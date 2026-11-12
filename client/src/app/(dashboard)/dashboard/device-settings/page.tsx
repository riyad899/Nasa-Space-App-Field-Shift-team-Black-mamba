"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Settings,
  Cpu,
  Power,
  ShieldCheck,
  Save,
  Check,
  RefreshCw,
  Key,
  Radio,
  ExternalLink,
  Wifi,
  Zap,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectModal from "@/Components/modules/Device/DeviceConnectModal";


export default function DeviceSettingsPage() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const {
    device,
    isConnected,
    isOnline,
    disconnectDevice,
    refreshData,
    isLoadingData,
    isSyncing,
  } = useDevice();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState(device?.name || "ESP32 Master Agro");
  const [deviceKey, setDeviceKey] = useState("102030");
  const [maxRuntime, setMaxRuntime] = useState(45);
  const [dryRunProtection, setDryRunProtection] = useState(true);
  const [voltageCutoff, setVoltageCutoff] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
              <Settings className="h-3.5 w-3.5" />
              {isBn ? "ডিভাইস ও মোটর কনফিগারেশন" : "Device & Hardware Settings"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "ডিভাইস সেটিংস" : "Device Settings"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "ESP32 মাইক্রোকন্ট্রোলারের সিক্রেট কী, ক্লাউড কানেকশন, লাইভ সিঙ্ক ও ডিসকানেক্ট অপশন এবং নিরাপত্তা সেটিংস পরিচালনা করুন।"
                : "Manage authentication keys, cloud sync, device disconnect, and motor protection interlocks."}
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6 max-w-4xl mx-auto">

        {/* 1. Device Live Status & Sync / Disconnect Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {isConnected ? (device?.name || "ESP32 Master Agro") : (isBn ? "কোনো ডিভাইস কানেক্ট করা নেই" : "No Device Connected")}
                  </h2>
                  {isConnected && (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-mono font-bold text-emerald-800">
                      {device?.deviceId || "esp32-001"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {isConnected
                    ? isBn
                      ? "ডিভাইসটি সফলভাবে অথেনটিকেট ও সংযুক্ত আছে"
                      : "ESP32 unit is authenticated and communicating with cloud"
                    : isBn
                    ? "রিয়েল-টাইম ডাটা পেতে ডিভাইসটি কানেক্ট করুন"
                    : "Connect your ESP32 hardware to enable real telemetry"}
                </p>
              </div>
            </div>

            {/* Status & Actions: Sync Data & Disconnect (or Connect if disconnected) */}
            <div className="flex items-center gap-2.5">
              {isConnected ? (
                <>
                  {isSyncing ? (
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-300">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                      </span>
                      <span>{isBn ? "স্ট্যাটাস সিঙ্ক হচ্ছে..." : "Status Syncing..."}</span>
                    </span>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        isOnline
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                      {isOnline ? (isBn ? "অনলাইন (Online)" : "Online") : (isBn ? "অফলাইন" : "Offline")}
                    </span>
                  )}

                  {/* Sync Data Button */}
                  <button
                    onClick={() => refreshData()}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-75"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>
                      {isSyncing
                        ? (isBn ? "স্ট্যাটাস সিঙ্ক হচ্ছে..." : "Status Syncing...")
                        : (isBn ? "সিঙ্ক করুন (Sync)" : "Sync Data")}
                    </span>
                  </button>

                  {/* Disconnect Button */}
                  <button
                    onClick={disconnectDevice}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>{isBn ? "ডিসকানেক্ট" : "Disconnect"}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-800"
                >
                  <Radio className="h-4 w-4" />
                  <span>{isBn ? "ডিভাইস কানেক্ট করুন" : "Connect Device"}</span>
                </button>
              )}
            </div>
          </div>

          {isConnected && device && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-500">{isBn ? "কানেক্টের সময়:" : "Connected At:"}</span>
                <p className="mt-0.5 font-semibold text-slate-800">
                  {device.lastConnectedAt ? new Date(device.lastConnectedAt).toLocaleString() : "Just now"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-500">{isBn ? "অ্যাক্টিভেশন টোকেন:" : "Session Token:"}</span>
                <p className="mt-0.5 font-mono font-semibold text-slate-800 truncate">
                  {device.token || "active_token_session"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-500">{isBn ? "টেলিমিতি ফ্রিকোয়েন্সি:" : "Heartbeat Interval:"}</span>
                <p className="mt-0.5 font-semibold text-slate-800">Every 15 Seconds</p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Credentials & Gateway Configuration */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald-600" />
            <span>{isBn ? "ডিভাইস ক্রেডেনশিয়াল ও গেটওয়ে সেটিংস" : "Credentials & Gateway Configuration"}</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {isBn ? "ডিভাইস নাম" : "Device Name"}
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {isBn ? "ডিভাইস আইডি" : "Device ID"}
              </label>
              <input
                type="text"
                disabled
                value={device?.deviceId || "esp32-001"}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-sm font-mono text-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {isBn ? "ডিভাইস সিক্রেট কী (PIN)" : "Device Secret Key / PIN"}
              </label>
              <input
                type="text"
                value={deviceKey}
                onChange={(e) => setDeviceKey(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-emerald-600 mt-1 block">Default production key: 102030</span>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {isBn ? "ক্লাউড গেটওয়ে ইউআরএল" : "IoT Cloud Gateway URL"}
              </label>
              <input
                type="text"
                disabled
                value="https://esp32-iot-cloude-connect.vercel.app"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-mono text-slate-600"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition"
            >
              {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{savedSuccess ? (isBn ? "সংরক্ষিত হয়েছে!" : "Saved!") : (isBn ? "সেটিংস সংরক্ষণ করুন" : "Save Changes")}</span>
            </button>
          </div>
        </div>

        {/* 3. Motor Safety & Cutoffs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>{isBn ? "মোটর ও পাম্প সেফটি ইন্টারলক" : "Motor Safety & Auto-Cutoff Interlocks"}</span>
          </h2>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isBn ? "ড্রাই-রান সুরক্ষা (Dry-Run Protection)" : "Dry-Run Protection"}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn ? "পানির স্তরে প্রবাহ না থাকলে মোটর ৫ মিনিটে স্বয়ংক্রিয়ভাবে বন্ধ হবে" : "Shuts off pump within 5 minutes if no water flow is detected"}
                </p>
              </div>
              <input
                type="checkbox"
                checked={dryRunProtection}
                onChange={(e) => setDryRunProtection(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isBn ? "ভোল্টেজ কাটঅফ (Under/Over Voltage Cutoff)" : "Voltage Fluctuation Cutoff"}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn ? "১৮০V এর নিচে অথবা ২৫০V এর উপরে গেলে মোটর ট্রিপ করবে" : "Protects motor coils against brownouts below 180V or surges above 250V"}
                </p>
              </div>
              <input
                type="checkbox"
                checked={voltageCutoff}
                onChange={(e) => setVoltageCutoff(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isBn ? "সর্বোচ্চ নিরবচ্ছিন্ন চলার সীমা (Max Continuous Runtime)" : "Max Continuous Runtime"}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn ? "একটানা পাম্প চলার পর স্বয়ংক্রিয় বিরতি" : "Automatic cool-off period after extended watering"}
                </p>
              </div>
              <span className="font-bold text-slate-800">{maxRuntime} mins</span>
            </div>
          </div>
        </div>

      </div>

      {/* Connect Modal */}
      <DeviceConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
