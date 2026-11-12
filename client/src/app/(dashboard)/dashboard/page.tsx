"use client";

import React, { useState } from "react";
import Link from "next/link";
import { script } from "@/lib/fonts";
import {
  Sprout,
  MessageCircle,
  BookOpen,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Satellite,
  Cog,
  ArrowRight,
  MapPin,
  Leaf,
  Target,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { TransparentNavSlot } from "../header-context";
import FilterBar from "@/Components/modules/Dashboord/FilterBar";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { useAnalysis } from "@/lib/analysis-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cropwiseQueryKeys, cropwiseQueryOptions } from "@/lib/query-client";
import { getAnalysisHistory, getAnalysisTransparency } from "@/lib/apis/analyzeAi";


// Mobile select er options (FilterBar er value gulor sathe mil rekho)
const LOCATIONS = ["Rajshahi", "Mymensingh", "Rangpur", "Dhaka", "Khulna", "Sylhet", "Chattogram", "Barishal"];
const CROPS = ["Aman Rice", "Boro Rice", "Maize"];
const PRIORITIES = ["Save Water", "Maximize Yield", "Climate Resilience"];

function SelectRow({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  options,
  render,
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  render: (v: string) => string;
}) {
  return (
    <label className="relative flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        <Icon className="h-5 w-5" />
      </span>
      <span className="w-[84px] shrink-0 text-sm font-semibold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`min-w-0 flex-1 appearance-none bg-transparent pr-6 text-sm outline-none ${
          value ? "font-medium text-slate-800" : "text-slate-400"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {render(o)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-slate-700" />
    </label>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { lang, t, locName, cropName, priorityName } = useLanguage();
  const { user } = useAuth();
  const { activeAnalysis } = useAnalysis();
  const queryClient = useQueryClient();
  const isBn = lang === "BN";

  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("");
  const [priority, setPriority] = useState("");

  // Normal query caching (standard 60s staleTime) for general user history (NOT 20 minutes)
  const { data: serverHistory } = useQuery({
    queryKey: ["user-analysis-history", user?.id || "guest"],
    queryFn: async () => {
      const res = await getAnalysisHistory();
      return res?.success && Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
  });

  const prefetchTransparency = (analysisId?: string) => {
    if (!analysisId) return;
    queryClient.prefetchQuery({
      queryKey: cropwiseQueryKeys.transparency(analysisId),
      queryFn: async () => {
        const res = await getAnalysisTransparency(analysisId);
        return res?.data;
      },
      ...cropwiseQueryOptions,
    });
  };

  const quickActions = [
    {
      title: isBn ? "খামার বিশ্লেষণ করুন" : "Analyze My Farm",
      desc: isBn ? "আপনার এলাকার জলবায়ু উপাত্ত জানুন" : "Get climate insights for your location",
      icon: Sprout,
      tone: "bg-primary-100 text-primary-700",
      href: "/dashboard/climate-analysis",
      mobileHidden: true, // mobile e upore form-ei ache
    },
    {
      title: isBn ? "ক্রপওয়াইজ এআইকে জিজ্ঞাসা করুন" : "Ask CropWise AI",
      mTitle: isBn ? "এআইকে জিজ্ঞাসা করুন" : "Ask CropWise AI",
      desc: isBn ? "কৃষি বিষয়ক যেকোনো প্রশ্নের সমাধান পান" : "Get answers to your farming questions",
      mDesc: isBn ? "কৃষি প্রশ্নের উত্তর পান" : "Get answers to your farming questions",
      icon: MessageCircle,
      tone: "bg-sky-100 text-sky-600",
      href: "/dashboard/ask-ai",
    },
    {
      title: isBn ? "নতুন কিছু শিখুন" : "Learn Something New",
      mTitle: isBn ? "কৃষি শিখুন" : "Learn farming insights",
      desc: isBn ? "স্মার্ট কৃষিকাজের সহজ সহায়িকা" : "Simple guides for smarter farming",
      mDesc: isBn ? "সহজ কৃষি সহায়িকা" : "Simple guides for smarter farming",
      icon: BookOpen,
      tone: "bg-amber-100 text-amber-600",
      href: "/dashboard/learn",
    },
    {
      title: isBn ? "নমুনা ফলাফল দেখুন" : "See Example Results",
      mTitle: isBn ? "নমুনা ফলাফল" : "View sample results",
      desc: isBn ? "পূর্ববর্তী বিশ্লেষণ ও সুপারিশসমূহ অন্বেষণ করুন" : "Explore sample analysis and recommendations",
      mDesc: isBn ? "নমুনা বিশ্লেষণ দেখুন" : "Explore example analyses",
      icon: BarChart3,
      tone: "bg-violet-100 text-violet-600",
      href: "/dashboard/recommendations",
    },
  ];

  const defaultRecentAnalyses = [
    { location: locName("Rajshahi"), crop: cropName("Aman Rice"), tag: priorityName("Save Water"), date: isBn ? "১২ সেপ্টে, ২০২৫" : "Sep 12, 2025", icon: "🌾", analysisId: "" },
    { location: locName("Mymensingh"), crop: cropName("Boro Rice"), tag: priorityName("Maximize Yield"), date: isBn ? "২৮ আগস্ট, ২০২৫" : "Aug 28, 2025", icon: "🌱", analysisId: "" },
    { location: locName("Rangpur"), crop: cropName("Maize"), tag: priorityName("Climate Resilience"), date: isBn ? "১০ আগস্ট, ২০২৫" : "Aug 10, 2025", icon: "🌽", analysisId: "" },
  ];

  const displayedAnalyses = serverHistory && serverHistory.length > 0
    ? serverHistory.slice(0, 3).map((item: any) => ({
        location: locName(item.location?.district || "Rajshahi"),
        crop: cropName(item.crop?.cropType === "aman_rice" ? "Aman Rice" : item.crop?.cropType || "Aman Rice"),
        tag: priorityName(item.farmerPriority?.type || item.farmingMethod || "Save Water"),
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : (isBn ? "সাম্প্রতিক" : "Recent"),
        icon: "🌾",
        analysisId: item.id || item.analysisId || "",
      }))
    : defaultRecentAnalyses;

  const steps = [
    {
      title: isBn ? "১. নাসার উপাত্ত" : "1. NASA Data",
      mTitle: isBn ? "নাসার উপাত্ত" : "NASA Data",
      desc: isBn ? "বৃষ্টিপাত, তাপমাত্রা ও মাটির আর্দ্রতা সংক্রান্ত স্যাটেলাইট পর্যবেক্ষণ।" : "We use satellite data on rainfall, temperature, soil moisture and more.",
      mDesc: isBn ? "স্যাটেলাইট পর্যবেক্ষণ" : "Satellite observations",
      icon: Satellite,
      filled: true,
    },
    {
      title: isBn ? "২. স্মার্ট এআই বিশ্লেষণ" : "2. Smart Analysis",
      mTitle: isBn ? "স্মার্ট বিশ্লেষণ" : "Smart Analysis",
      desc: isBn ? "আপনার নির্দিষ্ট অবস্থান ও ফসলের জন্য জলবায়ুর ধারা বিশ্লেষণ।" : "Our system analyzes climate trends for your location and crop.",
      mDesc: isBn ? "এআই-চালিত ইনসাইট" : "AI-powered insights",
      icon: Cog,
      filled: false,
    },
    {
      title: isBn ? "৩. বাস্তবসম্মত পরামর্শ" : "3. Actionable Insights",
      mTitle: isBn ? "খামার ইনসাইট" : "Farm Insights",
      desc: isBn ? "উজ্জ্বল ও সুরক্ষিত ভবিষ্যতের জন্য সময়োপযোগী সঠিক রোপণ নির্দেশনা।" : "You get simple, practical recommendations for a resilient tomorrow.",
      mDesc: isBn ? "সঠিক সিদ্ধান্ত" : "Better decisions",
      icon: Sprout,
      filled: false,
    },
  ];

  const handleAnalyze = () => {
    router.push(`/dashboard/climate-analysis?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}&priority=${encodeURIComponent(priority)}`);
  };

  return (
    <div className="pb-24 md:pb-8">
      <TransparentNavSlot />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[430px] overflow-hidden bg-[#fbfcfa] sm:min-h-[320px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_60%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/HDzJ2h3N/Screenshot-2026-09-24-at-11-31-21-PM.png')",
            }}
          />
          {/* Mobile: top light fade (dark text er jonno) */}
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#fbfcfa]/95 via-[#fbfcfa]/55 to-transparent sm:hidden" />
          {/* Desktop: left fade + navbar fade */}
          <div className="absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent sm:block" />
          <div className="absolute inset-x-0 top-0 hidden h-20 bg-gradient-to-b from-black/20 to-transparent sm:block" />
          {/* Bottom blend */}
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent" />
          <div className="absolute bottom-0 right-0 hidden h-[30%] w-[20%] bg-gradient-to-tl from-[#f5f7f5]/90 to-transparent sm:block" />
        </div>

        <div className="relative px-5 pb-20 pt-24 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-md">
            <h1 className="text-[34px] font-bold leading-[1.1] text-slate-900 sm:flex sm:items-center sm:gap-2 sm:text-4xl sm:font-semibold sm:leading-normal">
              <span>
                {isBn ? "আসুন একসাথে গড়ি" : "Let's grow a"}{" "}
                <br className="sm:hidden" />
                <span className="text-primary-800 sm:text-slate-900">
                  {isBn ? "এক সমৃদ্ধ আগামী" : "stronger tomorrow."}
                </span>
              </span>
            </h1>

            {/* Mobile: short subtitle */}
            <p className="mt-3 max-w-[270px] text-[15px] leading-snug text-slate-700 sm:hidden">
              {isBn
                ? "নাসার আর্থ অবজারভেশন দিয়ে স্মার্ট কৃষি সিদ্ধান্ত।"
                : "NASA Earth observations for smarter farming decisions."}
            </p>

            {/* Desktop: full description */}
            <p className="mt-3 hidden text-sm leading-relaxed text-slate-600 sm:block">
              {isBn
                ? "ক্রপওয়াইজ এআই নাসার স্যাটেলাইট আর্থ অবজারভেশন ব্যবহার করে আপনার খামারের উপযোগী সহজ ও কার্যকর কৃষি পরামর্শ প্রদান করে।"
                : "CropWise AI uses NASA Earth observations to help you make better farming decisions — simple, practical, and tailored to your land."}
            </p>
          </div>

          {/* Handwritten: mobile e bottom-left, desktop e top-right */}
          <div
            className={`${script.className} absolute bottom-24 left-5 -rotate-[8deg] text-[22px] leading-6 text-white drop-shadow sm:bottom-auto sm:left-auto sm:right-10 sm:top-24 sm:-rotate-2 sm:text-2xl`}
          >
            <p className="whitespace-pre-line">
              {isBn ? "একই জমি।\nনতুন সম্ভাবনা।" : "Same Land.\nNew Possibilities."}
            </p>
            <div className="mt-1 h-px w-28 origin-left rotate-[-3deg] bg-white/90 sm:hidden" />
          </div>
        </div>
      </section>

      {/* ── FILTER CARD ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 -mt-14 mb-6 px-4 sm:-mt-12 sm:mb-8 sm:px-6">
        {/* Mobile: Start your analysis card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(20,60,40,0.10)] sm:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-tight text-slate-900">
                {isBn ? "বিশ্লেষণ শুরু করুন" : "Start your analysis"}
              </h2>
              <p className="text-[11px] leading-snug text-slate-500">
                {isBn
                  ? "জলবায়ু ইনসাইট পেতে আপনার খামারের তথ্য দিন।"
                  : "Select your farm details to get climate insights and recommendations."}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <SelectRow
              icon={MapPin}
              label={isBn ? "এলাকা" : "Location"}
              placeholder={isBn ? "এলাকা বাছাই করুন" : "Select location"}
              value={location}
              onChange={setLocation}
              options={LOCATIONS}
              render={locName}
            />
            <SelectRow
              icon={Sprout}
              label={isBn ? "ফসল" : "Crop"}
              placeholder={isBn ? "ফসল বাছাই করুন" : "Select crop"}
              value={crop}
              onChange={setCrop}
              options={CROPS}
              render={cropName}
            />
            <SelectRow
              icon={Target}
              label={isBn ? "অগ্রাধিকার" : "Farm priority"}
              placeholder={isBn ? "অগ্রাধিকার বাছাই করুন" : "Select priority"}
              value={priority}
              onChange={setPriority}
              options={PRIORITIES}
              render={priorityName}
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f4d36] text-sm font-semibold text-white shadow-[0_6px_20px_rgba(15,77,54,0.25)] transition active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            {isBn ? "আমার খামার বিশ্লেষণ করুন" : "Analyze my farm"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop: FilterBar */}
        <div className="hidden sm:block">
          <FilterBar
            variant="card"
            location={location}
            crop={crop}
            priority={priority}
            onLocationChange={setLocation}
            onCropChange={setCrop}
            onPriorityChange={setPriority}
            onSubmit={handleAnalyze}
          />

          <p className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-500">
            <span>{t("filter_hint_ai")}</span>
            <span>{t("filter_hint_nasa")}</span>
          </p>
        </div>
      </div>

      {/* Main page content */}
      <div className="space-y-6 px-4 sm:px-6">
        {/* Quick actions */}
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="h-5 w-5 text-primary-700 sm:hidden" />
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:font-semibold">
                  {isBn ? "দ্রুত কার্যক্রম" : "Quick Actions"}
                </h2>
                <p className="text-[11px] text-slate-500 sm:hidden">
                  {isBn ? "জানা, শেখা ও সহায়তার টুলস।" : "Useful tools to explore, learn, and get help."}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/learn"
              className="flex items-center gap-1 text-xs font-semibold text-primary-700 sm:hidden"
            >
              {isBn ? "সব দেখুন" : "See all"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className={`relative flex-col rounded-2xl border border-slate-100 bg-white p-3 transition hover:shadow-sm sm:p-4 ${
                  a.mobileHidden ? "hidden sm:flex" : "flex"
                }`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-10 sm:w-10 ${a.tone}`}>
                  <a.icon className="h-5 w-5" />
                </span>
                <p className="mt-2.5 pr-3 text-[13px] font-semibold leading-snug text-slate-900 sm:mt-3 sm:pr-0 sm:text-sm">
                  <span className="sm:hidden">{a.mTitle ?? a.title}</span>
                  <span className="hidden sm:inline">{a.title}</span>
                </p>
                <p className="mt-1 text-[11px] leading-snug text-slate-400 sm:text-xs sm:leading-relaxed">
                  <span className="sm:hidden">{a.mDesc ?? a.desc}</span>
                  <span className="hidden sm:inline">{a.desc}</span>
                </p>
                <ChevronRight className="absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:hidden" />
              </Link>
            ))}
          </div>
        </section>

        {/* Recent + How it works */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-primary-700 sm:hidden" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 sm:font-semibold">
                    {isBn ? "সাম্প্রতিক বিশ্লেষণসমূহ" : "Recent Analyses"}
                  </h2>
                  <p className="text-[11px] text-slate-500 sm:hidden">
                    {isBn ? "আপনার সাম্প্রতিক খামার বিশ্লেষণ" : "Your latest farm analyses"}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/climate-analysis" className="flex items-center gap-1 text-xs font-semibold text-primary-700">
                {isBn ? "সবগুলো দেখুন" : "View All"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {displayedAnalyses.map((r, idx) => (
                <Link
                  key={idx}
                  href={r.analysisId ? `/dashboard/why-this-result?analysisId=${encodeURIComponent(r.analysisId)}` : "/dashboard/climate-analysis"}
                  onMouseEnter={() => prefetchTransparency(r.analysisId)}
                  className={`items-center justify-between py-3 hover:bg-slate-50/60 ${
                    idx === 2 ? "hidden sm:flex" : "flex"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg sm:h-auto sm:w-auto sm:bg-transparent">
                      {r.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {r.location} · {r.crop}
                      </p>
                      <p className="text-xs text-slate-400">{r.tag}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                    {r.date}
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile: compact how-it-works strip */}
          <div className="flex items-center justify-between gap-1 rounded-2xl bg-primary-50/70 p-3 sm:hidden">
            {steps.map((s, i) => (
              <React.Fragment key={s.title}>
                <div className="flex min-w-0 items-center gap-1.5">
                  <s.icon className="h-6 w-6 shrink-0 text-primary-700" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-tight text-slate-800">{s.mTitle}</p>
                    <p className="text-[9px] leading-tight text-slate-400">{s.mDesc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Desktop: How it works card */}
          <div className="hidden rounded-2xl border border-slate-100 bg-white p-5 sm:block">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {isBn ? "ক্রপওয়াইজ এআই যেভাবে কাজ করে" : "How CropWise AI Works"}
              </h2>
              <Link href="/dashboard/about" className="flex items-center gap-1 text-xs font-semibold text-primary-700">
                {isBn ? "আরও জানুন" : "Learn more"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 flex items-start justify-between gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.title}>
                  <div className="flex-1 text-center">
                    <span
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                        s.filled ? "bg-[#0f3d2a] text-white" : "bg-primary-50 text-primary-700"
                      }`}
                    >
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-slate-800">{s.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="mt-5 h-4 w-4 flex-shrink-0 text-slate-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className={`${script.className} mt-4 -rotate-1 text-center text-lg text-primary-700`}>
              {isBn ? "সুস্থ মাঠ। উজ্জ্বল ভবিষ্যৎ।" : "Healthy Fields. Brighter Tomorrows."}
            </p>
          </div>
        </section>

        {/* AskAiBar: mobile e hidden (image e nai) */}
        <div className="hidden sm:block">
          <AskAiBar />
        </div>
      </div>
    </div>
  );
}