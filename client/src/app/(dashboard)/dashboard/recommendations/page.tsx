"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Calendar,
  Info,
  RefreshCw,
  Sprout,
  Droplet,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";

import { TransparentNavSlot } from "../../header-context";
import FilterBar from "@/Components/modules/Dashboord/FilterBar";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";

import { useAnalysis } from "@/lib/analysis-context";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cropwiseQueryKeys, cropwiseQueryOptions } from "@/lib/query-client";


const rotation = [
  {
    icon: "🌾",
    name: "Aman Rice",
    season: "Kharif Season",
    window: "Jul – Nov",
    points: ["Main crop", "Good climate suitability", "Moderate water need"],
  },
  {
    icon: "🔴",
    name: "Lentil",
    season: "Rabi Season",
    window: "Nov – Feb",
    points: ["Improves soil health", "Low water requirement", "Good market value"],
  },
  {
    icon: "🌾",
    name: "Boro Rice",
    season: "Pre-summer",
    window: "Feb – May",
    points: [
      "Utilizes residual moisture",
      "Higher yield potential",
      "Suitable with proper water management",
    ],
  },
];

const alternatives = [
  {
    icon: "🌽",
    name: "Maize",
    window: "Mar – Jun",
    tag: "Low water need",
    points: ["Good for dry conditions", "Can be an alternative if water is limited"],
  },
  {
    icon: "🫘",
    name: "Mung Bean",
    window: "Mar – May",
    tag: "Very low water need",
    points: ["Improves soil nitrogen", "Good short-term option"],
  },
];

const benefits = [
  { label: "Better water\nmanagement", icon: Droplet, tone: "bg-sky-100 text-sky-600" },
  { label: "Healthier\nsoil", icon: Sprout, tone: "bg-primary-100 text-primary-700" },
  { label: "More stable\nyield", icon: TrendingUp, tone: "bg-emerald-100 text-emerald-600" },
  { label: "Higher climate\nresilience", icon: ShieldCheck, tone: "bg-primary-100 text-primary-700" },
];

const card = "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5";
const heading =
  "flex items-center justify-between text-[15px] font-semibold text-slate-900 sm:text-base";

