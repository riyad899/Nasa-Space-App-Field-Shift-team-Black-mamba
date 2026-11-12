/* eslint-disable @typescript-eslint/no-explicit-any */

const getBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5007"
  ).replace(/\/+$/, "");
};

const UPSTREAM_IOT_URL = "https://esp32-iot-cloude-connect.vercel.app";

export interface IDeviceAuthRequest {
  deviceId?: string;
  name: string;
  key: string;
}

export interface IConnectedDevice {
  deviceId: string;
  name: string;
  status: "online" | "offline";
  connected: boolean;
  lastConnectedAt?: string;
  lastSeen?: string;
  secondsSinceLastSeen?: number;
  token?: string;
}

export interface IDeviceAuthResponse {
  success: boolean;
  connected: boolean;
  status: "online" | "offline";
  message: string;
  device: IConnectedDevice;
  permissions?: {
    telemetryUpload: boolean;
    telemetryRead: boolean;
    relayControl: boolean;
    relayCommandPoll: boolean;
  };
  apis?: Record<string, { method: string; endpoint: string; description: string }>;
}

export interface ILatestTelemetry {
  deviceId?: string;
  temperature?: number | null;
  humidity?: number | null;
  soilMoistureRaw?: number | null;
  rainSensorRaw?: number | null;
  gpsValid?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  satellites?: number | null;
  recordedAt?: string | null;
  created_at?: string | null;
  rawPayload?: any;
}

export interface IDeviceStatusResponse {
  success: boolean;
  deviceId: string;
  status: "online" | "offline";
  active: boolean;
  lastSeen: string | null;
  secondsSinceLastSeen: number | null;
  relay1: "ON" | "OFF" | boolean;
  relay2: "ON" | "OFF" | boolean;
}

export interface IRelayControlResponse {
  success: boolean;
  deviceId: string;
  relay: number;
  state: "ON" | "OFF";
  relay1?: "ON" | "OFF" | boolean;
  relay2?: "ON" | "OFF" | boolean;
  updatedAt?: string;
}

/**
 * 1. Authenticate and Connect Device (POST /api/device/auth)
 */
export async function authenticateDeviceApi(
  payload: IDeviceAuthRequest
): Promise<IDeviceAuthResponse> {
  const requestBody = {
    deviceId: payload.deviceId || "esp32-001",
    name: payload.name.trim(),
    key: payload.key.trim(),
  };

  let primaryErr: any = null;

  // Try local backend first
  try {
    const res = await fetch(`${getBaseUrl()}/api/device/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (res.ok) {
      return await res.json();
    }
    const errJson = await res.json().catch(() => null);
    if (errJson?.message) {
      primaryErr = new Error(errJson.message);
    }
  } catch (err: any) {
    primaryErr = err;
  }

  // Fallback direct to upstream IoT cloud gateway
  try {
    const directRes = await fetch(`${UPSTREAM_IOT_URL}/api/device/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (directRes.ok) {
      return await directRes.json();
    }
    const directErr = await directRes.json().catch(() => null);
    throw new Error(directErr?.message || "Failed to authenticate device with given key.");
  } catch (directErr: any) {
    throw new Error(
      directErr?.message || primaryErr?.message || "Device connection failed. Check your Secret Key (102030)."
    );
  }
}

/**
 * 2. Check Device Connection Status (GET /api/device/auth?deviceId=...)
 */
export async function checkDeviceAuthApi(deviceId = "esp32-001"): Promise<{
  success: boolean;
  deviceId: string;
  name: string;
  connected: boolean;
  status: "online" | "offline";
  lastConnectedAt?: string;
  secondsSinceLastSeen?: number;
}> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/device/auth?deviceId=${encodeURIComponent(deviceId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  try {
    const upRes = await fetch(`${UPSTREAM_IOT_URL}/api/device/auth?deviceId=${encodeURIComponent(deviceId)}`, {
      cache: "no-store",
    });
    if (upRes.ok) {
      return await upRes.json();
    }
  } catch {
    // fallback
  }

  return {
    success: false,
    deviceId,
    name: "ESP32 Master Agro",
    connected: false,
    status: "offline",
  };
}

/**
 * 3. Get Latest Device Telemetry (GET /api/device/data/latest?deviceId=...)
 */
export async function getLatestTelemetryApi(
  deviceId = "esp32-001"
): Promise<{ success: boolean; data: ILatestTelemetry; relay1?: any; relay2?: any }> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/device/data/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // fallback
  }

  const directRes = await fetch(
    `${UPSTREAM_IOT_URL}/api/device/data/latest?deviceId=${encodeURIComponent(deviceId)}`,
    { cache: "no-store" }
  );
  if (!directRes.ok) {
    throw new Error("Failed to fetch latest device telemetry");
  }
  return await directRes.json();
}

/**
 * 4. Get Device Online/Offline & Relay Status (GET /api/device/status?deviceId=...)
 */
export async function getDeviceStatusApi(
  deviceId = "esp32-001"
): Promise<IDeviceStatusResponse> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/device/status?deviceId=${encodeURIComponent(deviceId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const directRes = await fetch(
    `${UPSTREAM_IOT_URL}/api/device/status?deviceId=${encodeURIComponent(deviceId)}`,
    { cache: "no-store" }
  );
  if (!directRes.ok) {
    throw new Error("Failed to fetch device status");
  }
  return await directRes.json();
}

/**
 * 5. Control Relay (POST /api/device/relay)
 */
export async function controlRelayApi(params: {
  deviceId: string;
  relay: 1 | 2;
  state: boolean | "ON" | "OFF";
  source?: string;
}): Promise<IRelayControlResponse> {
  const payload = {
    deviceId: params.deviceId || "esp32-001",
    relay: params.relay,
    state: params.state,
    source: params.source || "Dashboard UI",
  };

  try {
    const res = await fetch(`${getBaseUrl()}/api/device/relay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data || data;
    }
  } catch {
    // fallback
  }

  const directRes = await fetch(`${UPSTREAM_IOT_URL}/api/device/relay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!directRes.ok) {
    throw new Error("Failed to dispatch relay command to device gateway");
  }
  return await directRes.json();
}
