// ─── Farm Intelligence Module Interfaces ─────────────────────────────
// Combines data from the Python geospatial API (port 8000) and existing
// Node.js endpoints (NasaPower, IMERG, SMAP) into unified types.

export interface IDistrictBaseline {
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

export interface IDistrictSummaryAnalytics {
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

export interface IDistrictSummary {
    source: string;
    district: string;
    period: { date_from: string; date_to: string };
    baseline_context: IDistrictBaseline;
    two_year_analytics: IDistrictSummaryAnalytics;
}

export interface IDailyRecord {
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

export interface ITimeseriesResponse {
    source: string;
    district: string;
    date_from?: string;
    date_to?: string;
    period?: { date_from: string; date_to: string };
    total_days?: number;
    total_records?: number;
    timeseries?: IDailyRecord[];
    data?: IDailyRecord[];
}

export interface IFarmIntelligenceQuery {
    district: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface IFarmIntelligenceOverview {
    summary: IDistrictSummary;
    riskIndicators: {
        droughtRisk: "low" | "moderate" | "high" | "extreme";
        waterStress: "low" | "moderate" | "high" | "extreme";
        heatStress: "low" | "moderate" | "high" | "extreme";
        vegetationHealth: "poor" | "fair" | "good" | "excellent";
        soilHealth: "poor" | "fair" | "good" | "excellent";
        overallScore: number; // 0-100
    };
    recentTrends: {
        ndviTrend: "declining" | "stable" | "improving";
        precipTrend: "below_normal" | "normal" | "above_normal";
        tempTrend: "cooling" | "stable" | "warming";
    };
}

export interface ISatelliteDatasetQuery {
    lat: number;
    lon: number;
    dateFrom?: string;
    dateTo?: string;
}

export interface IAllDatasetsResponse {
    [key: string]: unknown;
}
