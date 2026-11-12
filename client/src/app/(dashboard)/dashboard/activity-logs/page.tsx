"use client";

import React, { useState } from "react";
import { script } from "@/lib/fonts";
import {
  History,
  FileText,
  Filter,
  Download,
  Power,
  Clock,
  Mic,
  Cpu,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


interface ActivityLogItem {
  id: string;
  timestamp: string;
  relay: string;
  action: "ON" | "OFF";
  source: "Manual" | "Timer" | "Automation" | "Voice Assistant";
  userOrTrigger: string;
  duration?: string;
  status: "Success" | "Safety Cutoff" | "Warning";
}

function ActivityLogsContent() {
  const { lang } = useLanguage();
  const isBn = lang === "BN";

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const logs: ActivityLogItem[] = [
    {
      id: "LOG-1049",
      timestamp: "Today, 10:45 AM",
      relay: "Relay 1 (Water Motor)",
      action: "OFF",
      source: "Timer",
      userOrTrigger: isBn ? "৩০ মিনিট কাউন্টডাউন শেষ" : "30-min countdown timer expired",
      duration: "30m 00s",
      status: "Success",
    },
    {
      id: "LOG-1048",
      timestamp: "Today, 10:15 AM",
      relay: "Relay 1 (Water Motor)",
      action: "ON",
      source: "Voice Assistant",
      userOrTrigger: isBn ? "ভয়েস কমান্ড: 'পাম্প চালু করো'" : "Voice cmd: 'Turn on water pump'",
      status: "Success",
    },
    {
      id: "LOG-1047",
      timestamp: "Today, 08:30 AM",
      relay: "Relay 2 (Solenoid Valve)",
      action: "OFF",
      source: "Automation",
      userOrTrigger: isBn ? "রুল: তাপমাত্রা স্বাভাবিক অবস্থায় ফিরেছে" : "Rule: Temperature dropped below 35°C",
      duration: "15m 22s",
      status: "Success",
    },
    {
      id: "LOG-1046",
      timestamp: "Today, 08:15 AM",
      relay: "Relay 2 (Solenoid Valve)",
      action: "ON",
      source: "Automation",
      userOrTrigger: isBn ? "রুল: তাপমাত্রা > ৩৮°C" : "Rule: Ambient Temp > 38.0°C trigger",
      status: "Success",
    },
    {
      id: "LOG-1045",
      timestamp: "Today, 06:45 AM",
      relay: "Relay 1 (Water Motor)",
      action: "OFF",
      source: "Timer",
      userOrTrigger: isBn ? "সকালের নিয়মিত শিডিউল শেষ" : "Morning Schedule (06:00 - 06:45 AM)",
      duration: "45m 00s",
      status: "Success",
    },
    {
      id: "LOG-1044",
      timestamp: "Today, 06:00 AM",
      relay: "Relay 1 (Water Motor)",
      action: "ON",
      source: "Timer",
      userOrTrigger: isBn ? "সকালের শিডিউল ট্রিগার" : "Scheduled auto start",
      status: "Success",
    },
    {
      id: "LOG-1043",
      timestamp: "Yesterday, 04:20 PM",
      relay: "Relay 1 (Water Motor)",
      action: "OFF",
      source: "Automation",
      userOrTrigger: isBn ? "রুল: বৃষ্টি সেন্সরে বৃষ্টি সনাক্ত" : "Rule: Rain sensor detected precipitation",
      duration: "08m 10s",
      status: "Safety Cutoff",
    },
    {
      id: "LOG-1042",
      timestamp: "Yesterday, 02:10 PM",
      relay: "Relay 1 (Water Motor)",
      action: "ON",
      source: "Manual",
      userOrTrigger: isBn ? "ড্যাশবোর্ড থেকে রিয়াদ খান" : "Manual switch by Riyad Khan",
      status: "Success",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    if (selectedFilter !== "all" && log.source.toLowerCase() !== selectedFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.relay.toLowerCase().includes(q) ||
        log.userOrTrigger.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
              <History className="h-3.5 w-3.5 animate-pulse" />
              {isBn ? "সম্পূর্ণ ইভেন্ট ও কমান্ড হিস্ট্রি" : "Comprehensive Execution History"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {isBn ? "অ্যাক্টিভিটি লগ" : "Activity Logs"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {isBn
                ? "কখন রিলে অন বা অফ হয়েছে, কে কমান্ড দিয়েছে (ম্যানুয়াল, টাইমার, অটোমেশন রুল বা ভয়েস অ্যাসিস্ট্যান্ট) এবং অপারেশনের সময়কাল পর্যালোচনা করুন।"
                : "Auditable trace of every relay actuation, initiator (Manual, Timer, Automation, Voice Assistant), duration, and safety trip."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Verified Actions.
            <br />
            Full Accountability.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: isBn ? "সব লগ" : "All Events" },
              { id: "manual", label: isBn ? "ম্যানুয়াল" : "Manual" },
              { id: "timer", label: isBn ? "টাইমার" : "Timer" },
              { id: "automation", label: isBn ? "অটোমেশন" : "Automation" },
              { id: "voice assistant", label: isBn ? "ভয়েস" : "Voice" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedFilter === f.id
                    ? "bg-primary-700 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? "লগ খুঁজুন..." : "Search logs..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-primary-600"
              />
            </div>

            <button
              onClick={() => alert("Logs exported to CSV.")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              {isBn ? "রপ্তানি (CSV)" : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">{isBn ? "সময়" : "Timestamp"}</th>
                  <th className="px-5 py-3.5">{isBn ? "আউটপুট" : "Actuator / Relay"}</th>
                  <th className="px-5 py-3.5">{isBn ? "পদক্ষেপ" : "Action"}</th>
                  <th className="px-5 py-3.5">{isBn ? "উৎস (Source)" : "Source / Trigger"}</th>
                  <th className="px-5 py-3.5">{isBn ? "সময়কাল" : "Duration"}</th>
                  <th className="px-5 py-3.5">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="transition hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-600">
                      {log.timestamp}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-900">
                      {log.relay}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          log.action === "ON"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Power className="h-3 w-3" />
                        {log.action}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {log.source === "Manual" && <User className="h-3.5 w-3.5 text-slate-400" />}
                        {log.source === "Timer" && <Clock className="h-3.5 w-3.5 text-sky-500" />}
                        {log.source === "Automation" && <Cpu className="h-3.5 w-3.5 text-amber-500" />}
                        {log.source === "Voice Assistant" && <Mic className="h-3.5 w-3.5 text-purple-500" />}
                        <span className="font-semibold text-slate-800">{log.source}:</span>
                        <span className="text-slate-500">{log.userOrTrigger}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {log.duration || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          log.status === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {log.status === "Success" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ActivityLogsPage() {
  return (
    <DeviceConnectGate
      pageTitle="Actuator & Relay Activity Logs"
      pageSubtitle="Connect your ESP32 device to audit execution logs, emergency trips, and relay switches."
    >
      <ActivityLogsContent />
    </DeviceConnectGate>
  );
}
