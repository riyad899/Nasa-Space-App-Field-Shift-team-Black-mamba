"use client";

import React, { useState, useEffect } from "react";
import { script } from "@/lib/fonts";
import {
  Clock,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  CalendarClock,
  Sparkles,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


interface ScheduleItem {
  id: string;
  name: string;
  relay: string;
  onTime: string;
  offTime: string;
  days: string[];
  active: boolean;
}

function TimersSchedulesContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  // Countdown timer state
  const [countdownMinutes, setCountdownMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isCounting, setIsCounting] = useState(false);
  const [selectedRelay, setSelectedRelay] = useState("Relay 1 (Water Motor)");

  useEffect(() => {
    let interval: any;
    if (isCounting && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [isCounting, secondsRemaining]);

  const handleStartTimer = () => setIsCounting(true);
  const handlePauseTimer = () => setIsCounting(false);
  const handleResetTimer = () => {
    setIsCounting(false);
    setSecondsRemaining(countdownMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Schedules state
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "SCH-1",
      name: isBn ? "সকালের নিয়মিত সেচ" : "Morning Field Irrigation",
      relay: "Relay 1 (Pump)",
      onTime: "06:00 AM",
      offTime: "06:45 AM",
      days: ["Mon", "Wed", "Fri", "Sun"],
      active: true,
    },
    {
      id: "SCH-2",
      name: isBn ? "বিকালে ড্রিপ ও স্প্রিংকলার" : "Evening Greenhouse Misting",
      relay: "Relay 2 (Solenoid)",
      onTime: "05:15 PM",
      offTime: "05:40 PM",
      days: ["Everyday"],
      active: true,
    },
    {
      id: "SCH-3",
      name: isBn ? "মাটির গভীর আর্দ্রতা সাইকেল" : "Deep Subsoil Root Feed",
      relay: "Relay 1 (Pump)",
      onTime: "11:30 PM",
      offTime: "12:15 AM",
      days: ["Sat", "Tue"],
      active: false,
    },
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="pb-24 sm:pb-12">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[300px] overflow-hidden bg-[#fbfcfa] sm:min-h-[320px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_35%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/PG31PycM/Chat-GPT-Image-Sep-24-2026-05-42-01-PM.png')",
            }}
          />
          <div className="absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent sm:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/55 sm:hidden" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 hidden h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent sm:block" />
        </div>

        <div className="relative px-6 pb-20 pt-24 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-lg">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-primary-700 uppercase sm:text-primary-800">
              <CalendarClock className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "স্মার্ট টাইমিং ও রিকারিং শিডিউল" : "Smart Timers & Recurring Cycles"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "টাইমার ও শিডিউল" : "Timers & Schedules"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "কাউন্টডাউন টাইমার সেট করুন অথবা ঘড়ির নির্দিষ্ট সময়ে এবং সপ্তাহের নির্ধারিত দিনে মোটর স্বয়ংক্রিয়ভাবে চালু ও বন্ধ করুন।"
                : "Configure precise countdown timers, automated clock triggers, and recurring day-by-day irrigation cycles."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Precision Timing.
            <br />
            Zero Water Waste.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">

        {/* Top Grid: Countdown Timer + Quick Preset */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Countdown Clock Display */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? "কাউন্টডাউন টাইমার" : "Countdown Timer"}
                </h3>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isCounting ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
              }`}>
                {isCounting ? (isBn ? "চলছে" : "Active") : (isBn ? "স্থগিত" : "Idle")}
              </span>
            </div>

            {/* Circular time presentation */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary-100 bg-primary-50/50 shadow-inner">
                <span className="text-4xl font-black tracking-tight text-slate-800">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {selectedRelay}
              </p>
            </div>

            {/* Target Relay Selector */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {isBn ? "টার্গেট ডিভাইস" : "Target Output"}
              </label>
              <select
                value={selectedRelay}
                onChange={(e) => setSelectedRelay(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-primary-600"
              >
                <option>Relay 1 (Water Motor)</option>
                <option>Relay 2 (Solenoid Valve)</option>
              </select>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-2">
              {!isCounting ? (
                <button
                  onClick={handleStartTimer}
                  className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary-700 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-primary-800"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isBn ? "শুরু করুন" : "Start Timer"}
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-amber-600"
                >
                  <Pause className="h-3.5 w-3.5" />
                  {isBn ? "বিরতি" : "Pause"}
                </button>
              )}

              <button
                onClick={handleResetTimer}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isBn ? "রিসেট" : "Reset"}
              </button>
            </div>
          </div>

          {/* Presets and Recurring Schedules list */}
          <div className="space-y-6 lg:col-span-2">

            {/* Preset durations */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {isBn ? "দ্রুত টাইমার নির্বাচন" : "Quick Duration Presets"}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {isBn ? "ক্লিকের সাথে সাথে কাউন্টডাউন সময় সেট করুন" : "Click any duration to load into the countdown controller"}
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[10, 20, 30, 45, 60, 90, 120].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCountdownMinutes(m);
                      setSecondsRemaining(m * 60);
                      setIsCounting(false);
                    }}
                    className={`rounded-2xl border p-3 text-left transition ${
                      countdownMinutes === m
                        ? "border-primary-500 bg-primary-50/70 text-primary-900 shadow-sm"
                        : "border-slate-100 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <p className="text-base font-bold">{m} {isBn ? "মি." : "min"}</p>
                    <p className="text-[10px] text-slate-500">
                      {m >= 60 ? `${(m / 60).toFixed(1)} hrs` : `${m} minutes`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Timers Table */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? "নির্ধারিত স্বয়ংক্রিয় শিডিউল" : "Clock Schedules"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? "নির্দিষ্ট সময়ে অন এবং অফ করার তালিকা" : "Automatic execution at designated hours of day"}
                  </p>
                </div>

                <button className="flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800 transition hover:bg-primary-100">
                  <Plus className="h-3.5 w-3.5" />
                  {isBn ? "নতুন শিডিউল" : "Add Schedule"}
                </button>
              </div>

              <div className="space-y-3">
                {schedules.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        item.active ? "bg-primary-100 text-primary-800" : "bg-slate-200 text-slate-400"
                      }`}>
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                            {item.relay}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{item.onTime}</span> →{" "}
                          <span className="font-semibold text-slate-700">{item.offTime}</span> · {item.days.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSchedule(item.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          item.active ? "bg-primary-700" : "bg-slate-300"
                        }`}
                        role="switch"
                        aria-checked={item.active}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            item.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function TimersSchedulesPage() {
  return (
    <DeviceConnectGate
      pageTitle="Irrigation Timers & Schedules"
      pageSubtitle="Connect your ESP32 device to set automated motor timers and recurring watering schedules."
    >
      <TimersSchedulesContent />
    </DeviceConnectGate>
  );
}
