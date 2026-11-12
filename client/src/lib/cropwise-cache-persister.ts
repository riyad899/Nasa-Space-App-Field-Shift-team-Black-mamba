import { QueryClient } from "@tanstack/react-query";

export const CROPWISE_AI_STALE_TIME = 20 * 60 * 1000; // 20 minutes
export const CROPWISE_AI_GC_TIME = 30 * 60 * 1000;    // 30 minutes
const STORAGE_KEY = "cropwise-ai:browser-cache-v1";

interface PersistedCropWiseEntry {
  queryKey: readonly unknown[];
  data: unknown;
  timestamp: number;
}

/**
 * Checks if a query key belongs to the special CropWise AI data scope
 */
export function isCropWiseAiQueryKey(queryKey: readonly unknown[]): boolean {
  return Array.isArray(queryKey) && queryKey[0] === "cropwise-ai";
}

/**
 * Restores only valid (under 20-minute old) CropWise AI queries from browser localStorage.
 * Expired, corrupted, or non-CropWise data is safely pruned.
 */
export function restoreCropWiseAiCache(queryClient: QueryClient): void {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const entries: PersistedCropWiseEntry[] = JSON.parse(raw);
    if (!Array.isArray(entries)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const now = Date.now();
    const freshEntries: PersistedCropWiseEntry[] = [];

    for (const entry of entries) {
      if (
        entry &&
        Array.isArray(entry.queryKey) &&
        isCropWiseAiQueryKey(entry.queryKey) &&
        typeof entry.timestamp === "number" &&
        now - entry.timestamp < CROPWISE_AI_STALE_TIME
      ) {
        // Restore into TanStack Query in-memory cache with original timestamp
        queryClient.setQueryData(entry.queryKey, entry.data, {
          updatedAt: entry.timestamp,
        });
        freshEntries.push(entry);
      }
    }

    // Persist only clean, non-expired entries back
    if (freshEntries.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshEntries));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn("⚠️ Unable to restore CropWise AI cache from storage:", err);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable or disabled
    }
  }
}

/**
 * Subscribes to QueryClient cache events and saves ONLY successful CropWise AI query data
 * with an expiration timestamp. All unrelated queries are strictly ignored.
 */
export function setupCropWiseAiPersistence(queryClient: QueryClient): () => void {
  if (typeof window === "undefined") return () => {};

  const syncToStorage = () => {
    try {
      const allQueries = queryClient.getQueryCache().getAll();
      const now = Date.now();
      const entriesToSave: PersistedCropWiseEntry[] = [];

      for (const query of allQueries) {
        if (!isCropWiseAiQueryKey(query.queryKey)) continue;

        const state = query.state;
        if (state.status === "success" && state.data !== undefined) {
          const age = now - state.dataUpdatedAt;
          if (age < CROPWISE_AI_STALE_TIME) {
            entriesToSave.push({
              queryKey: query.queryKey,
              data: state.data,
              timestamp: state.dataUpdatedAt,
            });
          }
        }
      }

      if (entriesToSave.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesToSave));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage full or private mode; fail gracefully
    }
  };

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const debouncedSync = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(syncToStorage, 250);
  };

  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    if (event && isCropWiseAiQueryKey(event.query.queryKey)) {
      debouncedSync();
    }
  });

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    unsubscribe();
  };
}
