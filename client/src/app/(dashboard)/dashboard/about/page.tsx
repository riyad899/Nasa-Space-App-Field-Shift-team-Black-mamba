"use client";

import React from "react";
import { script } from "@/lib/fonts";
import { Leaf, Satellite, LineChart, Brain, BarChart3, Sun, CloudRain, Droplet, ArrowUpRight, Sprout, CloudSun, TrendingUp, Users, Quote, ArrowRight } from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";

// Handwritten font — same one used across the app for consistency

const steps = [
  { title: "1. NASA Data", desc: "We collect satellite data on rainfall, temperature, soil moisture, and vegetation.", icon: Satellite },
  { title: "2. Analysis", desc: "We analyze climate trends for your location and crop using advanced methods.", icon: LineChart },
  { title: "3. AI Interpretation", desc: "Our AI explains the results in simple language.", icon: Brain },
  { title: "4. Actionable Insights", desc: "You get practical recommendations for better farming decisions.", icon: BarChart3 },
];

const sources = [
  { name: "NASA POWER", desc: "Weather and climate data (temperature, rainfall, etc.)", icon: Sun, tone: "bg-amber-100 text-amber-500" },
  { name: "GPM IMERG", desc: "Global precipitation data", icon: CloudRain, tone: "bg-sky-100 text-sky-600" },
  { name: "SMAP", desc: "Soil moisture data", icon: Droplet, tone: "bg-blue-100 text-blue-600" },
  { name: "MODIS / VIIRS", desc: "Vegetation index (NDVI)", icon: Sprout, tone: "bg-primary-100 text-primary-700" },
];

const impact = [
  { title: "Empowering Farmers", desc: "Data-driven decisions for stronger communities.", icon: Sprout, tone: "bg-primary-100 text-primary-700" },
  { title: "Climate Resilience", desc: "Helping farms adapt to changing climate conditions.", icon: CloudSun, tone: "bg-sky-100 text-sky-600" },
  { title: "Sustainable Future", desc: "Healthier land, better yields, stronger food security.", icon: TrendingUp, tone: "bg-violet-100 text-violet-600" },
];

export default function AboutPage() {
  return (
    <div className="pb-8">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#fbfcfa]" style={{ minHeight: 320 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_60%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/VYKH4926/Chat-GPT-Image-Sep-25-2026-01-08-52-PM.png')",
            }}
          />
          {/* Minimal left fade so heading text is legible */}
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent" />
          {/* Top fade for readable navbar */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          {/* Smoky bottom blend into #f5f7f5 */}
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent" />
          <div className="absolute bottom-0 right-0 h-[30%] w-[20%] bg-gradient-to-tl from-[#f5f7f5]/90 to-transparent" />
        </div>

        {/* Text content */}
        <div className="relative px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">About CropWise AI</h1>

            <p className="mt-1 text-lg font-medium text-slate-800">
              Adapting Farms with NASA Data
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              CropWise AI uses NASA Earth observations and AI analysis to help farmers
              make informed, climate-resilient decisions.
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Healthy Fields
            <br />
            Brighter Tomorrows.
          </p>
        </div>
      </section>

      {/* Content wrapper */}
      <div className="relative -mt-6 z-10 space-y-6 px-4 sm:px-6">

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-primary-800">Our Mission</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                To empower farmers with simple, science-based insights from NASA data, helping them adapt to climate change and build a more resilient future.
              </p>
            </div>
          </div>
        </div>

        {/* Quote card — light tinted card with a quote mark + handwritten
            font, matching the reference (not a dark gradient panel) */}
        <div className="flex flex-col justify-center rounded-2xl border border-primary-100 bg-primary-50 p-5">
          <Quote className="h-5 w-5 -rotate-1 text-primary-400" />
          <p className={`${script.className} -mt-1 -rotate-1 text-xl leading-snug text-primary-800`}>
            Better data. Stronger farmers. A more resilient tomorrow.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">How CropWise AI Works</h2>
        <div className="mt-5 flex items-start justify-between gap-2 overflow-x-auto">
          {steps.map((s, i) => (
            <React.Fragment key={s.title}>
              <div className="w-28 flex-shrink-0 text-center sm:w-auto sm:flex-1">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-2 text-xs font-semibold text-slate-800">{s.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mt-7 h-4 w-4 flex-shrink-0 text-slate-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold">NASA</span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">NASA Data Sources</h2>
              <p className="text-xs text-slate-400">We use trusted NASA Earth observation datasets to provide accurate and reliable insights.</p>
            </div>
          </div>
          <a href="https://www.nasa.gov" target="_blank" rel="noreferrer" className="hidden flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex">
            Learn more about NASA <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sources.map((s) => (
            <div key={s.name} className="rounded-xl border border-slate-100 p-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </span>
              <p className="mt-2 text-xs font-semibold text-slate-800">{s.name}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-slate-900">Our Impact</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {impact.map((i) => (
            <div key={i.title} className="rounded-2xl border border-slate-100 bg-white p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${i.tone}`}>
                <i.icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">{i.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Our Team</h2>
            <p className="text-xs leading-relaxed text-slate-400">
              We are a team of students, innovators, and changemakers, using space technology for real-world impact in agriculture.
            </p>
          </div>
        </div>
        <button className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          Meet the Team <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

      <AskAiBar title="Ask CropWise AI" subtitle="Ask anything about our project, data sources, or how it works." placeholder="e.g. How does CropWise AI use NASA data?" />
      </div>
    </div>
  );
}