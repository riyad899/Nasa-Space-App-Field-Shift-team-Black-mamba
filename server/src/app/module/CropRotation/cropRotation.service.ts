/**
 * CropWise AI — CropRotation Module Service
 * Reuses existing NASA POWER, IMERG, and SMAP backend modules
 * to fetch 2-year empirical agro-climatic observations and run
 * deterministic crop rotation recommendation pipelines.
 */

import { NasaPowerService } from "../NasaPower/nasaPower.service.js";
import { ImergService } from "../IMERG/imerg.service.js";
import { SmapService } from "../SMAP/smap.service.js";
import { resolveLocation, getAllDatesInRange } from "../../shared/geo.constants.js";
import {
    SUPPORTED_CROPS,
    DEFAULT_ANALYSIS_DATE_RANGE,
    normalizeCropName,
} from "./cropRotation.constants.js";
import {
    ICropRotationAnalyzeInput,
    ICropRotationAnalyzeOutput,
    ICropCatalogItem,
    IValidationResult,
    IPreferredCropItem,
} from "./cropRotation.interface.js";
import {
    aggregateEnvironmentalData,
    generateAlternativeRotationPlans,
    validateCropSequence,
    IRawNasaDailyMetric,
    IRawImergDailyMetric,
    IRawSmapDailyMetric,
} from "./cropRotation.utils.js";

/**
 * Normalizes input preferred crops into an ordered list of strings
 */
function extractRankedPreferredCrops(
    inputPreferred: Array<string | IPreferredCropItem>
): string[] {
    const list: Array<{ crop: string; priority: number }> = [];

    inputPreferred.forEach((item, index) => {
        if (typeof item === "string") {
            list.push({ crop: item, priority: index + 1 });
        } else if (item && typeof item === "object") {
            list.push({
                crop: item.crop,
                priority: item.priority !== undefined ? item.priority : index + 1,
            });
        }
    });

    list.sort((a, b) => a.priority - b.priority);
    return list.map((i) => i.crop);
}

/**
 * Main Crop Rotation Analysis Pipeline
 */
async function analyzeCropRotation(
    input: ICropRotationAnalyzeInput
): Promise<ICropRotationAnalyzeOutput> {
    // 1. Resolve Location (District or Coords)
    const loc = resolveLocation({
        district: input.district,
        latitude: input.latitude,
        longitude: input.longitude,
    });

    // 2. Resolve Date Range (Defaults to 2-year historical range)
    const start = input.analysisDateRange?.start || DEFAULT_ANALYSIS_DATE_RANGE.start;
    const end = input.analysisDateRange?.end || DEFAULT_ANALYSIS_DATE_RANGE.end;
    const allDates = getAllDatesInRange(start, end);
    const requestedDays = allDates.length;

    // 3. Extract and rank preferred crops
    const preferredCropsRanked = extractRankedPreferredCrops(input.preferredCrops);
    const excludedCrops = input.excludedCrops || [];
    const lastCultivatedCrop = input.lastCultivatedCrop || null;
    const soilType = input.soilType || "Clay Loam / Alluvial Loam";
    const drainage = input.drainage || "MODERATE";

    // 4. Fetch 2-year Empirical Data from Existing NASA Modules concurrently
    const missingDataNotes: string[] = [];

    const [nasaPowerRes, imergRes, smapRes] = await Promise.allSettled([
        NasaPowerService.getRegionalHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
        ImergService.getImergHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
        SmapService.getSmapHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
    ]);

    // NASA POWER Data
    let rawNasaPower: IRawNasaDailyMetric[] = [];
    if (nasaPowerRes.status === "fulfilled" && nasaPowerRes.value) {
        const val = nasaPowerRes.value as any;
        const dailyArr = val.daily || val.records || val.data || [];
        rawNasaPower = dailyArr.map((r: any) => ({
            date: r.date,
            temperatureMean: r.temperatureMean ?? r.temperature?.mean,
            temperatureMin: r.temperatureMin ?? r.temperature?.min,
            temperatureMax: r.temperatureMax ?? r.temperature?.max,
            precipitation: r.rainfallMean ?? r.rainfall?.mean,
            solarRadiation: r.solarRadiationMean ?? r.solarRadiation?.mean,
        }));
    } else {
        missingDataNotes.push("NASA POWER historical archive query fallback: utilizing regional baseline averages.");
    }

    // IMERG Rainfall Data
    let rawImerg: IRawImergDailyMetric[] = [];
    if (imergRes.status === "fulfilled" && imergRes.value) {
        const val = imergRes.value as any;
        const dailyArr = val.data || val.records || val.daily || [];
        rawImerg = dailyArr.map((r: any) => ({
            date: r.date,
            rainfall: r.rainfall ?? r.meanRainfall,
            meanRainfall: r.meanRainfall ?? r.rainfall,
            isRainy: r.isRainy,
            isHeavyRain: r.isHeavyRain,
            season: r.season,
        }));
    } else {
        missingDataNotes.push("NASA IMERG precipitation archive fallback: utilizing seasonal climatology averages.");
    }

    // SMAP Soil Moisture Data
    let rawSmap: IRawSmapDailyMetric[] = [];
    if (smapRes.status === "fulfilled" && smapRes.value) {
        const val = smapRes.value as any;
        const dailyArr = val.data || val.daily || val.records || [];
        rawSmap = dailyArr.map((r: any) => ({
            date: r.date,
            surfaceSm: r.surfaceSm ?? r.surfaceSoilMoisture,
            rootzoneSm: r.rootzoneSm ?? r.rootzoneSoilMoisture,
            surfaceCondition: r.surfaceCondition,
            rootzoneCondition: r.rootzoneCondition,
        }));
    } else {
        missingDataNotes.push("NASA SMAP soil moisture archive fallback: utilizing default agro-zone moisture balance.");
    }

    // 5. Aggregate Environmental & Climate Metrics
    const { summary: envSummary, coverage: dataCoverage } = aggregateEnvironmentalData(
        rawNasaPower,
        rawImerg,
        rawSmap,
        requestedDays
    );

    // 6. Execute Crop Rotation Engine & Generate 3 Alternative Plans
    const { planA, planB, planC, excludedExplanations } = generateAlternativeRotationPlans(
        preferredCropsRanked,
        excludedCrops,
        lastCultivatedCrop,
        envSummary
    );

    // 7. Calculate overall model confidence score
    let confidence = 85;
    if (dataCoverage.nasaPowerCoveragePercentage >= 80) confidence += 5;
    if (dataCoverage.imergCoveragePercentage >= 80) confidence += 5;
    if (dataCoverage.smapCoveragePercentage >= 80) confidence += 5;
    if (preferredCropsRanked.length >= 2) confidence = Math.min(98, confidence + 2);

    return {
        location: {
            district: loc.district,
            latitude: loc.latitude,
            longitude: loc.longitude,
            regionKey: loc.regionKey,
            boundingBox: {
                latitudeMin: loc.latitudeMin,
                latitudeMax: loc.latitudeMax,
                longitudeMin: loc.longitudeMin,
                longitudeMax: loc.longitudeMax,
            },
        },
        analysisPeriod: {
            start,
            end,
            days: requestedDays,
        },
        nasaDataCoverage: dataCoverage,
        environmentalSummary: envSummary,
        farmerInputs: {
            preferredCropsRanked,
            excludedCrops,
            lastCultivatedCrop,
            soilType,
            drainage,
        },
        plans: {
            planA,
            planB,
            planC,
        },
        excludedCropsExplanation: excludedExplanations,
        confidenceScore: confidence,
        missingDataNotes,
    };
}

