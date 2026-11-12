import { httpClient } from "../axios/httpClinet";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface IPreferredCropItem {
  crop: string;
  priority?: number;
}

export interface ICropRotationAnalyzeInput {
  district?: string;
  latitude?: number;
  longitude?: number;
  soilType?: string;
  drainage?: "GOOD" | "MODERATE" | "POOR";
  preferredCrops: Array<string | IPreferredCropItem>;
  excludedCrops?: string[];
  lastCultivatedCrop?: string;
  previousPlantingDate?: string;
  previousHarvestingDate?: string;
  previousCropSequence?: string[];
  analysisDateRange?: {
    start?: string;
    end?: string;
  };
}

export interface IEnvironmentalClimateSummary {
  temperature: {
    min: number;
    max: number;
    average: number;
    extremeHeatDays: number;
    frostOrColdStressDays: number;
  };
  rainfall: {
    totalRainfallMm: number;
    averageDailyMm: number;
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
  soilMoisture: {
    surfaceMean: number | null;
    rootzoneMean: number | null;
    surfaceMin: number | null;
    surfaceMax: number | null;
    rootzoneMin: number | null;
    rootzoneMax: number | null;
    condition: string;
    dryStressDays: number;
    optimalMoistureDays: number;
    waterloggedDays: number;
  };
}

export interface INasaDataCoverage {
  nasaPowerCoveragePercentage: number;
  imergCoveragePercentage: number;
  smapCoveragePercentage: number;
  requestedDays: number;
  availableDays: number;
  isSufficient: boolean;
  sources: string[];
}

export interface IScheduledCropItem {
  sequenceNumber: number;
  cropId: string;
  cropNameEn: string;
  cropNameBn: string;
  family: string;
  agriculturalSeason: "Rabi" | "Kharif-I" | "Kharif-II";
  plantingWindow: string;
  harvestingWindow: string;
  estimatedPlantingDate: string;
  estimatedHarvestDate: string;
  growingDurationDays: number;
  transitionPeriodDays: number;
  waterRequirementMm: number;
  waterConsiderations: string;
  soilConsiderations: string;
  nutrientImpact: string;
  reasonForSelection: string;
  suitabilityScore: number;
  isFarmerPreferred: boolean;
  potentialRisks: string[];
}

export interface ICropRotationPlan {
  planId: "plan_a_farmer_priority" | "plan_b_soil_health" | "plan_c_climate_water";
  titleEn: string;
  titleBn: string;
  focusDescription: string;
  schedule: IScheduledCropItem[];
  overallSuitabilityScore: number;
  metrics: {
    waterStressIndex: "LOW" | "MODERATE" | "HIGH";
    soilNutrientBalance: "POSITIVE_REGENERATIVE" | "BALANCED" | "DEPLETING";
    legumeInclusion: boolean;
    diseaseBreakEffective: boolean;
    farmerPreferenceFulfillmentPct: number;
  };
  keyBenefits: string[];
  managementRecommendations: string[];
}

export interface IExcludedCropExplanation {
  crop: string;
  reason: string;
  suggestedAlternative: string;
}

export interface ICropRotationAnalyzeOutput {
  location: {
    district?: string;
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
    start: string;
    end: string;
    days: number;
  };
  nasaDataCoverage: INasaDataCoverage;
  environmentalSummary: IEnvironmentalClimateSummary;
  farmerInputs: {
    preferredCropsRanked: string[];
    excludedCrops: string[];
    lastCultivatedCrop: string | null;
    soilType: string;
    drainage: string;
  };
  plans: {
    planA: ICropRotationPlan;
    planB: ICropRotationPlan;
    planC: ICropRotationPlan;
  };
  excludedCropsExplanation: IExcludedCropExplanation[];
  confidenceScore: number;
  missingDataNotes: string[];
}

export interface ICropCatalogItem {
  id: string;
  nameEn: string;
  nameBn: string;
  family: string;
  suitableSeasons: string[];
  durationDays: { min: number; max: number; average: number };
  waterNeedCategory: string;
  waterRequirementMm: { min: number; max: number; average: number };
  temperatureRangeC: { min: number; max: number; optimalMin: number; optimalMax: number };
  nutrientImpact: string;
  rootDepth: string;
  agronomicBenefits: string[];
  risks: string[];
}

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compatibilityIssues: Array<{
    previousCrop: string;
    candidateCrop: string;
    issue: string;
    severity: "CRITICAL" | "MODERATE" | "INFO";
  }>;
}

/**
 * Fetch crop rotation analysis from backend
 */
export async function analyzeCropRotation(
  payload: ICropRotationAnalyzeInput
): Promise<ICropRotationAnalyzeOutput> {
  const response = await httpClient.post<{
    success: boolean;
    message: string;
    data: ICropRotationAnalyzeOutput;
  }>("/crop-rotation/analyze", payload);
  return response.data;
}

/**
 * Fetch catalog of supported crops
 */
export async function getCropCatalog(): Promise<ICropCatalogItem[]> {
  const response = await httpClient.get<{
    success: boolean;
    message: string;
    data: ICropCatalogItem[];
  }>("/crop-rotation/crops");
  return response.data;
}

/**
 * Pre-validate sequence
 */
export async function validateCropSequence(payload: {
  previousCrop?: string;
  proposedCrops: string[];
}): Promise<IValidationResult> {
  const response = await httpClient.post<{
    success: boolean;
    message: string;
    data: IValidationResult;
  }>("/crop-rotation/validate", payload);
  return response.data;
}

/**
 * TanStack Query Hook: Mutation for analyzing crop rotation
 */
export function useCropRotationMutation() {
  return useMutation({
    mutationFn: (payload: ICropRotationAnalyzeInput) => analyzeCropRotation(payload),
  });
}

/**
 * TanStack Query Hook: Supported crops catalog
 */
export function useCropCatalogQuery() {
  return useQuery({
    queryKey: ["cropRotation", "catalog"],
    queryFn: getCropCatalog,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
