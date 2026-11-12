"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  OnsetAnalysisData,
  getLatestAnalysis,
  getAnalysisHistory,
  saveAnalysisToHistory,
} from "./apis/analyzeAi";
import { useAuth } from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { cropwiseQueryKeys } from "./query-client";

interface AnalysisContextType {
  activeAnalysis: OnsetAnalysisData | null;
  activeRecommendation: any | null;
  history: any[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  setActiveAnalysis: (data: OnsetAnalysisData | null) => void;
  loadHistory: () => Promise<void>;
  selectAnalysisFromHistory: (historyItem: any) => void;
  clearAnalysis: () => void;
  saveCurrentAnalysis: () => Promise<boolean>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "cropwise:active-analysis";

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [activeAnalysis, setActiveAnalysisState] = useState<OnsetAnalysisData | null>(null);
  const [activeRecommendation, setActiveRecommendation] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Check auth session
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const setActiveAnalysis = useCallback((data: OnsetAnalysisData | null) => {
    setActiveAnalysisState(data);
    if (data) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        window.localStorage.setItem("fieldshift:last-analysis-id", data.analysisId);
      }
      if (data.location?.district && data.crop?.cropType) {
        queryClient.setQueryData(
          cropwiseQueryKeys.analysis(data.location.district, data.crop.cropType, data.crop.farmingMethod || "rainfed"),
          data
        );
      }
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, [queryClient]);

  const loadHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      return;
    }
    setIsLoadingHistory(true);
    try {
      const res = await getAnalysisHistory();
      if (res && res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch analysis history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [userId]);

  const selectAnalysisFromHistory = useCallback((item: any) => {
    if (!item) return;
    if (item.results) {
      setActiveAnalysis(item.results);
      if (item.recommendations && item.recommendations.length > 0) {
        setActiveRecommendation(item.recommendations[0]);
      }
    }
  }, [setActiveAnalysis]);

  const clearAnalysis = useCallback(() => {
    setActiveAnalysis(null);
    setActiveRecommendation(null);
    setHistory([]);
  }, [setActiveAnalysis]);

  const saveCurrentAnalysis = useCallback(async (): Promise<boolean> => {
    if (!activeAnalysis || !userId) return false;
    try {
      const res = await saveAnalysisToHistory({
        analysisId: activeAnalysis.analysisId,
        location: activeAnalysis.location,
        crop: activeAnalysis.crop,
        farmingMethod: activeAnalysis.crop?.farmingMethod,
        shiftDays: activeAnalysis.shift?.medianDays,
        plantingWindowStart: activeAnalysis.transplantingWindow?.start,
        plantingWindowEnd: activeAnalysis.transplantingWindow?.end,
        confidence: activeAnalysis.transplantingWindow?.confidence,
        dataSources: activeAnalysis.dataSources,
        results: activeAnalysis,
        recommendationText: `Recommended transplanting window: ${activeAnalysis.transplantingWindow?.start || ""} to ${activeAnalysis.transplantingWindow?.end || ""}`,
        explanation: activeAnalysis.explanation,
        farmerGuidance: activeAnalysis.farmerGuidance,
        whyThisResult: {
          shift: activeAnalysis.shift,
          baseline: activeAnalysis.baseline,
          recent: activeAnalysis.recent,
        },
      });
      if (res && res.success) {
        await loadHistory();
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Failed to manually save analysis:", err);
      return false;
    }
  }, [activeAnalysis, userId, loadHistory]);

  // Initial restoration on mount or login change
  useEffect(() => {
    let isMounted = true;

    async function restoreState() {
      setIsLoading(true);

      // 1. Try restoring from localStorage first for instantaneous route transitions
      if (typeof window !== "undefined") {
        try {
          const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (isMounted) {
              setActiveAnalysisState(parsed);
            }
          }
        } catch {
          // ignore cache parse error
        }
      }

      // 2. If user is logged in, sync with latest record from database
      if (userId) {
        try {
          const [latestRes, historyRes] = await Promise.allSettled([
            getLatestAnalysis(),
            getAnalysisHistory(),
          ]);

          if (isMounted) {
            if (latestRes.status === "fulfilled" && latestRes.value?.success && latestRes.value?.data) {
              const latestData = latestRes.value.data;
              if (latestData.results) {
                setActiveAnalysisState(latestData.results);
                if (latestData.recommendations?.length) {
                  setActiveRecommendation(latestData.recommendations[0]);
                }
              }
            }

            if (historyRes.status === "fulfilled" && historyRes.value?.success && Array.isArray(historyRes.value?.data)) {
              setHistory(historyRes.value.data);
            }
          }
        } catch (err) {
          console.warn("Could not sync latest analysis with server:", err);
        }
      } else {
        // Guest user: clear history list
        if (isMounted) {
          setHistory([]);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    restoreState();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <AnalysisContext.Provider
      value={{
        activeAnalysis,
        activeRecommendation,
        history,
        isLoading,
        isLoadingHistory,
        setActiveAnalysis,
        loadHistory,
        selectAnalysisFromHistory,
        clearAnalysis,
        saveCurrentAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
