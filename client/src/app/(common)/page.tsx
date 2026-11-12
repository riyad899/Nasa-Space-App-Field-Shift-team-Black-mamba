"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ArrowRight,
  Sparkles,
  Droplet,
  Users,
  Globe2,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");

  const isBn = lang === "BN";

  const handleAskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/dashboard/ask-ai?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/dashboard/crop-rotation");
    }
  };

  const stages = [
    {
      label: isBn ? "সুস্থ ফসল" : "Healthier Crops",
      active: true,
    },
    {
      label: isBn ? "শক্তিশালী সমাজ" : "Stronger Communities",
      active: false,
    },
    {
      label: isBn ? "উজ্জ্বল ভবিষ্যৎ" : "A Resilient Tomorrow",
      active: false,
    },
  ];

  const features = [
    {
      icon: Leaf,
      text: isBn ? "উপাত্ত-ভিত্তিক কৃষি পরামর্শ" : "Data-driven farming advice",
    },
    {
      icon: Droplet,
      text: isBn ? "জলবায়ু-সহনশীল সিদ্ধান্ত" : "Climate-resilient decisions",
    },
    {
      icon: Users,
      text: isBn ? "উন্নত সমাজের জন্য সহায়তা" : "Support for healthier communities",
    },
    {
      icon: Globe2,
      text: isBn ? "মহাকাশ থেকে মাটি — বাস্তব প্রভাব" : "Real impact from space to soil",
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#fbfaf7]">

      {/* ================================================= */}
      {/*                    HERO CONTENT                   */}
      {/* ================================================= */}

      <section className="mx-auto h-[58%] max-w-7xl px-5 pt-7 sm:px-8 lg:pt-8">

        {/* ================= MAIN CONTENT ================= */}

        <div className="flex h-full flex-col items-center text-center">

          {/* NASA Label */}
          <p className="text-[10px] font-medium tracking-[0.2em] text-slate-400 sm:text-xs uppercase">
            {isBn ? "নাসা আর্থ ডেটা দ্বারা চালিত" : "POWERED BY NASA EARTH DATA"}
          </p>

          {/* Heading */}
          <h1 className="mt-2 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {isBn ? "উন্নত তথ্য" : "Better Information"}
            <br />
            <span className="text-[#147a55]">
              {isBn ? "সমৃদ্ধ ফসল" : "Brighter Harvests"}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            {isBn
              ? "ক্রপওয়াইজ এআই স্যাটেলাইটের তথ্যকে সহজ এবং কার্যকর অন্তর্দৃষ্টিতে রূপান্তর করে, যাতে কৃষকরা আত্মবিশ্বাসের সাথে পরিকল্পনা করতে এবং ফলন বাড়াতে পারেন।"
              : "CropWise AI turns satellite data into simple, practical insights so farmers can adapt, plan, and grow with confidence."}
          </p>

          {/* ================= SEARCH & ACTION ================= */}

          <div className="mt-5 flex w-full max-w-2xl flex-col items-center justify-center gap-2.5 sm:flex-row">

            <form
              onSubmit={handleAskSubmit}
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-4 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
            >
              <Leaf className="h-4 w-4 flex-shrink-0 text-[#147a55]" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isBn ? "আজ আপনি কী জানতে চান?" : "What would you like to do today?"}
                className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none sm:text-sm"
              />

              <button
                type="submit"
                aria-label="Search and ask AI"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e5f1eb] text-[#147a55] transition hover:bg-[#d4e9df] active:scale-95 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => router.push("/dashboard/crop-rotation")}
              className="flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#147a55] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0f6345] active:scale-95 sm:text-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {isBn ? "শুরু করুন" : "Let's try"}
            </button>

          </div>


          {/* ================= FEATURES ================= */}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-600 sm:gap-x-8 sm:text-xs">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.text}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-[#147a55]" />
                  <span>{feature.text}</span>
                </div>
              );
            })}

          </div>


          {/* ================= STAGES ================= */}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">

            {stages.map((stage, index) => (
              <React.Fragment key={stage.label}>

                <div className="flex items-center gap-2">

                  <span
                    className={`h-3 w-3 flex-shrink-0 rounded-full border-2 ${
                      stage.active
                        ? "border-[#147a55] bg-[#147a55]"
                        : "border-slate-300 bg-[#fbfaf7]"
                    }`}
                  />

                  <span
                    className={`text-xs ${
                      stage.active
                        ? "font-semibold text-[#173d2a]"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </span>

                </div>

                {index < stages.length - 1 && (
                  <span className="hidden h-px w-8 bg-slate-200 sm:block" />
                )}

              </React.Fragment>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/*              FULL WIDTH IMAGE                     */}
      {/* ================================================= */}

      <section className="relative h-[42%] min-h-[280px] w-full overflow-hidden">

        {/* Image */}

        <div
          className="absolute inset-0 bg-cover bg-[center_15%] bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://i.ibb.co.com/spZxWQ7q/Chat-GPT-Image-Sep-24-2026-06-05-14-PM.png')",
          }}
        />

        {/* Top Fade */}

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fbfaf7] via-[#fbfaf7]/40 to-transparent" />

        {/* Bottom Overlay */}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#173d2a]/70 to-transparent" />


        {/* ================= IMAGE TEXT ================= */}

        <div className="absolute left-6 top-6 sm:left-10 sm:top-8 lg:left-14">

          <p className="font-serif text-sm italic leading-5 text-white drop-shadow-md sm:text-base">
            {isBn ? "মহাকাশের উপাত্ত থেকে" : "From Space Data"}
            <br />
            {isBn ? "আরও সমৃদ্ধ খামার" : "to Stronger Farms"}
          </p>

          <div className="mt-1.5 h-px w-20 bg-white/70" />

        </div>


        {/* ================= NASA BADGE ================= */}

        <div className="absolute bottom-4 right-5 flex items-center gap-2 rounded-full bg-[#0f2e20]/80 px-3 py-1.5 text-[10px] text-white backdrop-blur-md sm:bottom-5 sm:right-10 sm:text-xs">

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#0f2e20]">
            N
          </span>

          <span>
            {isBn ? "নাসা আর্থ ডেটা দ্বারা পরিচালিত" : "Powered by NASA Earth Data"}
          </span>

        </div>

      </section>

    </div>
  );
}