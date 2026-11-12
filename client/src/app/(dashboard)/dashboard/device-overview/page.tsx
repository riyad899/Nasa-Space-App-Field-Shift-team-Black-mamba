"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Layers,
  Cpu,
  ShieldCheck,
  Radio,
  MapPin,
  HardDrive,
  Settings,
  CheckCircle2,
  Sparkles,
  Wifi,
  Power,
  RefreshCw,
  Key,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";
import Link from "next/link";


function RealDeviceOverviewContent() {
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
  } = useDevice();

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
              <Layers className="h-3.5 w-3.5" />
              {isBn ? "হার্ডওয়্যার ও আর্কিটেকচার ওভারভিউ" : "Hardware & IoT Node Overview"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "ডিভাইস ওভারভিউ" : "Device Overview"}
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-white drop-shadow sm:text-sm sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "আপনার কানেক্টেড ESP32 ডিভাইসের হার্ডওয়্যার তথ্য, অ্যাক্টিভেশন টোকেন, কন্ট্রোল রিলে এবং রিয়েল-টাইম কনফিগারেশন বিবরণী।"
                : "Registered hardware profile, telemetry synchronization state, and live actuator status for your authenticated ESP32 unit."}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/dashboard/device-status"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700"
              >
                <span>{isBn ? "লাইভ স্ট্যাটাস দেখুন" : "View Live Telemetry"}</span>
              </Link>

              <Link
                href="/dashboard/relay-control"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white"
              >
                <Power className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isBn ? "রিলে ও মোটর কন্ট্রোল" : "Relay Control"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Real Hardware Spec Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
                <Cpu className="h-7 w-7" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{device?.name || "ESP32 Master Agro"}</h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    {device?.deviceId || "esp32-001"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isBn ? "ESP32-S3 এগ্রিকালচারাল আইওটি কন্ট্রোলার" : "ESP32-S3 Agricultural Precision Controller"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                {isOnline ? (isBn ? "অনলাইনে সচল" : "Online & Active") : (isBn ? "অফলাইন" : "Offline")}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "ডিভাইস মডেল ও চিপসেট" : "Hardware & Microcontroller"}
              </span>
              <p className="mt-1 text-base font-bold text-slate-800">Espressif ESP32-S3 Dual Core</p>
              <p className="text-xs text-slate-500">240 MHz · 8MB PSRAM · Wi-Fi + BLE 5.0</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "ফার্মওয়্যার সংস্করণ" : "Firmware Build"}
              </span>
              <p className="mt-1 text-base font-bold text-slate-800">CropSense v3.2.0-Production</p>
              <p className="text-xs text-slate-500">JSON REST Telemetry & Relay Polling</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "অথেনটিকেশন টোকেন" : "Auth Session Token"}
              </span>
              <p className="mt-1 text-base font-mono font-bold text-slate-800 truncate">
                {device?.token || "tok_authenticated_esp32_master"}
              </p>
              <p className="text-xs text-emerald-600 font-medium">
                {isBn ? "ভেরিফাইড কানেক্টেড" : "Verified & Active"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "সংযুক্ত রিলে অ্যাকচুয়েটর" : "Connected Actuators"}
              </span>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{isBn ? "রিলে ১: পানির মোটর (Water Pump)" : "Relay 1: Water Motor"}</span>
                  <span className={`font-bold ${relays.relay1 ? "text-emerald-600" : "text-slate-500"}`}>{relays.relay1State}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{isBn ? "রিলে ২: সলিনয়েড ভাল্ব (Drip Valve)" : "Relay 2: Solenoid Valve"}</span>
                  <span className={`font-bold ${relays.relay2 ? "text-emerald-600" : "text-slate-500"}`}>{relays.relay2State}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "সক্রিয় সেন্সর অ্যারে" : "Active Sensor Array"}
              </span>
              <ul className="mt-2 space-y-1 text-xs text-slate-700">
                <li>• {isBn ? "ডিএইচটি২২/এসএইচটি৩১ ডিজিটাল আর্দ্রতা ও তাপমাত্রা" : "DHT22 / SHT31 Temp & Humidity"}</li>
                <li>• {isBn ? "ক্যাপাসিটিভ মৃত্তিকা আর্দ্রতা প্রোব (Raw ADC)" : "Capacitive Soil Moisture Probe (Raw)"}</li>
                <li>• {isBn ? "রেইনড্রপ সেন্সর মডিউল (Raw ADC)" : "Raindrop Detection Module (Raw)"}</li>
                <li>• {isBn ? "নিও-৬এম জিপিএস পজিশনিং ইউনিট" : "NEO-6M GPS Module (Lat/Lng/Alt)"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isBn ? "টেলিমিতির হার ও ফ্রিকোয়েন্সি" : "Telemetry Transmission Rate"}
              </span>
              <p className="mt-1 text-base font-bold text-slate-800">Every 15s / 5m Interval</p>
              <p className="text-xs text-slate-500">
                {isBn ? "অফলাইন টাইমআউট থ্রেশহোল্ড: ৭৫ সেকেন্ড" : "Offline timeout threshold: 75 seconds"}
              </p>
            </div>
          </div>
        </div>

        {/* Live Action Quick Links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/relay-control"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Power className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold text-emerald-600">Open &rarr;</span>
            </div>
            <h3 className="mt-3 font-bold text-slate-900">{isBn ? "রিলে সুইচ ও মোটর কন্ট্রোল" : "Relay Control"}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn ? "লাইভ পানির মোটর ও ড্রিপ সেচের সলিনয়েড ভাল্ব চালু বা বন্ধ করুন" : "Toggle pump and solenoid valve actuators instantly"}
            </p>
          </Link>

          <Link
            href="/dashboard/sensor-monitoring"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition">
                <Radio className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold text-sky-600">Open &rarr;</span>
            </div>
            <h3 className="mt-3 font-bold text-slate-900">{isBn ? "সেন্সর পর্যবেক্ষণ" : "Sensor Monitoring"}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn ? "তাপমাত্রা, আর্দ্রতা এবং মাটির রস পর্যবেক্ষণ করুন" : "Inspect soil moisture, temperature, humidity and rainfall metrics"}
            </p>
          </Link>

          <Link
            href="/dashboard/device-settings"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-500 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Settings className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold text-purple-600">Open &rarr;</span>
            </div>
            <h3 className="mt-3 font-bold text-slate-900">{isBn ? "ডিভাইস সেটিংস" : "Device Settings"}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn ? "ডিভাইস সিক্রেট কী ও ব্যাকএন্ড গেটওয়ে কনফিগার করুন" : "Manage API keys, safety cutoffs and gateway configurations"}
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function DeviceOverviewPage() {
  return (
    <DeviceConnectGate
      pageTitle="Device Overview & Hardware Registry"
      pageSubtitle="Connect your ESP32 device with Name & Secret Key to view registered hardware specifications and active channels."
    >
      <RealDeviceOverviewContent />
    </DeviceConnectGate>
  );
}
