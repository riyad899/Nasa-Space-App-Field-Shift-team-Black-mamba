"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardHeaderContextValue {
  header: React.ReactNode;
  setHeader: (node: React.ReactNode) => void;
  transparentNav: boolean;
  setTransparentNav: (v: boolean) => void;
}

const DashboardHeaderContext = createContext<DashboardHeaderContextValue | null>(null);

export function DashboardHeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<React.ReactNode>(null);
  const [transparentNav, setTransparentNav] = useState(false);
  return (
    <DashboardHeaderContext.Provider value={{ header, setHeader, transparentNav, setTransparentNav }}>
      {children}
    </DashboardHeaderContext.Provider>
  );
}

export function useDashboardHeader() {
  const ctx = useContext(DashboardHeaderContext);
  if (!ctx) throw new Error("useDashboardHeader must be used within DashboardHeaderProvider");
  return ctx;
}

/** Drop this inside any dashboard page to render content into the shared top navbar row. */
export function DashboardHeaderSlot({ children }: { children: React.ReactNode }) {
  const { setHeader } = useDashboardHeader();
  React.useEffect(() => {
    setHeader(children);
    return () => setHeader(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);
  return null;
}

/**
 * Mount inside a page to make the navbar transparent/absolute so the hero
 * image bleeds directly behind it. Cleans up automatically on unmount.
 */
export function TransparentNavSlot() {
  const { setTransparentNav } = useDashboardHeader();
  React.useEffect(() => {
    setTransparentNav(true);
    return () => setTransparentNav(false);
  }, [setTransparentNav]);
  return null;
}
