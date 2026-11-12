import { z } from "zod";

export const statisticalOverviewQuerySchema = z.object({
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
  k: z.coerce.number().int().min(2).max(5).optional().default(3),
});

export const statisticalCorrelationQuerySchema = z.object({
  district: z.string().optional().default("Dhaka"),
  dateFrom: z.string().optional().default("2024-01-01"),
  dateTo: z.string().optional().default("2025-12-31"),
  method: z.enum(["pearson", "spearman", "both"]).optional().default("both"),
});

export const statisticalRegressionQuerySchema = z.object({
  district: z.string().optional().default("Dhaka"),
  dateFrom: z.string().optional().default("2024-01-01"),
  dateTo: z.string().optional().default("2025-12-31"),
  target: z.string().optional().default("ndvi"),
});
