"use client";

import React, { useState } from "react";
import {
  Radio,
  ShieldCheck,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useDevice } from "@/context/device-context";
import { useLanguage } from "@/lib/language-context";
import DeviceConnectModal from "./DeviceConnectModal";

interface DeviceConnectGateProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function DeviceConnectGate({
  children,
  pageTitle,
  pageSubtitle,
}: DeviceConnectGateProps) {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const { isConnected, device } = useDevice();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If connected, render page content directly without any top ribbon
  if (isConnected && device) {
    return <>{children}</>;
  }

  // If NOT connected, show a clean, elegant card with a button to open the connect modal
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
          <Radio className="h-8 w-8 animate-pulse text-emerald-600" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          {isBn ? "ডিভাইস কানেকশন প্রয়োজন" : "ESP32 Device Connection Required"}
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {pageTitle || (isBn ? "আপনার ESP32 ডিভাইসটি কানেক্ট করুন" : "Connect Your ESP32 Device")}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {pageSubtitle ||
            (isBn
              ? "মাঠের লাইভ সেন্সর ডাটা দেখতে এবং সেচ পাম্প নিয়ন্ত্রণ করতে প্রথমে ডিভাইসের নাম ও সিক্রেট কী দিয়ে ডিভাইসটি কানেক্ট করুন।"
              : "To view real-time field telemetry and control irrigation relays, please authenticate your ESP32 hardware.")}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-800 active:scale-95"
          >
            <Cpu className="h-4 w-4" />
            <span>{isBn ? "ডিভাইস কানেক্ট করুন" : "Connect Device"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Simple Connection Modal */}
      <DeviceConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
