"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LocationMapSection = dynamic(
  () => import("@/Components/modules/Dashboord/LocationMapSection"),
  { ssr: false, loading: () => <div className="h-[360px] rounded-2xl bg-slate-100 animate-pulse" /> }
);
import {
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Droplets,
  Sun,
  ShieldCheck,
  Check,
  HelpCircle,
  ExternalLink,
  Loader2,
  Sprout,
  Wheat,
  Carrot,
  Leaf,
  Flower2,
  Flame,
  TrendingUp,
  Compass,
  Satellite,
  BarChart3,
  ArrowUp,
  ArrowDown,
  CircleDot,
  History,
  ShieldAlert,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import {
  useCropRotationMutation,
  ICropRotationAnalyzeOutput,
  ICropRotationPlan,
  IScheduledCropItem,
} from "@/lib/apis/cropRotation.api";
import { useLanguage } from "@/lib/language-context";

const DISTRICTS_BANGLADESH: Record<string, { lat: number; lon: number }> = {
  Rajshahi: { lat: 24.37, lon: 88.6 },
  Mymensingh: { lat: 24.75, lon: 90.4 },
  Rangpur: { lat: 25.75, lon: 89.25 },
  Dhaka: { lat: 23.81, lon: 90.41 },
  Dinajpur: { lat: 25.62, lon: 88.64 },
  Bogura: { lat: 24.85, lon: 89.38 },
  Jessore: { lat: 23.17, lon: 89.21 },
  Pabna: { lat: 24.01, lon: 89.25 },
  Kushtia: { lat: 23.9, lon: 89.12 },
  Sirajganj: { lat: 24.45, lon: 89.7 },
  Natore: { lat: 24.41, lon: 88.98 },
  Faridpur: { lat: 23.6, lon: 89.84 },
  Tangail: { lat: 24.25, lon: 89.92 },
  Comilla: { lat: 23.46, lon: 91.18 },
  Chittagong: { lat: 22.36, lon: 91.78 },
  Sylhet: { lat: 24.89, lon: 91.87 },
  Khulna: { lat: 22.85, lon: 89.54 },
  Barisal: { lat: 22.7, lon: 90.35 },
};

interface ICropOption {
  id: string;
  nameEn: string;
  nameBn: string;
  iconType: "wheat" | "potato" | "maize" | "lentil" | "mustard" | "chickpea" | "mung" | "vegetables" | "jute";
  expectedYieldEn: string;
  expectedYieldBn: string;
}

const AVAILABLE_CROPS_LIST: ICropOption[] = [
  { id: "Rice", nameEn: "Rice", nameBn: "ধান", iconType: "wheat", expectedYieldEn: "4.8 – 5.5 t/ha", expectedYieldBn: "৪.৮ – ৫.৫ টন/হেক্টর" },
  { id: "Potato", nameEn: "Potato", nameBn: "আলু", iconType: "potato", expectedYieldEn: "24 – 28 t/ha", expectedYieldBn: "২৪ – ২৮ টন/হেক্টর" },
  { id: "Maize", nameEn: "Maize", nameBn: "ভুট্টা", iconType: "maize", expectedYieldEn: "8.5 – 10.5 t/ha", expectedYieldBn: "৮.৫ – ১০.৫ টন/হেক্টর" },
  { id: "Wheat", nameEn: "Wheat", nameBn: "গম", iconType: "wheat", expectedYieldEn: "3.5 – 4.2 t/ha", expectedYieldBn: "৩.৫ – ৪.২ টন/হেক্টর" },
  { id: "Lentil", nameEn: "Lentil", nameBn: "মসুর ডাল", iconType: "lentil", expectedYieldEn: "1.4 – 1.8 t/ha", expectedYieldBn: "১.৪ – ১.৮ টন/হেক্টর" },
  { id: "Mustard", nameEn: "Mustard", nameBn: "সরিষা", iconType: "mustard", expectedYieldEn: "1.2 – 1.6 t/ha", expectedYieldBn: "১.২ – ১.৬ টন/হেক্টর" },
  { id: "Chickpea", nameEn: "Chickpea", nameBn: "ছোলা", iconType: "chickpea", expectedYieldEn: "1.3 – 1.7 t/ha", expectedYieldBn: "১.৩ – ১.৭ টন/হেক্টর" },
  { id: "Mung", nameEn: "Mung", nameBn: "মুগ ডাল", iconType: "mung", expectedYieldEn: "1.2 – 1.5 t/ha", expectedYieldBn: "১.২ – ১.৫ টন/হেক্টর" },
  { id: "Vegetables", nameEn: "Vegetables", nameBn: "সবজি", iconType: "vegetables", expectedYieldEn: "18 – 25 t/ha", expectedYieldBn: "১৮ – ২৫ টন/হেক্টর" },
  { id: "Jute", nameEn: "Jute", nameBn: "পাট", iconType: "jute", expectedYieldEn: "2.2 – 2.8 t/ha", expectedYieldBn: "২.২ – ২.৮ টন/হেক্টর" },
];

const SOIL_TYPES = [
  { id: "Clay Loam", en: "Clay Loam", bn: "এটেল দোআঁশ" },
  { id: "Loam", en: "Loam", bn: "দোআঁশ" },
  { id: "Sandy Loam", en: "Sandy Loam", bn: "বেলে দোআঁশ" },
  { id: "Silty Clay", en: "Silty Clay", bn: "পলি এটেল" },
  { id: "Alluvial", en: "Alluvial", bn: "পলল মাটি" },
];

// Module-scoped in-memory cache:
// - Persists during client-side route navigation (e.g. navigating to other dashboard pages and returning)
// - Resets to null on hard browser reload (F5 / refresh)
let memoryCachedResult: ICropRotationAnalyzeOutput | null = null;
let memoryCachedDistrict = "Rajshahi";
let memoryCachedSoil = "Clay Loam";
let memoryCachedDrainage: "GOOD" | "MODERATE" | "POOR" = "MODERATE";
let memoryCachedLastCrop = "Potato";
let memoryCachedPreferred: string[] = ["Rice", "Wheat"];
let memoryCachedRanked: string[] = ["Rice", "Wheat", "Jute"];
let memoryCachedPlanTab: "planA" | "planB" | "planC" = "planA";

export default function CropRotationPage() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  // Form states initialized from in-memory cache
  const [district, setDistrict] = useState(memoryCachedDistrict);
  const [soilType, setSoilType] = useState(memoryCachedSoil);
  const [drainage, setDrainage] = useState<"GOOD" | "MODERATE" | "POOR">(memoryCachedDrainage);
  const [lastCultivatedCrop, setLastCultivatedCrop] = useState<string>(memoryCachedLastCrop);
  const [preferredCrops, setPreferredCrops] = useState<string[]>(memoryCachedPreferred);
  const [rankedList, setRankedList] = useState<string[]>(memoryCachedRanked);

  // Active selected plan tab in results view
  const [selectedPlanTab, setSelectedPlanTab] = useState<"planA" | "planB" | "planC">(memoryCachedPlanTab);
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>("plan_a_farmer_priority");

  const router = useRouter();

  // TanStack Query Mutation
  const analyzeMutation = useCropRotationMutation();
  // Result initialized from memoryCachedResult (null on fresh reload, restored on route navigation)
  const [result, setResult] = useState<ICropRotationAnalyzeOutput | null>(memoryCachedResult);

  const activePlan: ICropRotationPlan | undefined =
    result?.plans ? (selectedPlanTab === "planA" ? result.plans.planA : selectedPlanTab === "planB" ? result.plans.planB : result.plans.planC) : undefined;

  const handleSelectPlan = (planToSelect?: ICropRotationPlan) => {
    const chosenPlan = planToSelect || activePlan;
    if (!chosenPlan) return;
    setConfirmedPlan(chosenPlan.planId);
    if (typeof window !== "undefined") {
      const payload = {
        selectedPlanId: chosenPlan.planId,
        plan: chosenPlan,
        plans: result?.plans,
        location: result?.location,
        district: district,
        farmerInputs: result?.farmerInputs || {
          preferredCropsRanked: rankedList,
          excludedCrops: [lastCultivatedCrop],
          lastCultivatedCrop: lastCultivatedCrop,
          soilType,
          drainage,
        },
        environmentalSummary: result?.environmentalSummary,
        nasaDataCoverage: result?.nasaDataCoverage,
        excludedCropsExplanation: result?.excludedCropsExplanation,
        confidenceScore: result?.confidenceScore ?? 94,
        analysisPeriod: result?.analysisPeriod,
        missingDataNotes: result?.missingDataNotes,
        updatedAt: Date.now(),
      };
      localStorage.setItem("cropwise:selected-rotation-plan", JSON.stringify(payload));
    }
    router.push(`/dashboard/why-this-result?from=crop-rotation&planId=${encodeURIComponent(chosenPlan.planId)}`);
  };

  // Sync state changes to memory cache
  useEffect(() => {
    memoryCachedDistrict = district;
    memoryCachedSoil = soilType;
    memoryCachedDrainage = drainage;
    memoryCachedLastCrop = lastCultivatedCrop;
    memoryCachedPreferred = preferredCrops;
    memoryCachedRanked = rankedList;
    memoryCachedPlanTab = selectedPlanTab;
  }, [district, soilType, drainage, lastCultivatedCrop, preferredCrops, rankedList, selectedPlanTab]);

  const handleLastCropChange = (cropId: string) => {
    setLastCultivatedCrop(cropId);
    if (cropId && cropId !== "none") {
      // Remove from preferred crops and ranked list since it's the last cultivated crop and will be excluded
      if (preferredCrops.includes(cropId)) {
        const nextPref = preferredCrops.filter((c) => c !== cropId);
        setPreferredCrops(nextPref.length > 0 ? nextPref : ["Rice"]);
      }
      if (rankedList.includes(cropId)) {
        const nextRanked = rankedList.filter((c) => c !== cropId);
        setRankedList(nextRanked.length > 0 ? nextRanked : ["Rice"]);
      }
    }
  };

  const handleRunAnalysis = () => {
    analyzeMutation.mutate(
      {
        district,
        latitude: DISTRICTS_BANGLADESH[district]?.lat,
        longitude: DISTRICTS_BANGLADESH[district]?.lon,
        soilType,
        drainage,
        preferredCrops: rankedList.map((cropId, idx) => ({ crop: cropId, priority: idx + 1 })),
        excludedCrops: [],
        lastCultivatedCrop: lastCultivatedCrop && lastCultivatedCrop !== "none" ? lastCultivatedCrop : undefined,
        analysisDateRange: {
          start: "20230101",
          end: "20241231",
        },
      },
      {
        onSuccess: (data) => {
          setResult(data);
          memoryCachedResult = data;
        },
      }
    );
  };

  const togglePreferredCrop = (cropId: string) => {
    if (preferredCrops.includes(cropId)) {
      if (preferredCrops.length > 1) {
        const next = preferredCrops.filter((c) => c !== cropId);
        setPreferredCrops(next);
        setRankedList(rankedList.filter((r) => r !== cropId));
      }
    } else {
      setPreferredCrops([...preferredCrops, cropId]);
      setRankedList([...rankedList, cropId]);
    }
  };

  const movePriority = (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= rankedList.length) return;
    const next = [...rankedList];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setRankedList(next);
  };

  const getCropDisplayName = (cropId: string) => {
    if (cropId.toLowerCase() === "jute") return isBn ? "পাট" : "Jute";
    const found = AVAILABLE_CROPS_LIST.find((c) => c.id.toLowerCase() === cropId.toLowerCase());
    if (found) return isBn ? found.nameBn : found.nameEn;
    return cropId;
  };

  // Modern SVG Icons for crops (replacing emojis)
  const renderCropIcon = (iconType: ICropOption["iconType"], className = "h-4 w-4") => {
    switch (iconType) {
      case "wheat":
        return <Wheat className={`${className} text-amber-600`} />;
      case "potato":
        return (
          <div className="flex items-center justify-center h-4 w-4 rounded-full bg-amber-600/15">
            <CircleDot className="h-3 w-3 text-amber-700" />
          </div>
        );
      case "maize":
        return <Sun className={`${className} text-amber-500`} />;
      case "lentil":
        return (
          <div className="flex items-center justify-center h-4 w-4 rounded-full bg-orange-600/15">
            <Droplets className="h-3 w-3 text-orange-600" />
          </div>
        );
      case "mustard":
        return <Flower2 className={`${className} text-yellow-500`} />;
      case "chickpea":
        return <Sprout className={`${className} text-emerald-600`} />;
      case "mung":
        return <Leaf className={`${className} text-emerald-500`} />;
      case "vegetables":
        return <Carrot className={`${className} text-emerald-600`} />;
      case "jute":
      default:
        return <Leaf className={`${className} text-teal-600`} />;
    }
  };

  // Specific visual icon badge for cropping sequence cards
  const renderSequenceCropBadge = (cropName: string) => {
    const lower = cropName.toLowerCase();
    if (lower.includes("potato") || lower.includes("আলু")) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300/60 shadow-xs">
          <CircleDot className="h-6 w-6 text-amber-800" />
        </div>
      );
    }
    if (lower.includes("jute") || lower.includes("পাট")) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 border border-emerald-300/60 shadow-xs">
          <Leaf className="h-6 w-6 text-emerald-800" />
        </div>
      );
    }
    if (lower.includes("lentil") || lower.includes("মসুর") || lower.includes("chickpea") || lower.includes("ছোলা")) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 border border-orange-300/60 shadow-xs">
          <Sprout className="h-6 w-6 text-orange-800" />
        </div>
      );
    }
    if (lower.includes("wheat") || lower.includes("গম")) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 border border-amber-300/60 shadow-xs">
          <Wheat className="h-6 w-6 text-amber-800" />
        </div>
      );
    }
    // Default Rice / Crop
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 border border-emerald-300/60 shadow-xs">
        <Wheat className="h-6 w-6 text-emerald-800" />
      </div>
    );
  };

  const getExpectedYield = (cropId: string) => {
    const found = AVAILABLE_CROPS_LIST.find((c) => c.id.toLowerCase() === cropId.toLowerCase() || cropId.toLowerCase().includes(c.id.toLowerCase()));
    if (!found) return isBn ? "৩.৫ – ৫.০ টন/হেক্টর" : "3.5 – 5.0 t/ha";
    return isBn ? found.expectedYieldBn : found.expectedYieldEn;
  };

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-800 pb-16">
      {/* ── Transparent Navbar Slot: Enables absolute transparent navbar overlay ── */}
      <TransparentNavSlot />

      {/* ─────────────────────────────────────────────────────────────
          HERO BANNER: Lush Green Agricultural Field with Sun Rays
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: 330 }}>
        {/* Background Image: using analysisBG.png */}
        <div
          className="absolute inset-0 bg-cover bg-[center_55%]"
          style={{
            backgroundImage: "url('/analysisBG.png')",
          }}
        />

        {/* Cinematic dark emerald gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-950/25" />

        {/* Hero content positioned with top padding to accommodate the transparent navbar */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-2">
            <Satellite className="h-4 w-4" />
            <span>{isBn ? "নাসা আর্থ অবজারভেশন চালিত" : "NASA EARTH OBSERVATION POWERED"}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[40px] leading-tight">
            {isBn ? "স্মার্ট ফসল আবর্তন ইঞ্জিন" : "Evidence-Based Crop Rotation Engine"}
          </h1>

          <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            {isBn
              ? "২ বছরের নাসা POWER তাপমাত্রা, IMERG বৃষ্টিপাত এবং SMAP মাটির আর্দ্রতার ডাটা বিশ্লেষণ করে আপনার পছন্দ অনুযায়ী বৈজ্ঞানিক ফসল পর্যায় তৈরি করুন।"
              : "Harmonizing 2-year NASA POWER thermal curves, IMERG rainfall totals, and SMAP root-zone soil moisture with farmer crop preferences and agronomic disease-break rules."}
          </p>

          {/* 4 Glassmorphism Feature Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-white">
            <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3.5 py-1.5 border border-white/20">
              <Compass className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isBn ? "নাসা আর্থ ডাটা" : "NASA Earth Data"}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3.5 py-1.5 border border-white/20">
              <Sprout className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isBn ? "জলবায়ু সচেতন পরিকল্পনা" : "Climate-Aware Planning"}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3.5 py-1.5 border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isBn ? "রোগচক্র নিয়ন্ত্রণ" : "Disease Break Control"}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md px-3.5 py-1.5 border border-white/20">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isBn ? "উচ্চ ফলন • কম ঝুঁকি" : "Higher Yield • Lower Risk"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN DASHBOARD CONTENT (Edge-to-Edge with Consistent Margins)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─────────────────────────────────────────────────────────
              LEFT COLUMN: Farm & Crop Parameters (Step 1 of 5)
             ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">
                    {isBn ? "খামার ও ফসলের প্যারামিটার" : "Farm & Crop Parameters"}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isBn ? "ধাপ ১ এর ৫" : "Step 1 of 5"}
                </span>
              </div>

              {/* 1. Farm District (Location) */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {isBn ? "১. খামারের জেলা (অবস্থান)" : "1. Farm District (Location)"}
                </label>
                <div className="relative">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-sm font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    {Object.keys(DISTRICTS_BANGLADESH).map((d) => (
                      <option key={d} value={d}>
                        {d} ({DISTRICTS_BANGLADESH[d].lat}°N, {DISTRICTS_BANGLADESH[d].lon}°E)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">GPS: {DISTRICTS_BANGLADESH[district]?.lat}°N, {DISTRICTS_BANGLADESH[district]?.lon}°E</span>
                  <button type="button" className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline">
                    {isBn ? "ম্যাপে দেখুন" : "View on Map"} <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 2. Soil Characteristics */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-600" />
                  {isBn ? "২. মাটির বৈশিষ্ট্য" : "2. Soil Characteristics"}
                </label>
                <div className="relative mb-2">
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    {SOIL_TYPES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isBn ? s.bn : s.en}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* 3-Toggle Drainage Options */}
                <div className="grid grid-cols-3 gap-1.5">
                  {(["GOOD", "MODERATE", "POOR"] as const).map((lvl) => {
                    const isSelected = drainage === lvl;
                    const label = lvl === "GOOD" ? (isBn ? "উত্তম" : "Good Drain") : lvl === "MODERATE" ? (isBn ? "মধ্যম" : "Moderate") : (isBn ? "বদ্ধ" : "Poor Drain");
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDrainage(lvl)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                          isSelected
                            ? "bg-[#0f402b] text-white border-[#0f402b] shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Last Cultivated Crop (Previous Harvest) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <History className="h-3.5 w-3.5 text-emerald-600" />
                    {isBn ? "৩. পূর্ববর্তী চাষ করা ফসল" : "3. Last Cultivated Crop"}
                  </label>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {isBn ? "আবর্তনে বাদ যাবে" : "Auto-Excluded"}
                  </span>
                </div>
                <div className="relative mb-2">
                  <select
                    value={lastCultivatedCrop}
                    onChange={(e) => handleLastCropChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-sm font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    <option value="none">
                      {isBn ? "— কোনোটি নয় / নতুন জমি —" : "— None / Fresh Plot —"}
                    </option>
                    {AVAILABLE_CROPS_LIST.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {isBn ? crop.nameBn : crop.nameEn} ({crop.id})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-700 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-amber-900 font-semibold">{isBn ? "সুরক্ষা নিয়ম:" : "Agronomic Rule:"}</strong>{" "}
                    {isBn
                      ? "এই ফসলটি পরবর্তী আবর্তন তালিকায় বাদ থাকবে, যাতে মাটির উর্বরতা পুনরুদ্ধার হয় ও রোগচক্র দূর হয়।"
                      : "This crop is strictly avoided in upcoming suggestions to prevent monoculture disease carryover and soil depletion."}
                  </span>
                </p>
              </div>

              {/* 4. Farmer Preferred Crops */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-0.5">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                  {isBn ? "৪. কৃষকের পছন্দের ফসল" : "4. Farmer Preferred Crops"}
                </label>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  {isBn
                    ? "পছন্দের ফসল নির্বাচন করুন (পূর্ববর্তী ফসল ব্যতীত) এবং অগ্রাধিকার সাজান।"
                    : "Select priority crops (excluding your last harvested crop) and rank them."}
                </p>

                {/* 3x3 Grid of Crop Pills with SVG Icons (no emojis!) */}
                <div className="grid grid-cols-3 gap-1.5">
                  {AVAILABLE_CROPS_LIST.map((crop) => {
                    const isLastCrop = lastCultivatedCrop && lastCultivatedCrop.toLowerCase() === crop.id.toLowerCase();
                    const isSelected = preferredCrops.includes(crop.id);
                    const displayName = isBn ? crop.nameBn : crop.nameEn;

                    if (isLastCrop) {
                      return (
                        <div
                          key={crop.id}
                          className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-amber-200 bg-amber-50/50 px-2 py-1.5 text-xs text-amber-800/80 cursor-not-allowed select-none"
                          title={isBn ? "পূর্ববর্তী ফসল হওয়ায় এটি আবর্তনে বাদ দেওয়া হয়েছে" : "Excluded because this was the previous crop"}
                        >
                          <div className="flex items-center gap-1">
                            {renderCropIcon(crop.iconType, "h-3 w-3 opacity-60")}
                            <span className="line-through text-[11px] font-medium">{displayName}</span>
                          </div>
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100/90 rounded px-1.5 py-0.2">
                            {isBn ? "পূর্ববর্তী ফসল" : "Last Crop"}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => togglePreferredCrop(crop.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-emerald-50/80 text-emerald-900 border-emerald-400 font-bold shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        {renderCropIcon(crop.iconType, "h-3.5 w-3.5")}
                        <span>{displayName}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-emerald-700 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Ranked Order (High to Low) */}
              <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Layers className="h-3.5 w-3.5 text-emerald-600" />
                  {isBn ? "৫. অগ্রাধিকার ক্রম (বেশি থেকে কম)" : "5. Ranked Order (High to Low)"}
                </label>

                <div className="space-y-1.5">
                  {rankedList.map((cropId, idx) => (
                    <div
                      key={cropId}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-6 items-center justify-center rounded-md bg-emerald-100 text-[11px] font-bold text-emerald-800">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {getCropDisplayName(cropId)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePriority(idx, "up")}
                          className="p-1 rounded hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 transition"
                          title="Move priority up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === rankedList.length - 1}
                          onClick={() => movePriority(idx, "down")}
                          className="p-1 rounded hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 transition"
                          title="Move priority down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={analyzeMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0f402b] hover:bg-[#0c3523] py-3 px-4 text-xs font-bold text-white shadow-sm active:scale-[0.99] disabled:opacity-60 transition"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                    <span>{isBn ? "২ বছরের নাসা ডাটা প্রসেস হচ্ছে..." : "Evaluating 2-Year NASA Data..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>{isBn ? "ফসল আবর্তন পরিকল্পনা তৈরি করুন" : "Generate Crop Rotation Plan"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              RIGHT COLUMN: Climate Summary & Results
             ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-5">
            {/* ── Loading State ── */}
            {analyzeMutation.isPending && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-sm">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">
                  {isBn ? "নাসার ৩টি স্যাটেলাইট ডাটাবেস বিশ্লেষণ করা হচ্ছে..." : "Evaluating 2-Year NASA Earth Observations..."}
                </h3>
                <p className="max-w-md text-xs sm:text-sm text-slate-500 mt-1.5">
                  {isBn
                    ? "৭৩১ দিনের তাপমাত্রা, বৃষ্টিপাত এবং মাটির আর্দ্রতার তথ্য সমন্বয় করে সর্বোত্তম ৩টি আবর্তন পরিকল্পনা তৈরি করা হচ্ছে।"
                    : "Analyzing 731 daily records of NASA POWER, IMERG precipitation, and SMAP root-zone soil moisture..."}
                </p>
              </div>
            )}

            {/* ── Initial Empty State: Prompting User to Select Options and Click Generate ── */}
            {!result && !analyzeMutation.isPending && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200/90 bg-white p-10 sm:p-14 text-center shadow-2xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs mb-4">
                  <Compass className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  {isBn ? "ফসল আবর্তন পরিকল্পনা তৈরি করতে প্রস্তুত" : "Ready to Generate Your Crop Rotation Plan"}
                </h3>
                <p className="max-w-lg text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {isBn
                    ? "অনুগ্রহ করে বাম পাশের প্যানেল থেকে আপনার খামারের জেলা, মাটির ধরন এবং পছন্দের ফসলগুলো সাজিয়ে নিন। এরপর ২ বছরের নাসা স্যাটেলাইট ডাটা বিশ্লেষণ ও বৈজ্ঞানিক পর্যায়ক্রম তৈরির জন্য 'ফসল আবর্তন পরিকল্পনা তৈরি করুন' বাটনে ক্লিক করুন।"
                    : "Please review or customize your farm district, soil characteristics, and preferred crops on the left. Then click 'Generate Crop Rotation Plan' to analyze 2-year NASA Earth observations and generate 3 evidence-based rotation plans."}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-700">
                  <span className="flex items-center gap-1.5 rounded-xl bg-amber-50/80 px-3 py-1.5 border border-amber-200/60 font-semibold text-amber-900">
                    <Sun className="h-3.5 w-3.5 text-amber-600" />
                    NASA POWER
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-blue-50/80 px-3 py-1.5 border border-blue-200/60 font-semibold text-blue-900">
                    <Droplets className="h-3.5 w-3.5 text-blue-600" />
                    NASA IMERG
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50/80 px-3 py-1.5 border border-emerald-200/60 font-semibold text-emerald-900">
                    <Layers className="h-3.5 w-3.5 text-emerald-600" />
                    NASA SMAP
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-[#0f402b] hover:bg-[#0c3523] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-[0.99]"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>
                    {isBn ? `${district} জেলার জন্য পরিকল্পনা তৈরি করুন` : `Generate Plan for ${district}`}
                  </span>
                </button>
              </div>
            )}

            {/* ── Results Container: Displayed when result exists (from cache or freshly generated) ── */}
            {result && !analyzeMutation.isPending && (
              <>
                {/* ── Climate & NASA Data Summary Top Card ── */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Satellite className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">
                      {isBn ? "জলবায়ু ও নাসা ডাটা সারসংক্ষেপ" : "Climate & NASA Data Summary"}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{district} ({DISTRICTS_BANGLADESH[district]?.lat}°N, {DISTRICTS_BANGLADESH[district]?.lon}°E)</span>
                      <span>•</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.2 font-semibold text-[11px]">
                        {isBn ? "৭৩১ দিন বিশ্লেষিত" : "731 Days Analysed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Model Confidence Badge */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {isBn ? "মডেল আস্থা" : "Model Confidence"}
                    </span>
                    <span className="text-base font-extrabold text-emerald-700">98%</span>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* 3 NASA Observation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* NASA POWER Card */}
                <div className="rounded-xl border border-amber-200/60 bg-[#fffbf6] p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sun className="h-3.5 w-3.5 text-amber-600" />
                      NASA POWER
                    </span>
                    <span className="rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                      +1.8°C
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {result ? result.environmentalSummary.temperature.average : 26.15}°C <span className="text-xs font-normal text-slate-500">{isBn ? "গড়" : "avg"}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "পরিসীমা" : "Range"}: {result ? result.environmentalSummary.temperature.min : 12.4}°C – {result ? result.environmentalSummary.temperature.max : 36.1}°C
                  </div>
                </div>

                {/* NASA IMERG Card */}
                <div className="rounded-xl border border-blue-200/60 bg-[#f6faff] p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-blue-600" />
                      NASA IMERG
                    </span>
                    <span className="rounded bg-blue-100/80 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                      +28%
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {result ? result.environmentalSummary.rainfall.totalRainfallMm : 3528.60} mm <span className="text-xs font-normal text-slate-500">{isBn ? "মোট" : "total"}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "৩২৪ মিমি/দিন (১২টি শুষ্ক স্পেল)" : "324 mm/day (12 dry spells)"}
                  </div>
                </div>

                {/* NASA SMAP Card */}
                <div className="rounded-xl border border-emerald-200/60 bg-[#f6fbf8] p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-emerald-600" />
                      NASA SMAP
                    </span>
                    <span className="rounded bg-emerald-100/80 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      +16%
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {result ? (result.environmentalSummary.soilMoisture.rootzoneMean ?? 0.42) : 0.42} m³/m³ <span className="text-xs font-normal text-slate-500">{isBn ? "মূল অঞ্চল" : "root-zone"}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {isBn ? "স্ট্যাটাস" : "Status"}: <strong className="text-emerald-800 uppercase font-bold">{isBn ? "সর্বোত্তম আর্দ্রতা" : (result ? result.environmentalSummary.soilMoisture.condition : "OPTIMAL_MOISTURE")}</strong>
                  </div>
                </div>
              </div>

              {/* Field Profile & Previous Crop Rotation Protection Summary */}
              {result && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50/90 border border-slate-200/90 p-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700">{isBn ? "খামারের বৈশিষ্ট্য:" : "Plot Profile:"}</span>
                    <span className="rounded-md bg-white px-2.5 py-1 border border-slate-200 text-slate-700 font-semibold shadow-2xs">
                      {isBn ? "মাটি:" : "Soil:"} {result.farmerInputs.soilType}
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-1 border border-slate-200 text-slate-700 font-semibold shadow-2xs">
                      {isBn ? "নিষ্কাশন:" : "Drainage:"} {result.farmerInputs.drainage}
                    </span>
                  </div>

                  {result.farmerInputs.lastCultivatedCrop ? (
                    <div className="flex items-center gap-2 text-amber-900 bg-amber-50/90 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>
                        <strong className="font-bold">{isBn ? "পূর্ববর্তী চাষ করা ফসল:" : "Last Cultivated Crop:"}</strong>{" "}
                        <span className="underline decoration-amber-400 font-extrabold text-amber-950">
                          {getCropDisplayName(result.farmerInputs.lastCultivatedCrop)}
                        </span>{" "}
                        <span className="text-[11px] text-amber-800 font-medium">
                          ({isBn ? "নতুন আবর্তন থেকে স্বয়ংক্রিয়ভাবে বাদ দেওয়া হয়েছে" : "auto-excluded from suggestions to protect soil"})
                        </span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">
                      {isBn ? "পূর্ববর্তী ফসল: কোনোটি নির্দিষ্ট নেই" : "Previous Crop: None specified"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── Plan Switcher Tabs (Plan A, B, C) ── */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedPlanTab("planA")}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition border-b-2 ${
                    selectedPlanTab === "planA"
                      ? "border-emerald-700 text-emerald-800 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-800 bg-slate-50/50"
                  }`}
                >
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  <span>{isBn ? "পরিকল্পনা ক (কৃষকের পছন্দ)" : "Plan A (Farmer Priority)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanTab("planB")}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition border-b-2 ${
                    selectedPlanTab === "planB"
                      ? "border-teal-700 text-teal-800 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-800 bg-slate-50/50"
                  }`}
                >
                  <Layers className="h-4 w-4 text-teal-600" />
                  <span>{isBn ? "পরিকল্পনা খ (মাটির স্বাস্থ্য)" : "Plan B (Soil Health)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanTab("planC")}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition border-b-2 ${
                    selectedPlanTab === "planC"
                      ? "border-blue-700 text-blue-800 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-800 bg-slate-50/50"
                  }`}
                >
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span>{isBn ? "পরিকল্পনা গ (জলবায়ু/পানি)" : "Plan C (Climate/Water)"}</span>
                </button>
              </div>

              {/* ── Selected Plan Highlights Banner ── */}
              <div className="p-5">
                <div className="rounded-2xl border border-[#d6ebd9] bg-[#f4f9f5] p-5 mb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Leaf className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {isBn ? (activePlan ? activePlan.titleBn : "পরিকল্পনা ক — কৃষকের পছন্দকে অগ্রাধিকার") : (activePlan ? activePlan.titleEn : "Plan A — Farmer Priority Focused")}
                          </h3>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {activePlan ? activePlan.overallSuitabilityScore : 91}% {isBn ? "উপযোগিতা" : "Suitability"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                          {isBn
                            ? "কৃষকের লক্ষ্যভিত্তিক অর্থকরী ফসলকে সর্বোচ্চ গুরুত্ব দিয়ে মাটির রোগচক্র মুক্ত ও অর্থনৈতিক লাভজনক পর্যায় তৈরি করে।"
                            : (activePlan
                            ? activePlan.focusDescription
                            : "Directly honors the farmer's preferred crops and primary economic goals while ensuring agricultural compatibility and preventing severe pathogen carryover.")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectPlan(activePlan)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#0e3f28] hover:bg-[#0b3320] px-4 py-2 text-xs font-bold text-white shadow-xs transition"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span>
                          {isBn
                            ? (confirmedPlan === (activePlan?.planId || "plan_a_farmer_priority")
                              ? "✓ এই পরিকল্পনা বেছে নিন"
                              : "এই পরিকল্পনা বেছে নিন")
                            : (confirmedPlan === (activePlan?.planId || "plan_a_farmer_priority")
                              ? "✓ Select This Plan"
                              : "Select This Plan")}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPlan(activePlan)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-2 text-xs font-bold text-emerald-900 shadow-xs transition"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
                        <span>{isBn ? "কেন এই ফলাফল?" : "Why This Result?"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 KPI Grid Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* WATER STRESS */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isBn ? "পানির চাপ" : "WATER STRESS"}
                        </span>
                        <span className="text-xs font-bold text-orange-700">
                          {isBn ? (activePlan?.metrics.waterStressIndex === "LOW" ? "কম" : "মধ্যম") : (activePlan ? activePlan.metrics.waterStressIndex : "Moderate")}
                        </span>
                      </div>
                    </div>

                    {/* NUTRIENT BALANCE */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Leaf className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isBn ? "মাটির পুষ্টি" : "NUTRIENT BALANCE"}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          {isBn ? (activePlan?.metrics.soilNutrientBalance === "BALANCED" ? "ভারসাম্যপূর্ণ" : "পুনরুৎপাদনশীল") : (activePlan ? activePlan.metrics.soilNutrientBalance.replace("_", " ") : "Balanced")}
                        </span>
                      </div>
                    </div>

                    {/* LEGUME FIXATION */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <RotateCcw className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isBn ? "নাইট্রোজেন সংযোজন" : "LEGUME FIXATION"}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {isBn ? (activePlan?.metrics.legumeInclusion ? "সংযুক্ত" : "নেই") : (activePlan?.metrics.legumeInclusion ? "Included (N-Fix)" : "None")}
                        </span>
                      </div>
                    </div>

                    {/* PREFERENCE MATCH */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isBn ? "পছন্দের মিল" : "PREFERENCE MATCH"}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-800">
                          {activePlan ? activePlan.metrics.farmerPreferenceFulfillmentPct : 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Annual 3-Season Cropping Sequence ── */}
                <div className="mb-2">
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3.5">
                    <Calendar className="h-4 w-4 text-emerald-700" />
                    <span>{isBn ? "বার্ষিক ৩-ফসলী পর্যায়ক্রম ও সময়সূচী" : "Annual 3-Season Cropping Sequence"}</span>
                  </h4>

                  {/* Render 3 Cards for the 3 Seasons */}
                  <div className="space-y-3.5">
                    {activePlan ? (
                      activePlan.schedule.map((item: IScheduledCropItem, idx: number) => {
                        const cropTitle = isBn ? item.cropNameBn : item.cropNameEn;
                        const seasonLabel = isBn
                          ? (item.agriculturalSeason === "Rabi" ? "রবি" : item.agriculturalSeason === "Kharif-I" ? "খরিফ-১" : "খরিফ-২")
                          : item.agriculturalSeason;
                        const growingPeriod = isBn
                          ? (item.agriculturalSeason === "Rabi" ? "ডিসে – মার্চ" : item.agriculturalSeason === "Kharif-I" ? "এপ্রিল – জুলাই" : "জুলাই – নভে")
                          : (item.agriculturalSeason === "Rabi" ? "Dec – Mar" : item.agriculturalSeason === "Kharif-I" ? "Apr – Jul" : "Jul – Nov");

                        return (
                          <div
                            key={item.cropId + idx}
                            className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition"
                          >
                            {/* Sequence Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                              <div className="flex items-center gap-3">
                                {/* Number Circle in dark green */}
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e3f28] text-xs font-extrabold text-white">
                                  {item.sequenceNumber}
                                </div>

                                {/* Crop Icon Graphic */}
                                {renderSequenceCropBadge(item.cropNameEn)}

                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-extrabold text-slate-900">
                                      {cropTitle}
                                    </h5>
                                    {item.isFarmerPreferred && (
                                      <span className="rounded-full bg-[#faecd8] text-[#93540c] px-2.5 py-0.5 text-[10px] font-bold">
                                        {isBn ? "কৃষকের পছন্দ" : "Farmer Preferred"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    {isBn ? "পরিবার" : "Family"}: <strong className="text-slate-700">{item.family}</strong> | {isBn ? "মৌসুম" : "Season"}: <strong className="text-slate-700">{seasonLabel}</strong>
                                  </div>
                                </div>
                              </div>

                              {/* Right Badges: Duration & Score */}
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  <Calendar className="h-3 w-3 text-slate-500" />
                                  {item.growingDurationDays} {isBn ? "দিন" : "Days"}
                                </span>
                                <span className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                  <Leaf className="h-3 w-3 text-emerald-600" />
                                  {item.suitabilityScore}% {isBn ? "স্কোর" : "Score"}
                                </span>
                              </div>
                            </div>

                            {/* 4 Bottom Columns inside Sequence Card */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              {/* 1. Planting Window */}
                              <div className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100 flex items-start gap-2">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isBn ? "রোপণের সময়" : "Planting Window"}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs">{item.plantingWindow}</span>
                                </div>
                              </div>

                              {/* 2. Growing Period */}
                              <div className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100 flex items-start gap-2">
                                <Sprout className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isBn ? "বৃদ্ধিকাল" : "Growing Period"}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs">{growingPeriod}</span>
                                </div>
                              </div>

                              {/* 3. Expected Yield */}
                              <div className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100 flex items-start gap-2">
                                <BarChart3 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isBn ? "প্রত্যাশিত ফলন" : "Expected Yield"}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs">{getExpectedYield(item.cropId)}</span>
                                </div>
                              </div>

                              {/* 4. Disease Break */}
                              <div className="rounded-xl bg-slate-50/70 p-2.5 border border-slate-100 flex items-start gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isBn ? "রোগচক্র বিরতি" : "Disease Break"}
                                  </span>
                                  <span className="font-bold text-emerald-800 text-xs">{isBn ? "উচ্চ" : "High"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        {isBn ? "পরিকল্পনা লোড হচ্ছে..." : "Loading sequence..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map Section */}
                <div className="mt-8">
                  <LocationMapSection
                    latitude={result.location?.latitude ?? DISTRICTS_BANGLADESH[district]?.lat ?? 24.75}
                    longitude={result.location?.longitude ?? DISTRICTS_BANGLADESH[district]?.lon ?? 90.4}
                    locationName={isBn ? `${result.location?.district || district || "খামার"}, বাংলাদেশ` : `${result.location?.district || district || "Farm"}, Bangladesh`}
                    zoom={10}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
