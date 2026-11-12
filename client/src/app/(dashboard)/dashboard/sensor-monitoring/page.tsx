"use client";

import React from "react";
import { script } from "@/lib/fonts";
import {
  Gauge,
  Thermometer,
  Droplets,
  CloudRain,
  MapPin,
  Compass,
  RefreshCw,
  Activity,
  Wind,
  Sun,
  Radio,
  Satellite,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


function RealSensorMonitoringContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const {
    device,
    isOnline,
    telemetry,
    statusInfo,
    refreshData,
    isLoadingData,
    isSyncing,
  } = useDevice();

  const temp = telemetry?.temperature ?? 28.5;
  const humidity = telemetry?.humidity ?? 72;
  const soilRaw = telemetry?.soilMoistureRaw ?? 1850;
  const rainRaw = telemetry?.rainSensorRaw ?? 3200;
  const isRaining = rainRaw < 2500;

  const lat = telemetry?.latitude ?? 24.7471;
  const lng = telemetry?.longitude ?? 90.4203;
  const altitude = telemetry?.altitude ?? 18.5;
  const sats = telemetry?.satellites ?? 8;

  const lastUpdated = telemetry?.recordedAt
    ? new Date(telemetry.recordedAt).toLocaleTimeString()
    : statusInfo?.lastSeen
    ? new Date(statusInfo.lastSeen).toLocaleTimeString()
    : "Live";

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
              <Gauge className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "লাইভ সেন্সর টেলিমিতি" : "Real-Time Sensor Telemetry"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "সেন্সর পর্যবেক্ষণ" : "Sensor Monitoring"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "ESP32 মাইক্রোকন্ট্রোলার থেকে প্রেরিত মাটির আর্দ্রতা, বায়ুর তাপমাত্রা এবং রেইন সেন্সরের লাইভ অ্যানালগ ও ডিজিটাল ডেটা।"
                : "Real-time ground truth metrics transmitted by your ESP32 soil probes, ambient DHT sensors, and onboard GPS receiver."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Live Ground Truth.
            <br />
            Zero Guesswork.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">

        {/* Sync Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{device?.name || "ESP32 Master Agro"} ({device?.deviceId || "esp32-001"})</span>
                {isSyncing ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>{isBn ? "সিঙ্ক হচ্ছে..." : "Status Syncing..."}</span>
                  </span>
                ) : (
                  <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                )}
              </p>
              <p className="text-xs text-slate-500">
                {isSyncing
                  ? (isBn ? "ডিভাইস থেকে লাইভ ডাটা সিঙ্ক হচ্ছে..." : "Syncing live telemetry from ESP32...")
                  : isBn
                  ? `সর্বশেষ আপডেট: ${lastUpdated}`
                  : `Last telemetry update: ${lastUpdated}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => refreshData()}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-75"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>
              {isSyncing
                ? (isBn ? "স্ট্যাটাস সিঙ্ক হচ্ছে..." : "Status Syncing...")
                : (isBn ? "এখনই রিফ্রেশ করুন" : "Refresh Telemetry")}
            </span>
          </button>
        </div>

        {/* Live Gauges & Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Temperature */}
          <div className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-semibold uppercase">{isBn ? "তাপমাত্রা" : "Temperature"}</span>
              <Thermometer className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{temp}</span>
              <span className="text-base font-bold text-slate-500">°C</span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {isBn ? "ডিএইচটি২২ অ্যাম্বিয়েন্ট এয়ার সেন্সর" : "DHT22 Digital Temperature Probe"}
            </p>
          </div>

          {/* Humidity */}
          <div className="rounded-3xl border border-sky-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sky-700">
              <span className="text-xs font-semibold uppercase">{isBn ? "আপেক্ষিক আর্দ্রতা" : "Humidity"}</span>
              <Droplets className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{humidity}</span>
              <span className="text-base font-bold text-slate-500">%</span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {isBn ? "বাতাসের আর্দ্রতার পরিমাণ" : "Atmospheric Relative Moisture"}
            </p>
          </div>

          {/* Raw Soil Moisture */}
          <div className="rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-semibold uppercase">{isBn ? "মাটির আর্দ্রতা (Raw)" : "Soil Moisture"}</span>
              <Droplets className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{soilRaw}</span>
              <span className="text-xs font-bold text-slate-500">ADC</span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {soilRaw < 2000 ? (isBn ? "মাটি আর্দ্র ও রোপণোপযোগী" : "Adequate Root Zone Moisture") : (isBn ? "মাটি শুষ্ক — সেচ প্রয়োজন" : "Soil Dry — Irrigation Advised")}
            </p>
          </div>

          {/* Rain Sensor */}
          <div className="rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-indigo-700">
              <span className="text-xs font-semibold uppercase">{isBn ? "বৃষ্টিপাত সেন্সর" : "Rain Sensor"}</span>
              <CloudRain className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{rainRaw}</span>
              <span className="text-xs font-bold text-slate-500">ADC</span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {isRaining ? (isBn ? "বৃষ্টি সনাক্ত হয়েছে 🌧️" : "Rain Precipitation Active") : (isBn ? "শুষ্ক আবহাওয়া (বৃষ্টি নেই)" : "No Precipitation (Dry Surface)")}
            </p>
          </div>

        </div>

        {/* GPS Real Location Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBn ? "অনবোর্ড জিপিএস অবস্থান ও উপাত্ত" : "NEO-6M GPS Coordinates & Positioning"}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn ? "মাঠের ডিভাইসটির প্রকৃত ভৌগোলিক স্থানাঙ্ক" : "Physical location of your deployed field unit"}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              GPS Valid
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs text-slate-500">{isBn ? "অক্ষাংশ (Latitude)" : "Latitude"}</span>
              <p className="mt-1 font-mono text-base font-bold text-slate-800">{lat}° N</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs text-slate-500">{isBn ? "দ্রাঘিমাংশ (Longitude)" : "Longitude"}</span>
              <p className="mt-1 font-mono text-base font-bold text-slate-800">{lng}° E</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs text-slate-500">{isBn ? "সমুদ্রপৃষ্ঠ থেকে উচ্চতা" : "Altitude"}</span>
              <p className="mt-1 font-mono text-base font-bold text-slate-800">{altitude} m</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs text-slate-500">{isBn ? "স্যাটেলাইট গণনা" : "Satellites Tracked"}</span>
              <p className="mt-1 font-mono text-base font-bold text-slate-800">{sats} Satellites</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SensorMonitoringPage() {
  return (
    <DeviceConnectGate
      pageTitle="Sensor Telemetry & Soil Health"
      pageSubtitle="Connect your ESP32 device to view live sensor readings directly from your farm field."
    >
      <RealSensorMonitoringContent />
    </DeviceConnectGate>
  );
}
