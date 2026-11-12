import z from "zod";

export const farmIntelligenceOverviewSchema = z.object({
    district: z.string().min(1, "District name is required"),
    dateFrom: z.string().optional().default("2024-01-01"),
    dateTo: z.string().optional().default("2025-12-31"),
});

export const farmIntelligenceTimeseriesSchema = z.object({
    district: z.string().min(1, "District name is required"),
    dateFrom: z.string().optional().default("2024-01-01"),
    dateTo: z.string().optional().default("2025-12-31"),
});

export const farmIntelligenceDistrictsSchema = z.object({}).optional();

export const farmIntelligenceSatelliteSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
    dateFrom: z.string().optional().default("2024-01-01"),
    dateTo: z.string().optional().default("2025-12-31"),
    dataset: z.enum([
        "modis-ndvi",
        "modis-et",
        "landsat",
        "ecostress",
        "soilgrids",
        "terrain",
        "gedi",
        "all",
    ]).optional().default("all"),
});

export const farmIntelligenceDailySchema = z.object({
    district: z.string().optional(),
    dateFrom: z.string().optional().default("2024-01-01"),
    dateTo: z.string().optional().default("2025-12-31"),
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().nonnegative().optional().default(0),
});
