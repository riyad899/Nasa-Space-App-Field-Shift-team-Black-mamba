"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  LogOut,
  LogIn,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import UserAvatar from "@/Components/common/UserAvatar";

interface DashboardNavbarProps {
  onToggleSidebar?: () => void;
  children?: React.ReactNode;
  /** When true the navbar floats above content with a transparent background */
  transparent?: boolean;
}

export default function DashboardNavbar({
  children,
  transparent,
}: DashboardNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/dashboard");
  };

  // ── Style tokens (solid ↔ transparent) ──
  const headerCls = transparent
    ? "absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between gap-3 border-none bg-transparent px-4 sm:px-6"
    : "relative flex h-16 items-center justify-between gap-3 border-b border-primary-100 bg-white px-4 sm:px-6";

  const iconBtn = transparent
    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 hover:bg-white/20 md:hidden"
    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden";

  const langWrap = transparent ? "bg-white/20" : "bg-slate-100";
  const enCls =
    lang === "EN"
      ? "bg-white text-slate-800 shadow-sm"
      : transparent
      ? "text-white/70"
      : "text-slate-400";
  const bnCls =
    lang === "BN"
      ? transparent
        ? "bg-white/90 text-primary-800 shadow-sm"
        : "bg-primary-700 text-white shadow-sm"
      : transparent
      ? "text-white/70"
      : "text-slate-400";

  const bellCls = transparent
    ? "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/20"
    : "flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100";

  const avatarBtn = transparent
    ? "flex h-9 items-center gap-2 rounded-full pl-0.5 pr-2 hover:bg-white/10 transition"
    : "flex h-9 items-center gap-2 rounded-full pl-0.5 pr-2 hover:bg-slate-100 transition";

  const nameCls = transparent
    ? "hidden text-sm font-medium text-white sm:block"
    : "hidden text-sm font-medium text-slate-700 sm:block";

  const chevCls = transparent
    ? "hidden h-3.5 w-3.5 text-white/60 sm:block"
    : "hidden h-3.5 w-3.5 text-slate-400 sm:block";

  const signInBtnCls = transparent
    ? "inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 shadow-sm active:scale-[0.98]"
    : "inline-flex items-center gap-1.5 rounded-full bg-primary-800 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-primary-900 shadow-sm active:scale-[0.98]";

  const logoutBtnCls = transparent
    ? "inline-flex h-9 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white/90 hover:bg-rose-600 hover:text-white hover:border-transparent transition shadow-sm"
    : "inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition shadow-sm";

  return (
    <header className={headerCls}>
      {/* LEFT: back button + slot content */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button onClick={handleBack} className={iconBtn} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* RIGHT: lang switcher, bell, user/auth section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Language toggle */}
        <div
          className={`flex h-9 items-center rounded-full p-1 text-xs font-semibold ${langWrap}`}
        >
          <button
            onClick={() => setLang("EN")}
            className={`flex h-full items-center rounded-full px-2.5 transition sm:px-3 ${enCls}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("BN")}
            className={`flex h-full items-center rounded-full px-2.5 transition sm:px-3 ${bnCls}`}
          >
            BN
          </button>
        </div>

        {/* Bell */}
        <button className={bellCls} aria-label={t("notifications")}>
          <Bell className="h-5 w-5" />
        </button>

        {/* LOGGED IN: User Profile, Name, Top Corner Logout */}
        {user ? (
          <div className="flex items-center gap-2">
            {/* User Profile dropdown button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={avatarBtn}
                aria-label="User profile menu"
              >
                <UserAvatar user={user} size="sm" />
                <span className={nameCls}>{user.name}</span>
                <ChevronDown className={chevCls} />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {/* User Profile Info Card */}
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

                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{t("profile") || (lang === "BN" ? "আমার প্রোফাইল" : "My Profile")}</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        <span>{lang === "BN" ? "ড্যাশবোর্ড হোম" : "Dashboard Home"}</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("logout")}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Logout Button in top corner */}
            <button
              onClick={handleLogout}
              className={logoutBtnCls}
              title={t("logout")}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">{t("logout")}</span>
            </button>
          </div>
        ) : (
          /* NOT LOGGED IN: No guest badge/sign, display prominent Sign In button */
          <Link
            href="/signin"
            className={signInBtnCls}
            aria-label="Sign In"
          >
            <LogIn className="h-4 w-4" />
            <span>{t("signin") || (lang === "BN" ? "লগইন" : "Sign In")}</span>
          </Link>
        )}
      </div>
    </header>
  );
}