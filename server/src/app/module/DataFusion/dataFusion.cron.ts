import { prisma } from "../../lib/prisma.js";

const DEFAULT_DEVICE_ID = "esp32-001";
const UPSTREAM_API_BASE =
  process.env.ESP32_SERVER_API_URL ||
  process.env.ESP32_API_URL ||
  "https://esp32-iot-cloude-connect.vercel.app";

let cronTimerId: NodeJS.Timeout | null = null;
let isCollecting = false;

export class DataFusionCronService {
  /**
   * Polls upstream ESP32 server and persists deduplicated historical snapshots.
   */
  static async collectTelemetrySnapshot(deviceId: string = DEFAULT_DEVICE_ID): Promise<{
    status: "SAVED" | "DUPLICATE" | "FAILED" | "OFFLINE";
    details?: any;
  }> {
    if (isCollecting) {
      return { status: "FAILED", details: "Collection already in progress" };
    }
    isCollecting = true;

    try {
      const url = `${UPSTREAM_API_BASE.replace(/\/+$/, "")}/api/device/data/latest?deviceId=${encodeURIComponent(
        deviceId
      )}`;

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        return { status: "FAILED", details: `HTTP error ${response.status} from ESP32 gateway` };
      }

      const json = await response.json();
      if (!json?.success || !json?.data) {
        return { status: "OFFLINE", details: "No device data returned from gateway" };
      }

      const d = json.data;
      const sourceTimestamp = d.created_at ? new Date(d.created_at) : new Date();

      // Check for duplicate reading based on deviceId and timestamp
      const existing = await prisma.deviceTelemetry.findFirst({
        where: {
          deviceId,
          recordedAt: sourceTimestamp,
        },
      });

      if (existing) {
        return { status: "DUPLICATE", details: "Snapshot already stored in database" };
      }

      // Ensure device record exists in DB
      await prisma.device.upsert({
        where: { deviceId },
        create: {
          deviceId,
          name: `ESP32 (${deviceId})`,
          deviceType: "ESP32-S3",
          lastSeenAt: sourceTimestamp,
          connectionStatus: "online",
          location: d.latitude && d.longitude ? { latitude: d.latitude, longitude: d.longitude } : undefined,
        },
        update: {
          lastSeenAt: sourceTimestamp,
          connectionStatus: "online",
          location: d.latitude && d.longitude ? { latitude: d.latitude, longitude: d.longitude } : undefined,
        },
      });

      // Insert new historical telemetry snapshot
      const snapshot = await prisma.deviceTelemetry.create({
        data: {
          deviceId,
          temperature: d.temperature != null ? Number(d.temperature) : null,
          humidity: d.humidity != null ? Number(d.humidity) : null,
          soilMoistureRaw: d.soilMoistureRaw != null ? Number(d.soilMoistureRaw) : (d.soil_moisture_raw != null ? Number(d.soil_moisture_raw) : null),
          rainSensorRaw: d.rainSensorRaw != null ? Number(d.rainSensorRaw) : (d.rain_sensor_raw != null ? Number(d.rain_sensor_raw) : null),
          gpsValid: Boolean(d.gpsValid || d.gps_valid),
          latitude: d.latitude != null ? Number(d.latitude) : null,
          longitude: d.longitude != null ? Number(d.longitude) : null,
          altitude: d.altitude != null ? Number(d.altitude) : null,
          satellites: d.satellites != null ? Number(d.satellites) : null,
          rawPayload: d,
          recordedAt: sourceTimestamp,
          receivedAt: new Date(),
        },
      });

      return { status: "SAVED", details: snapshot };
    } catch (err: any) {
      return { status: "FAILED", details: err?.message || "Unknown error during snapshot collection" };
    } finally {
      isCollecting = false;
    }
  }

  /**
   * Initializes periodic background snapshot polling (default 5 minutes).
   */
  static startScheduler(intervalMs: number = 5 * 60 * 1000, deviceId: string = DEFAULT_DEVICE_ID) {
    if (cronTimerId) {
      clearInterval(cronTimerId);
    }

    // Immediate initial poll on boot
    this.collectTelemetrySnapshot(deviceId).catch(() => {});

    // Recurring poll
    cronTimerId = setInterval(() => {
      this.collectTelemetrySnapshot(deviceId).catch(() => {});
    }, intervalMs);
  }

  static stopScheduler() {
    if (cronTimerId) {
      clearInterval(cronTimerId);
      cronTimerId = null;
    }
  }
}
