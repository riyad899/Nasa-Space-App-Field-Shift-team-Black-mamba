"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Sprout,
  RotateCw,
  Droplet,
  CloudLightning,
  Play,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import AskAiBar from "@/Components/modules/Dashboord/AskAiBar";


const topics = ["All Topics", "NASA Data", "Climate & Weather", "Crops & Farming", "Soil & Water", "Sustainability"];

const HERO_IMG = "https://i.ibb.co.com/tp4x9fn8/Chat-GPT-Image-Sep-24-2026-11-33-05-PM.png";

const guides = [
  {
    title: "What is NASA Earth Data?",
    desc: "Learn how satellite data helps us understand climate and support farming.",
    read: "5 min read",
    image: "https://i.ibb.co.com/1GDRVzB6/Space.jpg",
  },
  {
    title: "How Rainfall Affects Crops",
    desc: "Understand rainfall patterns, seasonal changes, and their impact on crop timing.",
    read: "4 min read",
    image: "https://i.ibb.co.com/F4WJBLnQ/Download-Free-Vectors-Images-Photos-Vecteezy.jpg",
  },
  {
    title: "Soil Moisture and Plant Health",
    desc: "See how soil moisture influences growth and yield.",
    read: "4 min read",
    image: "https://i.ibb.co.com/9mb9Lx9T/Seasonal-soil-care.jpg",
  },
  {
    title: "What is NDVI?",
    desc: "Learn how vegetation index shows plant health from space.",
    read: "3 min read",
    image: "https://i.ibb.co.com/LL2MgDh/NDVI-image-The-field-has-a-great-amount-of-stress-in-the-northern-area.jpg",
  },
];

const practices = [
  { title: "Crop Rotation Basics", desc: "Learn how crop rotation improves soil health and reduces risks.", read: "4 min read", icon: RotateCw, tone: "bg-primary-100 text-primary-700" },
  { title: "Water Saving Techniques", desc: "Practical tips to use water efficiently in your farm.", read: "4 min read", icon: Droplet, tone: "bg-sky-100 text-sky-600" },
  { title: "Climate-Resilient Crops", desc: "Explore crops that perform better in changing climate conditions.", read: "6 min read", icon: Sprout, tone: "bg-emerald-100 text-emerald-600" },
  { title: "Preparing for Extreme Weather", desc: "Learn how to protect your farm from floods, droughts and heatwaves.", read: "5 min read", icon: CloudLightning, tone: "bg-indigo-100 text-indigo-600" },
];

const videos = [
  { title: "Introduction to NASA Data", duration: "8:24", image: "https://i.ibb.co.com/1GDRVzB6/Space.jpg" },
  { title: "Understanding Soil Moisture", duration: "6:15", image: "https://i.ibb.co.com/9mb9Lx9T/Seasonal-soil-care.jpg" },
  { title: "Climate Resilient Farming", duration: "5:32", image: HERO_IMG },
];

export default function LearnPage() {
  const [activeTopic, setActiveTopic] = useState("All Topics");

  return (
    <div className="pb-24 md:pb-8">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#fbfcfa]" style={{ minHeight: 320 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_60%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/tp4x9fn8/Chat-GPT-Image-Sep-24-2026-11-33-05-PM.png')",
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
          <div className="max-w-lg">
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Learn</h1>

            <p className="mt-1 text-base font-medium text-slate-700">
              Simple guides for smarter, climate-resilient farming.
            </p>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Explore topics on climate, crops, soil, and NASA data — explained
              in simple language, with real examples.
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Knowledge Today
            <br />
            Healthier Fields Tomorrow.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mt-4 space-y-6 px-4 sm:-mt-6 sm:px-6">
        {/* Topic chips: mobile e single row scroll */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTopic === t
                  ? "bg-primary-800 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ---------- Featured Learning Guides ---------- */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Featured Learning Guides</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary-700 sm:text-blue-600">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {guides.map((g) => (
              <div
                key={g.title}
                className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white sm:block"
              >
                {/* Image: mobile e left, desktop e top */}
                <div
                  className="w-32 shrink-0 bg-cover bg-center sm:h-28 sm:w-full"
                  style={{ backgroundImage: `url(${g.image})` }}
                />

                {/* Content */}
                <div className="flex min-w-0 flex-1 items-center gap-2 p-3 sm:block sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{g.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{g.desc}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400 sm:mt-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {g.read}
                      </span>
                      <ChevronRight className="hidden h-4 w-4 sm:block" />
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Farming Practices ---------- */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Farming Practices</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary-700 sm:text-blue-600">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {practices.map((p) => (
              <div
                key={p.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 sm:block sm:p-4"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${p.tone}`}
                >
                  <p.icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1 sm:mt-3">
                  <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:mt-1">{p.desc}</p>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400 sm:mt-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {p.read}
                    </span>
                    <ChevronRight className="hidden h-4 w-4 sm:block" />
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" />
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Video Tutorials ---------- */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Video Tutorials</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary-700 sm:text-blue-600">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-4">
            {videos.map((v) => (
              <div key={v.title}>
                <div
                  className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl bg-cover bg-center sm:h-32 sm:rounded-2xl"
                  style={{ backgroundImage: `url(${v.image})` }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary-800 sm:h-10 sm:w-10">
                    <Play className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {v.duration}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-slate-800 sm:text-sm">
                  {v.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        <AskAiBar
          title="Ask CropWise AI"
          subtitle="Get simple explanations, farming tips, or learn more about any topic in Bangla or English."
          placeholder="e.g. What is NDVI?"
        />
      </div>
    </div>
  );
}











