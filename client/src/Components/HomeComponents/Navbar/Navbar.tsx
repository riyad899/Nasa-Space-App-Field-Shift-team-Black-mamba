"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Globe,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import UserAvatar from "@/Components/common/UserAvatar";

const navLinks = [
  { labelEn: "Home", labelBn: "হোম", href: "/" },
  { labelEn: "Crops", labelBn: "ফসল", href: "/#crops" },
  { labelEn: "How It Works", labelBn: "কার্যপদ্ধতি", href: "/#how-it-works" },
  { labelEn: "Learn", labelBn: "শিখুন", href: "/dashboard/learn" },
  { labelEn: "About", labelBn: "আমাদের সম্পর্কে", href: "/dashboard/about" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
  };

  const handleHomeClick = () => {
    setOpen(false);
    setMenuOpen(false);
    setLangOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* CropWise AI Logo */}
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 text-left"
          aria-label="Go to CropWise AI home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-white shadow-sm">
            <Leaf className="h-4.5 w-4.5" />
          </span>

          <span>
            <span className="block text-lg font-semibold leading-none text-slate-900">
              CropWise AI
            </span>

            <span className="mt-1 block text-[11px] leading-none text-slate-400">
              {lang === "BN" ? "নাসার তথ্যে আধুনিক কৃষি ও নিরাপত্তা" : "Farms Today. A Safer Tomorrow."}
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-[15px] font-medium transition-colors ${
                i === 0
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {lang === "BN" ? l.labelBn : l.labelEn}

              {i === 0 && (
                <span className="absolute -bottom-[26px] left-0 h-[2px] w-full bg-primary-700" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
              aria-label="Switch language"
              aria-expanded={langOpen}
            >
              <Globe className="h-4 w-4 text-primary-700" />
              <span>{lang === "BN" ? "বাংলা" : "EN"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setLang("EN");
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      lang === "EN"
                        ? "bg-primary-50 text-primary-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <span>English (EN)</span>
                    </span>
                    {lang === "EN" && <Check className="h-3.5 w-3.5 text-primary-700" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang("BN");
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      lang === "BN"
                        ? "bg-primary-50 text-primary-800"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇧🇩</span>
                      <span>বাংলা (BN)</span>
                    </span>
                    {lang === "BN" && <Check className="h-3.5 w-3.5 text-primary-700" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile or Sign In */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((v) => !v);
                    setLangOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:bg-slate-50"
                  aria-label="User menu"
                >
                  <UserAvatar user={user} size="sm" />

                  <span className="max-w-[130px] truncate text-sm font-medium text-slate-700">
                    {user.name}
                  </span>

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                      {/* User Card */}
                      <div className="border-b border-slate-100 px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar user={user} size="md" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Navigation inside user menu */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          <span>{lang === "BN" ? "ড্যাশবোর্ডে যান" : "Go to Dashboard"}</span>
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{lang === "BN" ? "আমার প্রোফাইল" : "My Profile"}</span>
                        </Link>
                      </div>

                      {/* Logout button */}
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{lang === "BN" ? "লগআউট" : "Log out"}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Explicit top corner logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                title={lang === "BN" ? "লগআউট" : "Log out"}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">{lang === "BN" ? "লগআউট" : "Log out"}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-primary-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-900 active:scale-[0.98]"
            >
              {lang === "BN" ? "লগইন" : "Sign In"}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-primary-100 bg-white px-5 py-4 md:hidden">
          {/* Mobile Language Switcher */}
          <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 p-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Globe className="h-4 w-4 text-primary-700" />
              <span>Language:</span>
            </div>
            <div className="flex rounded-lg bg-white p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setLang("EN")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  lang === "EN" ? "bg-primary-700 text-white shadow" : "text-slate-600"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("BN")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  lang === "BN" ? "bg-primary-700 text-white shadow" : "text-slate-600"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                {lang === "BN" ? l.labelBn : l.labelEn}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="mt-3 space-y-2 border-t border-primary-100 pt-3">
              <div className="flex items-center gap-2.5 px-3">
                <UserAvatar user={user} size="md" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-primary-700 py-2.5 text-center text-xs font-semibold text-white"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {lang === "BN" ? "ড্যাশবোর্ড" : "Dashboard"}
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2.5 text-center text-xs font-semibold text-slate-700"
                >
                  <User className="h-3.5 w-3.5" />
                  {lang === "BN" ? "প্রোফাইল" : "Profile"}
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                {lang === "BN" ? "লগআউট" : "Log out"}
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary-700 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              {lang === "BN" ? "লগইন" : "Sign In"}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}