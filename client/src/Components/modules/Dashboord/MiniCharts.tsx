"use client";

import React from "react";

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export function MiniBarChart({
  hist, recent, max, lightColor, darkColor,
}: { hist: number[]; recent: number[]; max: number; lightColor: string; darkColor: string }) {
  return (
    <svg viewBox="0 0 300 140" className="w-full">
      {MONTHS.map((m, i) => {
        const x = i * 50 + 10;
        const hHist = (hist[i] / max) * 110;
        const hRecent = (recent[i] / max) * 110;
        return (
          <g key={m}>
            <rect x={x} y={120 - hHist} width="14" height={hHist} rx="2" fill={lightColor} />
            <rect x={x + 16} y={120 - hRecent} width="14" height={hRecent} rx="2" fill={darkColor} />
            <text x={x + 15} y="134" fontSize="9" textAnchor="middle" fill="#94a3b8">{m}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function MiniLineChart({
  hist, recent, min, max, lightColor, darkColor,
}: { hist: number[]; recent: number[]; min: number; max: number; lightColor: string; darkColor: string }) {
  const toPoints = (arr: number[]) =>
    arr.map((v, i) => `${i * 60 + 10},${120 - ((v - min) / (max - min)) * 110}`).join(" ");
  return (
    <svg viewBox="0 0 300 140" className="w-full">
      <polyline points={toPoints(hist)} fill="none" stroke={lightColor} strokeWidth="2.5" />
      <polyline points={toPoints(recent)} fill="none" stroke={darkColor} strokeWidth="2.5" />
      {MONTHS.map((m, i) => (
        <text key={m} x={i * 60 + 10} y="134" fontSize="9" textAnchor="middle" fill="#94a3b8">{m}</text>
      ))}
    </svg>
  );
}

export function ChartLegend({ lightColor, darkColor }: { lightColor: string; darkColor: string }) {
  return (
    <div className="flex gap-3 text-[11px] text-slate-500">
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: lightColor }} /> 2001–2012</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: darkColor }} /> 2013–2025</span>
    </div>
  );
}