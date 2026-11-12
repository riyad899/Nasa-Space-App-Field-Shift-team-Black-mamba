"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { script } from "@/lib/fonts";
import {
  CloudRain,
  Thermometer,
  Droplet,
  Leaf,
  Info,
  Satellite,
  MapPin,
  BarChart3,
  Calendar,
  Sprout,
  Check,
  Cloud,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Sun,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers,
  Compass,
  Activity,
  Wind,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cropwiseQueryKeys, cropwiseQueryOptions } from "@/lib/query-client";
import { TransparentNavSlot } from "../../header-context";
import FilterBar from "@/Components/modules/Dashboord/FilterBar";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";
import {
  runTwoYearClimateAnalysis,
  ITwoYearClimateAnalysisResponse,
  ITwoYearMonthlyPoint,
} from "@/lib/apis/analyzeAi";
import { useLanguage } from "@/lib/language-context";

// Handwritten font

const SECTION_X = "px-6 sm:px-10";

// Coordinates fallback for Bangladesh districts
const LOCATION_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  Mymensingh: { latitude: 24.75, longitude: 90.40 },
  Rajshahi: { latitude: 24.37, longitude: 88.60 },
  Rangpur: { latitude: 25.75, longitude: 89.25 },
  Dhaka: { latitude: 23.81, longitude: 90.41 },
  Chittagong: { latitude: 22.36, longitude: 91.78 },
  Sylhet: { latitude: 24.89, longitude: 91.87 },
  Khulna: { latitude: 22.85, longitude: 89.54 },
  Barisal: { latitude: 22.70, longitude: 90.35 },
  Dinajpur: { latitude: 25.62, longitude: 88.64 },
  Bogura: { latitude: 24.85, longitude: 89.38 },
  Comilla: { latitude: 23.46, longitude: 91.18 },
  Jessore: { latitude: 23.17, longitude: 89.21 },
  Pabna: { latitude: 24.01, longitude: 89.25 },
  Tangail: { latitude: 24.25, longitude: 89.92 },
  Kushtia: { latitude: 23.90, longitude: 89.12 },
  Sirajganj: { latitude: 24.45, longitude: 89.70 },
  Faridpur: { latitude: 23.61, longitude: 89.84 },
  Natore: { latitude: 24.41, longitude: 88.98 },
};

// Mobile loading screen steps
const loadingSteps = [
  { en: "Querying NASA POWER climate data (731 days)", bn: "নাসা পাওয়ার জলবায়ু উপাত্ত সংগ্রহ (৭৩১ দিন)", icon: Thermometer },
  { en: "Processing NASA GPM IMERG rainfall records", bn: "নাসা জিপিএম আইমার্জ বৃষ্টিপাত হিসাব প্রক্রিয়া", icon: CloudRain },
  { en: "Evaluating NASA SMAP surface & rootzone moisture", bn: "নাসা এসএমএপি মাটির আর্দ্রতা মূল্যায়ন", icon: Droplet },
  { en: "Analyzing MODIS vegetation & canopy vigor", bn: "মডিস ভেজিটেশন ও ক্যানোপি স্বাস্থ্য বিশ্লেষণ", icon: Leaf },
  { en: "Matching soil & climate context with crop profile", bn: "মাটি ও আবহাওয়ার সাথে ফসলের উপযোগিতা যাচাই", icon: Sprout },
  { en: "Generating AI crop suitability & farmer advice", bn: "এআই ফসল উপযোগিতা ও চাষাবাদ নির্দেশিকা তৈরি", icon: Cpu },
];

const LOCAL_STORAGE_KEY = "cropwise:climate-2yr-analysis";

// ================= DYNAMIC 2-YEAR CHARTS =================

