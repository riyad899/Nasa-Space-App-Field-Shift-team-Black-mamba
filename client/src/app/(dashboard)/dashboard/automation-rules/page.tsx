"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  Cpu,
  Sliders,
  Droplets,
  CloudRain,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Plus,
  Power,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


interface AutomationRule {
  id: string;
  name: string;
  conditionSensor: string;
  conditionOperator: "<" | ">" | "==";
  conditionValue: string;
  actionRelay: string;
  actionState: "ON" | "OFF";
  actionDuration?: string;
  active: boolean;
  triggersToday: number;
  icon: any;
  color: string;
}

function AutomationRulesContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "RULE-1",
      name: isBn ? "শুষ্ক মাটিতে স্বয়ংক্রিয় সেচ" : "Low Soil Moisture Auto-Irrigation",
      conditionSensor: isBn ? "মাটির আর্দ্রতা (Soil Moisture)" : "Soil Moisture Probe A1",
      conditionOperator: "<",
      conditionValue: "35% VWC",
      actionRelay: "Relay 1 (Water Motor)",
      actionState: "ON",
      actionDuration: isBn ? "৩০ মিনিটের জন্য" : "for 30 mins",
      active: true,
      triggersToday: 3,
      icon: Droplets,
      color: "emerald",
    },
    {
      id: "RULE-2",
      name: isBn ? "বৃষ্টি হলে সাথে সাথে পাম্প বন্ধ" : "Rain Detection Emergency Cutoff",
      conditionSensor: isBn ? "বৃষ্টি সেন্সর (Optical Rain Sensor)" : "Rain Sensor Array",
      conditionOperator: ">",
      conditionValue: "0 mm (Wet)",
      actionRelay: "Relay 1 & Relay 2",
      actionState: "OFF",
      actionDuration: isBn ? "বৃষ্টি থামা পর্যন্ত" : "until dry",
      active: true,
      triggersToday: 1,
      icon: CloudRain,
      color: "sky",
    },
    {
      id: "RULE-3",
      name: isBn ? "অতিরিক্ত গরমে মিস্টিং স্প্রিংকলার" : "Excess Heat Greenhouse Misting",
      conditionSensor: isBn ? "বাতাসের তাপমাত্রা (Ambient Temp)" : "Field Weather Temp",
      conditionOperator: ">",
      conditionValue: "38.0 °C",
      actionRelay: "Relay 2 (Solenoid Valve)",
      actionState: "ON",
      actionDuration: isBn ? "১০ মিনিটের জন্য" : "for 10 mins",
      active: true,
      triggersToday: 2,
      icon: Thermometer,
      color: "amber",
    },
    {
      id: "RULE-4",
      name: isBn ? "পানি জমে যাওয়া রোধে কাট-অফ" : "Waterlogging Root Rot Protection",
      conditionSensor: isBn ? "রুট-জোন স্যাচুরেশন (Root Zone)" : "Root Zone Saturation",
      conditionOperator: ">",
      conditionValue: "75% VWC",
      actionRelay: "Relay 1 (Water Motor)",
      actionState: "OFF",
      actionDuration: isBn ? "অস্থায়ী লক" : "safety lockout",
      active: false,
      triggersToday: 0,
      icon: ShieldAlert,
      color: "rose",
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
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
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "স্মার্ট সেন্সর-ট্রিগারড অটোমেশন" : "Sensor-Driven Autonomous Control"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "অটোমেশন রুলস" : "Automation Rules"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "সেন্সরের ডেটা অনুযায়ী রিলে এবং পাম্প স্বয়ংক্রিয়ভাবে অন/অফ করার শর্তাবলী তৈরি ও পরিচালনা করুন।"
                : "Create intelligent IF-THIS-THEN-THAT triggers to automatically control irrigation based on live temperature, moisture, and rain sensors."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Autonomous Fields.
            <br />
            Continuous Care.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">

        {/* Top bar with stats & add button */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-800">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {isBn ? "৪ টি স্বয়ংক্রিয় অটোমেশন রুল কনফিগার করা" : "4 Active Field Logic Rules Configured"}
              </p>
              <p className="text-xs text-slate-500">
                {isBn ? "আজকে মোট ৬ বার স্বয়ংক্রিয়ভাবে ট্রিগার হয়েছে" : "Triggered 6 times autonomously today"}
              </p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 rounded-xl bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-primary-800">
            <Plus className="h-4 w-4" />
            {isBn ? "নতুন অটোমেশন রুল যুক্ত করুন" : "Add Automation Rule"}
          </button>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.id}
                className={`relative overflow-hidden rounded-3xl border p-5 transition-all duration-200 ${
                  rule.active
                    ? "border-slate-200 bg-white shadow-sm hover:shadow-md"
                    : "border-slate-200/60 bg-slate-50/70 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        rule.color === "emerald"
                          ? "bg-emerald-100 text-emerald-700"
                          : rule.color === "sky"
                          ? "bg-sky-100 text-sky-700"
                          : rule.color === "amber"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">
                        {rule.id} · {isBn ? "আজকে" : "Today"}: {rule.triggersToday} {isBn ? "বার ট্রিগার" : "triggers"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      rule.active ? "bg-primary-700" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={rule.active}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* IF THEN visualization */}
                <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-3 sm:grid-cols-2 sm:gap-4 border border-slate-100">
                  <div className="space-y-1">
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase border border-slate-200">
                      IF (শর্ত / Condition)
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {rule.conditionSensor}
                    </p>
                    <p className="text-xs font-bold text-primary-700">
                      {rule.conditionOperator} {rule.conditionValue}
                    </p>
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase border border-slate-200">
                      THEN (পদক্ষেপ / Action)
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {rule.actionRelay}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`font-bold ${
                          rule.actionState === "ON" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        SET {rule.actionState}
                      </span>
                      {rule.actionDuration && (
                        <span className="text-slate-500">({rule.actionDuration})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default function AutomationRulesPage() {
  return (
    <DeviceConnectGate
      pageTitle="Sensor Automation Rules"
      pageSubtitle="Connect your ESP32 device to configure threshold-triggered automated watering and relay rules."
    >
      <AutomationRulesContent />
    </DeviceConnectGate>
  );
}
