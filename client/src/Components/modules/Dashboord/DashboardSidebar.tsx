"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Home,
  CloudSun,
  ClipboardCheck,
  HelpCircle,
  BotMessageSquare,
  BookOpen,
  Info,
  Activity,
  Layers,
  Power,
  Clock,
  Cpu,
  Gauge,
  History,
  Mic,
  Settings,
  Radio,
  RotateCcw,
  Satellite,
  GitMerge,
  ChartNoAxesCombined,
} from "lucide-react";

import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { useDevice } from "@/context/device-context";
import DeviceConnectModal from "@/Components/modules/Device/DeviceConnectModal";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const publicNavItems = [
  {
    key: "nav_home",
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    key: "nav_climate_analysis",
    label: "Climate Analysis",
    href: "/dashboard/climate-analysis",
    icon: CloudSun,
  },
  {
    key: "nav_recommendations",
    label: "Recommendations",
    href: "/dashboard/recommendations",
    icon: ClipboardCheck,
  },
  {
    key: "nav_crop_rotation",
    label: "Crop Rotation",
    href: "/dashboard/crop-rotation",
    icon: RotateCcw,
  },
  {
    key: "nav_farm_intelligence",
    label: "Farm Intelligence",
    href: "/dashboard/farm-intelligence",
    icon: Satellite,
  },
  {
    key: "nav_data_fusion",
    label: "Data Fusion",
    href: "/dashboard/data-fusion",
    icon: GitMerge,
  },
  {
    key: "nav_statistical_intelligence",
    label: "Statistical Intelligence",
    href: "/dashboard/statistical-intelligence",
    icon: ChartNoAxesCombined,
  },
  {
    key: "nav_why_this_result",
    label: "Why This Result?",
    href: "/dashboard/why-this-result",
    icon: HelpCircle,
  },
  {
    key: "nav_ask_ai",
    label: "Ask CropWise AI",
    href: "/dashboard/ask-ai",
    icon: BotMessageSquare,
  },
  {
    key: "nav_learn",
    label: "Learn",
    href: "/dashboard/learn",
    icon: BookOpen,
  },
  {
    key: "nav_about",
    label: "About",
    href: "/dashboard/about",
    icon: Info,
  },
] as const;

const authenticatedNavItems = [
  {
    key: "nav_device_status",
    label: "Device Status",
    href: "/dashboard/device-status",
    icon: Activity,
  },
  {
    key: "nav_device_overview",
    label: "Device Overview",
    href: "/dashboard/device-overview",
    icon: Layers,
  },
  {
    key: "nav_relay_control",
    label: "Relay Control",
    href: "/dashboard/relay-control",
    icon: Power,
  },
  {
    key: "nav_timers_schedules",
    label: "Timers & Schedules",
    href: "/dashboard/timers-schedules",
    icon: Clock,
  },
  {
    key: "nav_automation_rules",
    label: "Automation Rules",
    href: "/dashboard/automation-rules",
    icon: Cpu,
  },
  {
    key: "nav_sensor_monitoring",
    label: "Sensor Monitoring",
    href: "/dashboard/sensor-monitoring",
    icon: Gauge,
  },
  {
    key: "nav_activity_logs",
    label: "Activity Logs",
    href: "/dashboard/activity-logs",
    icon: History,
  },
  {
    key: "nav_voice_assistant",
    label: "Voice Assistant",
    href: "/dashboard/voice-assistant",
    icon: Mic,
  },
  {
    key: "nav_device_settings",
    label: "Device Settings",
    href: "/dashboard/device-settings",
    icon: Settings,
  },
] as const;

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { isConnected } = useDevice();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const activeNavItems = user && isConnected
    ? [...publicNavItems, ...authenticatedNavItems]
    : publicNavItems;

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-slate-50 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Desktop Logo */}
        <div className="flex h-[76px] items-center px-2">
          <Link href="/" className="relative flex items-center">
            <Image
              src="/Green%20Leaf.png"
              alt="CropWise AI"
              width={60}
              height={60}
              className="h-auto w-14 shrink-0 object-contain"
              style={{ height: "auto" }}
              priority
            />

            <div className="absolute left-[55px] top-1/2 -translate-y-1/2 whitespace-nowrap">
              <span className="block text-[20px] font-semibold leading-none text-slate-900">
                CropWise AI
              </span>

              <span className="mt-1 block text-[9px] leading-none text-primary-600">
                {t("tagline")}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                    ? "bg-primary-50 font-medium text-primary-800"
                    : "font-normal text-slate-600 hover:bg-primary-50/60"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-700" : "text-slate-400"
                    }`}
                />

                {t(item.key as any, item.label)}
              </Link>
            );
          })}

          {user && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  {lang === "BN" ? "ফিল্ড ও আইওটি টুলস" : "Connected IoT & AI"}
                </p>
              </div>

              {!isConnected ? (
                <div className="px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(true)}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-emerald-500/60 bg-emerald-50/80 px-3 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 hover:border-emerald-600 active:scale-[0.98]"
                  >
                    <Radio className="h-4 w-4 text-emerald-600 animate-pulse shrink-0" />
                    <span className="truncate">{lang === "BN" ? "ডিভাইস কানেক্ট করুন" : "Connect Device"}</span>
                  </button>
                </div>
              ) : (
                authenticatedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                          ? "bg-primary-50 font-medium text-primary-800"
                          : "font-normal text-slate-600 hover:bg-primary-50/60"
                        }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-700" : "text-slate-400"
                          }`}
                      />

                      {t(item.key as any, item.label)}
                    </Link>
                  );
                })
              )}
            </>
          )}
        </nav>

        {/* Desktop Bottom Section */}
        <div className="relative h-[106px] bg-[#f4f8fb] px-4 py-3">
          <img
            src="/Leaf.png"
            alt=""
            className="pointer-events-none absolute bottom-1 right-[70px] top-[-100px] h-[200px] w-[140px] object-contain mix-blend-multiply"
          />

          <div className="relative z-10 ml-12 mt-[-30px] pt-[-50px]">
            <p className="max-w-[150px] text-[11px] font-medium leading-[1.25] text-[#163b36]">
              {lang === "BN"
                ? "কৃষকদের জন্য জলবায়ু-সহনশীল ভবিষ্যৎ"
                : "A Climate-Resilient Future for Farmers"}
            </p>

            <p className="mt-2 max-w-[155px] text-[9px] leading-[1.35] text-slate-500">
              {lang === "BN"
                ? "পৃথিবীর উপাত্ত। স্থানীয় অগ্রগতি। সমৃদ্ধ খামার।"
                : "Earth data. Local impact. Stronger farms."}
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM SIDEBAR
          ONLY ICONS - NO HAMBURGER
          ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-[64px] items-center justify-around overflow-x-auto border-t border-slate-200 bg-[#fbfaf7]/95 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-400 hover:bg-primary-50 hover:text-primary-700"
                }`}
            >
              <Icon className="h-[21px] w-[21px]" />
            </Link>
          );
        })}

        {user && !isConnected && (
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(true)}
            aria-label="Connect Device"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300"
          >
            <Radio className="h-[21px] w-[21px] animate-pulse" />
          </button>
        )}
      </nav>

      {/* Device Connection Modal */}
      <DeviceConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </>
  );
}