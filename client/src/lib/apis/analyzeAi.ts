import { httpClient } from "../axios/httpClinet";

export interface AnalyzeRequest {
  location: {
    latitude: number;
    longitude: number;
    district: string;
  };
  crop: {
    cropType: string;
    farmingMethod: string;
  };
  analysis: {
    type: string;
    baselineStartYear: number;
    baselineEndYear: number;
    recentStartYear: number;
    recentEndYear: number;
  };
  language: "bn" | "en";
}

export interface AnnualOnset {
  year: number;
  onsetDate: string;
  dayOfYear: number;
  rainfallTotalMm: number;
  confidence: string;
}

export interface OnsetPeriod {
  startYear: number;
  endYear: number;
  annualOnsets: AnnualOnset[];
  validYears: number;
  medianDayOfYear: number | null;
  p25DayOfYear: number | null;
  p75DayOfYear: number | null;
}

export interface OnsetAnalysisData {
  analysisId: string;
  location: AnalyzeRequest["location"];
  crop: AnalyzeRequest["crop"];
  method: {
    season: string;
    minimumAccumulatedRainfallMm: number;
    accumulationDays: number;
    confirmationWindowDays: number;
    minimumConfirmationRainyDays: number;
  };
  baseline: OnsetPeriod;
  recent: OnsetPeriod;
  shift: {
    medianDays: number | null;
    direction: string;
    p25ToP75Days: {
      lower: number;
      upper: number;
    } | null;
  };
  transplantingWindow: {
    start: string;
    end: string;
    confidence: string;
  };
  explanation: string;
  farmerGuidance: string[];
  dataSources: string[];
  warnings: string[];
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  data: OnsetAnalysisData;
}

export interface TransparencySource {
  id: string;
  analysisId: string;
  source: string;
  provider: string;
  dataset: string;
  endpoint: string;
  requestParameters: Record<string, string | number>;
  variables: string[];
  units: Record<string, string>;
  temporalResolution: string;
  spatialResolution: string;
  fetchStatus: string;
  responseTimeMs: number | null;
  requestedStart: string;
  requestedEnd: string;
  recordCount: number;
  coverage: unknown;
  missingData: unknown;
  sourceLink: string;
  sourceVersion: string;
  errorMessage: string | null;
}

export interface TransparencyYearlyCalculation {
  id: string;
  analysisId: string;
  periodType: string;
  year: number;
  onsetDate: string;
  dayOfYear: number;
  rainfallTotal: number;
  valid: boolean;
  missingDays: number;
  confidence: string;
  calculation: Record<string, string | number>;
}

export interface TransparencyObservation {
  id: string;
  source: string;
  observedAt: string;
  variable: string;
  value: number;
  unit: string;
  isValid: boolean;
  qualityNote: string | null;
}

export interface TransparencyResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    algorithmVersion: string;
    status: string;
    requestedAt: string;
    completedAt: string;
    location: AnalyzeRequest["location"];
    crop: AnalyzeRequest["crop"];
    farmingMethod: string;
    farmerPriority: unknown;
    baselinePeriod: { startYear: number; endYear: number };
    recentPeriod: { startYear: number; endYear: number };
    methodology: {
      rule: string;
      formulas: Record<string, string>;
      uncertaintyMethod: string;
    };
    recommendation: unknown;
    aiExplanation: {
      source: string;
      explanation: string;
      provider: string | null;
      model: string | null;
      promptVersion: string | null;
      fallback: boolean;
    };
    warnings: string[];
    sources: TransparencySource[];
    observations: TransparencyObservation[];
    yearlyCalculations: TransparencyYearlyCalculation[];
    auditLogs: Array<{
      id: string;
      analysisId: string;
      event: string;
      details: Record<string, string | number>;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  } | null;
  error: string | null;
}

export interface ObservationsResponse {
  success: boolean;
  message: string;
  data: {
    items: TransparencyObservation[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  } | null;
  error: string | null;
}

export async function analyzeClimateData(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  return httpClient.post<AnalyzeResponse>("/ai/analyze-aman-onset", payload, {
    timeout: 90000,
  });
}

export async function getAnalysisTransparency(analysisId: string): Promise<TransparencyResponse> {
  return httpClient.get<TransparencyResponse>(`/analyses/${encodeURIComponent(analysisId)}`);
}

export async function getAnalysisObservations(
  analysisId: string,
  page = 1,
  pageSize = 50
): Promise<ObservationsResponse> {
  return httpClient.get<ObservationsResponse>(`/analyses/${encodeURIComponent(analysisId)}/observations`, {
    params: { source: "POWER", variable: "PRECTOTCORR", page, pageSize },
  });
}

export async function getLatestAnalysis(): Promise<{ success: boolean; data: any }> {
  return httpClient.get<{ success: boolean; data: any }>("/analyses/latest");
}

export async function getAnalysisHistory(): Promise<{ success: boolean; data: any[] }> {
  return httpClient.get<{ success: boolean; data: any[] }>("/analyses/history");
}

export async function saveAnalysisToHistory(data: any): Promise<{ success: boolean; data: any }> {
  return httpClient.post<{ success: boolean; data: any }>("/analyses/save", data);
}

export interface ICropWiseChatPayload {
  conversationId?: string;
  message: string;
  guestSessionId?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    district?: string;
  };
  crop?: string;
  language?: "BN" | "EN" | "bn" | "en";
}

