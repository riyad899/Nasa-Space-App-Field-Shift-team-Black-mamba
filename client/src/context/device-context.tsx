"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  authenticateDeviceApi,
  checkDeviceAuthApi,
  getLatestTelemetryApi,
  getDeviceStatusApi,
  controlRelayApi,
  IConnectedDevice,
  ILatestTelemetry,
  IDeviceStatusResponse,
} from "@/lib/apis/device.api";

interface RelaysState {
  relay1: boolean;
  relay2: boolean;
  relay1State: "ON" | "OFF";
  relay2State: "ON" | "OFF";
}

interface DeviceContextType {
  isConnected: boolean;
  isOnline: boolean;
  isConnecting: boolean;
  isLoadingData: boolean;
  isSyncing: boolean;
  hasSynced: boolean;
  error: string | null;
  device: IConnectedDevice | null;
  telemetry: ILatestTelemetry | null;
  statusInfo: IDeviceStatusResponse | null;
  relays: RelaysState;
  connectDevice: (name: string, key: string, deviceId?: string) => Promise<boolean>;
  disconnectDevice: () => void;
  toggleRelay: (relay: 1 | 2, state: boolean) => Promise<boolean>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = "cropwise_esp32_connection_v1";

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<IConnectedDevice | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [hasSynced, setHasSynced] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState<ILatestTelemetry | null>(null);
  const [statusInfo, setStatusInfo] = useState<IDeviceStatusResponse | null>(null);
  const [relays, setRelays] = useState<RelaysState>({
    relay1: false,
    relay2: false,
    relay1State: "OFF",
    relay2State: "OFF",
  });

  const isSyncing = isLoadingData || (isConnected && !hasSynced);

  // Load saved connection from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.deviceId && parsed?.connected) {
          setDevice(parsed);
          setIsConnected(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch telemetry & status
  const refreshData = useCallback(async () => {
    if (!device?.deviceId) return;
    const devId = device.deviceId;
    setIsLoadingData(true);
    const startTime = Date.now();

    try {
      const [telRes, statRes] = await Promise.all([
        getLatestTelemetryApi(devId).catch(() => null),
        getDeviceStatusApi(devId).catch(() => null),
      ]);

      if (statRes) {
        setStatusInfo(statRes);
        const online = statRes.status === "online" || statRes.active === true;
        setIsOnline(online);

        const r1On =
          statRes.relay1 === true ||
          String(statRes.relay1).toUpperCase() === "ON";
        const r2On =
          statRes.relay2 === true ||
          String(statRes.relay2).toUpperCase() === "ON";

        setRelays({
          relay1: r1On,
          relay2: r2On,
          relay1State: r1On ? "ON" : "OFF",
          relay2State: r2On ? "ON" : "OFF",
        });
      }

      if (telRes?.data) {
        const d = telRes.data as any;
        const normalizedTel: ILatestTelemetry = {
          deviceId: d.deviceId || d.device_id || devId,
          temperature: d.temperature ?? d.temperature1 ?? null,
          humidity: d.humidity ?? d.humidity1 ?? null,
          soilMoistureRaw: d.soilMoistureRaw ?? d.soil_moisture_raw ?? d.soil1 ?? null,
          rainSensorRaw: d.rainSensorRaw ?? d.rain_sensor_raw ?? d.rain ?? null,
          gpsValid: Boolean(d.gpsValid ?? d.gps_valid),
          latitude: d.latitude != null ? Number(d.latitude) : null,
          longitude: d.longitude != null ? Number(d.longitude) : null,
          altitude: d.altitude != null ? Number(d.altitude) : null,
          satellites: d.satellites != null ? Number(d.satellites) : null,
          recordedAt: d.recordedAt || d.created_at || statRes?.lastSeen || null,
        };
        setTelemetry(normalizedTel);
      }
    } catch (err: any) {
      console.warn("Device telemetry refresh warning:", err?.message);
    } finally {
      // Ensure smooth visual transition: at least 650ms to allow "Status Syncing..." indicator to be visible
      const elapsed = Date.now() - startTime;
      const minDuration = 650;
      if (elapsed < minDuration) {
        await new Promise((r) => setTimeout(r, minDuration - elapsed));
      }
      setIsLoadingData(false);
      setHasSynced(true);
    }
  }, [device?.deviceId]);

  // Periodic heartbeat poll every 15 seconds when connected
  useEffect(() => {
    if (!isConnected || !device?.deviceId) return;

    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, [isConnected, device?.deviceId, refreshData]);

  // Connect Device
  const connectDevice = async (name: string, key: string, deviceId = "esp32-001"): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      const res = await authenticateDeviceApi({
        deviceId: deviceId.trim() || "esp32-001",
        name: name.trim() || "ESP32 Master Agro",
        key: key.trim(),
      });

      if (res.success && res.connected) {
        const connectedDev: IConnectedDevice = {
          deviceId: res.device.deviceId,
          name: res.device.name,
          status: res.status,
          connected: true,
          lastConnectedAt: res.device.lastConnectedAt || new Date().toISOString(),
          token: res.device.token,
        };

        setDevice(connectedDev);
        setIsConnected(true);
        setIsOnline(res.status === "online");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(connectedDev));

        // Initial data fetch
        setTimeout(refreshData, 300);
        return true;
      } else {
        throw new Error(res.message || "Device could not be authenticated.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate device. Please check your Device Key.");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Device
  const disconnectDevice = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDevice(null);
    setIsConnected(false);
    setIsOnline(false);
    setHasSynced(false);
    setIsLoadingData(false);
    setTelemetry(null);
    setStatusInfo(null);
    setRelays({
      relay1: false,
      relay2: false,
      relay1State: "OFF",
      relay2State: "OFF",
    });
  };

  // Toggle Relay (1 or 2)
  const toggleRelay = async (relay: 1 | 2, state: boolean): Promise<boolean> => {
    if (!device?.deviceId) return false;

    // Optimistic update
    setRelays((prev) => ({
      ...prev,
      [relay === 1 ? "relay1" : "relay2"]: state,
      [relay === 1 ? "relay1State" : "relay2State"]: state ? "ON" : "OFF",
    }));

    try {
      const res = await controlRelayApi({
        deviceId: device.deviceId,
        relay,
        state,
      });

      if (res?.success) {
        if (res.relay1 !== undefined) {
          const r1On = res.relay1 === true || String(res.relay1).toUpperCase() === "ON";
          const r2On = res.relay2 === true || String(res.relay2).toUpperCase() === "ON";
          setRelays({
            relay1: r1On,
            relay2: r2On,
            relay1State: r1On ? "ON" : "OFF",
            relay2State: r2On ? "ON" : "OFF",
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Relay toggle failed:", err);
      // Revert on error
      refreshData();
      return false;
    }
  };

  const clearError = () => setError(null);

  return (
    <DeviceContext.Provider
      value={{
        isConnected,
        isOnline,
        isConnecting,
        isLoadingData,
        isSyncing,
        hasSynced,
        error,
        device,
        telemetry,
        statusInfo,
        relays,
        connectDevice,
        disconnectDevice,
        toggleRelay,
        refreshData,
        clearError,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return ctx;
}
