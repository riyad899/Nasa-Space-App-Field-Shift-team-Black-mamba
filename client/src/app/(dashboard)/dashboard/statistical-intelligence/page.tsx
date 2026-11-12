"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChartNoAxesCombined,
  Layers,
  Sparkles,
  TrendingUp,
  MapPin,
  RefreshCw,
  Scale,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Flame,
  Droplets,
  Leaf,
  Thermometer,
  ShieldCheck,
  Binary,
  ScatterChart,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import {
  getStatisticalIntelligenceOverview,
  type IStatisticalOverviewResponse,
  type IDescriptiveStats,
  type ICorrelationMatrixResult,
  type IMethodComparisonRow,
} from "@/lib/apis/statisticalIntelligence.api";

// ─── District Coordinate Dictionary ──────────────────────────────────
const DISTRICTS_COORDS: Record<string, { lat: number; lon: number; nameBn: string }> = {
  Dhaka: { lat: 23.8103, lon: 90.4125, nameBn: "ঢাকা" },
  Chittagong: { lat: 22.3569, lon: 91.7832, nameBn: "চট্টগ্রাম" },
  Rajshahi: { lat: 24.3745, lon: 88.6042, nameBn: "রাজশাহী" },
  Khulna: { lat: 22.8456, lon: 89.5403, nameBn: "খুলনা" },
  Barisal: { lat: 22.7010, lon: 90.3535, nameBn: "বরিশাল" },
  Sylhet: { lat: 24.8949, lon: 91.8687, nameBn: "সিলেট" },
  Rangpur: { lat: 25.7439, lon: 89.2752, nameBn: "রংপুর" },
  Mymensingh: { lat: 24.7471, lon: 90.4203, nameBn: "ময়মনসিংহ" },
  Dinajpur: { lat: 25.6279, lon: 88.6332, nameBn: "দিনাজপুর" },
  Bogura: { lat: 24.8465, lon: 89.3777, nameBn: "বগুড়া" },
  Comilla: { lat: 23.4607, lon: 91.1809, nameBn: "কুমিল্লা" },
  Jessore: { lat: 23.1664, lon: 89.2081, nameBn: "যশোর" },
  Pabna: { lat: 24.0064, lon: 89.2372, nameBn: "পাবনা" },
  Tangail: { lat: 24.2513, lon: 89.9167, nameBn: "টাঙ্গাইল" },
  Kushtia: { lat: 23.9013, lon: 89.1204, nameBn: "কুষ্টিয়া" },
  Sirajganj: { lat: 24.4534, lon: 89.7008, nameBn: "সিরাজগঞ্জ" },
  Faridpur: { lat: 23.6071, lon: 89.8429, nameBn: "ফরিদপুর" },
  Natore: { lat: 24.4102, lon: 88.9796, nameBn: "নাটোর" },
};

const DISTRICTS = Object.keys(DISTRICTS_COORDS);

type ActiveTab = "climate" | "soil" | "combined" | "comparison";