export interface ICropWiseChatResponse {
  success: boolean;
  message: string;
  data: {
    conversationId: string;
    message: {
      role: "assistant" | "user";
      content: string;
    };
    sources: Array<{
      type: string;
      title: string;
      timestamp?: string;
      details?: any;
    }>;
    contextStatus: {
      userAuthenticated: boolean;
      deviceDataAvailable: boolean;
      deviceOnline?: boolean;
      analysisDataAvailable: boolean;
      knowledgeBaseCount: number;
    };
  };
}

export type ProboyChatPayload = ICropWiseChatPayload;
export type ProboyChatResponse = ICropWiseChatResponse;

export async function sendCropWiseChatMessage(payload: ICropWiseChatPayload): Promise<ICropWiseChatResponse> {
  try {
    return await httpClient.post<ICropWiseChatResponse>("/cropwise/chat", payload, {
      timeout: 60000,
    });
  } catch (err: any) {
    // Fallback to /proboy/chat if needed
    return await httpClient.post<ICropWiseChatResponse>("/proboy/chat", payload, {
      timeout: 60000,
    });
  }
}

export const sendProboyChatMessage = sendCropWiseChatMessage;

export interface ITwoYearClimateAnalysisRequest {
  district?: string;
  latitude?: number;
  longitude?: number;
  crop?: string;
  farmerPriority?: string;
  soilType?: string;
  drainage?: "GOOD" | "MODERATE" | "POOR";
  analysisPeriod?: {
    start?: string;
    end?: string;
  };
  language?: "bn" | "en";
}

export interface ITwoYearMonthlyPoint {
  month: string;
  historical: number;
  recent: number;
}

export interface ITwoYearClimateAnalysisResponse {
  analysisId: string;
  location: {
    district: string;
    latitude: number;
    longitude: number;
    regionKey: string;
    boundingBox: {
      latitudeMin: number;
      latitudeMax: number;
      longitudeMin: number;
      longitudeMax: number;
    };
  };
  analysisPeriod: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  cropRequested: string;
  farmerPriority: string;
  soilContext: {
    type: string;
    drainage: string;
    ph: number;
  };
  nasaData: {
    nasaPower: {
      source: string;
      coveragePercentage: number;
      meanTemperature: number;
      minTemperature: number;
      maxTemperature: number;
      extremeHeatDays: number;
      coldStressDays: number;
      solarRadiationAvg: number;
      relativeHumidityAvg: number;
    };
    imerg: {
      source: string;
      coveragePercentage: number;
      totalRainfallMm: number;
      annualAverageMm: number;
      dailyAverageMm: number;
      maxDailyRainfallMm: number;
      rainyDays: number;
      dryDays: number;
      drySpellsCount: number;
      heavyRainfallDays: number;
      seasonal: {
        rabiMm: number;
        kharifIMm: number;
        kharifIIMm: number;
      };
    };
    smap: {
      source: string;
      coveragePercentage: number;
      surfaceMean: number;
      rootzoneMean: number;
      surfaceMin: number;
      surfaceMax: number;
      rootzoneMin: number;
      rootzoneMax: number;
      condition: string;
      dryStressDays: number;
      optimalMoistureDays: number;
      waterloggedDays: number;
    };
    modis: {
      source: string;
      vegetationIndexNDVI: number;
      canopyVigorCondition: string;
      peakGreennessSeason: string;
      canopyHealthScore: number;
    };
  };
  rainInfo: {
    totalRainfallMm: number;
    annualAverageMm: number;
    dailyAverageMm: number;
    rainyDays: number;
    dryDays: number;
    drySpellsCount: number;
    heavyRainfallDays: number;
    monsoonRainfallMm: number;
    preMonsoonRainfallMm: number;
    winterDryRainfallMm: number;
    trend: string;
    monthlyRainfall: ITwoYearMonthlyPoint[];
  };
  soilInfo: {
    rootzoneMoisture: number;
    surfaceMoisture: number;
    moistureStatus: string;
    waterloggingRisk: string;
    droughtStressRisk: string;
    soilType: string;
    drainage: string;
    irrigationNeed: string;
    effectiveRootDepthHydration: string;
  };
  temperatureAndHumidity: {
    meanTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    extremeHeatDays: number;
    coldStressDays: number;
    solarRadiation: number;
    relativeHumidity: number;
    thermalStressStatus: string;
    monthlyTemperature: ITwoYearMonthlyPoint[];
  };
  suitabilityRecommendation: {
    isRequestedCropSuitable: boolean;
    suitabilityScore: number;
    primaryRecommendedCrop: string;
    primaryCropNameEn: string;
    primaryCropNameBn: string;
    cropFamily: string;
    compatibilityExplanation: string;
    alternativeCrops: Array<{
      cropId: string;
      nameEn: string;
      nameBn: string;
      suitabilityScore: number;
      reason: string;
    }>;
    plantingWindow: {
      start: string;
      end: string;
      labelEn: string;
      labelBn: string;
      confidence: string;
    };
    harvestingWindow: {
      start: string;
      end: string;
      labelEn: string;
      labelBn: string;
    };
    growingDurationDays: number;
    waterRequirementMm: number;
    waterStressIndex: string;
    climateRisks: Array<{
      factor: string;
      riskLevel: string;
      observation: string;
      mitigation: string;
    }>;
    farmerAdvice: string[];
  };
  confidenceScore: number;
  dataSources: string[];
}

export async function runTwoYearClimateAnalysis(
  payload: ITwoYearClimateAnalysisRequest
): Promise<{ success: boolean; data: ITwoYearClimateAnalysisResponse }> {
  return httpClient.post<{ success: boolean; data: ITwoYearClimateAnalysisResponse }>(
    "/ai/climate-analysis",
    payload,
    { timeout: 60000 }
  );
}


