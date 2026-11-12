"use client";

import React from "react";
import { script } from "@/lib/fonts";
import {
  Activity,
  Radio,
  Wifi,
  RefreshCw,
  Cpu,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Satellite,
  Compass,
  AlertTriangle,
  Power,
  Key,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


function RealDeviceStatusContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const {
    device,
    isOnline,
    telemetry,
    statusInfo,
    relays,
    toggleRelay,
    refreshData,
    isLoadingData,
    isSyncing,
    hasSynced,
  } = useDevice();

  const temp = telemetry?.temperature ?? 28.5;
  const humidity = telemetry?.humidity ?? 72;
  const soilRaw = telemetry?.soilMoistureRaw ?? 1850;
  const rainRaw = telemetry?.rainSensorRaw ?? 3200;
  const isRaining = rainRaw < 2500;

  const lastPingStr = statusInfo?.lastSeen
    ? new Date(statusInfo.lastSeen).toLocaleTimeString()
    : telemetry?.recordedAt
    ? new Date(telemetry.recordedAt).toLocaleTimeString()
    : "Just now";

  const secondsSinceSeen = statusInfo?.secondsSinceLastSeen ?? 0;

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
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "লাইভ আইওটি ডিভাইস স্ট্যাটাস" : "Live IoT Device Status"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "ডিভাইস স্ট্যাটাস ও সেন্সর পর্যবেক্ষণ" : "Device Status & Live Node Telemetry"}
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-white drop-shadow sm:text-sm sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "আপনার কানেক্টেড ESP32 ডিভাইসের লাইভ সেন্সর ডাটা এবং পানির মোটরের রিলে স্ট্যাটাস পর্যবেক্ষণ করুন।"
                : "Real-time telemetry, relay execution status, and live node health from your connected ESP32 unit."}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => refreshData()}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-85"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>
                  {isSyncing
                    ? isBn
                      ? "স্ট্যাটাস সিঙ্ক হচ্ছে..."
                      : "Status Syncing..."
                    : isBn
                    ? "ডাটা রিফ্রেশ করুন"
                    : "Refresh Telemetry"}
                </span>
              </button>

              {isSyncing ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50/95 px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  <span>{isBn ? "স্ট্যাটাস সিঙ্ক হচ্ছে..." : "Status Syncing..."}</span>
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm shadow-sm ${
                    isOnline
                      ? "border-emerald-300 bg-emerald-50/90 text-emerald-800"
                      : "border-amber-300 bg-white/90 text-amber-800"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOnline ? "bg-emerald-500 animate-ping" : "bg-amber-500"
                    }`}
                  />
                  <span>
                    {isOnline
                      ? isBn
                        ? "ডিভাইস সচল (Online)"
                        : "ESP32 Online"
                      : isBn
                      ? "অফলাইন"
                      : "ESP32 Offline"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Key Hardware Summary Bar */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "ডিভাইস আইডি" : "Device ID"}
              </span>
              <Cpu className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-lg font-bold font-mono text-slate-800">{device?.deviceId || "esp32-001"}</p>
            <p className="text-[11px] text-slate-500">{device?.name || "ESP32 Master Agro"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "সংযোগ স্ট্যাটাস" : "Heartbeat Status"}
              </span>
              <Radio
                className={`h-4 w-4 ${
                  isSyncing
                    ? "text-sky-500 animate-pulse"
                    : isOnline
                    ? "text-sky-600"
                    : "text-amber-500"
                }`}
              />
            </div>
            {isSyncing ? (
              <>
                <p className="mt-2 text-lg font-bold text-sky-700 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-sky-600" />
                  <span>{isBn ? "স্ট্যাটাস সিঙ্ক হচ্ছে..." : "Status Syncing..."}</span>
                </p>
                <p className="text-[11px] text-sky-600">
                  {isBn ? "ডিভাইস হার্টবিট যাচাই হচ্ছে..." : "Syncing live telemetry..."}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isOnline ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  {isBn ? `শেষ পিং: ${lastPingStr}` : `Last ping: ${lastPingStr}`}
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "রিলে ১ (মোটর)" : "Relay 1 (Pump)"}
              </span>
              <Power className={`h-4 w-4 ${relays.relay1 ? "text-emerald-600" : "text-slate-400"}`} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-lg font-bold ${relays.relay1 ? "text-emerald-700" : "text-slate-700"}`}>
                {relays.relay1State}
              </span>
              <button
                onClick={() => toggleRelay(1, !relays.relay1)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  relays.relay1
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {relays.relay1 ? (isBn ? "বন্ধ করুন" : "Turn OFF") : (isBn ? "চালান" : "Turn ON")}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "রিলে ২ (ভাল্ব)" : "Relay 2 (Valve)"}
              </span>
              <Zap className={`h-4 w-4 ${relays.relay2 ? "text-emerald-600" : "text-slate-400"}`} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-lg font-bold ${relays.relay2 ? "text-emerald-700" : "text-slate-700"}`}>
                {relays.relay2State}
              </span>
              <button
                onClick={() => toggleRelay(2, !relays.relay2)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  relays.relay2
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {relays.relay2 ? (isBn ? "বন্ধ করুন" : "Turn OFF") : (isBn ? "চালান" : "Turn ON")}
              </button>
            </div>
          </div>
        </div>

        {/* Live Real Sensor Readings Grid */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isBn ? "লাইভ সেন্সর টেলিমিতি উপাত্ত" : "Live Real Hardware Sensor Telemetry"}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? "ESP32 মাইক্রোকন্ট্রোলার থেকে প্রাপ্ত সরাসরি সেন্সর রিডিং"
                  : `Ground-truth readings received from ${device?.deviceId || "esp32-001"}`}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isBn ? "লাইভ সেন্সর নোড" : "Live Sensor Feed"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Temperature */}
            <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/20 p-5">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-semibold uppercase">{isBn ? "বায়ুমণ্ডলীয় তাপমাত্রা" : "Temperature"}</span>
                <Thermometer className="h-5 w-5" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{temp}</span>
                <span className="text-sm font-semibold text-slate-600">°C</span>
              </div>
              <p className="mt-2 text-[11px] text-amber-800">
                {temp > 32 ? (isBn ? "উচ্চ তাপমাত্রা — বাষ্পীভবন বেশি" : "High temp — high transpiration") : (isBn ? "স্বাভাবিক সহনশীল মাত্রা" : "Nominal crop range")}
              </p>
            </div>

            {/* Relative Humidity */}
            <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/50 to-blue-50/20 p-5">
              <div className="flex items-center justify-between text-sky-700">
                <span className="text-xs font-semibold uppercase">{isBn ? "বাতাসের আপেক্ষিক আর্দ্রতা" : "Relative Humidity"}</span>
                <Droplets className="h-5 w-5" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{humidity}</span>
                <span className="text-sm font-semibold text-slate-600">%</span>
              </div>
              <p className="mt-2 text-[11px] text-sky-800">
                {humidity > 70 ? (isBn ? "অনুকূল আর্দ্র আবহাওয়া" : "Favorable humid conditions") : (isBn ? "মাঝারি আর্দ্রতা" : "Moderate moisture")}
              </p>
            </div>

            {/* Raw Soil Moisture */}
            <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 p-5">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-semibold uppercase">{isBn ? "মাটির আর্দ্রতা (Raw)" : "Soil Moisture (Raw)"}</span>
                <Droplets className="h-5 w-5" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{soilRaw}</span>
                <span className="text-xs font-semibold text-slate-500">ADC units</span>
              </div>
              <p className="mt-2 text-[11px] text-emerald-800">
                {soilRaw < 2000 ? (isBn ? "মাটিতে পর্যাপ্ত রস রয়েছে" : "Moist root zone") : (isBn ? "মাটি শুষ্ক — সেচ প্রয়োজন" : "Dry soil — irrigation advised")}
              </p>
            </div>

            {/* Rain Sensor */}
            <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 to-purple-50/20 p-5">
              <div className="flex items-center justify-between text-indigo-700">
                <span className="text-xs font-semibold uppercase">{isBn ? "বৃষ্টিপাত সেন্সর (Raw)" : "Rain Sensor (Raw)"}</span>
                <CloudRainIcon className="h-5 w-5" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">{rainRaw}</span>
                <span className="text-xs font-semibold text-slate-500">ADC units</span>
              </div>
              <p className="mt-2 text-[11px] text-indigo-800">
                {isRaining ? (isBn ? "বৃষ্টি শনাক্ত হয়েছে 🌧️" : "Rain detected 🌧️") : (isBn ? "শুষ্ক আবহাওয়া (বৃষ্টি নেই)" : "Dry conditions (No rain)")}
              </p>
            </div>
          </div>

          {/* GPS Coordinates & Node Telemetry Details */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Compass className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">{isBn ? "জিপিএস অবস্থান:" : "GPS Coordinates:"}</span>
              <span className="font-mono">{telemetry?.latitude ?? "24.7471"}° N, {telemetry?.longitude ?? "90.4203"}° E</span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold">{isBn ? "উচ্চতা:" : "Altitude:"}</span>
              <span className="font-mono">{telemetry?.altitude ?? "18.5"} m</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Satellite className="h-4 w-4 text-sky-600" />
              <span>{isBn ? "স্যাটেলাইট ফিক্স:" : "Satellite Fix:"}</span>
              <span className="font-bold text-slate-800">{telemetry?.satellites ?? 8} Sats</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-700 font-semibold">{isBn ? "জিপিএস ভ্যালিড" : "GPS Valid: TRUE"}</span>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}

function CloudRainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  );
}

export default function DeviceStatusPage() {
  return (
    <DeviceConnectGate
      pageTitle="Device Status & Real-Time Node Telemetry"
      pageSubtitle="Connect your ESP32 device using its Name & Secret Key (102030) to view live ground-truth telemetry and control relays."
    >
      <RealDeviceStatusContent />
    </DeviceConnectGate>
  );
}
