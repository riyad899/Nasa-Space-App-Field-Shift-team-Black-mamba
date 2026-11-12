/**
 * CropWise AI — CropRotation Module Interfaces
 */

export interface IPreferredCropItem {
    crop: string;
    priority?: number; // 1 = highest, 2 = second, etc.
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
        extremeHeatDays: number; // Days > 35C
        frostOrColdStressDays: number; // Days < 12C
    };
    rainfall: {
        totalRainfallMm: number;
        averageDailyMm: number;
        maxDailyRainfallMm: number;
        rainyDays: number;
        dryDays: number;
        drySpellsCount: number; // Sequences of >= 10 consecutive dry days
        heavyRainfallDays: number; // Days >= 25mm
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
    plantingWindow: string; // e.g. "November 01 – November 30"
    harvestingWindow: string; // e.g. "February 05 – March 10"
    estimatedPlantingDate: string; // e.g. "2025-11-15"
    estimatedHarvestDate: string; // e.g. "2026-02-20"
    growingDurationDays: number;
    transitionPeriodDays: number;
    waterRequirementMm: number;
    waterConsiderations: string;
    soilConsiderations: string;
    nutrientImpact: string;
    reasonForSelection: string;
    suitabilityScore: number; // 0 - 100
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