export default function RecommendationsPage() {
  const router = useRouter();
  const { activeAnalysis } = useAnalysis();

  const [location, setLocation] = useState(activeAnalysis?.location?.district || "Rajshahi");
  const [crop, setCrop] = useState(activeAnalysis?.crop?.cropType === "aman_rice" ? "Aman Rice" : (activeAnalysis?.crop?.cropType || "Aman Rice"));
  const [priority, setPriority] = useState("Save Water");

  const analysisId = activeAnalysis?.analysisId || "default";

  // ─── Query Recommendations (20-Minute Cache) ─────────────────────────────
  const { data: cachedRecommendation } = useQuery({
    queryKey: cropwiseQueryKeys.recommendations(analysisId),
    queryFn: async () => ({
      analysisId,
      windowStart: activeAnalysis?.transplantingWindow?.start || "2026-07-15",
      windowEnd: activeAnalysis?.transplantingWindow?.end || "2026-07-25",
      farmerGuidance: activeAnalysis?.farmerGuidance || [],
      warnings: activeAnalysis?.warnings || [],
    }),
    enabled: Boolean(activeAnalysis),
    ...cropwiseQueryOptions, // 20-minute staleTime
  });

  const windowStart = cachedRecommendation?.windowStart || activeAnalysis?.transplantingWindow?.start || "2026-07-15";
  const windowEnd = cachedRecommendation?.windowEnd || activeAnalysis?.transplantingWindow?.end || "2026-07-25";

  return (
    <div className="pb-24 sm:pb-8">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[280px] overflow-hidden rounded-b-3xl bg-[#fbfcfa] sm:min-h-[320px] sm:rounded-2xl">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://i.ibb.co.com/23cWFG8j/Chat-GPT-Image-Sep-24-2026-05-53-43-PM.png")',
            }}
          />
          <div className="absolute inset-x-0 top-0 h-[75%] bg-gradient-to-b from-[#fbfcfa] via-[#fbfcfa]/80 to-transparent sm:hidden" />
          <div className="absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-[#fbfcfa] to-transparent sm:block" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent" />
          <div className="absolute bottom-0 right-0 hidden h-[30%] w-[20%] bg-gradient-to-tl from-[#f5f7f5]/90 to-transparent sm:block" />
        </div>

        <div className="relative px-5 pb-16 pt-20 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-md">
            <h1 className="text-[28px] font-bold leading-tight text-slate-900 sm:text-4xl">
              Recommendations
            </h1>

            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#173d2a] px-3 py-1 text-xs font-semibold text-white sm:bg-transparent sm:p-0 sm:text-lg sm:text-[#173d2a]">
              {location} · {crop}
            </span>

            <p className="mt-3 text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
              Actionable farming recommendations based on NASA Earth observations
              and AI analysis.
            </p>
          </div>

          <p
            className={`${script.className} absolute right-10 top-24 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:block`}
          >
            Better Choices
            <br />
            Greener Tomorrows.
          </p>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <div className="relative z-10 -mt-10 mb-6 px-4 sm:-mt-12 sm:mb-8 sm:px-6">
        <FilterBar
          variant="card"
          location={location}
          crop={crop}
          priority={priority}
          onLocationChange={setLocation}
          onCropChange={setCrop}
          onPriorityChange={setPriority}
          onSubmit={() => {
            router.push(`/dashboard/climate-analysis?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}&priority=${encodeURIComponent(priority)}`);
          }}
          hasResult
        />
      </div>

      <div className="space-y-5 px-4 sm:space-y-6 sm:px-6">
        {/* ================= PLANTING WINDOW ================= */}
        <section className="grid grid-cols-1 gap-5 rounded-3xl bg-primary-50 p-4 sm:rounded-2xl sm:p-8 lg:grid-cols-2">
          <div
            className="relative order-first min-h-[200px] overflow-hidden rounded-2xl bg-cover bg-center p-4 sm:min-h-[300px] sm:p-5 lg:order-last"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/PG31PycM/Chat-GPT-Image-Sep-24-2026-05-42-01-PM.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-emerald-950/35 to-emerald-950/70" />

            <div className="relative z-10 text-white">
              <p className="text-2xl font-bold leading-tight">{windowStart} – {windowEnd}</p>
              <p className="mt-1 text-xs text-white/80">Recommended planting window</p>
              {activeAnalysis && (
                <span className="mt-2 inline-block rounded-full bg-emerald-500/80 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Evidence-Grounded ({activeAnalysis.transplantingWindow?.confidence || "Verified"})
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 hidden max-w-[170px] rounded-xl bg-white/15 p-3.5 text-white shadow-lg backdrop-blur-sm sm:bottom-5 sm:right-5 sm:block">
              <Quote className="h-4 w-4 text-white/70" />
              <p className="mt-1.5 text-xs italic leading-snug">
                Plant at the right time, for a more resilient harvest.
              </p>
              <div className="mt-2 h-px w-7 bg-white/40" />
            </div>
          </div>

          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-primary-700 sm:text-sm">
              <Sprout className="h-4 w-4" />
              Recommended for You
            </p>

            <h3 className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
              Optimal Planting Window
            </h3>

            <p className="text-[13px] font-medium text-slate-600 sm:text-sm">
              {crop} · {location}
            </p>

            <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-sm">
              {activeAnalysis?.explanation ? (
                activeAnalysis.explanation
              ) : (
                <>
                  Based on recent climate trends, the best time to transplant {crop} in your area is{" "}
                  <span className="font-semibold text-slate-800">{windowStart} – {windowEnd}</span>.
                </>
              )}
            </p>

            {activeAnalysis?.farmerGuidance && activeAnalysis.farmerGuidance.length > 0 && (
              <div className="mt-4 space-y-1.5 rounded-xl border border-primary-200/60 bg-white/70 p-3 text-xs text-slate-700">
                <p className="font-semibold text-primary-900">কৃষক নির্দেশনা (Farmer Guidance):</p>
                {activeAnalysis.farmerGuidance.map((g, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{g}</span>
                  </p>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              <button
                onClick={() => router.push(`/dashboard/climate-analysis?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}&priority=${encodeURIComponent(priority)}`)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary-800 px-4 text-sm font-semibold text-white transition active:scale-[0.98] sm:w-auto hover:bg-primary-900"
              >
                <Calendar className="h-4 w-4" />
                View Climate Details
              </button>

              <button
                onClick={() => {
                  const targetId = activeAnalysis?.analysisId;
                  router.push(targetId ? `/dashboard/why-this-result?analysisId=${encodeURIComponent(targetId)}` : "/dashboard/why-this-result");
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 text-sm font-semibold text-primary-800 transition active:scale-[0.98] sm:w-auto hover:bg-primary-50"
              >
                <Info className="h-4 w-4" />
                Why this recommendation?
              </button>
            </div>
          </div>
        </section>


        {/* ================= ROTATION + ALTERNATIVES ================= */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className={card}>
            <h2 className={heading}>
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary-600" />
                Suggested Crop Rotation
              </span>
              <Info className="h-4 w-4 text-slate-300" />
            </h2>

            <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {rotation.map((r, i) => (
                <React.Fragment key={r.name}>
                  <div className="min-w-[78%] flex-shrink-0 snap-center rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:min-w-0 sm:flex-1 sm:bg-transparent">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-xl">
                        {r.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {i + 1}. {r.name}
                        </p>
                        <p className="text-xs text-slate-400">{r.season}</p>
                      </div>
                    </div>

                    <span className="mt-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {r.window}
                    </span>

                    <ul className="mt-3 space-y-2">
                      {r.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-[13px] text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {i < rotation.length - 1 && (
                    <ArrowRight className="hidden h-5 w-5 flex-shrink-0 self-center text-slate-300 sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400 sm:hidden">
              ← Swipe to see next season →
            </p>
          </div>

          <div className={card}>
            <h2 className={heading}>
              <span className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary-600" />
                Alternative Options
              </span>
              <Info className="h-4 w-4 text-slate-300" />
            </h2>

            <div className="mt-4 space-y-3">
              {alternatives.map((a) => (
                <div
                  key={a.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5 transition active:bg-slate-50"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xl">
                    {a.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                      <span className="text-xs text-slate-400">{a.window}</span>
                    </div>

                    <span className="mt-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
                      {a.tag}
                    </span>

                    <ul className="mt-2 space-y-1.5">
                      {a.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-1.5 text-[13px] text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ChevronRight className="mt-2 h-4 w-4 flex-shrink-0 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BENEFITS + NOTES ================= */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className={card}>
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 sm:text-base">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              Key Benefits
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {benefits.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-center sm:p-4"
                >
                  <span
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${b.tone}`}
                  >
                    <b.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-2 whitespace-pre-line text-xs font-medium leading-snug text-slate-700">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Important Notes
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-amber-800">
              <li>• Recommendations may vary based on local soil conditions.</li>
              <li>• Monitor local weather updates during the season.</li>
              <li>• Consider your available resources and market demand.</li>
            </ul>
          </div>
        </section>

        {/* ================= ASK AI ================= */}
        <AskAiBar
          title="Have questions? Ask FieldShift AI"
          subtitle="Get simple explanations, farming tips, or personalized advice in Bangla or English."
          placeholder="e.g. Can I plant earlier than 15 July?"
        />
      </div>
    </div>
  );
}