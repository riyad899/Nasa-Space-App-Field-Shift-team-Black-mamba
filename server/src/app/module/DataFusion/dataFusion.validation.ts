import { z } from "zod";

export const dataFusionQuerySchema = z.object({
  deviceId: z.string().optional().default("esp32-001"),
  district: z.string().optional().default("Dhaka"),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateFrom must be in YYYY-MM-DD format")
    .optional()
    .default("2024-01-01"),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateTo must be in YYYY-MM-DD format")
    .optional()
    .default("2025-12-31"),
  calibrationProfile: z
    .enum(["CLAY_LOAM", "SANDY_LOAM", "ALLUVIAL", "DEFAULT"])
    .optional()
    .default("DEFAULT"),
});

export const dataFusionHistoryQuerySchema = z.object({
  deviceId: z.string().optional().default("esp32-001"),
  limit: z.coerce.number().int().min(1).max(500).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const triggerSnapshotCollectionSchema = z.object({
  deviceId: z.string().optional().default("esp32-001"),
});