function RainfallTwoYearChart({ data }: { data?: ITwoYearMonthlyPoint[] }) {
  const { lang, monthName } = useLanguage();
  const width = 720;
  const height = 170;
  const padL = 42;
  const padR = 18;
  const padT = 16;
  const padB = 26;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = (data && data.length > 0) ? data : [
    { month: "Jan", historical: 12, recent: 15 },
    { month: "Feb", historical: 28, recent: 30 },
    { month: "Mar", historical: 55, recent: 62 },
    { month: "Apr", historical: 140, recent: 155 },
    { month: "May", historical: 290, recent: 310 },
    { month: "Jun", historical: 460, recent: 490 },
    { month: "Jul", historical: 510, recent: 535 },
    { month: "Aug", historical: 420, recent: 440 },
    { month: "Sep", historical: 310, recent: 325 },
    { month: "Oct", historical: 160, recent: 175 },
    { month: "Nov", historical: 35, recent: 40 },
    { month: "Dec", historical: 10, recent: 12 },
  ];

  const maxVal = Math.max(...points.map((p) => Math.max(p.historical, p.recent)), 100);
  const max = Math.ceil(maxVal / 50) * 50;
  const ticks = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];
  const groupW = chartW / points.length;
  const barW = Math.max(5, Math.min(10, groupW / 3));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-end gap-3 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-sky-300" />
          <span className="text-[11px] text-slate-600">{lang === "BN" ? "১ম বছর ২০২৩" : "Year 1 (2023)"}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-blue-700" />
          <span className="text-[11px] text-slate-600">{lang === "BN" ? "২য় বছর ২০২৪" : "Year 2 (2024)"}</span>
        </span>
      </div>
      <div className="w-full overflow-hidden max-h-[175px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[165px]">
          <text
            x={12}
            y={padT + chartH / 2}
            fontSize="9"
            fill="#94a3b8"
            textAnchor="middle"
            transform={`rotate(-90, 12, ${padT + chartH / 2})`}
          >
            {lang === "BN" ? "মিমি" : "mm"}
          </text>

          {ticks.map((t) => {
            const y = padT + chartH - (t / max) * chartH;
            return (
              <g key={t}>
                <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padL - 6} y={y + 3.5} fontSize="9" textAnchor="end" fill="#94a3b8">
                  {t}
                </text>
              </g>
            );
          })}

          {points.map((m, i) => {
            const gx = padL + i * groupW;
            const hHist = (m.historical / max) * chartH;
            const hRecent = (m.recent / max) * chartH;
            return (
              <g key={m.month}>
                <rect
                  x={gx + groupW / 2 - barW - 1.5}
                  y={padT + chartH - hHist}
                  width={barW}
                  height={Math.max(1.5, hHist)}
                  rx={1.5}
                  fill="#7dd3fc"
                />
                <rect
                  x={gx + groupW / 2 + 1.5}
                  y={padT + chartH - hRecent}
                  width={barW}
                  height={Math.max(1.5, hRecent)}
                  rx={1.5}
                  fill="#1d4ed8"
                />
                <text x={gx + groupW / 2} y={height - 7} fontSize="9.5" textAnchor="middle" fill="#64748b">
                  {monthName(m.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TemperatureTwoYearChart({ data }: { data?: ITwoYearMonthlyPoint[] }) {
  const { lang, monthName } = useLanguage();
  const width = 720;
  const height = 170;
  const padL = 42;
  const padR = 18;
  const padT = 16;
  const padB = 26;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = (data && data.length > 0) ? data : [
    { month: "Jan", historical: 18.2, recent: 18.8 },
    { month: "Feb", historical: 21.5, recent: 22.0 },
    { month: "Mar", historical: 26.8, recent: 27.5 },
    { month: "Apr", historical: 29.4, recent: 30.1 },
    { month: "May", historical: 29.8, recent: 30.5 },
    { month: "Jun", historical: 29.2, recent: 29.6 },
    { month: "Jul", historical: 28.7, recent: 29.0 },
    { month: "Aug", historical: 28.9, recent: 29.2 },
    { month: "Sep", historical: 28.6, recent: 28.9 },
    { month: "Oct", historical: 27.2, recent: 27.6 },
    { month: "Nov", historical: 23.4, recent: 23.9 },
    { month: "Dec", historical: 19.5, recent: 20.0 },
  ];

  const min = 15;
  const max = 40;
  const ticks = [15, 20, 25, 30, 35, 40];
  const stepX = chartW / (points.length - 1);

  const toXY = (key: "historical" | "recent") =>
    points.map((p, i) => [
      padL + i * stepX,
      padT + chartH - ((p[key] - min) / (max - min)) * chartH,
    ]);

  const histPts = toXY("historical");
  const recentPts = toXY("recent");
  const linePoints = (pts: number[][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-end gap-3 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-amber-500 border-b border-dashed" />
          <span className="text-[11px] text-slate-600">{lang === "BN" ? "১ম বছর ২০২৩ (গড়)" : "Year 1 2023 (Avg)"}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-rose-600" />
          <span className="text-[11px] text-slate-600">{lang === "BN" ? "২য় বছর ২০২৪ (সাম্প্রতিক)" : "Year 2 2024 (Recent)"}</span>
        </span>
      </div>
      <div className="w-full overflow-hidden max-h-[175px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[165px]">
          <text
            x={12}
            y={padT + chartH / 2}
            fontSize="9"
            fill="#94a3b8"
            textAnchor="middle"
            transform={`rotate(-90, 12, ${padT + chartH / 2})`}
          >
            {lang === "BN" ? "°সে" : "°C"}
          </text>

          {ticks.map((t) => {
            const y = padT + chartH - ((t - min) / (max - min)) * chartH;
            return (
              <g key={t}>
                <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padL - 6} y={y + 3.5} fontSize="9" textAnchor="end" fill="#94a3b8">
                  {t}
                </text>
              </g>
            );
          })}

          {/* Historical Line (Dashed Amber) */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeDasharray="4 3"
            points={linePoints(histPts)}
          />

          {/* Recent Line (Solid Rose/Red) */}
          <polyline
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            points={linePoints(recentPts)}
          />

          {/* Recent Dots */}
          {recentPts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.8" fill="#e11d48" stroke="#fff" strokeWidth="1" />
          ))}

          {points.map((p, i) => (
            <text
              key={p.month}
              x={padL + i * stepX}
              y={height - 7}
              fontSize="9.5"
              textAnchor="middle"
              fill="#64748b"
            >
              {monthName(p.month)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ================= MAIN PAGE COMPONENT =================

function ClimateAnalysisInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t, locName, cropName, priorityName } = useLanguage();
  const isBn = lang === "BN";

  // Form states
  const [location, setLocation] = useState<string>("Mymensingh");
  const [crop, setCrop] = useState<string>("Aman Rice");
  const [priority, setPriority] = useState<string>("Save Water");

  // Flow control states
  const [hasRequested, setHasRequested] = useState<boolean>(false);
  const [hasResult, setHasResult] = useState<boolean>(false);
  const [loadStep, setLoadStep] = useState<number>(0);
  const [analysisData, setAnalysisData] = useState<ITwoYearClimateAnalysisResponse | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);

  // Restore cached result from localStorage on mount (prevents re-fetching when navigating between routes)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed: ITwoYearClimateAnalysisResponse = JSON.parse(cached);
        if (parsed && parsed.analysisId && parsed.location) {
          setAnalysisData(parsed);
          setHasResult(true);
          if (parsed.location.district) setLocation(parsed.location.district);
          if (parsed.cropRequested) setCrop(parsed.cropRequested);
          if (parsed.farmerPriority) setPriority(parsed.farmerPriority);
        }
      }
    } catch (e) {
      console.warn("Failed to restore cached 2-year analysis:", e);
    }
  }, []);

  // Handle URL query parameters if present
  useEffect(() => {
    const locParam = searchParams.get("location");
    const cropParam = searchParams.get("crop");
    const priParam = searchParams.get("priority");

    if (locParam && cropParam) {
      setLocation(locParam);
      setCrop(cropParam);
      if (priParam) setPriority(priParam);
      setHasRequested(true);
    }
  }, [searchParams]);

  // TanStack Query for 2-year NASA Climate Analysis
  const queryKey = cropwiseQueryKeys.climateTwoYear(location, crop, priority);

  const {
    data: queryData,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const coords = LOCATION_COORDINATES[location] || { latitude: 24.75, longitude: 90.40 };
      const res = await runTwoYearClimateAnalysis({
        district: location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        crop,
        farmerPriority: priority,
        language: isBn ? "bn" : "en",
      });
      if (!res || !res.success || !res.data) {
        throw new Error(res?.data ? "Failed to retrieve analysis" : "Failed to analyze 2-year NASA Earth Observation records.");
      }
      return res.data;
    },
    enabled: Boolean(location && crop && hasRequested),
    ...cropwiseQueryOptions,
  });

  const isLoading = isQueryLoading || (isQueryFetching && !analysisData);
  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to analyze climate data") : manualError;

  // Sync queryData with local state and localStorage
  useEffect(() => {
    if (queryData) {
      setAnalysisData(queryData);
      setHasResult(true);
      setManualError(null);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(queryData));
      } catch (e) {
        console.warn("Failed to persist analysis in localStorage:", e);
      }
    }
  }, [queryData]);

  // Mobile loading screen animation timer
  useEffect(() => {
    if (!isLoading) {
      setLoadStep(0);
      return;
    }
    const id = setInterval(
      () => setLoadStep((s) => Math.min(s + 1, loadingSteps.length - 1)),
      1300
    );
    return () => clearInterval(id);
  }, [isLoading]);

  // Trigger analysis execution
  const handleAnalyze = async () => {
    setManualError(null);
    setHasRequested(true);
    router.push(
      `/dashboard/climate-analysis?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}&priority=${encodeURIComponent(priority)}`
    );
    await refetch();
  };

  return (
    <div className="pb-10">
      <TransparentNavSlot />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#fbfcfa]" style={{ minHeight: 310 }}>
        {/* Background image & gradient blend */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_65%]"
            style={{ backgroundImage: "url('/analysisBG.png')" }}
          />
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent" />
          <div className="absolute bottom-0 right-0 h-[30%] w-[20%] bg-gradient-to-tl from-[#f5f7f5]/90 to-transparent" />
        </div>

        <div className="relative px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/10 px-3 py-1 text-xs font-semibold text-emerald-900 backdrop-blur-sm">
              <Satellite className="h-3.5 w-3.5" />
              <span>
                {isBn ? "২ বছরের নাসা আর্থ অবজারভেশন বিশ্লেষণ (৭৩১ দিন)" : "2-Year NASA Earth Observation Engine (731 Days)"}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {isBn ? "জলবায়ু ও কৃষি বিশ্লেষণ" : "Climate & Agro Analysis"}
            </h1>

            {hasResult && (
              <p className="mt-1 text-lg font-semibold text-[#173d2a]">
                {locName(location)} · {cropName(crop)}
              </p>
            )}

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isBn
                ? "বিগত ২ বছরের নাসা উপাত্ত (NASA POWER, IMERG, SMAP, MODIS) বিশ্লেষণ করে মাটি ও আবহাওয়ার সাথে ফসলের নিখুঁত উপযোগিতা জানুন।"
                : "Analyze 2 years (731 days) of NASA satellite records to evaluate rainfall, soil moisture, thermal curves, and crop suitability."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-[-24px] pr-[200px] -rotate-[19deg] text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24 whitespace-pre-line`}
          >
            {isBn ? "সুস্থ মাটি\nউজ্জ্বল ভবিষ্যৎ" : "Healthy Fields\nBrighter Tomorrows"}
          </p>
        </div>
      </section>

      {/* ── FILTER CARD ──────────────────────────────────────────────────────── */}
      <div className="relative -mt-12 z-10 mb-8 px-4 sm:px-6">
        <FilterBar
          variant="card"
          location={location}
          crop={crop}
          priority={priority}
          onLocationChange={setLocation}
          onCropChange={setCrop}
          onPriorityChange={setPriority}
          onSubmit={handleAnalyze}
          hasResult={hasResult}
        />

        <p className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-500">
          <span>{isBn ? "আপনার এলাকা ও ফসল নির্বাচন করে বিশ্লেষণ শুরু করুন" : "Select location, desired crop, and priority to analyze"}</span>
          <span>{isBn ? "নাসা পাওয়ার · জিপিএম আইমার্জ · এসএমএপি · মডিস" : "NASA POWER · GPM IMERG · SMAP · MODIS"}</span>
        </p>
      </div>

      {/* ── ERROR STATE ──────────────────────────────────────────────────────── */}
      {error && (
        <section className={`mb-6 ${SECTION_X}`}>
          <div className="flex items-start justify-between rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-rose-800 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
              <div>
                <h4 className="font-semibold text-rose-900">{t("error_title")}</h4>
                <p className="mt-1 text-sm text-rose-700">{error}</p>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
            >
              <RefreshCw className="h-3.5 w-3.5" /> {t("retry")}
            </button>
          </div>
        </section>
      )}

      {/* ── LOADING STATE: Desktop ───────────────────────────────────────────── */}
      {isLoading && (
        <section className={`mb-8 hidden sm:block ${SECTION_X}`}>
          <div className="rounded-2xl border border-emerald-100 bg-white/95 p-8 text-center shadow-sm backdrop-blur">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-75" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-white shadow-md">
                <Satellite className="h-6 w-6 animate-pulse" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {isBn ? "২ বছরের নাসা স্যাটেলাইট উপাত্ত বিশ্লেষণ হচ্ছে..." : "Analyzing 2-Year NASA Earth Observations..."}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {locName(location)} {isBn ? "অঞ্চলের ২০২৩–২০২৪ সালের ৭৩১ দিনের জলবায়ু, বৃষ্টিপাত ও মাটির আর্দ্রতা প্রক্রিয়াকরণ হচ্ছে।" : "region 2023–2024 records: NASA POWER, IMERG rainfall, SMAP moisture, and MODIS NDVI."}
            </p>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium">
              <Loader2 className="h-4 w-4 animate-spin" /> {isBn ? "বিশ্লেষণ চলমান..." : "Processing algorithms..."}
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING STATE: Mobile Fullscreen ─────────────────────────────────── */}
      {isLoading && (
        <div className="fixed inset-0 z-[120] flex flex-col overflow-hidden bg-gradient-to-b from-[#e8f4fb] via-[#f3faf6] to-[#fbfcfa] sm:hidden">
          <div className="flex items-center gap-3 px-4 pb-3 pt-12">
            <button
              onClick={() => router.back()}
              aria-label="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <h2 className="flex-1 pr-9 text-center text-lg font-bold text-slate-900">
              {isBn ? "নাসা উপাত্ত বিশ্লেষণ হচ্ছে" : "Analyzing NASA Records"}
            </h2>
          </div>

          <p className="px-5 text-sm leading-snug text-slate-600">
            {isBn
              ? "বিগত ২ বছরের ৭৩১ দিনের বৃষ্টিপাত, মাটির আর্দ্রতা ও তাপমাত্রা বিশ্লেষণ করা হচ্ছে।"
              : "Processing 731 days of historical satellite records for your selected crop."}
          </p>

          <ul className="relative z-10 mt-5 space-y-3.5 px-5">
            {loadingSteps.map((s, i) => {
              const done = i < loadStep;
              const active = i === loadStep;
              return (
                <li key={s.en} className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      done || active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <s.icon className="h-[18px] w-[18px]" />
                  </span>

                  <span
                    className={`flex-1 text-[15px] ${
                      done || active ? "font-medium text-slate-800" : "text-slate-500"
                    }`}
                  >
                    {isBn ? s.bn : s.en}
                  </span>

                  {done ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : active ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-100">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full border-2 border-slate-300" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── RESULTS DASHBOARD ────────────────────────────────────────────────── */}
      {hasResult && analysisData && !isLoading ? (
        <div className="space-y-10">

          {/* ── 4 SATELLITE SOURCES (Diagram Center Box) ───────────────────────── */}
          <section className={SECTION_X}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? "নাসা আর্থ অবজারভেশন উপাত্ত ভান্ডার (২ বছর • ৭৩১ দিন)" : "NASA Earth Observation Satellite Feeds (2-Year Archive)"}
                </h3>
                <p className="text-xs text-slate-500">
                  {analysisData.location.district} {isBn ? "জেলার ওপর ২০২৩–২০২৪ সালের নির্ভুল স্যাটেলাইট পর্যবেক্ষণ" : "empirical satellite records for 2023–2024"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {analysisData.analysisPeriod.totalDays} {isBn ? "দিন সংগৃহীত" : "Days Synchronized"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* NASA POWER Card */}
              <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                    <Thermometer className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    NASA POWER
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {isBn ? "জলবায়ু ও তাপমাত্রা" : "Climate & Thermal Data"}
                </h4>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {analysisData.nasaData.nasaPower.meanTemperature}°C
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    ({analysisData.nasaData.nasaPower.minTemperature}° – {analysisData.nasaData.nasaPower.maxTemperature}°)
                  </span>
                </p>
                <div className="mt-3 space-y-1 border-t border-amber-100 pt-2 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isBn ? "তাপপ্রবাহ দিন (>৩৫°C):" : "Extreme Heat Days:"}</span>
                    <span className="font-semibold text-amber-900">{analysisData.nasaData.nasaPower.extremeHeatDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "সৌর বিকিরণ গড়:" : "Solar Radiation:"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.nasaPower.solarRadiationAvg} MJ/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "আপেক্ষিক আর্দ্রতা:" : "Relative Humidity:"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.nasaPower.relativeHumidityAvg}%</span>
                  </div>
                </div>
              </div>

              {/* NASA IMERG Card */}
              <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                    <CloudRain className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                    GPM IMERG
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {isBn ? "বৃষ্টিপাত পর্যবেক্ষণ" : "Rainfall Data"}
                </h4>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {analysisData.nasaData.imerg.totalRainfallMm}
                  <span className="text-xs font-normal text-slate-500 ml-1">mm (2-Yr)</span>
                </p>
                <div className="mt-3 space-y-1 border-t border-sky-100 pt-2 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isBn ? "বার্ষিক গড় বৃষ্টি:" : "Annual Average:"}</span>
                    <span className="font-semibold text-sky-900">{analysisData.nasaData.imerg.annualAverageMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "বৃষ্টির দিন:" : "Rainy Days:"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.imerg.rainyDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "শুষ্ক স্পেল (≥১০ দিন):" : "Dry Spells (≥10d):"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.imerg.drySpellsCount} times</span>
                  </div>
                </div>
              </div>

              {/* NASA SMAP Card */}
              <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/70 via-white to-teal-50/30 p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                    <Droplet className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                    NASA SMAP
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {isBn ? "মাটির আর্দ্রতা" : "Soil Moisture"}
                </h4>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {analysisData.nasaData.smap.rootzoneMean}
                  <span className="text-xs font-normal text-slate-500 ml-1">m³/m³ root</span>
                </p>
                <div className="mt-3 space-y-1 border-t border-teal-100 pt-2 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isBn ? "সারফেস আর্দ্রতা (০-৫ সেমি):" : "Surface (0-5cm):"}</span>
                    <span className="font-semibold text-teal-900">{analysisData.nasaData.smap.surfaceMean} m³/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "আর্দ্রতার অবস্থা:" : "Condition:"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.smap.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "অনুকূল আর্দ্রতার দিন:" : "Optimal Days:"}</span>
                    <span className="font-semibold text-slate-700">{analysisData.nasaData.smap.optimalMoistureDays} days</span>
                  </div>
                </div>
              </div>

              {/* NASA MODIS Card */}
              <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    MODIS NDVI
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {isBn ? "উদ্ভিদ ও ক্যানোপি" : "Vegetation Data"}
                </h4>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {analysisData.nasaData.modis.vegetationIndexNDVI}
                  <span className="text-xs font-normal text-slate-500 ml-1">NDVI</span>
                </p>
                <div className="mt-3 space-y-1 border-t border-emerald-100 pt-2 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isBn ? "ক্যানোপি স্বাস্থ্য স্কোর:" : "Canopy Health:"}</span>
                    <span className="font-semibold text-emerald-900">{analysisData.nasaData.modis.canopyHealthScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "শীর্ষ সবুজ মৌসুম:" : "Peak Greenness:"}</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[130px]">{analysisData.nasaData.modis.peakGreennessSeason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? "সবুজায়ন অবস্থা:" : "Vigor:"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? "সতেজ ও অনুকূল" : "Healthy & Vigorous"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── RESPONSE 1: RAIN INFOS (Diagram Item #1) ────────────────────────── */}
          <section className={SECTION_X}>
            <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <CloudRain className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
                        1
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {isBn ? "বৃষ্টিপাতের বিস্তারিত তথ্য (Rain Infos)" : "1. Rain Infos (NASA GPM IMERG 2-Year Analysis)"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isBn ? "বিগত ২ বছরে মোট বৃষ্টিপাত, দৈনিক গড় ও মৌসুমি বণ্টন" : "Accumulated 2-year rainfall, seasonal breakdown, and monthly precipitation curves"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200">
                  <TrendingUp className="h-4 w-4 text-sky-600" />
                  <span>{analysisData.rainInfo.trend}</span>
                </div>
              </div>

              {/* Rain Stat Counters */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="text-xs text-slate-500">{isBn ? "২ বছরের মোট বৃষ্টিপাত" : "Total 2-Yr Rainfall"}</span>
                  <p className="mt-1 text-2xl font-bold text-sky-950">{analysisData.rainInfo.totalRainfallMm} mm</p>
                  <p className="mt-1 text-[11px] text-slate-500">{isBn ? "বার্ষিক গড়:" : "Annual Avg:"} {analysisData.rainInfo.annualAverageMm} mm</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="text-xs text-slate-500">{isBn ? "বৃষ্টিবহুল দিন (≥১ মিমি)" : "Rainy Days Count"}</span>
                  <p className="mt-1 text-2xl font-bold text-sky-950">{analysisData.rainInfo.rainyDays} {isBn ? "দিন" : "days"}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{isBn ? "শুষ্ক দিন:" : "Dry Days:"} {analysisData.rainInfo.dryDays} {isBn ? "দিন" : "days"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="text-xs text-slate-500">{isBn ? "শুষ্ক স্পেল (≥১০ দিন শুষ্ক)" : "Dry Spells (≥10d)"}</span>
                  <p className="mt-1 text-2xl font-bold text-amber-700">{analysisData.rainInfo.drySpellsCount} {isBn ? "বার" : "events"}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{isBn ? "সেচ পরিকল্পনা প্রয়োজন" : "Supplementary irrigation needed"}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="text-xs text-slate-500">{isBn ? "ভারী বর্ষণ দিন (≥২৫ মিমি)" : "Heavy Rain Days"}</span>
                  <p className="mt-1 text-2xl font-bold text-indigo-900">{analysisData.rainInfo.heavyRainfallDays} {isBn ? "দিন" : "days"}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{isBn ? "পানি নিষ্কাশন সতর্কতা" : "Surface runoff & drainage watch"}</p>
                </div>
              </div>

              {/* Seasonal & Chart Comparison */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isBn ? "মৌসুমি বৃষ্টিপাত বিভাজন" : "Seasonal Precipitation Distribution"}
                  </h4>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{isBn ? "খরিফ-২ (আমন ও বর্ষাকাল)" : "Kharif-II (Aman & Monsoon)"}</span>
                        <span className="text-sky-700 font-bold">{analysisData.rainInfo.monsoonRainfallMm} mm</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-sky-600 rounded-full"
                          style={{
                            width: `${Math.min(100, (analysisData.rainInfo.monsoonRainfallMm / analysisData.rainInfo.totalRainfallMm) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{isBn ? "খরিফ-১ (আউশ ও প্রাক-বর্ষা)" : "Kharif-I (Aus & Pre-monsoon)"}</span>
                        <span className="text-emerald-700 font-bold">{analysisData.rainInfo.preMonsoonRainfallMm} mm</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{
                            width: `${Math.min(100, (analysisData.rainInfo.preMonsoonRainfallMm / analysisData.rainInfo.totalRainfallMm) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{isBn ? "রবি (শীতকালীন ও শুষ্ক মৌসুম)" : "Rabi (Winter & Dry Season)"}</span>
                        <span className="text-amber-700 font-bold">{analysisData.rainInfo.winterDryRainfallMm} mm</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{
                            width: `${Math.min(100, (analysisData.rainInfo.winterDryRainfallMm / analysisData.rainInfo.totalRainfallMm) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 lg:col-span-7">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      {isBn ? "মাসিক বৃষ্টিপাতের ২ বছরের তুলনা (২০২৩ বনাম ২০২৪)" : "2-Year Monthly Rainfall Comparison (2023 vs 2024)"}
                    </span>
                    <span className="text-[10px] text-slate-400">NASA GPM IMERG</span>
                  </div>
                  <RainfallTwoYearChart data={analysisData.rainInfo.monthlyRainfall} />
                </div>
              </div>
            </div>
          </section>

          {/* ── RESPONSE 2: SOIL INFO (Diagram Item #2) ─────────────────────────── */}
          <section className={SECTION_X}>
            <div className="rounded-3xl border border-teal-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <Droplet className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800">
                        2
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {isBn ? "মাটির আর্দ্রতা ও হাইড্রেশন (Soil Info)" : "2. Soil Info (NASA SMAP Soil Moisture Analysis)"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isBn ? "রুট-জোন ও সারফেস আর্দ্রতা, জলাবদ্ধতা এবং সেচ চাহিদা মূল্যায়ন" : "Root-zone & surface volumetric soil moisture, drought risk, and irrigation necessity"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 border border-teal-200">
                  <ShieldCheck className="h-4 w-4" />
                  {analysisData.soilInfo.effectiveRootDepthHydration}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Root-zone Moisture */}
                <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/60 to-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-800">
                      {isBn ? "রুট-জোন আর্দ্রতা (০–১০০ সেমি)" : "Rootzone Moisture (0-100cm)"}
                    </span>
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                      SMAP L4
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-teal-950">
                    {(analysisData.soilInfo.rootzoneMoisture * 100).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-teal-700 font-medium">
                    {analysisData.soilInfo.rootzoneMoisture} m³/m³ volumetric moisture
                  </p>
                  <div className="mt-3 border-t border-teal-100 pt-2 text-[11px] text-slate-600">
                    {isBn
                      ? "ফসলের মূল স্তরে মাটির পানি ধারণ ক্ষমতা স্থিতিশীল রয়েছে।"
                      : "Subsoil layers retain consistent hydration for deep-root crop absorption."}
                  </div>
                </div>

                {/* Surface Moisture */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {isBn ? "সারফেস আর্দ্রতা (০–৫ সেমি)" : "Surface Moisture (0-5cm)"}
                    </span>
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      Topsoil
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {(analysisData.soilInfo.surfaceMoisture * 100).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-slate-600 font-medium">
                    {analysisData.soilInfo.surfaceMoisture} m³/m³ topsoil moisture
                  </p>
                  <div className="mt-3 border-t border-slate-200 pt-2 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">{isBn ? "অবস্থা:" : "Status:"}</span> {analysisData.soilInfo.moistureStatus}
                  </div>
                </div>

                {/* Irrigation Recommendation */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-900">
                      {isBn ? "সেচ নির্দেশনা" : "Irrigation Requirement"}
                    </span>
                    <Activity className="h-4 w-4 text-indigo-600" />
                  </div>
                  <p className="mt-2 text-sm font-bold text-indigo-950">
                    {analysisData.soilInfo.irrigationNeed}
                  </p>
                  <div className="mt-3 space-y-1.5 border-t border-indigo-100 pt-2 text-[11px] text-indigo-900/80">
                    <div className="flex justify-between">
                      <span>{isBn ? "মাটির ধরণ:" : "Soil Type:"}</span>
                      <span className="font-semibold">{analysisData.soilInfo.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? "পানি নিষ্কাশন:" : "Drainage:"}</span>
                      <span className="font-semibold">{analysisData.soilInfo.drainage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? "জলাবদ্ধতার ঝুঁকি:" : "Waterlog Risk:"}</span>
                      <span className="font-semibold">{analysisData.soilInfo.waterloggingRisk}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── RESPONSE 3: TEMP AND HUMIDITY (Diagram Item #3) ─────────────────── */}
          <section className={SECTION_X}>
            <div className="rounded-3xl border border-amber-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Thermometer className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                        3
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {isBn ? "তাপমাত্রা ও আর্দ্রতা (Temp and Humidity)" : "3. Temp and Humidity (NASA POWER 2-Year Thermal Profile)"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isBn ? "গড়, সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা, চরম তাপপ্রবাহ ও আপেক্ষিক আর্দ্রতা" : "Mean, max, min temperatures, heat stress events, and thermal stress status"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200">
                  <Sun className="h-4 w-4" />
                  <span>{analysisData.temperatureAndHumidity.thermalStressStatus}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
                {/* Left side: The Temperature Curve */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 lg:col-span-7 xl:col-span-8">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {isBn ? "মাসিক তাপমাত্রার ২ বছরের তুলনা (২০২৩ বনাম ২০২৪)" : "2-Year Monthly Temperature Curve (2023 vs 2024)"}
                    </span>
                    <span className="text-[10px] text-slate-400">NASA POWER Agroclimatology</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <TemperatureTwoYearChart data={analysisData.temperatureAndHumidity.monthlyTemperature} />
                  </div>
                </div>

                {/* Right side: 4 cards in 1 line (vertical column) */}
                <div className="flex flex-col justify-between gap-3 lg:col-span-5 xl:col-span-4">
                  {/* Card 1: 2-Year Mean Temp */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-sm">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">{isBn ? "২ বছরের গড় তাপমাত্রা" : "2-Year Mean Temp"}</span>
                      <p className="text-xl font-extrabold text-slate-900">{analysisData.temperatureAndHumidity.meanTemperature}°C</p>
                    </div>
                    <p className="text-[11px] text-slate-500 text-right leading-tight">
                      {isBn ? "সর্বনিম্ন:" : "Min:"} {analysisData.temperatureAndHumidity.minTemperature}°C<br />
                      {isBn ? "সর্বোচ্চ:" : "Max:"} {analysisData.temperatureAndHumidity.maxTemperature}°C
                    </p>
                  </div>

                  {/* Card 2: Heat Stress Days */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-sm">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">{isBn ? "চরম তাপপ্রবাহ দিন (>৩৫°C)" : "Heat Stress Days (>35°C)"}</span>
                      <p className="text-xl font-extrabold text-rose-600">{analysisData.temperatureAndHumidity.extremeHeatDays} {isBn ? "দিন" : "days"}</p>
                    </div>
                    <span className="text-[10px] text-amber-800 bg-amber-100/70 px-2 py-1 rounded-md font-medium text-right max-w-[130px]">
                      {isBn ? "প্রাক-বর্ষা সময়ে সতর্ক থাকুন" : "Pre-monsoon thermal alert"}
                    </span>
                  </div>

                  {/* Card 3: Cold Stress Days */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-sm">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">{isBn ? "শৈত্যপ্রবাহ দিন (<১২°C)" : "Cold Stress Days (<12°C)"}</span>
                      <p className="text-xl font-extrabold text-sky-700">{analysisData.temperatureAndHumidity.coldStressDays} {isBn ? "দিন" : "days"}</p>
                    </div>
                    <span className="text-[10px] text-sky-800 bg-sky-100/70 px-2 py-1 rounded-md font-medium text-right max-w-[130px]">
                      {isBn ? "রবি ফসল সহনশীল জাত" : "Rabi cold tolerance"}
                    </span>
                  </div>

                  {/* Card 4: Humidity & Solar */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-sm">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">{isBn ? "আপেক্ষিক আর্দ্রতা ও বিকিরণ" : "Humidity & Solar"}</span>
                      <p className="text-xl font-extrabold text-slate-900">{analysisData.temperatureAndHumidity.relativeHumidity}%</p>
                    </div>
                    <p className="text-[11px] text-slate-500 text-right leading-tight">
                      {isBn ? "বিকিরণ:" : "Radiation:"}<br />
                      <span className="font-semibold text-slate-700">{analysisData.temperatureAndHumidity.solarRadiation} MJ/m²</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── RESPONSE 4: CROP SUITABILITY & RECOMMENDATION (Diagram Item #4) ──── */}
          <section className={SECTION_X}>
            <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 p-6 sm:p-9 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    <Sprout className="h-4 w-4" />
                    <span>
                      {isBn ? "Soil ও Climate Context অনুযায়ী ফসল উপযোগিতা" : "Crop Suitability by Soil & Climate Context"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                    {isBn
                      ? `${analysisData.suitabilityRecommendation.primaryCropNameBn} কি চাষের জন্য উপযোগী?`
                      : `Is ${analysisData.suitabilityRecommendation.primaryCropNameEn} Suitable to Farm?`}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {isBn
                      ? "বিগত ২ বছরের ৭৩১ দিনের নাসা স্যাটেলাইট উপাত্তের ভিত্তিতে সঠিক মূল্যায়ন"
                      : "Verified against 731 days of empirical NASA satellite agro-climatic observations"}
                  </p>
                </div>

                {/* Score badge */}
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-emerald-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white font-extrabold text-lg">
                    {analysisData.suitabilityRecommendation.suitabilityScore}%
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-emerald-900">
                      {analysisData.suitabilityRecommendation.isRequestedCropSuitable
                        ? (isBn ? "চাষের জন্য অত্যন্ত উপযোগী" : "Highly Suitable")
                        : (isBn ? "পরিমিত উপযোগী (সতর্কতা সহ)" : "Moderately Suitable")}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {isBn ? "উপযোগিতা স্কোর" : "Compatibility Match"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compatibility Explanation */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                  <Info className="h-4 w-4 text-emerald-700" />
                  {isBn ? "মাটি ও জলবায়ু প্রেক্ষাপট বিশ্লেষণ (Soil & Climate Context)" : "Soil & Climate Context Agronomic Reasoning"}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {analysisData.suitabilityRecommendation.compatibilityExplanation}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">{isBn ? "রোপণের আদর্শ সময়:" : "Optimal Planting Window:"}</span>
                    <p className="font-bold text-slate-900">{analysisData.suitabilityRecommendation.plantingWindow.labelEn}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{isBn ? "ফসল তোলার সময়:" : "Harvesting Window:"}</span>
                    <p className="font-bold text-slate-900">{analysisData.suitabilityRecommendation.harvestingWindow.labelEn}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{isBn ? "মোট পানির চাহিদা:" : "Water Requirement:"}</span>
                    <p className="font-bold text-slate-900">{analysisData.suitabilityRecommendation.waterRequirementMm} mm</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{isBn ? "পানির চাপ সূচক:" : "Water Stress Index:"}</span>
                    <p className="font-bold text-emerald-800">{analysisData.suitabilityRecommendation.waterStressIndex}</p>
                  </div>
                </div>
              </div>

              {/* Alternative Crops */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {isBn ? "বিকল্প সামঞ্জস্যপূর্ণ ফসল (Alternative Compatible Crops)" : "Alternative Compatible Crops for this Soil Context"}
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {analysisData.suitabilityRecommendation.alternativeCrops.map((alt) => (
                    <div
                      key={alt.cropId}
                      className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-emerald-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {isBn ? alt.nameBn : alt.nameEn}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                          {alt.suitabilityScore}%
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 leading-snug">
                        {alt.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Climate Risks & Mitigation */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {analysisData.suitabilityRecommendation.climateRisks.map((risk, idx) => (
                  <div key={idx} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <h5 className="text-xs font-bold text-amber-950">{risk.factor}</h5>
                      <span className="ml-auto rounded-full bg-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                        {risk.riskLevel}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700">
                      <strong>{isBn ? "পর্যবেক্ষণ:" : "Observation:"}</strong> {risk.observation}
                    </p>
                    <p className="mt-1 text-xs text-emerald-800 font-medium">
                      <strong>{isBn ? "করণীয়:" : "Mitigation:"}</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Farmer Advice */}
              <div className="mt-6 rounded-2xl bg-emerald-800 p-5 text-white shadow-sm">
                <h4 className="flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  {isBn ? "কৃষকের জন্য এআই বাস্তবায়ন নির্দেশিকা (Farmer Advice)" : "Actionable Farmer Guidance"}
                </h4>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-50">
                  {analysisData.suitabilityRecommendation.farmerAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>
      ) : null}

      {/* ── INITIAL EMPTY STATE (Before selecting & analyzing) ───────────────── */}
      {!hasResult && !isLoading && (
        <section className={`mt-8 ${SECTION_X}`}>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              {isBn ? "২ বছরের নাসা জলবায়ু বিশ্লেষণ শুরু করুন" : "Start 2-Year NASA Earth Observation Climate Analysis"}
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              {isBn
                ? "উপরের ফিল্টার থেকে আপনার জেলা (Location), যে ফসল চাষ করতে চান (Crop), এবং আপনার প্রধান অগ্রাধিকার (Farmer Priority) নির্বাচন করে 'Analyze' বাটনে ক্লিক করুন।"
                : "Select your location, the crop you wish to farm, and your farmer priority in the bar above, then click 'Analyze' to inspect 731 days of empirical satellite records."}
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 text-left">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 text-xs font-bold">1</span>
                <h4 className="mt-2 text-xs font-bold text-slate-800">{isBn ? "১. বৃষ্টিপাতের তথ্য" : "1. Rain Infos"}</h4>
                <p className="mt-1 text-[11px] text-slate-500">{isBn ? "মোট বৃষ্টিপাত, খরা ও মৌসুমি পরিবর্তন" : "IMERG 2-year rain totals, dry spells & seasonal curves"}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 text-xs font-bold">2</span>
                <h4 className="mt-2 text-xs font-bold text-slate-800">{isBn ? "২. মাটির অবস্থা" : "2. Soil Info"}</h4>
                <p className="mt-1 text-[11px] text-slate-500">{isBn ? "SMAP মূল স্তরের আর্দ্রতা ও সেচ চাহিদা" : "SMAP surface & rootzone moisture hydration"}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">3</span>
                <h4 className="mt-2 text-xs font-bold text-slate-800">{isBn ? "৩. ফসল উপযোগিতা" : "3. Crop Suitability"}</h4>
                <p className="mt-1 text-[11px] text-slate-500">{isBn ? "মাটি ও আবহাওয়ায় ফসলের সঠিক উপযোগিতা" : "Deterministic suitability score & planting window"}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ASK AI BAR ───────────────────────────────────────────────────────── */}
      <div className={`mt-10 ${SECTION_X}`}>
        <AskAiBar />
      </div>
    </div>
  );
}

export default function ClimateAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfcfa]" />}>
      <ClimateAnalysisInner />
    </Suspense>
  );
}