export interface IAnalyzeLocation {
  latitude: number;
  longitude: number;
}

export interface IAnalyzePeriod {
  startDate: string; // YYYY-MM-DD or YYYYMMDD
  endDate: string;   // YYYY-MM-DD or YYYYMMDD
}

export interface IAnalyzeCrop {
  currentCrop?: string;
  consideringCrops?: string[];
}

export interface IAnalyzeFarmerPriority {
  waterAvailability?: "low" | "medium" | "high" | string;
  riskTolerance?: "low" | "medium" | "high" | string;
  priority?: "water_saving" | "yield_maximization" | "cost_minimization" | string;
}

export interface IAnalyzeSoil {
  type?: string;
  ph?: number;
}

export interface IAnalyzeAiRequest {
  location: IAnalyzeLocation;
  analysisPeriod: IAnalyzePeriod;
  crop?: IAnalyzeCrop;
  farmerPriority?: IAnalyzeFarmerPriority;
  soil?: IAnalyzeSoil;
}

export interface IPlantingWindow {
  start: string;
  end: string;
}

export interface IRecommendation {
  primaryCrop: string;
  alternativeCrops: string[];
  plantingWindow: IPlantingWindow;
  waterRequirement: "low" | "medium" | "high" | string;
  riskLevel: "low" | "moderate" | "high" | "severe" | string;
}

export interface IWhyThisResult {
  factor: string;
  observation: string;
  impact: string;
}

export interface IClimateSummary {
  temperature: {
    mean: number | null;
    max: number | null;
  };
  rainfall: {
    recent: number | null;
    trend: "low" | "moderate" | "high" | "insufficient_data" | string;
  };
  soilMoisture: {
    surface: number | null;
    rootzone: number | null;
    trend: "decreasing" | "increasing" | "stable" | "insufficient_data" | string;
  };
}

export interface IRiskItem {
  type: string;
  level: "low" | "moderate" | "high" | "critical" | string;
  reason: string;
}

export interface IAnalyzeAiResponse {
  analysisId: string;
  location: IAnalyzeLocation;
  analysisPeriod: IAnalyzePeriod;
  recommendation: IRecommendation;
  whyThisResult: IWhyThisResult[];
  climateSummary: IClimateSummary;
  risks: IRiskItem[];
  farmerAdvice: string[];
  dataSources: string[];
  knowledgeSources: string[];
  generatedBy: {
    provider: string;
    model: string;
  };
}

export interface INormalizedEnvironmentalContext {
  power?: {
    avgTemperature: number | null;
    maxTemperature: number | null;
    totalRainfall: number | null;
    avgSolarRadiation: number | null;
    recordsCount: number;
  };
  imerg?: {
    totalRainfall: number | null;
    averageRainfall: number | null;
    maximumDailyRainfall: number | null;
    rainyDays: number;
    dryDays: number;
  };
  smap?: {
    surfaceMoistureMean: number | null;
    rootzoneMoistureMean: number | null;
    surfaceCondition?: string;
    rootzoneCondition?: string;
  };
  missingSources: string[];
}

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

export interface ITwoYearMonthlyData {
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
    monthlyRainfall: ITwoYearMonthlyData[];
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
    monthlyTemperature: ITwoYearMonthlyData[];
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

