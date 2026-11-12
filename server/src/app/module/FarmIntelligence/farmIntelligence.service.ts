// ─── Farm Intelligence Service ──────────────────────────────────────
// Proxies requests to the Python geospatial API (port 8000)
// and computes risk indicators from the returned environmental data.

import type {
    IDistrictSummary,
    IFarmIntelligenceOverview,
    ITimeseriesResponse,
    IDistrictBaseline,
} from "./farmIntelligence.interface.js";

const PYTHON_API_BASE = process.env.PYTHON_API_URL || "http://localhost:8000";

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
        throw new Error(`Python API error ${response.status}: ${response.statusText} for ${url}`);
    }
    return response.json() as Promise<T>;
}

// ─── Risk scoring helpers ───────────────────────────────────────────

function computeDroughtRisk(wdi: number, soilMoisture: number): "low" | "moderate" | "high" | "extreme" {
    const score = wdi * 60 + (1 - soilMoisture / 100) * 40;
    if (score > 65) return "extreme";
    if (score > 45) return "high";
    if (score > 25) return "moderate";
    return "low";
}

function computeWaterStress(wdi: number, precipMm: number): "low" | "moderate" | "high" | "extreme" {
    // Low precip + high WDI = stress
    const annualPrecipNorm = precipMm / 730; // rough daily avg
    if (wdi > 0.5 && annualPrecipNorm < 4) return "extreme";
    if (wdi > 0.35 && annualPrecipNorm < 5) return "high";
    if (wdi > 0.2) return "moderate";
    return "low";
}

function computeHeatStress(maxTemp: number, extremeDays: number): "low" | "moderate" | "high" | "extreme" {
    if (extremeDays > 30 || maxTemp > 42) return "extreme";
    if (extremeDays > 15 || maxTemp > 39) return "high";
    if (extremeDays > 5 || maxTemp > 36) return "moderate";
    return "low";
}

function computeVegetationHealth(meanNdvi: number): "poor" | "fair" | "good" | "excellent" {
    if (meanNdvi >= 0.6) return "excellent";
    if (meanNdvi >= 0.45) return "good";
    if (meanNdvi >= 0.3) return "fair";
    return "poor";
}

function computeSoilHealth(pH: number, soc: number, nitrogen: number): "poor" | "fair" | "good" | "excellent" {
    let score = 0;
    // pH: ideal 6.0–7.0
    if (pH >= 6.0 && pH <= 7.0) score += 40;
    else if (pH >= 5.5 && pH <= 7.5) score += 25;
    else score += 10;

    // SOC: higher is better
    if (soc > 20) score += 30;
    else if (soc > 12) score += 20;
    else score += 10;

    // Nitrogen
    if (nitrogen > 1.5) score += 30;
    else if (nitrogen > 1.0) score += 20;
    else score += 10;

    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "fair";
    return "poor";
}

function riskToNumber(risk: string): number {
    const map: Record<string, number> = {
        low: 85, moderate: 60, high: 35, extreme: 15,
        excellent: 90, good: 70, fair: 45, poor: 20,
    };
    return map[risk] ?? 50;
}

function computeNdviTrend(data: Array<{ ndvi: number }>): "declining" | "stable" | "improving" {
    if (data.length < 60) return "stable";
    const firstQ = data.slice(0, Math.floor(data.length / 4));
    const lastQ = data.slice(-Math.floor(data.length / 4));
    const avgFirst = firstQ.reduce((s, d) => s + d.ndvi, 0) / firstQ.length;
    const avgLast = lastQ.reduce((s, d) => s + d.ndvi, 0) / lastQ.length;
    const diff = avgLast - avgFirst;
    if (diff > 0.03) return "improving";
    if (diff < -0.03) return "declining";
    return "stable";
}

function computePrecipTrend(data: Array<{ precipitation_mm: number }>): "below_normal" | "normal" | "above_normal" {
    const total = data.reduce((s, d) => s + d.precipitation_mm, 0);
    const dailyAvg = total / data.length;
    // Bangladesh avg ~6-7mm/day
    if (dailyAvg > 7.5) return "above_normal";
    if (dailyAvg < 4.5) return "below_normal";
    return "normal";
}

