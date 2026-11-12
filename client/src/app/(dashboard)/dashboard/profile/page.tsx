"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { script } from "@/lib/fonts";
import {
  Camera, Pencil, Check, Sprout, MapPin, Target, Clock, Bookmark, BookOpen,
  BarChart3, Settings, Globe, Info, ShieldCheck, LogOut, ChevronRight,
  ChevronDown, Heart,
} from "lucide-react";
import { useAuth, initials } from "@/lib/auth-context";


const stats = [
  { n: 12, label: "Analyses Done", icon: Sprout, tone: "bg-emerald-100 text-emerald-700" },
  { n: 3, label: "Crops Explored", icon: Sprout, tone: "bg-sky-100 text-sky-600" },
  { n: 1, label: "Saved Locations", icon: MapPin, tone: "bg-orange-100 text-orange-500" },
  { n: 5, label: "Learning Guides", icon: Heart, tone: "bg-purple-100 text-purple-600" },
];

const sections = [
  {
    title: "My Farm Settings", icon: Sprout,
    rows: [
      { icon: MapPin, t: "My Locations", s: "Manage your saved farm locations", href: "/locations" },
      { icon: Sprout, t: "Preferred Crops", s: "Set your interested crops", href: "/preferred-crops" },
      { icon: Target, t: "Farming Priorities", s: "e.g. Save Water, Higher Yield, Climate Resilience", href: "/priorities" },
    ],
  },
  {
    title: "My Activity", icon: BarChart3,
    rows: [
      { icon: Clock, t: "Analysis History", s: "View your past analyses and results", href: "/history" },
      { icon: Bookmark, t: "Saved Results", s: "Access your saved recommendations", href: "/saved" },
      { icon: BookOpen, t: "Learning Progress", s: "Track the guides you've explored", href: "/learn/progress" },
    ],
  },
];

const cardCls = "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm";

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-6 flex items-center gap-2.5 px-1 text-[17px] font-semibold text-slate-900 lg:mt-0">
      <Icon className="h-5 w-5 text-primary-800" />
      {children}
    </h2>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, login, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [lang, setLang] = useState("English");

  useEffect(() => {
    if (ready && !user) router.push("/signin");
    if (user) setName(user.name);
  }, [ready, user, router]);

  if (!user) return null;

  const toggleEdit = () => {
    if (editing && name.trim()) login(name.trim(), user.email);
    setEditing(!editing);
  };

  const editBtn = (
    <button
      onClick={toggleEdit}
      className="flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition active:scale-[0.98]"
    >
      {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      {editing ? "Save" : "Edit Profile"}
    </button>
  );

  return (
    <div className="w-full pb-28 lg:pb-8">
      {/* Banner */}
      <div className="relative h-36 overflow-hidden rounded-2xl sm:h-44 lg:h-56">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://i.ibb.co.com/23cWFG8j/Chat-GPT-Image-Sep-24-2026-05-53-43-PM.png")' }}
        />
        <p className={`${script.className} absolute bottom-4 right-4 -rotate-3 text-xl leading-5 text-white drop-shadow sm:text-2xl lg:right-8 lg:text-3xl lg:leading-8`}>
          Healthy Fields
          <br />
          Brighter Tomorrows
        </p>
      </div>

      {/* Avatar + info (text starts BELOW banner) */}
      <div className="-mt-12 flex items-start gap-3 px-3 lg:gap-5 lg:px-6">
        <div className="relative flex-shrink-0">
          <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary-800 text-4xl font-semibold text-white shadow sm:h-28 sm:w-28">
            {initials(user.name)}
          </span>
          <button
            aria-label="Change photo"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow"
          >
            <Camera className="h-4 w-4 text-slate-700" />
          </button>
        </div>

        <div className="min-w-0 flex-1 pt-[3.75rem] sm:pt-14">
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-slate-200 px-2 py-1 text-lg font-bold text-slate-900 outline-none focus:border-primary-400"
            />
          ) : (
            <p className="truncate text-xl font-bold text-slate-900">{user.name}</p>
          )}
          <p className="truncate text-sm text-slate-500">{user.email}</p>
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <Sprout className="h-3.5 w-3.5" /> Farmer &amp; Learner
          </span>
        </div>

        {/* Desktop/tablet: button on the right of the same row */}
        <div className="hidden pt-14 sm:block">{editBtn}</div>
      </div>

      {/* Mobile: button below, right aligned */}
      <div className="mt-3 flex justify-end px-3 sm:hidden">{editBtn}</div>

      {/* Stats */}
      <div className={`${cardCls} mt-4 grid grid-cols-4 divide-x divide-slate-100 py-4 lg:mt-6 lg:py-6`}>
        {stats.map(({ n, label, icon: Icon, tone }) => (
          <div key={label} className="flex flex-col items-center px-1 text-center">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full lg:h-14 lg:w-14 ${tone}`}>
              <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <p className="mt-2 text-xl font-bold text-slate-900 lg:text-2xl">{n}</p>
            <p className="text-[11px] leading-tight text-slate-500 lg:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Mobile: stacked | Large screen: 3 columns */}
      <div className="lg:mt-8 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
        {sections.map(({ title, icon, rows }) => (
          <section key={title}>
            <SectionTitle icon={icon}>{title}</SectionTitle>
            <div className={`${cardCls} divide-y divide-slate-100`}>
              {rows.map(({ icon: Icon, t, s, href }) => (
                <Link key={t} href={href} className="flex items-center gap-3 px-4 py-3.5 transition active:bg-slate-50 lg:hover:bg-slate-50">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-slate-900">{t}</span>
                    <span className="block truncate text-[13px] text-slate-500">{s}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Account & Support */}
        <section>
          <SectionTitle icon={Settings}>Account &amp; Support</SectionTitle>
          <div className={`${cardCls} divide-y divide-slate-100`}>
            <label className="flex items-center gap-3 px-4 py-3.5">
              <Globe className="h-5 w-5 text-slate-500" />
              <span className="flex-1 text-[15px] text-slate-800">Language</span>
              <span className="relative flex items-center">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="appearance-none bg-transparent pr-5 text-[15px] text-slate-700 outline-none"
                >
                  <option>English</option>
                  <option>বাংলা</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-slate-400" />
              </span>
            </label>

            {[
              { icon: Info, t: "Help & Support", href: "/help" },
              { icon: ShieldCheck, t: "Privacy Policy", href: "/privacy" },
            ].map(({ icon: Icon, t, href }) => (
              <Link key={t} href={href} className="flex items-center gap-3 px-4 py-3.5 transition active:bg-slate-50 lg:hover:bg-slate-50">
                <Icon className="h-5 w-5 text-slate-500" />
                <span className="flex-1 text-[15px] text-slate-800">{t}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}

            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-rose-50 lg:hover:bg-rose-50"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="flex-1 text-[15px] text-red-500">Sign Out</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}