export default function StatisticalIntelligencePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Dhaka");
  const [kClusters, setKClusters] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<ActiveTab>("climate");
  const [correlationMode, setCorrelationMode] = useState<"pearson" | "spearman">("pearson");

  const {
    data: statData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["statistical-intelligence-overview", selectedDistrict, kClusters],
    queryFn: () =>
      getStatisticalIntelligenceOverview({
        district: selectedDistrict,
        dateFrom: "2024-01-01",
        dateTo: "2025-12-31",
        k: kClusters,
      }),
    staleTime: 60_000,
  });

  const matrixResult =
    correlationMode === "pearson" ? statData?.pearsonMatrix : statData?.spearmanMatrix;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 pb-20">
      {/* Transparent Navbar Slot */}
      <TransparentNavSlot />

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 330 }}>
        <div
          className="absolute inset-0 bg-cover bg-[center_55%]"
          style={{ backgroundImage: "url('/analysisBG.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/50" />
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md border border-emerald-400/30 mb-3">
                <ChartNoAxesCombined className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                <span>MULTIVARIATE STATISTICAL INTELLIGENCE & METHOD COMPARISON</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[40px] leading-tight">
                Statistical Intelligence (SI)
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
                Rigorous empirical comparison of statistical approaches (Descriptive Moments, Pearson & Spearman
                Correlation, OLS Multiple Regression, PCA, and K-Means++ Clustering) applied to 2-year NASA climate records.
              </p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white">
                <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3 py-1 border border-white/20">
                  <Binary className="h-3 w-3 text-emerald-400" />
                  <span>731 Continuous Daily Records</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3 py-1 border border-white/20">
                  <Scale className="h-3 w-3 text-amber-400" />
                  <span>6 Statistical Approaches Compared</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3 py-1 border border-white/20">
                  <ShieldCheck className="h-3 w-3 text-sky-400" />
                  <span>Two-Tailed p-Value Significance</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-xl p-3 backdrop-blur-md flex flex-col gap-2">
                <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider flex items-center justify-between">
                  <span>Target District</span>
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-emerald-900/90 text-white text-sm font-semibold rounded-lg px-3 py-1.5 border border-emerald-600/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-emerald-950 text-white">
                      {d} ({DISTRICTS_COORDS[d].nameBn})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-3 shadow-lg shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span>{isFetching ? "Computing..." : "Re-run Models"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-emerald-100 flex flex-wrap items-center gap-2">
          {[
            { id: "climate", label: "Climate Intelligence", icon: Flame },
            { id: "soil", label: "Soil Intelligence & PCA", icon: Layers },
            { id: "combined", label: "Combined Agronomic Analysis", icon: Sparkles },
            { id: "comparison", label: "Model Comparison Engine", icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
                  isSel
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSel ? "text-white" : "text-emerald-600"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: CLIMATE INTELLIGENCE                              */}
        {/* ========================================================= */}
        {activeTab === "climate" && (
          <div className="space-y-6">
            {/* Descriptive Statistics Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  <span>Descriptive Moments & Dispersion (2-Year Observation Period)</span>
                </h2>
                <span className="text-xs text-slate-600 font-medium">n = 731 Days</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statData?.descriptiveStats.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">{item.variable}</span>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        Mean: {item.mean}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3 pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-600">Median</div>
                        <div className="font-bold text-slate-800 mt-0.5">{item.median}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-600">Std Dev</div>
                        <div className="font-bold text-slate-800 mt-0.5">{item.stdDev}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-600">IQR</div>
                        <div className="font-bold text-slate-800 mt-0.5">{item.iqr}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2 pt-2 border-t border-slate-50">
                      <div>
                        <div className="text-[10px] text-slate-600">Skewness</div>
                        <div className="font-semibold text-slate-700 text-[11px]">{item.skewness}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-600">Kurtosis</div>
                        <div className="font-semibold text-slate-700 text-[11px]">{item.kurtosis}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-600">Min / Max</div>
                        <div className="font-semibold text-slate-700 text-[10px]">
                          {item.min} / {item.max}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Correlation Heatmap */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    <span>Multivariate Correlation Matrix & Significance</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Toggle between Pearson (Linear) and Spearman (Monotonic Rank) correlation with Student&apos;s t-test p-values
                  </p>
                </div>

                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    onClick={() => setCorrelationMode("pearson")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      correlationMode === "pearson"
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pearson (r)
                  </button>
                  <button
                    onClick={() => setCorrelationMode("spearman")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      correlationMode === "spearman"
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Spearman (ρ)
                  </button>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left font-bold text-slate-600">Variable</th>
                      {matrixResult?.variables.map((v, idx) => (
                        <th key={idx} className="py-2 px-3 font-semibold text-slate-700">
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matrixResult?.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="py-3 px-3 text-left font-bold text-slate-800">
                          {matrixResult.variables[rIdx]}
                        </td>
                        {row.map((cell, cIdx) => {
                          const coef = cell.coefficient;
                          const isPos = coef >= 0;
                          const absVal = Math.abs(coef);
                          const bgIntensity = Math.min(Math.round(absVal * 100), 90);

                          return (
                            <td key={cIdx} className="py-2.5 px-3">
                              <div
                                className={`p-2 rounded-lg font-mono font-bold text-xs flex flex-col items-center justify-center transition hover:scale-105 shadow-sm ${
                                  rIdx === cIdx
                                    ? "bg-slate-100 text-slate-500"
                                    : isPos
                                    ? "bg-emerald-500 text-white"
                                    : "bg-rose-500 text-white"
                                }`}
                                style={{
                                  backgroundColor:
                                    rIdx === cIdx
                                      ? undefined
                                      : isPos
                                      ? `rgba(16, 185, 129, ${Math.max(0.2, absVal)})`
                                      : `rgba(244, 63, 94, ${Math.max(0.2, absVal)})`,
                                  color: rIdx === cIdx || absVal < 0.4 ? "#1e293b" : "#ffffff",
                                }}
                              >
                                <span>{coef.toFixed(2)}</span>
                                <span className="text-[9px] font-normal opacity-80">
                                  {cell.significanceLevel}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Analytical Insight: </span>
                {matrixResult?.summaryInsights[0]}
              </div>
            </div>

            {/* OLS Multiple Linear Regression Model */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Ordinary Least Squares (OLS) Multiple Regression: Predicting NDVI
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner">
                    <span className="text-slate-400 block mb-1 text-[11px] font-sans font-semibold">
                      FITTED MULTIPLE REGRESSION EQUATION:
                    </span>
                    {statData?.linearRegressionNDVI?.equationString}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">R² Variance</div>
                      <div className="text-xl font-black text-emerald-700 mt-1">
                        {statData?.linearRegressionNDVI?.rSquared}
                      </div>
                      <div className="text-[10px] text-slate-600">Goodness of fit</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">Adjusted R²</div>
                      <div className="text-xl font-black text-emerald-700 mt-1">
                        {statData?.linearRegressionNDVI?.adjustedRSquared}
                      </div>
                      <div className="text-[10px] text-slate-600">Degrees adjusted</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">MAE</div>
                      <div className="text-xl font-black text-slate-800 mt-1">
                        {statData?.linearRegressionNDVI?.mae}
                      </div>
                      <div className="text-[10px] text-slate-600">Mean Abs Error</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-600 font-semibold uppercase">RMSE</div>
                      <div className="text-xl font-black text-slate-800 mt-1">
                        {statData?.linearRegressionNDVI?.rmse}
                      </div>
                      <div className="text-[10px] text-slate-600">Root Mean Sq</div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 flex flex-col justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-emerald-900 block mb-2 text-sm">
                      Model Interpretation
                    </span>
                    <p className="leading-relaxed">
                      {statData?.linearRegressionNDVI?.interpretation}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-emerald-200/60 mt-3 text-[11px] text-emerald-800">
                    Sample Count: {statData?.linearRegressionNDVI?.sampleCount} daily observations
                  </div>
                </div>
              </div>
            </div>

            {/* Time-Series Decomposition */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Time-Series Decomposition & Anomaly Detection (NDVI)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Separating long-term climate trend, periodic seasonality, and Z-score anomalies
                  </p>
                </div>
                <div className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
                  {statData?.timeSeriesDecomposition?.anomalyCount} Anomalies Flagged
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-600 font-medium">Trend Slope Per Year</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {statData?.timeSeriesDecomposition?.trendSlopePerYear != null &&
                    statData.timeSeriesDecomposition.trendSlopePerYear > 0
                      ? "+"
                      : ""}
                    {statData?.timeSeriesDecomposition?.trendSlopePerYear ?? 0} NDVI/yr
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-600 font-medium">Seasonality Strength</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {statData?.timeSeriesDecomposition?.seasonalityStrengthPct}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-600 font-medium">Anomaly Threshold</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">|Z| &gt; 2.5 σ</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SOIL INTELLIGENCE & PCA                            */}
        {/* ========================================================= */}
        {activeTab === "soil" && (
          <div className="space-y-6">
            {/* PCA Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    <span>Principal Component Analysis (PCA) on Soil Spatial Heterogeneity</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dimensionality reduction on SoilGrids features (pH, SOC, Nitrogen, Clay, Sand, Silt) across all 18 districts
                  </p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Sample Size: {statData?.soilPca?.sampleSize} Districts
                </span>
              </div>

              {/* Scree Plot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statData?.soilPca?.components?.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">{comp.componentName}</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {(comp.explainedVarianceRatio * 100).toFixed(1)}% Variance
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${comp.explainedVarianceRatio * 100}%` }}
                      />
                    </div>

                    <div className="text-xs text-slate-600 flex justify-between">
                      <span>Eigenvalue: {comp.eigenvalue}</span>
                      <span>Cumulative: {(comp.cumulativeVarianceRatio * 100).toFixed(1)}%</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-600">Dominant Driver: </span>
                      <span className="font-bold text-slate-800">{comp.primaryDominantFeature}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loadings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Soil Feature</th>
                      <th className="py-2.5 px-3 text-center">PC1 Loading</th>
                      <th className="py-2.5 px-3 text-center">PC2 Loading</th>
                      <th className="py-2.5 px-3 text-center">PC3 Loading</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statData?.soilPca?.features?.map((feat, fIdx) => (
                      <tr key={fIdx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{feat}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {statData?.soilPca?.components[0]?.loadings[feat] ?? "0.00"}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {statData?.soilPca?.components[1]?.loadings[feat] ?? "0.00"}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {statData?.soilPca?.components[2]?.loadings[feat] ?? "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800">PCA Interpretation: </span>
                {statData?.soilPca?.interpretation?.join(" ")}
              </div>
            </div>

            {/* K-Means++ Clustering on Multi-Dimensional Regimes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>K-Means++ Regime Clustering</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Unsupervised clustering partitioning environmental states into distinct agronomic vulnerability regimes
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">k Clusters:</span>
                  {[2, 3, 4, 5].map((k) => (
                    <button
                      key={k}
                      onClick={() => setKClusters(k)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                        kClusters === k
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-xs text-emerald-800 font-bold uppercase">Silhouette Coefficient</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    {statData?.kmeansClustering?.silhouetteScore}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {statData && statData.kmeansClustering && statData.kmeansClustering.silhouetteScore > 0.5
                      ? "Well-separated clusters"
                      : "Moderate overlapping regimes"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-600 font-bold uppercase">Cluster Inertia (WCSS)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {statData?.kmeansClustering?.inertia}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Within-cluster sum of squares</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statData?.kmeansClustering?.clusters?.map((c) => (
                  <div key={c.clusterIndex} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">
                        Cluster {c.clusterIndex + 1}: {c.clusterName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.agronomicVulnerability === "LOW"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.agronomicVulnerability === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.agronomicVulnerability}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mb-3">
                      {c.sampleCount} days ({c.percentage}%)
                    </div>

                    <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
                      {Object.entries(c.centroid).map(([feat, val]) => (
                        <div key={feat} className="flex justify-between text-slate-700">
                          <span className="text-slate-600">{feat}:</span>
                          <span className="font-mono font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: COMBINED ANALYSIS & AGRONOMIC DEDUCTIONS           */}
        {/* ========================================================= */}
        {activeTab === "combined" && (
          <div className="space-y-6">
            {/* Vulnerability Banner */}
            <div
              className={`rounded-2xl p-6 text-white shadow-lg ${
                statData?.agronomicSynthesis?.vulnerabilityLevel === "CRITICAL"
                  ? "bg-gradient-to-r from-rose-950 to-red-900"
                  : statData?.agronomicSynthesis?.vulnerabilityLevel === "HIGH"
                  ? "bg-gradient-to-r from-amber-950 to-orange-900"
                  : "bg-gradient-to-r from-emerald-950 to-slate-900"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Agronomic Synthesis & Vulnerability Assessment
                  </span>
                </div>
                <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                  Vulnerability: {statData?.agronomicSynthesis?.vulnerabilityLevel}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black mb-2">
                Climate-Soil Cross-Domain Vulnerability Matrix for {selectedDistrict}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
                Synthesis combining hydrological deficit curves, soil textural buffering capacity from SoilGrids,
                and empirical regression sensitivity.
              </p>
            </div>

            {/* Deductions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Hydrological Deficit Dynamics
                  </h3>
                </div>

                <div className="space-y-3">
                  {statData?.agronomicSynthesis?.hydroDeficitDeductions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Soil Textural & Organic Buffering
                  </h3>
                </div>

                <div className="space-y-3">
                  {statData?.agronomicSynthesis?.soilBufferingInsights?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Data-Driven Agricultural Decisions
                </h3>
              </div>

              <div className="space-y-3">
                {statData?.agronomicSynthesis?.recommendations?.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STATISTICAL APPROACHES COMPARISON ENGINE           */}
        {/* ========================================================= */}
        {activeTab === "comparison" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-emerald-600" />
                    <span>Comprehensive Evaluation Matrix of Statistical Approaches</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct comparison of 6 statistical and statistical intelligence methods for historical climate and soil pattern identification
                  </p>
                </div>
                <div className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                  Challenge Benchmark: 6 Methods Evaluated
                </div>
              </div>

              {/* Comprehensive Comparison Cards */}
              <div className="space-y-4">
                {statData?.methodComparisonMatrix?.map((row) => (
                  <div
                    key={row.methodId}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-emerald-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          {row.methodName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {row.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-semibold">Suitability Score:</span>
                        <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                          {row.suitabilityScore} / 100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 mb-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">Primary Question Answered:</span>
                        {row.primaryQuestionAnswered}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">Mathematical Formulation:</span>
                        <span className="font-mono text-[11px] text-slate-800">{row.mathematicalBasis}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-3">
                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                        <span className="font-bold text-emerald-950 block text-[11px]">Goodness-of-Fit / Metric:</span>
                        <span className="font-mono font-bold text-emerald-800 text-xs">
                          {row.goodnessOfFitOrMetric}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                        <span className="font-bold text-slate-900 block text-[11px]">Key Agronomic Finding:</span>
                        <span>{row.keyFinding}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-3">
                      <div>
                        <span className="font-bold text-emerald-900 text-[11px] block mb-1">
                          Statistical Assumptions:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {row.statisticalAssumptions.map((assump, aIdx) => (
                            <li key={aIdx}>{assump}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-rose-900 text-[11px] block mb-1">
                          Limitations & Uncertainty:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {row.limitationsAndUncertainty.map((lim, lIdx) => (
                            <li key={lIdx}>{lim}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
