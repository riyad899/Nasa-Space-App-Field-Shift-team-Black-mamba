"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Layers, Navigation } from "lucide-react";

interface LocationMapSectionProps {
  latitude: number;
  longitude: number;
  locationName: string;
  /** Optional zoom level, defaults to 10 */
  zoom?: number;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const MAP_STYLES = [
  { id: "satellite-streets-v12", label: "Satellite", icon: "🛰️" },
  { id: "streets-v12", label: "Map", icon: "🗺️" },
  { id: "outdoors-v12", label: "Terrain", icon: "⛰️" },
] as const;

export default function LocationMapSection({
  latitude,
  longitude,
  locationName,
  zoom = 10,
}: LocationMapSectionProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0); // satellite by default

  // ─── Initialise Map ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${MAP_STYLES[activeStyle].id}`,
      center: [longitude, latitude],
      zoom: 5, // start zoomed out — will fly in
      pitch: 40,
      bearing: -15,
      antialias: true,
    });

    // Navigation controls (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

    // Scale bar
    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 120, unit: "metric" }),
      "bottom-left"
    );

    map.on("load", () => {
      setMapLoaded(true);

      // Fly to the analysed location
      map.flyTo({
        center: [longitude, latitude],
        zoom,
        pitch: 45,
        bearing: 0,
        speed: 0.8,
        curve: 1.4,
        essential: true,
      });
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mount once

  // ─── Add / update marker when lat/lng change ────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old marker
    markerRef.current?.remove();

    // Create custom marker element
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        display: flex; flex-direction: column; align-items: center;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.35));
      ">
        <div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #166534, #22c55e);
          border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px rgba(22,101,52,0.25);
          animation: markerPulse 2s infinite;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #166534;
          margin-top: -2px;
        "></div>
      </div>
    `;

    // Add pulse animation
    if (!document.getElementById("marker-pulse-style")) {
      const styleTag = document.createElement("style");
      styleTag.id = "marker-pulse-style";
      styleTag.textContent = `
        @keyframes markerPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(22,101,52,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(22,101,52,0.08); }
        }
      `;
      document.head.appendChild(styleTag);
    }

    const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false, className: "cropwise-popup" }).setHTML(`
          <div style="padding: 8px 12px; font-family: system-ui, sans-serif;">
            <p style="margin:0; font-weight:600; font-size:14px; color:#0f3d2a;">📍 ${locationName}</p>
            <p style="margin:4px 0 0; font-size:11px; color:#64748b;">
              Lat ${latitude.toFixed(4)}° · Lng ${longitude.toFixed(4)}°
            </p>
          </div>
        `)
      )
      .addTo(map);

    // Auto-open popup
    marker.togglePopup();
    markerRef.current = marker;

    // Fly to new location
    map.flyTo({
      center: [longitude, latitude],
      zoom,
      pitch: 45,
      bearing: 0,
      speed: 0.8,
      curve: 1.4,
      essential: true,
    });
  }, [latitude, longitude, locationName, zoom]);

  // ─── Switch map style ───────────────────────────────────────────
  const handleStyleChange = (idx: number) => {
    if (!mapRef.current || idx === activeStyle) return;
    setActiveStyle(idx);
    mapRef.current.setStyle(`mapbox://styles/mapbox/${MAP_STYLES[idx].id}`);

    // Re-add marker after style change
    mapRef.current.once("style.load", () => {
      if (markerRef.current) {
        markerRef.current.addTo(mapRef.current!);
      }
    });
  };

  // ─── Recenter button handler ────────────────────────────────────
  const handleRecenter = () => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom,
      pitch: 45,
      bearing: 0,
      speed: 1.2,
      essential: true,
    });
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm text-amber-800">
          Map unavailable — <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> not configured.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 shadow-sm">
            <MapPin className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Location Overview</h3>
            <p className="text-xs text-slate-500">{locationName}</p>
          </div>
        </div>

        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-primary-700"
        >
          <Navigation className="h-3.5 w-3.5" />
          Recenter
        </button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainer}
          className="w-full"
          style={{ height: 360 }}
        />

        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" />
              <p className="text-xs text-slate-500">Loading map…</p>
            </div>
          </div>
        )}

        {/* Style switcher (floating inside map) */}
        <div className="absolute left-3 top-3 flex overflow-hidden rounded-lg border border-white/60 bg-white/90 shadow-lg backdrop-blur-sm">
          {MAP_STYLES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleStyleChange(idx)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${
                idx === activeStyle
                  ? "bg-primary-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer coordinates */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="font-medium text-slate-700">Lat:</span> {latitude.toFixed(4)}°
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-slate-700">Lng:</span> {longitude.toFixed(4)}°
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Layers className="h-3 w-3" />
          <span>{MAP_STYLES[activeStyle].label} view</span>
        </div>
      </div>
    </div>
  );
}
