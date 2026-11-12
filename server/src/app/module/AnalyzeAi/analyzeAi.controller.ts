import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { AnalyzeAiService } from "./analyzeAi.service.js";
import { AnalysisTransparencyService } from "../AnalysisTransparency/analysisTransparency.service.js";

const runAnalysis = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyzeAiService.runAnalysis(req.body);

  if (req.user?.userId) {
    try {
      await AnalysisTransparencyService.saveAnalysisHistory({
        analysisId: result.analysisId,
        location: result.location,
        crop: req.body.crop || { currentCrop: result.recommendation?.primaryCrop },
        farmingMethod: "rainfed_or_irrigated",
        farmerPriority: req.body.farmerPriority,
        results: result,
        plantingWindowStart: result.recommendation?.plantingWindow?.start,
        plantingWindowEnd: result.recommendation?.plantingWindow?.end,
        confidence: "high",
        dataSources: result.dataSources,
        recommendationText: `Primary: ${result.recommendation?.primaryCrop}. Alternatives: ${result.recommendation?.alternativeCrops?.join(", ") || "None"}`,
        cropType: result.recommendation?.primaryCrop,
        farmerGuidance: result.farmerAdvice,
        whyThisResult: result.whyThisResult,
      }, req.user.userId);
    } catch (saveErr) {
      console.warn("Failed to auto-save analysis history:", saveErr);
    }
  }

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "FieldShift agricultural analysis completed successfully",
    data: result,
  });
});

const runTwoYearClimateAnalysis = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyzeAiService.analyzeTwoYearClimate(req.body);

  if (req.user?.userId) {
    try {
      await AnalysisTransparencyService.saveAnalysisHistory({
        analysisId: result.analysisId,
        location: {
          latitude: result.location.latitude,
          longitude: result.location.longitude,
          district: result.location.district,
        },
        crop: {
          currentCrop: result.cropRequested,
        },
        farmingMethod: "climate_resilient_empiric",
        farmerPriority: {
          priority: result.farmerPriority,
        },
        results: result,
        plantingWindowStart: result.suitabilityRecommendation.plantingWindow.start,
        plantingWindowEnd: result.suitabilityRecommendation.plantingWindow.end,
        confidence: "high",
        dataSources: result.dataSources,
        recommendationText: `Primary: ${result.suitabilityRecommendation.primaryCropNameEn}. Suitability: ${result.suitabilityRecommendation.suitabilityScore}%.`,
        cropType: result.suitabilityRecommendation.primaryCropNameEn,
        farmerGuidance: result.suitabilityRecommendation.farmerAdvice,
        whyThisResult: {
          confidenceScore: result.confidenceScore,
          modelReasoning: result.suitabilityRecommendation.compatibilityExplanation,
          keyObservations: result.suitabilityRecommendation.climateRisks.map(
            (r) => `${r.factor}: ${r.observation}`
          ),
          riskEvaluation: result.suitabilityRecommendation.climateRisks.map(
            (r) => `${r.factor}: ${r.mitigation}`
          ),
        },
      }, req.user.userId);
    } catch (saveErr) {
      console.warn("Failed to auto-save 2-year climate analysis history:", saveErr);
    }
  }

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "2-Year NASA Earth Observation climate analysis completed successfully",
    data: result,
  });
});

export const AnalyzeAiController = {
  runAnalysis,
  runTwoYearClimateAnalysis,
};

