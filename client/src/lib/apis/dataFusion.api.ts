import { httpClient } from "../axios/httpClinet";

export type CalibrationProfile = "DEFAULT" | "CLAY_LOAM" | "SANDY_LOAM" | "ALLUVIAL";

export interface ISoilMoistureCalibration {
  airAdc: number;
  waterAdc: number;
  fieldCapacityVwc: number;
  wiltingPointVwc: number;
}

export interface IRainSensorCalibration {
  wetThresholdAdc: number;
  heavyRainThresholdAdc: number;
}

export interface ICalibrationConfig {
  soilMoisture: ISoilMoistureCalibration;
  rainSensor: IRainSensorCalibration;
  temperature: { offsetCelsius: number };
}

export interface ICalibratedSensorReading {
  rawSoilMoistureAdc: number;
  volumetricWaterContentPct: number;
  soilMoistureStatus: "SATURATED" | "OPTIMAL" | "WATER_DEFICIT" | "WILTING_POINT";
  rawRainSensorAdc: number;
  surfaceWetnessState: "DRY" | "LIGHT_RAIN_OR_DEW" | "HEAVY_PRECIPITATION";
  calibratedTempCelsius: number;
  ambientHumidityPct: number;
  recordedAt: string;
}

export interface ISatelliteReferenceData {
  satelliteSource: string;
  district: string;
  date: string;
  smapSoilMoisturePct: number;
  imergPrecipitationMm: number;
  modisSurfaceTempCelsius: number;
  ndvi: number;
}

export interface ISpatiotemporalAlignment {
  sensorCoordinates: { lat: number; lon: number };
  districtCentroid: { lat: number; lon: number };
  distanceToCentroidKm: number;
  timeDeltaMinutes: number;
  isSpatiotemporallyAligned: boolean;
}

export interface IValidationMetrics {
  soilMoisture: {
    meanBiasError: number;
    meanAbsoluteError: number;
    rootMeanSquareError: number;
    pearsonCorrelationR: number;
    sampleCount: number;
  };
  temperature: {
    meanBiasError: number;
    meanAbsoluteError: number;
    rootMeanSquareError: number;
  };
  precipitationConcordance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface IFusionRunResult {
  deviceId: string;
  district: string;
  analysisPeriod: { dateFrom: string; dateTo: string };
  deviceStatus: {
    isOnline: boolean;
    lastSeenAt?: string;
    totalHistoricalSnapshots: number;
  };
  latestGroundSensor: ICalibratedSensorReading;
  satelliteReference: ISatelliteReferenceData;
  spatiotemporalAlignment: ISpatiotemporalAlignment;
  validationMetrics: IValidationMetrics;
  fusedInsights: {
    soilMoistureDiscrepancyPct: number;
    surfaceRainEventDetected: boolean;
    satelliteConfirmedRainMm: number;
    hydrationAnomalyFlag: boolean;
    agronomicRecommendation: string;
    fusionConfidenceScore: number;
  };
  activeCalibration: {
    profile: CalibrationProfile;
    config: ICalibrationConfig;
  };
}

export interface IDataFusionHistoricalComparison {
  date: string;
  satelliteMoisture: number;
  groundMoisture: number;
  satelliteTemp: number;
  groundTemp: number;
  satelliteRainMm: number;
  groundRainEvent: boolean;
}

export interface IDeviceTelemetrySnapshot {
  id: string;
  deviceId: string;
  temperature: number | null;
  humidity: number | null;
  soilMoistureRaw: number | null;
  rainSensorRaw: number | null;
  gpsValid: boolean;
  latitude: number | null;
  longitude: number | null;
  recordedAt: string;
  receivedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getDataFusionRun(params: {
  deviceId?: string;
  district?: string;
  dateFrom?: string;
  dateTo?: string;
  calibrationProfile?: CalibrationProfile;
}): Promise<IFusionRunResult> {
  const res = await httpClient.get<ApiResponse<IFusionRunResult>>("/data-fusion/run", {
    params,
  });
  return res.data;
}

export async function getDataFusionComparison(params: {
  deviceId?: string;
  district?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<IDataFusionHistoricalComparison[]> {
  const res = await httpClient.get<ApiResponse<IDataFusionHistoricalComparison[]>>(
    "/data-fusion/comparison",
    { params }
  );
  return res.data;
}

export async function getDataFusionSnapshots(params: {
  deviceId?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  deviceId: string;
  total: number;
  limit: number;
  offset: number;
  data: IDeviceTelemetrySnapshot[];
}> {
  const res = await httpClient.get<
    ApiResponse<{
      deviceId: string;
      total: number;
      limit: number;
      offset: number;
      data: IDeviceTelemetrySnapshot[];
    }>
  >("/data-fusion/snapshots", { params });
  return res.data;
}

export async function triggerDataFusionCollection(deviceId = "esp32-001"): Promise<{
  status: "SAVED" | "DUPLICATE" | "FAILED" | "OFFLINE";
  details?: any;
}> {
  const res = await httpClient.post<ApiResponse<{ status: "SAVED" | "DUPLICATE" | "FAILED" | "OFFLINE"; details?: any }>>(
    "/data-fusion/collect",
    { deviceId }
  );
  return res.data;
}
