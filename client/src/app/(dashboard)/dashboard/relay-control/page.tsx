"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Power,
  Zap,
  Gauge,
  Clock,
  AlertOctagon,
  ShieldCheck,
  Droplets,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  Sliders,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


function RealRelayControlContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const {
    device,
    isOnline,
    relays,
    toggleRelay,
    refreshData,
    isLoadingData,
  } = useDevice();

  const [togglingRelay1, setTogglingRelay1] = useState(false);
  const [togglingRelay2, setTogglingRelay2] = useState(false);
  const [safetyLock, setSafetyLock] = useState(false);

  const handleToggle1 = async () => {
    if (safetyLock) return;
    setTogglingRelay1(true);
    await toggleRelay(1, !relays.relay1);
    setTogglingRelay1(false);
  };

  const handleToggle2 = async () => {
    if (safetyLock) return;
    setTogglingRelay2(true);
    await toggleRelay(2, !relays.relay2);
    setTogglingRelay2(false);
  };

  const handleAllOff = async () => {
    setTogglingRelay1(true);
    setTogglingRelay2(true);
    await Promise.all([
      toggleRelay(1, false),
      toggleRelay(2, false),
    ]);
    setTogglingRelay1(false);
    setTogglingRelay2(false);
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
              <Power className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "লাইভ পাওয়ার ও মোটর সুইচ" : "Live Power & Actuator Control"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "রিলে ও মোটর কন্ট্রোল" : "Relay Control"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "ESP32 এর সাথে সংযুক্ত ওয়াটার পাম্প (মোটর) এবং সোলেনয়েড ড্রিপ ভালভ আলাদাভাবে অন/অফ করুন।"
                : "Independently switch Relay 1 (Water Motor) and Relay 2 (Solenoid Valve) with real-time power telemetry and safety interlocks."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Instant Power.
            <br />
            Protected Motors.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">

        {/* Emergency Stop Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <AlertOctagon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-rose-950">
                {isBn ? "জরুরি শাটডাউন ও সেফটি ইন্টারলক" : "Emergency Shutoff & Motor Protection"}
              </p>
              <p className="text-xs text-rose-700">
                {isBn
                  ? "যেকোনো জরুরি অবস্থায় এক ক্লিকেই সব পাম্প এবং ভালভ সাথে সাথে বন্ধ করুন।"
                  : "Instant one-click override cuts power to all relays immediately."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSafetyLock(!safetyLock)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                safetyLock
                  ? "border-amber-400 bg-amber-100 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="mr-1.5 inline h-4 w-4" />
              {safetyLock ? (isBn ? "লক সক্রিয়" : "Locked") : (isBn ? "লক অন করুন" : "Lock Switches")}
            </button>

            <button
              onClick={handleAllOff}
              disabled={togglingRelay1 || togglingRelay2}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition hover:bg-rose-700 active:scale-95 disabled:opacity-60"
            >
              {isBn ? "সব বন্ধ করুন (Kill All)" : "Emergency Stop All"}
            </button>
          </div>
        </div>

        {/* Real Relays Dual Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* RELAY 1: Water Pump Motor */}
          <div
            className={`rounded-3xl border p-6 shadow-sm transition-all sm:p-8 ${
              relays.relay1
                ? "border-emerald-500 bg-gradient-to-b from-emerald-50/70 to-white ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                    relays.relay1 ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Power className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {isBn ? "রিলে ১ — ওয়াটার মোটর পাম্প" : "Relay 1 — Irrigation Motor"}
                    </h2>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800">
                      GPIO 26
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isBn ? "১.৫ এইচপি সেন্ট্রিফিউগাল পাম্প" : "1.5 HP Centrifugal Surface Pump"}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  relays.relay1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {relays.relay1State}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>{isBn ? "সক্রিয় চ্যানেল:" : "Active Channel:"}</span>
                <span className="font-semibold text-slate-900">Channel 1 (Main Pump Relay)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{isBn ? "কন্ট্রোল মেথড:" : "Control Method:"}</span>
                <span className="font-semibold text-emerald-700">{isBn ? "সরাসরি ক্লাউড সিগন্যাল" : "Direct Cloud Relay Control"}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleToggle1}
                disabled={togglingRelay1 || safetyLock}
                className={`w-full rounded-2xl py-4 text-sm font-bold shadow-lg transition active:scale-[0.99] disabled:opacity-50 ${
                  relays.relay1
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30"
                }`}
              >
                {togglingRelay1 ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {isBn ? "কমান্ড পাঠানো হচ্ছে..." : "Executing Relay Command..."}
                  </span>
                ) : relays.relay1 ? (
                  isBn ? "মোটর বন্ধ করুন (Turn OFF)" : "Turn Off Water Pump"
                ) : (
                  isBn ? "মোটর চালু করুন (Turn ON)" : "Turn On Water Pump"
                )}
              </button>
            </div>
          </div>

          {/* RELAY 2: Drip Solenoid Valve */}
          <div
            className={`rounded-3xl border p-6 shadow-sm transition-all sm:p-8 ${
              relays.relay2
                ? "border-sky-500 bg-gradient-to-b from-sky-50/70 to-white ring-2 ring-sky-500/20"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                    relays.relay2 ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Droplets className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {isBn ? "রিলে ২ — সোলেনয়েড ড্রিপ ভালভ" : "Relay 2 — Solenoid Valve"}
                    </h2>
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-mono font-bold text-sky-800">
                      GPIO 27
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isBn ? "১২ভি ডিসি বৈদ্যুতিক ভালভ" : "12V DC Normally-Closed Solenoid"}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  relays.relay2 ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {relays.relay2State}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>{isBn ? "সক্রিয় চ্যানেল:" : "Active Channel:"}</span>
                <span className="font-semibold text-slate-900">Channel 2 (Drip Line Solenoid)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{isBn ? "কন্ট্রোল মেথড:" : "Control Method:"}</span>
                <span className="font-semibold text-sky-700">{isBn ? "সরাসরি ক্লাউড সিগন্যাল" : "Direct Cloud Relay Control"}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleToggle2}
                disabled={togglingRelay2 || safetyLock}
                className={`w-full rounded-2xl py-4 text-sm font-bold shadow-lg transition active:scale-[0.99] disabled:opacity-50 ${
                  relays.relay2
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20"
                    : "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/30"
                }`}
              >
                {togglingRelay2 ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {isBn ? "কমান্ড পাঠানো হচ্ছে..." : "Executing Relay Command..."}
                  </span>
                ) : relays.relay2 ? (
                  isBn ? "ভালভ বন্ধ করুন (Close Valve)" : "Close Solenoid Valve"
                ) : (
                  isBn ? "ভালভ খুলুন (Open Valve)" : "Open Solenoid Valve"
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function RelayControlPage() {
  return (
    <DeviceConnectGate
      pageTitle="Relay & Water Motor Control"
      pageSubtitle="Connect your ESP32 device to toggle high-voltage pump relays and solenoid irrigation valves."
    >
      <RealRelayControlContent />
    </DeviceConnectGate>
  );
}
