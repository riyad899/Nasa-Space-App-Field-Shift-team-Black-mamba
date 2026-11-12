"use client";

import React, { useState } from "react";
import {
  X,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Radio,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDevice } from "@/context/device-context";
import { useLanguage } from "@/lib/language-context";

interface DeviceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceConnectModal({
  isOpen,
  onClose,
}: DeviceConnectModalProps) {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const { connectDevice, isConnecting } = useDevice();

  const [deviceName, setDeviceName] = useState("ESP32 Master Agro");
  const [deviceKey, setDeviceKey] = useState("102030");
  const [deviceId, setDeviceId] = useState("esp32-001");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<"idle" | "loading" | "success">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceKey.trim()) {
      setErrorMessage(isBn ? "অনুগ্রহ করে ডিভাইসের সিক্রেট কী দিন" : "Please enter the device secret key");
      return;
    }

    setErrorMessage(null);
    setStatusState("loading");

    try {
      const ok = await connectDevice(deviceName, deviceKey, deviceId);
      if (ok) {
        setStatusState("success");
        setTimeout(() => {
          setStatusState("idle");
          onClose();
        }, 1200);
      } else {
        setStatusState("idle");
        setErrorMessage(isBn ? "ডিভাইস কী ভুল হয়েছে। সঠিক কী (102030) দিন।" : "Invalid device key. Default key is 102030.");
      }
    } catch (err: any) {
      setStatusState("idle");
      setErrorMessage(err?.message || (isBn ? "কানেকশন ব্যর্থ হয়েছে।" : "Connection failed. Please retry."));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (statusState !== "loading") onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7 z-10">
        {/* Close Button */}
        {statusState !== "loading" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* State: SUCCESS */}
        {statusState === "success" ? (
          <div className="py-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isBn ? "ডিভাইস সফলভাবে কানেক্ট হয়েছে!" : "Device Connected Successfully!"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {isBn
                ? "সাইডবারে সকল ডিভাইস টুল সক্রিয় করা হয়েছে।"
                : "All IoT device channels and telemetry are now unlocked."}
            </p>
          </div>
        ) : statusState === "loading" ? (
          /* State: LOADING */
          <div className="py-8 text-center animate-in fade-in duration-200">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isBn ? "ESP32 এর সাথে কানেক্ট হচ্ছে..." : "Connecting to ESP32..."}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {isBn ? "সিক্রেট কী এবং ফার্মওয়্যার ভেরিফাই করা হচ্ছে" : "Verifying secret key & session token with gateway"}
            </p>
          </div>
        ) : (
          /* State: IDLE / FORM */
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isBn ? "ডিভাইস কানেক্ট করুন" : "Connect ESP32 Device"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? "ডিভাইসের নাম এবং সিক্রেট কী প্রদান করুন" : "Enter device name and secret PIN / key"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  {isBn ? "ডিভাইস নাম (Device Name)" : "Device Name"}
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="ESP32 Master Agro"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Cpu className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isBn ? "সিক্রেট কী (Secret Key)" : "Secret Key / PIN"}
                  </label>
                  <span className="text-[11px] font-medium text-emerald-600">
                    {isBn ? "ডিফল্ট: 102030" : "Default: 102030"}
                  </span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="password"
                    required
                    value={deviceKey}
                    onChange={(e) => setDeviceKey(e.target.value)}
                    placeholder="102030"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Key className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Advanced toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
                >
                  {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  <span>{isBn ? "উন্নত সেটিংস (Device ID)" : "Advanced (Device ID)"}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-1.5">
                    <input
                      type="text"
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                      placeholder="esp32-001"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-1.5 text-xs font-mono text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] disabled:opacity-60"
                >
                  {isBn ? "কানেক্ট করুন" : "Connect Device"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
