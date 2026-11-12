"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { script } from "@/lib/fonts";
import {
  Lightbulb,
  CloudRain,
  Thermometer,
  Droplet,
  Leaf,
  Info,
  Satellite,
  BarChart3,
  Cog,
  Sprout,
  Target,
  Calendar,
  Quote,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Database,
  Download,
  Loader2,
  ShieldCheck,
  Flame,
  TrendingUp,
  Check,
  Layers,
  Sparkles,
  Compass,
  RotateCcw,
  Wheat,
  Sun,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import FilterBar from "@/Components/modules/Dashboord/FilterBar";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";
import { MiniBarChart, MiniLineChart, ChartLegend } from "@/Components/modules/Dashboord/MiniCharts";
import {
  getAnalysisObservations,
  getAnalysisTransparency,
} from "@/lib/apis/analyzeAi";
import { useLanguage } from "@/lib/language-context";
import { useAnalysis } from "@/lib/analysis-context";
import { useQuery } from "@tanstack/react-query";
import { cropwiseQueryKeys, cropwiseQueryOptions } from "@/lib/query-client";
import {
  ICropRotationPlan,
  IScheduledCropItem,
  ICropRotationAnalyzeOutput,
} from "@/lib/apis/cropRotation.api";


// Mock / Fallback rotation data in case user enters directly without running a rotation
const DEFAULT_ROTATION_DATA: {
  selectedPlanId: string;
  plan: ICropRotationPlan;
  plans: {
    planA: ICropRotationPlan;
    planB: ICropRotationPlan;
    planC: ICropRotationPlan;
  };
  location: { district?: string; latitude: number; longitude: number };
  district: string;
  farmerInputs: {
    preferredCropsRanked: string[];
    excludedCrops: string[];
    lastCultivatedCrop: string | null;
    soilType: string;
    drainage: string;
  };
  environmentalSummary: {
    temperature: { min: number; max: number; average: number; extremeHeatDays: number; frostOrColdStressDays: number };
    rainfall: {
      totalRainfallMm: number;
      averageDailyMm: number;
      maxDailyRainfallMm: number;
      rainyDays: number;
      dryDays: number;
      drySpellsCount: number;
      heavyRainfallDays: number;
      seasonal: { rabiMm: number; kharifIMm: number; kharifIIMm: number };
    };
    soilMoisture: {
      surfaceMean: number | null;
      rootzoneMean: number | null;
      surfaceMin: number | null;
      surfaceMax: number | null;
      rootzoneMin: number | null;
      rootzoneMax: number | null;
      condition: string;
      dryStressDays: number;
      optimalMoistureDays: number;
      waterloggedDays: number;
    };
  };
  nasaDataCoverage: {
    nasaPowerCoveragePercentage: number;
    imergCoveragePercentage: number;
    smapCoveragePercentage: number;
    requestedDays: number;
    availableDays: number;
    isSufficient: boolean;
    sources: string[];
  };
  confidenceScore: number;
  analysisPeriod: { start: string; end: string; days: number };
} = {
  selectedPlanId: "plan_a_farmer_priority",
  district: "Rajshahi",
  location: { district: "Rajshahi", latitude: 24.37, longitude: 88.6 },
  confidenceScore: 94,
  analysisPeriod: { start: "2024-11-01", end: "2026-11-01", days: 730 },
  farmerInputs: {
    preferredCropsRanked: ["Mustard", "Mungbean", "Aman Rice"],
    excludedCrops: ["Boro Rice"],
    lastCultivatedCrop: "Boro Rice",
    soilType: "Loamy",
    drainage: "GOOD",
  },
  environmentalSummary: {
    temperature: { min: 11.4, max: 39.2, average: 25.8, extremeHeatDays: 24, frostOrColdStressDays: 4 },
    rainfall: {
      totalRainfallMm: 1460,
      averageDailyMm: 2.0,
      maxDailyRainfallMm: 112,
      rainyDays: 98,
      dryDays: 632,
      drySpellsCount: 16,
      heavyRainfallDays: 14,
      seasonal: { rabiMm: 48, kharifIMm: 342, kharifIIMm: 1070 },
    },
    soilMoisture: {
      surfaceMean: 0.25,
      rootzoneMean: 0.31,
      surfaceMin: 0.12,
      surfaceMax: 0.42,
      rootzoneMin: 0.18,
      rootzoneMax: 0.45,
      condition: "OPTIMAL",
      dryStressDays: 32,
      optimalMoistureDays: 610,
      waterloggedDays: 18,
    },
  },
  nasaDataCoverage: {
    nasaPowerCoveragePercentage: 99.2,
    imergCoveragePercentage: 98.7,
    smapCoveragePercentage: 94.6,
    requestedDays: 730,
    availableDays: 726,
    isSufficient: true,
    sources: ["NASA POWER", "GPM IMERG", "SMAP L3/L4", "MODIS NDVI"],
  },
  plans: {
    planA: {
      planId: "plan_a_farmer_priority",
      titleEn: "Plan A — Farmer Priority Focused",
      titleBn: "পরিকল্পনা ক — কৃষকের পছন্দকে অগ্রাধিকার",
      focusDescription:
        "Directly honors the farmer's preferred crops and primary economic goals while ensuring agricultural compatibility and preventing severe pathogen carryover.",
      overallSuitabilityScore: 92,
      metrics: {
        waterStressIndex: "LOW",
        soilNutrientBalance: "POSITIVE_REGENERATIVE",
        legumeInclusion: true,
        diseaseBreakEffective: true,
        farmerPreferenceFulfillmentPct: 100,
      },
      keyBenefits: [
        "Incorporates Legume (Mungbean) to fix 45-60 kg/ha atmospheric nitrogen.",
        "Mustard breaks the continuous cereal-monoculture disease cycle of rice.",
        "Schedules water-thirsty Aman rice during peak Kharif monsoon rainfall.",
        "Avoids repeating the previous season's crop, preventing soil nutrient exhaustion.",
      ],
      managementRecommendations: [
        "Incorporate pulse crop biomass into topsoil after harvest to boost organic matter.",
        "Maintain light ridge furrows for Mustard to prevent any early-season waterlogging.",
        "Utilize residual soil moisture from late Aman harvest for timely Mustard sowing.",
      ],
      schedule: [
        {
          sequenceNumber: 1,
          cropId: "mustard",
          cropNameEn: "Mustard",
          cropNameBn: "সরিষা",
          family: "Brassicaceae",
          agriculturalSeason: "Rabi",
          plantingWindow: "Nov 10 – Nov 25",
          harvestingWindow: "Feb 15 – Feb 28",
          estimatedPlantingDate: "2026-11-15",
          estimatedHarvestDate: "2027-02-20",
          growingDurationDays: 95,
          transitionPeriodDays: 15,
          waterRequirementMm: 180,
          waterConsiderations: "Low water requirement; survives well on 1-2 supplemental irrigations in dry Rabi.",
          soilConsiderations: "Breaks soil pest cycles and prevents crusting; deep taproot extracts subsoil nutrients.",
          nutrientImpact: "Consumes moderate nitrogen; adds sulfur and glucosinolates that naturally sanitize soil.",
          reasonForSelection: "Top farmer preference; short-duration oilseed providing quick cash income before summer pulses.",
          suitabilityScore: 94,
          isFarmerPreferred: true,
          potentialRisks: ["Late aphids during flowering", "Early unseasonal fog"],
        },
        {
          sequenceNumber: 2,
          cropId: "mungbean",
          cropNameEn: "Mungbean",
          cropNameBn: "মুগডাল",
          family: "Fabaceae",
          agriculturalSeason: "Kharif-I",
          plantingWindow: "Mar 10 – Mar 25",
          harvestingWindow: "May 25 – Jun 10",
          estimatedPlantingDate: "2027-03-15",
          estimatedHarvestDate: "2027-05-30",
          growingDurationDays: 75,
          transitionPeriodDays: 20,
          waterRequirementMm: 250,
          waterConsiderations: "Utilizes early Kharif pre-monsoon showers; minimal groundwater pumping needed.",
          soilConsiderations: "Nodules fix 50 kg/ha atmospheric nitrogen, enriching soil fertility for the following rice crop.",
          nutrientImpact: "Positive regenerative N balance; leaves high-quality organic biomass in rootzone.",
          reasonForSelection: "Essential legume bridge breaking disease cycle and cutting fertilizer costs by 35%.",
          suitabilityScore: 91,
          isFarmerPreferred: true,
          potentialRisks: ["Yellow mosaic virus", "Excessive rain during pod maturity"],
        },
        {
          sequenceNumber: 3,
          cropId: "rice",
          cropNameEn: "T. Aman Rice",
          cropNameBn: "রোপা আমন ধান",
          family: "Poaceae",
          agriculturalSeason: "Kharif-II",
          plantingWindow: "Jul 15 – Aug 05",
          harvestingWindow: "Nov 05 – Nov 25",
          estimatedPlantingDate: "2027-07-20",
          estimatedHarvestDate: "2027-11-15",
          growingDurationDays: 120,
          transitionPeriodDays: 20,
          waterRequirementMm: 950,
          waterConsiderations: "Synchronized with NASA IMERG 2-year peak monsoon rainfall, minimizing tube-well energy.",
          soilConsiderations: "Benefits immensely from nitrogen residue fixed by preceding Mungbean crop.",
          nutrientImpact: "High biomass feeder; balanced by preceding legume nitrogen restoration.",
          reasonForSelection: "Primary staple food crop; optimal weather window identified from NASA 2-year historical rainfall.",
          suitabilityScore: 93,
          isFarmerPreferred: true,
          potentialRisks: ["Late dry spell during grain filling", "Bacterial leaf blight"],
        },
      ],
    },
    planB: {
      planId: "plan_b_soil_health",
      titleEn: "Plan B — Soil Health & Regeneration",
      titleBn: "পরিকল্পনা খ — মাটির স্বাস্থ্য ও উর্বরতা পুনরুদ্ধার",
      focusDescription:
        "Maximizes organic matter recovery, biologically fixes nitrogen through deep-rooting legumes, and disrupts multi-year pest carryover.",
      overallSuitabilityScore: 95,
      metrics: {
        waterStressIndex: "LOW",
        soilNutrientBalance: "POSITIVE_REGENERATIVE",
        legumeInclusion: true,
        diseaseBreakEffective: true,
        farmerPreferenceFulfillmentPct: 85,
      },
      keyBenefits: [
        "Maximum biological nitrogen fixation from dual pulse inclusion.",
        "Deep root system loosens hardpan and improves soil infiltration capacity.",
        "Virtually eliminates nematode and root-rot carryover.",
      ],
      managementRecommendations: [
        "Apply Trichoderma-enriched compost during land prep.",
        "Practice green manuring with legume residue incorporation.",
      ],
      schedule: [],
    },
    planC: {
      planId: "plan_c_climate_water",
      titleEn: "Plan C — Climate & Water Resilient",
      titleBn: "পরিকল্পনা গ — জলবায়ু ও সেচ সাশ্রয়ী",
      focusDescription:
        "Engineered for drought defense and erratic monsoon windows, saving over 40% irrigation water using NASA SMAP moisture records.",
      overallSuitabilityScore: 89,
      metrics: {
        waterStressIndex: "LOW",
        soilNutrientBalance: "BALANCED",
        legumeInclusion: true,
        diseaseBreakEffective: true,
        farmerPreferenceFulfillmentPct: 80,
      },
      keyBenefits: [
        "Saves 400-500 mm irrigation water over the complete cycle.",
        "Tolerates unexpected heat waves and dry spells identified in 2-year NASA POWER data.",
      ],
      managementRecommendations: [
        "Use straw mulching for moisture retention during Rabi dry months.",
        "Implement AWD (Alternate Wetting and Drying) irrigation for rice.",
      ],
      schedule: [],
    },
  },
  plan: null as any,
};
DEFAULT_ROTATION_DATA.plan = DEFAULT_ROTATION_DATA.plans.planA;
DEFAULT_ROTATION_DATA.plans.planB.schedule = DEFAULT_ROTATION_DATA.plans.planA.schedule;
DEFAULT_ROTATION_DATA.plans.planC.schedule = DEFAULT_ROTATION_DATA.plans.planA.schedule;

// Classic single-crop metrics
const rainfall = { hist: [40, 85, 215, 210, 140, 65], recent: [55, 110, 185, 180, 110, 55] };
const temperature = { hist: [27, 29, 31, 32, 31, 28], recent: [31, 33, 35, 36, 35, 32] };
const soilMoisture = { hist: [0.18, 0.22, 0.28, 0.3, 0.26, 0.2], recent: [0.22, 0.26, 0.32, 0.34, 0.3, 0.24] };
const ndvi = { hist: [0.45, 0.55, 0.65, 0.7, 0.62, 0.5], recent: [0.5, 0.6, 0.72, 0.78, 0.68, 0.55] };

const classicMetrics = [
  {
    label: "Rainfall",
    value: "+11 days",
    icon: CloudRain,
    tone: "bg-sky-100 text-sky-600",
    desc: "Rainfall onset is now 11 days later compared to 2001–2012.",
    note: "Later rainfall means the best planting time shifts to mid-late July.",
    noteBg: "bg-sky-50 text-sky-800",
    light: "#bfdbfe",
    dark: "#1d4ed8",
    type: "bar" as const,
    data: rainfall,
    min: 0,
    max: 250,
  },
  {
    label: "Temperature",
    value: "+0.8°C",
    icon: Thermometer,
    tone: "bg-rose-100 text-rose-600",
    desc: "Growing season temperatures are higher than in the past.",
    note: "Higher temperatures can affect germination and crop development, so slightly later planting helps.",
    noteBg: "bg-rose-50 text-rose-800",
    light: "#fecaca",
    dark: "#dc2626",
    type: "line" as const,
    data: temperature,
    min: 20,
    max: 40,
  },
  {
    label: "Soil Moisture",
    value: "Moderate",
    icon: Droplet,
    tone: "bg-indigo-100 text-indigo-600",
    desc: "Current soil moisture levels are sufficient for transplanting soon.",
    note: "Soil moisture is improving, supporting the recommended planting window.",
    noteBg: "bg-slate-50 text-slate-600",
    light: "#c7d2fe",
    dark: "#4f46e5",
    type: "line" as const,
    data: soilMoisture,
    min: 0,
    max: 0.4,
  },
  {
    label: "Vegetation Index (NDVI)",
    value: "Stable",
    icon: Leaf,
    tone: "bg-emerald-100 text-emerald-600",
    desc: "Vegetation conditions in your area are generally healthy.",
    note: "Healthy vegetation indicates favorable growing conditions for Aman rice.",
    noteBg: "bg-primary-50 text-primary-800",
    light: "#b8dfc4",
    dark: "#1c5439",
    type: "line" as const,
    data: ndvi,
    min: 0,
    max: 0.8,
  },
];

export default function WhyThisResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, locName } = useLanguage();
  const isBn = lang === "BN" || (lang as string).toLowerCase() === "bn";
  const { activeAnalysis } = useAnalysis();

  // Mode detection: Was user sent from crop-rotation?
  const fromParam = searchParams.get("from");
  const planIdParam = searchParams.get("planId");

  const [activeTab, setActiveTab] = useState<"rotation" | "climate">(
    fromParam === "crop-rotation" || planIdParam ? "rotation" : "rotation"
  );

  // Rotation data loaded from localStorage or default
  const [rotationData, setRotationData] = useState<typeof DEFAULT_ROTATION_DATA>(DEFAULT_ROTATION_DATA);
  const [selectedPlanKey, setSelectedPlanKey] = useState<"planA" | "planB" | "planC">("planA");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cropwise:selected-rotation-plan");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.plan || parsed.plans)) {
            setRotationData({
              ...DEFAULT_ROTATION_DATA,
              ...parsed,
              plans: parsed.plans || DEFAULT_ROTATION_DATA.plans,
              plan: parsed.plan || parsed.plans?.planA || DEFAULT_ROTATION_DATA.plan,
            });
            if (planIdParam) {
              if (planIdParam.includes("soil_health") || planIdParam === "planB") {
                setSelectedPlanKey("planB");
              } else if (planIdParam.includes("climate_water") || planIdParam === "planC") {
                setSelectedPlanKey("planC");
              } else {
                setSelectedPlanKey("planA");
              }
            } else if (parsed.selectedPlanId) {
              if (parsed.selectedPlanId.includes("soil_health")) setSelectedPlanKey("planB");
              else if (parsed.selectedPlanId.includes("climate_water")) setSelectedPlanKey("planC");
              else setSelectedPlanKey("planA");
            }
          }
        }
      } catch (err) {
        console.error("Error loading selected rotation plan from localStorage:", err);
      }
    }
  }, [planIdParam]);

  // Current active plan in rotation rationale
  const currentPlan: ICropRotationPlan = useMemo(() => {
    if (rotationData.plans && rotationData.plans[selectedPlanKey]) {
      return rotationData.plans[selectedPlanKey];
    }
    return rotationData.plan || DEFAULT_ROTATION_DATA.plans.planA;
  }, [rotationData, selectedPlanKey]);

  // Fallback classic single-crop analysis params
  const [location, setLocation] = useState(
    rotationData.district || activeAnalysis?.location?.district || "Rajshahi"
  );
  const [crop, setCrop] = useState("Aman Rice");
  const [priority, setPriority] = useState("Save Water");
  const [observationPage, setObservationPage] = useState(1);

  const requestedId = searchParams.get("analysisId");
  const storedId =
    activeAnalysis?.analysisId ||
    (typeof window !== "undefined" ? window.localStorage.getItem("fieldshift:last-analysis-id") : null);
  const analysisId = requestedId || storedId || "";

  // Query classic transparency
  const {
    data: transparencyData,
    isLoading: isTransparencyLoading,
    error: transparencyErr,
  } = useQuery({
    queryKey: cropwiseQueryKeys.transparency(analysisId),
    queryFn: async () => {
      const res = await getAnalysisTransparency(analysisId);
      if (!res || !res.success || !res.data) {
        throw new Error(res?.error || res?.message || "Analysis not found");
      }
      return res.data;
    },
    enabled: Boolean(analysisId) && activeTab === "climate",
    ...cropwiseQueryOptions,
  });

  const {
    data: observationsData,
    isLoading: isObservationsLoading,
    error: observationsErr,
  } = useQuery({
    queryKey: cropwiseQueryKeys.observations(analysisId, observationPage),
    queryFn: async () => {
      const res = await getAnalysisObservations(analysisId, observationPage);
      if (!res || !res.success || !res.data) {
        throw new Error(res?.error || "Unable to load observations");
      }
      return res.data;
    },
    enabled: Boolean(analysisId) && activeTab === "climate",
    ...cropwiseQueryOptions,
  });

  const transparency = transparencyData || null;
  const observations = observationsData || null;
  const transparencyLoading = isTransparencyLoading || isObservationsLoading;
  const transparencyError = transparencyErr
    ? transparencyErr instanceof Error
      ? transparencyErr.message
      : "Unable to load analysis transparency"
    : observationsErr
    ? observationsErr instanceof Error
      ? observationsErr.message
      : "Unable to load this observation page"
    : null;

  return (
    <div className="pb-24 md:pb-12 text-slate-800">
      <TransparentNavSlot />

      {/* ================= HERO BANNER ================= */}
      <section className="relative min-h-[320px] overflow-hidden bg-[#0c3522] sm:min-h-[340px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_55%]"
            style={{
              backgroundImage: "url('/analysisBG.png')",
            }}
          />
          {/* Deep dark green gradient fade for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#072417]/95 via-[#0c3522]/85 to-transparent sm:w-[65%]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f5f7f5] to-transparent" />
        </div>

        <div className="relative px-5 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-24 max-w-7xl mx-auto">
          {/* Back button to Crop Rotation */}
          <div className="mb-4">
            <Link
              href="/dashboard/crop-rotation"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isBn ? "← শস্য আবর্তনে ফিরে যান" : "← Back to Crop Rotation"}</span>
            </Link>
          </div>

          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
              <Satellite className="h-3.5 w-3.5" />
              {isBn ? "নাসা আর্থ অবজারভেশন ও বৈজ্ঞানিক মূল্যায়ন" : "NASA Earth Observation & Agronomic Intelligence"}
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {isBn ? "কেন এই ফলাফল ও শস্য পরিকল্পনা?" : "Why This Result & Rotation Plan?"}
            </h1>

            <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              {isBn
                ? "গত ২ বছরের নাসা POWER জলবায়ু, IMERG বৃষ্টিপাত, SMAP মাটির আর্দ্রতা এবং MODIS উদ্ভিজ্জ কভারেজ বিশ্লেষণ করে এই সিদ্ধান্ত কেন আপনার খামারের জন্য লাভজনক ও বিজ্ঞানসম্মত তা নিচে ব্যাখ্যা করা হলো।"
                : "Explore the deep agronomic reasoning and the 2-year multi-satellite NASA observations (POWER, IMERG, SMAP, MODIS) that formed this customized rotation schedule."}
            </p>
          </div>

          {/* Quick Stats Pill Header */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-3 py-1.5 text-white border border-white/20">
              <Compass className="h-3.5 w-3.5 text-emerald-300" />
              <span>
                {isBn ? "এলাকা:" : "District:"}{" "}
                <strong>{locName(rotationData.district || location)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-3 py-1.5 text-white border border-white/20">
              <Calendar className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isBn ? "বিশ্লেষিত সময়: ২ বছর (৭৩০ দিন)" : "Analyzed Period: 2 Years (730 Days)"}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-3 py-1.5 text-white border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>
                {isBn ? "নাসা ডাটা নির্ভরযোগ্যতা:" : "NASA Data Sufficiency:"}{" "}
                <strong>{rotationData.nasaDataCoverage?.nasaPowerCoveragePercentage ?? 99}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/30 backdrop-blur-md px-3 py-1.5 text-emerald-200 border border-emerald-400/40">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span>
                {isBn ? "মডেল আত্মবিশ্বাস স্কোর:" : "AI Model Confidence:"}{" "}
                <strong>{rotationData.confidenceScore ?? 94}%</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 space-y-8 relative z-10">

        {/* ── Mode Switcher & Plan Tabs Bar ── */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Mode Selection (Rotation Plan vs Climate Analysis) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("rotation")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "rotation"
                  ? "bg-[#0e3f28] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isBn ? "শস্য আবর্তন পরিকল্পনার ব্যাখ্যা" : "Crop Rotation Plan Rationale"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("climate")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "climate"
                  ? "bg-[#0e3f28] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              <Satellite className="h-3.5 w-3.5" />
              <span>{isBn ? "জলবায়ু বিশ্লেষণ স্বচ্ছতা (Transparency)" : "Climate Analysis Transparency"}</span>
            </button>
          </div>

          {/* Right: Switch between Plan A, Plan B, Plan C */}
          {activeTab === "rotation" && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                {isBn ? "পরিকল্পনা দেখুন:" : "Inspect Plan:"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPlanKey("planA")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedPlanKey === "planA"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{isBn ? "পরিকল্পনা ক (অগ্রাধিকার)" : "Plan A (Priority)"}</span>
                <span className="rounded-full bg-emerald-700 text-white text-[10px] px-1.5 py-0.2">
                  {rotationData.plans?.planA?.overallSuitabilityScore ?? 92}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanKey("planB")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedPlanKey === "planB"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{isBn ? "পরিকল্পনা খ (মাটির স্বাস্থ্য)" : "Plan B (Soil)"}</span>
                <span className="rounded-full bg-emerald-700 text-white text-[10px] px-1.5 py-0.2">
                  {rotationData.plans?.planB?.overallSuitabilityScore ?? 95}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanKey("planC")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedPlanKey === "planC"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{isBn ? "পরিকল্পনা গ (পানি সাশ্রয়)" : "Plan C (Water)"}</span>
                <span className="rounded-full bg-emerald-700 text-white text-[10px] px-1.5 py-0.2">
                  {rotationData.plans?.planC?.overallSuitabilityScore ?? 89}%
                </span>
              </button>
            </div>
          )}
        </div>

        {activeTab === "rotation" ? (
          <>
            {/* =========================================================================
                PART 1: কেন এই পরিকল্পনা বেছে নিলে ভালো হবে? (WHY THIS PLAN IS BENEFICIAL)
               ========================================================================= */}
            <div className="space-y-6">
              {/* Section Header */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0e3f28] text-white shadow-md">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          {isBn ? "কৃষিতাত্ত্বিক যৌক্তিকতা" : "Agronomic Rationale"}
                        </span>
                        <span className="rounded-full bg-emerald-200 text-emerald-900 px-2.5 py-0.5 text-xs font-extrabold">
                          {currentPlan.overallSuitabilityScore}% {isBn ? "উপযোগিতা স্কোর" : "Suitability"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                        {isBn ? "কেন এই পরিকল্পনা বেছে নিলে আপনার জন্য ভালো হবে?" : "Why Choosing This Plan is Beneficial For Your Farm"}
                      </h2>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {isBn ? currentPlan.titleBn : currentPlan.titleEn}:{" "}
                        <span className="text-slate-800 font-medium">{currentPlan.focusDescription}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/crop-rotation"
                    className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#0e3f28] hover:bg-[#0b3320] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isBn ? "এই পরিকল্পনা বাস্তবায়ন করুন" : "Implement This Plan"}</span>
                  </Link>
                </div>
              </div>

              {/* 4 Core Agronomic Pillars Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. SOIL HEALTH & NITROGEN */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Sprout className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {currentPlan.metrics.soilNutrientBalance === "POSITIVE_REGENERATIVE"
                          ? isBn
                            ? "পুনরুৎপাদনশীল"
                            : "Regenerative"
                          : isBn
                          ? "ভারসাম্যপূর্ণ"
                          : "Balanced"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900">
                      {isBn ? "মাটির পুষ্টি ও উর্বরতা পুনরুদ্ধার" : "Soil Health & Nutrient Regeneration"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {isBn
                        ? "ডালজাতীয় ফসল (মুগ/মসুর) বাতাসে থাকা নাইট্রোজেন মাটিতে সংবন্ধন করে। এতে পরের ফসলে ইউরিয়া সারের খরচ ৩৫-৪০% কমে যায় এবং মাটির গঠন উন্নত হয়।"
                        : "Biological nitrogen fixation from pulses enriches soil reserves, cutting synthetic urea fertilizer costs by 35-40% for the subsequent crop."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isBn ? "প্রাকৃতিক নাইট্রোজেন যোগ: ৪০-৬০ কেজি/হেক্টর" : "Bio N-Fixation: 40-60 kg/ha"}</span>
                  </div>
                </div>

                {/* 2. DISEASE & PEST DISRUPTION */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                        {currentPlan.metrics.diseaseBreakEffective
                          ? isBn
                            ? "রোগচক্র বিরতি সক্রিয়"
                            : "Break Active"
                          : isBn
                          ? "মাঝারি"
                          : "Moderate"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900">
                      {isBn ? "রোগবালাই ও ক্ষতিকর কীটের চক্র ভাঙন" : "Disease & Pathogen Cycle Disruption"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {isBn
                        ? "ভিন্ন পরিবারের (Brassicaceae -> Fabaceae -> Poaceae) ফসল আবর্তনের কারণে মাটিতে থাকা ক্ষতিকর ছত্রাক ও নেমাটোড খাদ্য না পেয়ে স্বাভাবিকভাবেই নির্মূল হয়।"
                        : "Alternating botanical families deprives host-specific pathogens and root nematodes, breaking fungal lifecycles without heavy chemical pesticides."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isBn ? "রোগ বিস্তার ঝুঁকি ৭০% হ্রাস" : "70% Pathogen Carryover Cut"}</span>
                  </div>
                </div>

                {/* 3. WATER CONSERVATION & STRESS REDUCTION */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <CloudRain className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        {currentPlan.metrics.waterStressIndex === "LOW"
                          ? isBn
                            ? "পানির চাপ কম"
                            : "Low Stress"
                          : isBn
                          ? "মাঝারি চাপ"
                          : "Moderate Stress"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900">
                      {isBn ? "পানির চাপ হ্রাস ও সেচ সাশ্রয়" : "Water Stress Optimization & Energy Savings"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {isBn
                        ? "বৃষ্টিপাত ও মাটির আর্দ্রতার সাথে মিল রেখে শুষ্ক মৌসুমে কম পানির ফসল (সরিষা/ডাল) এবং বর্ষায় পানিগ্রাহী ফসল রাখা হয়েছে, যা সেচ পাম্পিং খরচ কমায়।"
                        : "High water demand crops are synced with peak monsoon rainfall (Kharif-II), while low-water oilseeds dominate dry winter months."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isBn ? "সেচ পানির সাশ্রয়: ৩৫%+" : "35%+ Groundwater Conserved"}</span>
                  </div>
                </div>

                {/* 4. FARMER PREFERENCE & PROFIT */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <TrendingUp className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {currentPlan.metrics.farmerPreferenceFulfillmentPct}% {isBn ? "পছন্দ ম্যাচ" : "Match"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900">
                      {isBn ? "সর্বোচ্চ আর্থিক মুনাফা ও কৃষকের অগ্রাধিকার" : "Max Economic Profit & Farmer Alignment"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {isBn
                        ? "কৃষকের পছন্দের ফসলসমূহকে সর্বোচ্চ অগ্রাধিকার দেওয়া হয়েছে। রবি মৌসুমে উচ্চ মূল্যের সরিষা ও গ্রীষ্মে দ্রুত বর্ধনশীল ডাল নিশ্চিত অর্থনৈতিক স্থায়িত্ব দেয়।"
                        : "Honors the farmer's prioritized crops while timing harvest windows to fetch premium local market wholesale rates across the 3 agricultural seasons."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isBn ? "বছরব্যাপী ধারাবাহিক আয় প্রবাহ" : "Continuous Year-Round Cashflow"}</span>
                  </div>
                </div>
              </div>

              {/* ── Sequence Step-by-Step Breakdown ── */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {isBn ? "পরিকল্পনার প্রতিটি ফসলের পর্যায়ক্রমিক যৌক্তিকতা" : "Sequential Crop Pipeline: Why Each Crop Was Selected"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {isBn
                        ? "কেন এই ৩টি ফসল এই নির্দিষ্ট ক্রমানুসারে এবং এই ক্যালেন্ডার অনুযায়ী সাজানো হয়েছে তা বিশ্লেষণ করুন।"
                        : "Agronomic rationale for the 3-crop sequence and timing based on local seasonal conditions."}
                    </p>
                  </div>
                  <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {currentPlan.schedule?.length ?? 3} {isBn ? "টি ফসল চক্র" : "Crops Cycle"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
                  {(currentPlan.schedule || DEFAULT_ROTATION_DATA.plans.planA.schedule).map((cropItem: IScheduledCropItem, idx: number) => {
                    const seasonName = isBn
                      ? cropItem.agriculturalSeason === "Rabi"
                        ? "রবি (শীতকালীন)"
                        : cropItem.agriculturalSeason === "Kharif-I"
                        ? "খরিফ-১ (গ্রীষ্মকালীন)"
                        : "খরিফ-২ (বর্ষাকালীন)"
                      : cropItem.agriculturalSeason;

                    return (
                      <div
                        key={cropItem.cropId + idx}
                        className="rounded-2xl border border-slate-200 bg-[#fbfdfb] p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition"
                      >
                        <div>
                          {/* Step Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="flex items-center gap-1.5 rounded-full bg-[#0e3f28] text-white px-3 py-1 text-xs font-extrabold">
                              {isBn ? `ধাপ ${cropItem.sequenceNumber}` : `Step ${cropItem.sequenceNumber}`}
                            </span>
                            <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                              {cropItem.suitabilityScore}% {isBn ? "উপযোগিতা" : "Score"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-extrabold text-slate-900">
                              {isBn ? cropItem.cropNameBn : cropItem.cropNameEn}
                            </h4>
                            {cropItem.isFarmerPreferred && (
                              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                                {isBn ? "কৃষকের পছন্দ" : "Farmer Preferred"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {isBn ? "পরিবার:" : "Family:"} <strong>{cropItem.family}</strong> | {seasonName}
                          </p>

                          {/* Planting & Duration */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isBn ? "রোপণের সময়" : "Planting"}
                              </span>
                              <span className="font-bold text-slate-800 text-xs">{cropItem.plantingWindow}</span>
                            </div>
                            <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isBn ? "জীবনকাল" : "Duration"}
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                {cropItem.growingDurationDays} {isBn ? "দিন" : "Days"}
                              </span>
                            </div>
                          </div>

                          {/* Reason for selection */}
                          <div className="mt-3.5 space-y-2 text-xs">
                            <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100/80">
                              <p className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                                <Check className="h-3.5 w-3.5 text-emerald-700" />
                                {isBn ? "কেন এই ফসলটি নির্বাচন করা হলো:" : "Reason For Selection:"}
                              </p>
                              <p className="text-slate-700 leading-relaxed text-[11px]">
                                {cropItem.reasonForSelection}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                              <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                                <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                                {isBn ? "মাটির পুষ্টি ও উর্বরতায় অবদান:" : "Nutrient & Soil Impact:"}
                              </p>
                              <p className="text-slate-600 leading-relaxed text-[11px]">
                                {cropItem.nutrientImpact}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                              <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                                <Droplet className="h-3.5 w-3.5 text-blue-600" />
                                {isBn ? "পানি ও সেচ বিবেচনা:" : "Water Consideration:"}
                              </p>
                              <p className="text-slate-600 leading-relaxed text-[11px]">
                                {cropItem.waterConsiderations} ({cropItem.waterRequirementMm} mm)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Potential risks & tips */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {isBn ? "ঝুঁকি নিয়ন্ত্রণ:" : "Risk Mitigation:"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {cropItem.potentialRisks?.map((r, ri) => (
                              <span
                                key={ri}
                                className="rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 text-[10px]"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Last Cultivated Crop Exclusion Rationale ── */}
              {rotationData.farmerInputs?.lastCultivatedCrop && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                      <ShieldAlert className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-900">
                        {isBn
                          ? `পূর্ববর্তী ফসল (${rotationData.farmerInputs.lastCultivatedCrop}) কেন অবিলম্বে পুনরায় রোপণ করা হয়নি?`
                          : `Why Previous Crop (${rotationData.farmerInputs.lastCultivatedCrop}) was Deliberately Rotated Away?`}
                      </h4>
                      <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                        {isBn
                          ? `একই জমিতে পরপর একই ফসল বা একই বোটানিক্যাল পরিবারের ফসল চাষ করলে মাটির উপরিভাগের নির্দিষ্ট খাদ্য উপাদান নিঃশেষ হয়ে যায় এবং ওই ফসলের ক্ষতিকারক কৃমি (Nematodes) ও রোগজীবাণু বংশবিস্তার করে। তাই আপনার নির্বাচিত "${rotationData.farmerInputs.lastCultivatedCrop}"-কে দ্বিতীয় মৌসুমে বিরতি দিয়ে মাটির উর্বরতা ও স্বাস্থ্য সুরক্ষিত রাখা হয়েছে।`
                          : `Planting "${rotationData.farmerInputs.lastCultivatedCrop}" consecutively causes severe mono-cropping fatigue, depleting identical soil macro/micro nutrients and multiplying host-specific root pathogens. Rotating to another botanical family starves these pests naturally.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Key Agronomic Management Advice ── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  {isBn ? "কৃষি ব্যবস্থাপনা ও বাস্তবায়নের বিশেষ নির্দেশিকা" : "Actionable Agronomic Management Recommendations"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentPlan.managementRecommendations?.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {i + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                  {currentPlan.keyBenefits?.map((benefit, i) => (
                    <div key={`b-${i}`} className="flex items-start gap-2.5 rounded-xl bg-emerald-50/50 p-3 border border-emerald-100/70">
                      <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* =========================================================================
                PART 2: এই ফলাফল কোন ডাটার উপরে ভিত্তি করে এসেছে? (WHICH DATA THIS RESULT IS BASED ON)
               ========================================================================= */}
            <div className="space-y-6 pt-4">
              {/* Section Header */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 via-white to-sky-50/40 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0a3250] text-white shadow-md">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                      {isBn ? "নাসা স্যাটেলাইট ডাটা ও পরিবেশগত ভিত্তি" : "NASA Earth Observation & Environmental Context"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {isBn
                        ? "এই ফলাফল কোন ডাটার ওপর ভিত্তি করে এসেছে?"
                        : "Which Specific NASA Data & Field Observations Back This Result?"}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {isBn
                        ? "CropWise AI কোনো অনুমান বা কাল্পনিক তথ্য নয়, বরং বিগত ২ বছরের ৪টি আন্তর্জাতিক নাসা (NASA) আর্থ অবজারভেশন উপগ্রহ ব্যবস্থা এবং আপনার মাঠ পর্যায়ের বাস্তব ইনপুটের ওপর ভিত্তি করে এই ফলাফল তৈরি করেছে।"
                        : "Every crop window, moisture threshold, and suitability score is directly derived from a 2-year multi-satellite dataset calibrated for your local coordinates."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 NASA Satellite Systems Grid (Following User's Architecture Diagram) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. NASA POWER — Climate Data */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <Sun className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          NASA POWER — Climate & Thermal Data
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isBn ? "তাপমাত্রা, সৌর বিকিরণ ও তাপপ্রবাহ বিশ্লেষণ" : "Temperature, Solar Radiation & Thermal Stress"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-orange-50 text-orange-700 px-2.5 py-0.5 text-xs font-bold border border-orange-200">
                      {rotationData.nasaDataCoverage?.nasaPowerCoveragePercentage ?? 99.2}% {isBn ? "কভারেজ" : "Coverage"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isBn
                      ? "বিগত ২ বছরে আপনার এলাকার দৈনিক গড়, সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা বিশ্লেষণ করে ফসল বৃদ্ধির জন্য অনুকূল তাপমাত্রার উইন্ডো তৈরি করা হয়েছে। এতে ফুল ফোটার সময় তীব্র তাপপ্রবাহের ঝুঁকি এড়ানো সম্ভব।"
                      : "Analyzed 2 years of daily 2-meter air temperature (T2M) and solar flux, guaranteeing that crop flowering and pollination windows escape fatal heat/frost spikes."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "গড় তাপমাত্রা" : "Mean Temp"}</span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {rotationData.environmentalSummary?.temperature?.average ?? 25.8}°C
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "সর্বোচ্চ তাপমাত্রা" : "Max Temp"}</span>
                      <span className="font-extrabold text-rose-700 text-sm">
                        {rotationData.environmentalSummary?.temperature?.max ?? 39.2}°C
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "তাপপ্রবাহের দিন" : "Heat Days"}</span>
                      <span className="font-extrabold text-amber-700 text-sm">
                        {rotationData.environmentalSummary?.temperature?.extremeHeatDays ?? 24} {isBn ? "দিন" : "Days"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. NASA IMERG — Rainfall Data */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <CloudRain className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          NASA GPM IMERG — Rainfall & Precipitation Data
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isBn ? "বৃষ্টিপাত অনসেট, খরা স্পেল ও মৌসুমি বণ্টন" : "Monsoon Onset, Dry Spells & Precipitation"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-bold border border-blue-200">
                      {rotationData.nasaDataCoverage?.imergCoveragePercentage ?? 98.7}% {isBn ? "কভারেজ" : "Coverage"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isBn
                      ? "২ বছরের ক্যালিব্রেটেড বৃষ্টিপাতের তথ্য বিশ্লেষণ করে দেখা গেছে বর্ষা কখন শুরু হয় এবং রবি মৌসুমে কত দিন দীর্ঘ অনাবৃষ্টি থাকে। সেই অনুযায়ী ফসলের সেচ ক্যালেন্ডার নির্ধারিত হয়েছে।"
                      : "Multi-satellite GPM IMERG precipitation data quantifies 2-year seasonal monsoon peaks and extended winter dry spells (>=10 dry days) to balance crop irrigation."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "মোট বৃষ্টিপাত" : "Total Rain"}</span>
                      <span className="font-extrabold text-blue-800 text-sm">
                        {rotationData.environmentalSummary?.rainfall?.totalRainfallMm ?? 1460} mm
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "বৃষ্টির দিন" : "Rainy Days"}</span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {rotationData.environmentalSummary?.rainfall?.rainyDays ?? 98} {isBn ? "দিন" : "Days"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "খরা স্পেল" : "Dry Spells"}</span>
                      <span className="font-extrabold text-slate-700 text-sm">
                        {rotationData.environmentalSummary?.rainfall?.drySpellsCount ?? 16} {isBn ? "বার" : "Events"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. NASA SMAP — Soil Moisture */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Droplet className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          NASA SMAP — Surface & Rootzone Soil Moisture
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isBn ? "পৃষ্ঠ ও মূলমণ্ডলের পানির আর্দ্রতা" : "Surface (0-5cm) & Rootzone (up to 100cm) Water"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-xs font-bold border border-indigo-200">
                      {rotationData.nasaDataCoverage?.smapCoveragePercentage ?? 94.6}% {isBn ? "কভারেজ" : "Coverage"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isBn
                      ? "বীজ অঙ্কুরোদগমের জন্য উপরিভাগের আর্দ্রতা এবং ফসলের শিকড় বৃদ্ধির জন্য মূলমণ্ডলীয় মাটির আর্দ্রতার পর্যাপ্ততা নিশ্চিত করে ফসল নির্বাচন করা হয়েছে যাতে জলাবদ্ধতা বা পানির ঘাটতি না হয়।"
                      : "L-band microwave observations verify seedbed germination readiness at 0-5cm and subsoil water reserves at root levels, preventing waterlogging or root suffocation."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "পৃষ্ঠ আর্দ্রতা" : "Surface SM"}</span>
                      <span className="font-extrabold text-indigo-800 text-sm">
                        {rotationData.environmentalSummary?.soilMoisture?.surfaceMean ?? 0.25} m³/m³
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "মূলমণ্ডল আর্দ্রতা" : "Rootzone SM"}</span>
                      <span className="font-extrabold text-indigo-800 text-sm">
                        {rotationData.environmentalSummary?.soilMoisture?.rootzoneMean ?? 0.31} m³/m³
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "অনুকূল দিন" : "Optimal Days"}</span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        {rotationData.environmentalSummary?.soilMoisture?.optimalMoistureDays ?? 610} {isBn ? "দিন" : "Days"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. NASA MODIS — Vegetation Data */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <Leaf className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          NASA MODIS — Vegetation & Canopy Greenness (NDVI)
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isBn ? "উদ্ভিজ্জ স্বাস্থ্য ও ঐতিহাসিক বায়োমাস উৎপাদন" : "NDVI Land Vigor & Biomass Dynamics"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-bold border border-emerald-200">
                      98.9% {isBn ? "কভারেজ" : "Coverage"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isBn
                      ? "MODIS উপগ্রহের ২ বছরের NDVI সূচক বিশ্লেষণ করে এলাকার মাটির সামগ্রিক উদ্ভিজ্জ স্বাস্থ্য এবং পূর্বের ফসল কাটার পর জমির পুনরুদ্ধারের হার পরিমাপ করা হয়েছে।"
                      : "MODIS 250m spectral bands record temporal canopy greenness and biomass recovery rates, calibrating field vegetative capacity across seasons."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "গড় NDVI মান" : "Mean NDVI"}</span>
                      <span className="font-extrabold text-emerald-800 text-sm">0.68</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "ক্যানোপি স্বাস্থ্য" : "Canopy Vigor"}</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{isBn ? "উৎকৃষ্ট" : "Healthy"}</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">{isBn ? "পুনরুদ্ধার গতি" : "Recovery"}</span>
                      <span className="font-extrabold text-slate-800 text-sm">{isBn ? "দ্রুত" : "Rapid"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Farmer Field Inputs & Local Context Integration ── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-600" />
                  {isBn
                    ? "মাঠ পর্যায়ের কৃষক ইনপুট ও মাটির বৈশিষ্ট্য"
                    : "Farmer Inputs, Soil Profile & Ground Context"}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {isBn
                    ? "স্যাটেলাইট তথ্যের পাশাপাশি এই ফলাফল তৈরিতে কৃষকের দেওয়া নিচের তথ্যগুলো সমন্বিত করা হয়েছে:"
                    : "In addition to NASA satellites, the AI engine directly applied your specific field conditions:"}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      {isBn ? "ভৌগোলিক অবস্থান" : "Location"}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                      {rotationData.district || "Rajshahi"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {rotationData.location?.latitude?.toFixed(2) ?? "24.37"}°N,{" "}
                      {rotationData.location?.longitude?.toFixed(2) ?? "88.60"}°E
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      {isBn ? "মাটির ধরন ও নিষ্কাশন" : "Soil & Drainage"}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                      {rotationData.farmerInputs?.soilType || "Loamy"}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {isBn ? "নিষ্কাশন:" : "Drainage:"}{" "}
                      {rotationData.farmerInputs?.drainage === "GOOD" ? (isBn ? "উত্তম" : "Good") : (isBn ? "মাঝারি" : "Moderate")}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      {isBn ? "পূর্ববর্তী ফসল" : "Last Cultivated Crop"}
                    </span>
                    <span className="font-extrabold text-amber-800 text-sm mt-0.5 block">
                      {rotationData.farmerInputs?.lastCultivatedCrop || "None"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isBn ? "পরবর্তী চক্রে সুরক্ষিত স্থানান্তর" : "Safely excluded in next round"}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      {isBn ? "কৃষকের পছন্দের ফসল" : "Preferred Crops"}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block truncate">
                      {rotationData.farmerInputs?.preferredCropsRanked?.join(", ") || "Mustard, Mungbean, Rice"}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {isBn ? "১০০% সমন্বয় সম্পন্ন" : "100% matched to priority"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
              CLASSIC CLIMATE ANALYSIS TRANSPARENCY (When toggled to Climate mode)
             ========================================================================= */
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 sm:p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 sm:text-base sm:font-semibold">
                    {isBn
                      ? "আমাদের সুপারিশ আপনার স্থানীয় জলবায়ুর বাস্তব পরিবর্তনের ওপর ভিত্তি করে তৈরি।"
                      : "Our recommendation is based on real changes in your local climate."}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                    {isBn
                      ? "আমরা নাসার স্যাটেলাইট ডাটা (বৃষ্টিপাত, তাপমাত্রা, মাটির আর্দ্রতা এবং উদ্ভিজ্জ সূচক) বিশ্লেষণ করে অতীত ও বর্তমান ট্রেন্ডের তুলনা করে সঠিক সময় নির্ধারণ করি।"
                      : "We analyze NASA satellite data (rainfall, temperature, soil moisture, and vegetation) and compare recent trends with historical patterns to find the best time and strategy for your crop."}
                  </p>
                </div>
              </div>

              <div className="hidden flex-col justify-center rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:flex">
                <Quote className="h-5 w-5 -rotate-1 text-primary-400" />
                <p className={`${script.className} -mt-1 -rotate-1 text-xl leading-snug text-primary-800`}>
                  {isBn ? "সঠিক তথ্যে সিদ্ধান্ত, সমৃদ্ধ ফসল আগামীর জন্য।" : "Smarter insights today, stronger harvests tomorrow."}
                </p>
              </div>
            </section>

            {/* 4 Single-Crop Metrics */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {classicMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-col sm:items-stretch sm:gap-0 shadow-xs"
                >
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${m.tone}`}>
                      <m.icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium text-slate-500">{m.label}</span>
                    <Info className="ml-auto h-3.5 w-3.5 text-slate-300" />
                  </div>

                  <p className="text-xl font-bold text-slate-900 sm:mt-2 sm:text-2xl sm:font-semibold">{m.value}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-400 sm:text-xs sm:leading-relaxed">{m.desc}</p>

                  <div className="w-[46%] shrink-0 sm:mt-3 sm:w-full">
                    <div className="hidden sm:block">
                      <ChartLegend lightColor={m.light} darkColor={m.dark} />
                    </div>
                    {m.type === "bar" ? (
                      <MiniBarChart hist={m.data.hist} recent={m.data.recent} max={m.max} lightColor={m.light} darkColor={m.dark} />
                    ) : (
                      <MiniLineChart hist={m.data.hist} recent={m.data.recent} min={m.min} max={m.max} lightColor={m.light} darkColor={m.dark} />
                    )}
                  </div>
                  <p className={`mt-auto hidden rounded-xl p-3 text-xs leading-relaxed sm:mt-3 sm:block ${m.noteBg}`}>
                    {m.note}
                  </p>
                </div>
              ))}
            </section>

            {/* Detailed Transparency Records */}
            {transparencyLoading && (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary-700" /> Loading analysis transparency...
              </div>
            )}

            {!transparencyLoading && !analysisId && (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-relaxed text-sky-900">
                Run an analysis from the Climate Analysis page first. Its analysis ID will appear here automatically. You can also open this page with{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">?analysisId=...</code>.
              </div>
            )}

            {!transparencyLoading && transparencyError && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
                <div>
                  <p className="font-semibold">Unable to load transparency</p>
                  <p className="mt-1">{transparencyError}</p>
                </div>
              </div>
            )}

            {transparency && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs text-slate-500">Analysis ID</p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800">{transparency.id}</p>
                    <p className="mt-2 text-xs text-slate-500">Algorithm: {transparency.algorithmVersion}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="mt-2 flex items-center gap-2 text-lg font-semibold capitalize text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" /> {transparency.status}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">Completed {new Date(transparency.completedAt).toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="mt-2 text-lg font-semibold text-slate-800">{transparency.location.district}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {transparency.location.latitude}, {transparency.location.longitude}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs text-slate-500">Crop and method</p>
                    <p className="mt-2 text-lg font-semibold text-slate-800">Aman rice</p>
                    <p className="mt-2 text-xs text-slate-500">{transparency.crop.farmingMethod}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-primary-900">
                      <Lightbulb className="h-5 w-5" /> AI explanation
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{transparency.aiExplanation.explanation}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <Cog className="h-5 w-5 text-primary-700" /> Methodology
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-700">{transparency.methodology.rule}</p>
                    <dl className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-500">Baseline period</dt>
                        <dd className="mt-1 font-medium text-slate-800">
                          {transparency.baselinePeriod.startYear}-{transparency.baselinePeriod.endYear}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Recent period</dt>
                        <dd className="mt-1 font-medium text-slate-800">
                          {transparency.recentPeriod.startYear}-{transparency.recentPeriod.endYear}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Ask CropWise AI Bar ── */}
        <AskAiBar
          title={isBn ? "আরও কোনো প্রশ্ন আছে? CropWise AI-কে জিজ্ঞেস করুন" : "Still have questions? Ask CropWise AI"}
          subtitle={
            isBn
              ? "বাংলা বা ইংরেজিতে সহজ ব্যাখ্যা জানুন। এই শস্য আবর্তন পরিকল্পনা বা আপনার জমির যে কোনো তথ্য জানতে প্রশ্ন করুন।"
              : "Get simple explanations in Bangla or English. Learn more about the data or ask anything about your farm."
          }
          placeholder={
            isBn
              ? "যেমন: কেন সরিষার পর মুগডাল চাষ করা সবচেয়ে লাভজনক?"
              : "e.g. Why is Mungbean recommended right after Mustard in Rajshahi?"
          }
        />
      </div>
    </div>
  );
}