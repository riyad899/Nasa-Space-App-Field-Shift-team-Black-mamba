// ─── Data Fusion Module Interfaces ──────────────────────────────────────
// Defines models for sensor calibration, spatiotemporal alignment,
// statistical validation metrics, and fused environmental observations.

export type SensorType = "SOIL_MOISTURE" | "TEMPERATURE" | "HUMIDITY" | "RAIN_SENSOR";
export type CalibrationProfile = "CLAY_LOAM" | "SANDY_LOAM" | "ALLUVIAL" | "DEFAULT";
export type AlignmentQuality = "HIGH" | "MEDIUM" | "LOW" | "UNMATCHED";

export interface ICalibrationConfig {
  soilMoisture: {
    airAdc: number;     // Dry sensor reading in air (~4095)
    waterAdc: number;   // Wet sensor reading in water (~1450)
    fieldCapacityVwc: number; // Field capacity VWC % (~35-40%)
    wiltingPointVwc: number;  // Permanent wilting point VWC % (~12-15%)
  };
  rainSensor: {
    wetThresholdAdc: number;   // Below this value indicates rain/wet surface (~2500)
    heavyRainThresholdAdc: number; // Below this value indicates heavy rain (~1500)
  };
  temperature: {
    offsetCelsius: number;     // Empirical offset for DHT casing warming (typically -0.5 to -1.0°C)
  };
}

export interface ICalibratedSensorReading {
  rawSoilMoistureAdc: number | null;
  calibratedSoilMoistureVwc: number | null; // Estimated volumetric water content % (0-50%)
  soilMoistureQuality: "VALID" | "DRY_SATURATED" | "WET_SATURATED" | "UNRELIABLE";
  
  rawRainSensorAdc: number | null;
  rainEventDetected: boolean;
  rainIntensityCategory: "NONE" | "LIGHT_OR_DEW" | "MODERATE_OR_HEAVY";
  
  rawTemperatureCelsius: number | null;
  calibratedTemperatureCelsius: number | null;
  
  humidityPct: number | null;
  gpsCoordinates: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    gpsValid: boolean;
  };
  sourceTimestamp: string;
  ingestionTimestamp: string;
}

export interface ISatelliteReferenceData {
  districtName: string;
  date: string;
  latitude: number;
  longitude: number;
  smapSoilMoisturePct: number;        // SMAP L4 root-zone moisture (0-100%)
  ecostressSurfaceTempCelsius: number; // ECOSTRESS LST (°C)
  imergPrecipitationMm: number;        // GPM IMERG rainfall (mm)
  modisNdvi: number;                   // MODIS 250m NDVI
  modisEvapotranspirationMm: number;   // MODIS ET (mm)
  waterDeficitIndex: number;
}

export interface ISpatiotemporalAlignment {
  spatialDistanceKm: number;
  temporalOffsetMinutes: number;
  alignmentQuality: AlignmentQuality;
  spatialMatchDistrict: string;
  matchDate: string;
}

export interface IValidationMetrics {
  variable: string;
  sampleCount: number;
  satelliteMean: number;
  groundMean: number;
  meanBiasError: number;        // Satellite - Ground
  meanAbsoluteError: number;    // |Satellite - Ground|
  rootMeanSquareError: number;  // sqrt(mean((Satellite - Ground)^2))
  pearsonCorrelation: number;   // r (-1 to +1)
  spearmanCorrelation?: number; // monotonic rank correlation
  rSquared?: number;
  classificationMetrics?: {     // For rain event detection
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    trueNegatives: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface IFusionRunResult {
  deviceId: string;
  district: string;
  analysisPeriod: {
    dateFrom: string;
    dateTo: string;
  };
  deviceStatus: {
    isOnline: boolean;
    lastSeenAt: string | null;
    totalHistoricalSnapshots: number;
  };
  latestGroundObservation: ICalibratedSensorReading | null;
  satelliteObservation: ISatelliteReferenceData | null;
  alignment: ISpatiotemporalAlignment;
  validationMetrics: {
    soilMoisture: IValidationMetrics;
    temperature: IValidationMetrics;
    precipitation: IValidationMetrics;
  };
  fusionSummary: {
    fusionEligibility: "ELIGIBLE" | "PARTIAL" | "SATELLITE_ONLY";
    overallConfidenceScore: number; // 0-100
    primaryEnvironmentalDriver: string;
    dataProvenance: {
      satelliteSources: string[];
      groundDeviceType: string;
      calibrationStandard: string;
    };
    agronomicRecommendation: string;
  };
}

export interface IDataFusionHistoricalComparison {
  date: string;
  satelliteMoisture: number;
  groundMoisture: number | null;
  satelliteTemp: number;
  groundTemp: number | null;
  satelliteRainMm: number;
  groundRainEvent: boolean | null;
}
