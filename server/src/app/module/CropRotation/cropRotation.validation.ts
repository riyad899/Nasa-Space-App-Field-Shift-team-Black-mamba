import { z } from "zod";

const preferredCropItemSchema = z.union([
    z.string().min(1, "Crop name cannot be empty"),
    z.object({
        crop: z.string().min(1, "Crop name cannot be empty"),
        priority: z.number().int().positive().optional(),
    }),
]);

export const analyzeCropRotationSchema = z.object({
    district: z.string().trim().optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    soilType: z.string().trim().optional(),
    drainage: z.enum(["GOOD", "MODERATE", "POOR"]).optional(),
    preferredCrops: z
        .array(preferredCropItemSchema)
        .min(1, "At least one preferred crop must be provided"),
    excludedCrops: z.array(z.string().trim()).optional().default([]),
    lastCultivatedCrop: z.string().trim().optional(),
    previousPlantingDate: z.string().trim().optional(),
    previousHarvestingDate: z.string().trim().optional(),
    previousCropSequence: z.array(z.string().trim()).optional().default([]),
    analysisDateRange: z
        .object({
            start: z.string().regex(/^\d{8}$/, "Start date must be in YYYYMMDD format").optional(),
            end: z.string().regex(/^\d{8}$/, "End date must be in YYYYMMDD format").optional(),
        })
        .optional(),
}).refine(
    (data) => Boolean(data.district) || (data.latitude !== undefined && data.longitude !== undefined),
    {
        message: "Must provide either a valid Bangladesh district name or both latitude and longitude.",
        path: ["district"],
    }
);

export const validateCropSequenceSchema = z.object({
    previousCrop: z.string().trim().optional(),
    proposedCrops: z
        .array(z.string().trim())
        .min(1, "At least one proposed crop must be provided for validation"),
});

export const getClimateSummarySchema = z.object({
    district: z.string().trim().optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    start: z.string().regex(/^\d{8}$/, "Start date must be in YYYYMMDD format").optional(),
    end: z.string().regex(/^\d{8}$/, "End date must be in YYYYMMDD format").optional(),
}).refine(
    (data) => Boolean(data.district) || (data.latitude !== undefined && data.longitude !== undefined),
    {
        message: "Must provide either a valid Bangladesh district name or both latitude and longitude.",
        path: ["district"],
    }
);