/**
 * Returns catalog of all supported crops and their agro-ecological traits
 */
function getSupportedCropsCatalog(): ICropCatalogItem[] {
    return Object.values(SUPPORTED_CROPS).map((crop) => ({
        id: crop.id,
        nameEn: crop.nameEn,
        nameBn: crop.nameBn,
        family: crop.family,
        suitableSeasons: crop.suitableSeasons,
        durationDays: crop.durationDays,
        waterNeedCategory: crop.waterNeedCategory,
        waterRequirementMm: crop.waterRequirementMm,
        temperatureRangeC: crop.temperatureRangeC,
        nutrientImpact: crop.nutrientImpact,
        rootDepth: crop.rootDepth,
        agronomicBenefits: crop.agronomicBenefits,
        risks: crop.risks,
    }));
}

/**
 * Pre-validates a proposed crop sequence against agronomic rules
 */
function validateSequence(
    previousCrop?: string,
    proposedCrops: string[] = []
): IValidationResult {
    return validateCropSequence(previousCrop, proposedCrops);
}

/**
 * Fetches climate & soil summary for a location using existing NASA modules
 */
async function getClimateSummary(query: {
    district?: string;
    latitude?: number;
    longitude?: number;
    start?: string;
    end?: string;
}) {
    const loc = resolveLocation(query);
    const start = query.start || DEFAULT_ANALYSIS_DATE_RANGE.start;
    const end = query.end || DEFAULT_ANALYSIS_DATE_RANGE.end;
    const allDates = getAllDatesInRange(start, end);

    const [nasaPowerRes, imergRes, smapRes] = await Promise.allSettled([
        NasaPowerService.getRegionalHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
        ImergService.getImergHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
        SmapService.getSmapHistoricalDataFromDB({
            latitude: loc.latitude,
            longitude: loc.longitude,
            district: loc.district,
            start,
            end,
            mode: "full",
        }),
    ]);

    const rawNasa: IRawNasaDailyMetric[] = (nasaPowerRes.status === "fulfilled" && (nasaPowerRes.value as any)?.daily) || [];
    const rawImerg: IRawImergDailyMetric[] = (imergRes.status === "fulfilled" && (imergRes.value as any)?.data) || [];
    const rawSmap: IRawSmapDailyMetric[] = (smapRes.status === "fulfilled" && (smapRes.value as any)?.data) || [];

    return aggregateEnvironmentalData(rawNasa, rawImerg, rawSmap, allDates.length);
}

/**
 * Health check for CropRotation module
 */
function getHealthStatus() {
    return {
        status: "UP",
        module: "CropRotation",
        reusedModules: ["NasaPower", "IMERG", "SMAP", "AnalysisTransparency"],
        supportedDistrictsCount: 18,
        supportedCropsCount: Object.keys(SUPPORTED_CROPS).length,
        timestamp: new Date().toISOString(),
    };
}

export const CropRotationService = {
    analyzeCropRotation,
    getSupportedCropsCatalog,
    validateSequence,
    getClimateSummary,
    getHealthStatus,
};
