import { Router } from "express";
import { validateZodQuery } from "../../../middleware/validateReq.js";
import {
    farmIntelligenceOverviewSchema,
    farmIntelligenceTimeseriesSchema,
    farmIntelligenceSatelliteSchema,
    farmIntelligenceDailySchema,
} from "./farmIntelligence.validation.js";
import { FarmIntelligenceController } from "./farmIntelligence.controller.js";

const router = Router();

// Environmental intelligence overview with risk scoring
router
    .route("/overview")
    .get(validateZodQuery(farmIntelligenceOverviewSchema), FarmIntelligenceController.getOverview);

// Daily timeseries data for charting
router
    .route("/timeseries")
    .get(validateZodQuery(farmIntelligenceTimeseriesSchema), FarmIntelligenceController.getTimeseries);

// All 18 districts list with baseline properties
router
    .route("/districts")
    .get(FarmIntelligenceController.getDistricts);

// Paginated daily records
router
    .route("/daily")
    .get(validateZodQuery(farmIntelligenceDailySchema), FarmIntelligenceController.getDailyData);

// On-demand satellite datasets (MODIS, Landsat, ECOSTRESS, SoilGrids, Terrain, GEDI)
router
    .route("/satellite")
    .get(validateZodQuery(farmIntelligenceSatelliteSchema), FarmIntelligenceController.getSatelliteData);

export const FarmIntelligenceRoute = router;