function computeTempTrend(data: Array<{ surface_temperature_celsius: number }>): "cooling" | "stable" | "warming" {
    if (data.length < 60) return "stable";
    const firstQ = data.slice(0, Math.floor(data.length / 4));
    const lastQ = data.slice(-Math.floor(data.length / 4));
    const avgFirst = firstQ.reduce((s, d) => s + d.surface_temperature_celsius, 0) / firstQ.length;
    const avgLast = lastQ.reduce((s, d) => s + d.surface_temperature_celsius, 0) / lastQ.length;
    const diff = avgLast - avgFirst;
    if (diff > 1.0) return "warming";
    if (diff < -1.0) return "cooling";
    return "stable";
}

// ─── Public Service Methods ──────────────────────────────────────────

async function getOverview(district: string, dateFrom: string, dateTo: string): Promise<IFarmIntelligenceOverview> {
    const [summary, timeseries] = await Promise.all([
        fetchJson<IDistrictSummary>(
            `${PYTHON_API_BASE}/api/v1/db/summary/${encodeURIComponent(district)}?date_from=${dateFrom}&date_to=${dateTo}`
        ),
        fetchJson<ITimeseriesResponse>(
            `${PYTHON_API_BASE}/api/v1/db/timeseries/${encodeURIComponent(district)}?date_from=${dateFrom}&date_to=${dateTo}`
        ),
    ]);

    const a = summary.two_year_analytics;
    const b = summary.baseline_context;

    const droughtRisk = computeDroughtRisk(a.mean_water_deficit_index, a.mean_soil_moisture_pct);
    const waterStress = computeWaterStress(a.mean_water_deficit_index, a.total_precipitation_mm);
    const heatStress = computeHeatStress(a.max_surface_temperature_c, a.extreme_heat_days_count);
    const vegetationHealth = computeVegetationHealth(a.mean_ndvi);
    const soilHealth = computeSoilHealth(b.soil_ph_0_5cm, b.soil_soc_g_kg, b.soil_nitrogen_g_kg);

    const scores = [droughtRisk, waterStress, heatStress, vegetationHealth, soilHealth].map(riskToNumber);
    const overallScore = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);

    const records = timeseries.timeseries || timeseries.data || [];

    return {
        summary,
        riskIndicators: {
            droughtRisk,
            waterStress,
            heatStress,
            vegetationHealth,
            soilHealth,
            overallScore,
        },
        recentTrends: {
            ndviTrend: computeNdviTrend(records),
            precipTrend: computePrecipTrend(records),
            tempTrend: computeTempTrend(records),
        },
    };
}

async function getTimeseries(district: string, dateFrom: string, dateTo: string): Promise<ITimeseriesResponse> {
    const raw = await fetchJson<any>(
        `${PYTHON_API_BASE}/api/v1/db/timeseries/${encodeURIComponent(district)}?date_from=${dateFrom}&date_to=${dateTo}`
    );
    const records = raw.timeseries || raw.data || [];
    return {
        ...raw,
        timeseries: records,
        data: records,
    };
}

async function getDistricts(): Promise<{ source: string; total_districts: number; data: IDistrictBaseline[] }> {
    return fetchJson(`${PYTHON_API_BASE}/api/v1/db/districts`);
}

async function getDailyData(params: {
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
}): Promise<unknown> {
    const qs = new URLSearchParams();
    if (params.district) qs.set("district", params.district);
    if (params.dateFrom) qs.set("date_from", params.dateFrom);
    if (params.dateTo) qs.set("date_to", params.dateTo);
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));

    return fetchJson(`${PYTHON_API_BASE}/api/v1/db/daily?${qs.toString()}`);
}

async function getSatelliteData(params: {
    lat: number;
    lon: number;
    dateFrom: string;
    dateTo: string;
    dataset: string;
}): Promise<unknown> {
    const endpoint = params.dataset === "all" ? "all" : params.dataset;
    const qs = `lat=${params.lat}&lon=${params.lon}&date_from=${params.dateFrom}&date_to=${params.dateTo}`;
    return fetchJson(`${PYTHON_API_BASE}/api/v1/datasets/${endpoint}?${qs}`);
}

export const FarmIntelligenceService = {
    getOverview,
    getTimeseries,
    getDistricts,
    getDailyData,
    getSatelliteData,
};
