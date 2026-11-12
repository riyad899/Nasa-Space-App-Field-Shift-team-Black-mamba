import { QueryClient } from "@tanstack/react-query";
import {
  CROPWISE_AI_STALE_TIME,
  CROPWISE_AI_GC_TIME,
  restoreCropWiseAiCache,
  setupCropWiseAiPersistence,
} from "./cropwise-cache-persister";

export { CROPWISE_AI_STALE_TIME, CROPWISE_AI_GC_TIME };

/**
 * Standard query options specifically for CropWise AI endpoints.
 * Only applied to CropWise AI analysis, transparency, observations, recommendations, and chat.
 */
export const cropwiseQueryOptions = {
  staleTime: CROPWISE_AI_STALE_TIME, // 20 minutes
  gcTime: CROPWISE_AI_GC_TIME,       // 30 minutes
  retry: 1,
  refetchOnWindowFocus: false,
} as const;

/**
 * Type-safe query keys for CropWise AI
 */
export const cropwiseQueryKeys = {
  all: ["cropwise-ai"] as const,
  analysis: (district: string, cropType: string, farmingMethod = "rainfed") =>
    [
      "cropwise-ai",
      "analysis",
      (district || "").toLowerCase().trim(),
      (cropType || "").toLowerCase().trim(),
      (farmingMethod || "rainfed").toLowerCase().trim(),
    ] as const,
  climateTwoYear: (district: string, crop: string, priority = "Save Water") =>
    [
      "cropwise-ai",
      "climate-2year",
      (district || "").toLowerCase().trim(),
      (crop || "").toLowerCase().trim(),
      (priority || "").toLowerCase().trim(),
    ] as const,
  transparency: (analysisId: string) =>
    ["cropwise-ai", "transparency", analysisId] as const,
  observations: (analysisId: string, page = 1) =>
    ["cropwise-ai", "observations", analysisId, page] as const,
  recommendations: (analysisId: string) =>
    ["cropwise-ai", "recommendations", analysisId] as const,
};

/**
 * Create a new QueryClient instance with normal, standard defaults.
 * Notice: the 20-minute policy is NOT applied globally.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,               // Standard normal default: immediate refetch when stale
        gcTime: 5 * 60 * 1000,      // Standard normal default: 5 minutes garbage collection
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a stable QueryClient instance.
 * For client components, this guarantees a single stable client across renders.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new query client per request
    return createQueryClient();
  }
  // Client: create singleton if not yet created
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
    // Restore non-expired CropWise AI query cache from browser storage
    restoreCropWiseAiCache(browserQueryClient);
    // Setup persistence subscriber for CropWise AI queries
    setupCropWiseAiPersistence(browserQueryClient);
  }
  return browserQueryClient;
}
