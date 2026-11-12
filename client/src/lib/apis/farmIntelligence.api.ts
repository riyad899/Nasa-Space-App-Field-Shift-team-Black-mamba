import { httpClient } from "../axios/httpClinet";

// ─── Types ──────────────────────────────────────────────────────────

export interface DistrictBaseline {
    id: number;
    name: string;
    division: string;
    latitude: number;
    longitude: number;
    elevation_m: number;
    slope_deg: number;
    aspect_deg: number;
    erosion_slope_index: number;
    soil_ph_0_5cm: number;
    soil_clay_pct: number;
    soil_sand_pct: number;
    soil_silt_pct: number;
    soil_soc_g_kg: number;
    soil_nitrogen_g_kg: number;
    canopy_height_m: number | null;
    biomass_density_mg_ha?: number | null;
    biomass_mg_ha?: number | null;
}

export interface DistrictSummaryAnalytics {
    total_days_recorded: number;
    mean_ndvi: number;
    max_ndvi: number;
    min_ndvi: number;
    mean_evi: number;
    cumulative_et_mm: number;
    total_precipitation_mm: number;
    mean_water_deficit_index: number;
    mean_surface_temperature_c: number;
    max_surface_temperature_c: number;
    mean_soil_moisture_pct: number;
    extreme_heat_days_count: number;
    severe_water_stress_days_count: number;
}

export interface DistrictSummary {
    source: string;
    district: string;
    period: { date_from: string; date_to: string };
    baseline_context: DistrictBaseline;
    two_year_analytics: DistrictSummaryAnalytics;
}

export type RiskLevel = "low" | "moderate" | "high" | "extreme";
export type HealthLevel = "poor" | "fair" | "good" | "excellent";

export interface RiskIndicators {
    droughtRisk: RiskLevel;
    waterStress: RiskLevel;
    heatStress: RiskLevel;
    vegetationHealth: HealthLevel;
    soilHealth: HealthLevel;
    overallScore: number;
}

export interface RecentTrends {
    ndviTrend: "declining" | "stable" | "improving";
    precipTrend: "below_normal" | "normal" | "above_normal";
    tempTrend: "cooling" | "stable" | "warming";
}

export interface FarmIntelligenceOverview {
    summary: DistrictSummary;
    riskIndicators: RiskIndicators;
    recentTrends: RecentTrends;
}

export interface DailyRecord {
    id: number;
    district_name: string;
    date: string;
    year: number;
    month: number;
    day: number;
    day_of_year: number;
    latitude: number;
    longitude: number;
    ndvi: number;
    evi: number;
    evapotranspiration_mm: number;
    potential_et_mm: number;
    water_deficit_index: number;
    surface_temperature_celsius: number;
    precipitation_mm: number;
    soil_moisture_pct: number;
    vegetation_condition_index: number;
    thermal_stress_index: number;
}

export interface TimeseriesResponse {
    source: string;
    district: string;
    date_from?: string;
    date_to?: string;
    period?: { date_from: string; date_to: string };
    total_days?: number;
    total_records?: number;
    timeseries?: DailyRecord[];
    data?: DailyRecord[];
}

export interface DistrictsResponse {
    source: string;
    total_districts: number;
    data: DistrictBaseline[];
}

// ─── API Functions ──────────────────────────────────────────────────

interface ApiResponse<T> {
    statusCode?: number;
    success: boolean;
    message?: string;
    data: T;
}

export async function getFarmIntelligenceOverview(
    district: string,
    dateFrom = "2024-01-01",
    dateTo = "2025-12-31"
): Promise<FarmIntelligenceOverview> {
    const res = await httpClient.get<ApiResponse<FarmIntelligenceOverview>>("/farm-intelligence/overview", {
        params: { district, dateFrom, dateTo },
    });
    return res.data;
}

export async function getFarmIntelligenceTimeseries(
    district: string,
    dateFrom = "2024-01-01",
    dateTo = "2025-12-31"
): Promise<TimeseriesResponse> {
    const res = await httpClient.get<ApiResponse<TimeseriesResponse>>("/farm-intelligence/timeseries", {
        params: { district, dateFrom, dateTo },
    });
    return res.data;
}

export async function getFarmIntelligenceDistricts(): Promise<DistrictsResponse> {
    const res = await httpClient.get<ApiResponse<DistrictsResponse>>("/farm-intelligence/districts");
    return res.data;
}

export async function getFarmIntelligenceSatellite(
    lat: number,
    lon: number,
    dataset = "all",
    dateFrom = "2024-01-01",
    dateTo = "2025-12-31"
): Promise<unknown> {
    const res = await httpClient.get<ApiResponse<unknown>>("/farm-intelligence/satellite", {
        params: { lat, lon, dataset, dateFrom, dateTo },
    });
    return res.data;
}
