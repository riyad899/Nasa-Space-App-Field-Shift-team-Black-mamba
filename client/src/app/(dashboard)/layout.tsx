"use client";

import DashboardNavbar from "@/Components/modules/Dashboord/DashboardNavbar";
import DashboardSidebar from "@/Components/modules/Dashboord/DashboardSidebar";
import React, { useState } from "react";
import { DashboardHeaderProvider, useDashboardHeader } from "./header-context";
import { LanguageProvider } from "@/lib/language-context";
import { DeviceProvider } from "@/context/device-context";

function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { header, transparentNav } = useDashboardHeader();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7f5]">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          transparent={transparentNav}
        >
          {header}
        </DashboardNavbar>

        {/* When transparent, navbar is `absolute` so it doesn't consume space —
            main fills from y=0 and the hero handles its own top padding. */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeviceProvider>
      <DashboardHeaderProvider>
        <Shell>{children}</Shell>
      </DashboardHeaderProvider>
    </DeviceProvider>
  );
}
