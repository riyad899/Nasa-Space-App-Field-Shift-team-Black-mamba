import { Router } from "express";
import { validateZodQuery, validateZodSchema } from "../../../middleware/validateReq.js";
import {
  dataFusionQuerySchema,
  dataFusionHistoryQuerySchema,
  triggerSnapshotCollectionSchema,
} from "./dataFusion.validation.js";
import { DataFusionController } from "./dataFusion.controller.js";

const router = Router();

// Run full sensor-to-satellite fusion with calibration and validation metrics
router
  .route("/run")
  .get(validateZodQuery(dataFusionQuerySchema), DataFusionController.getFusionRun);

// Historical daily comparison timeseries (Satellite SMAP vs Ground In-situ)
router
  .route("/comparison")
  .get(validateZodQuery(dataFusionQuerySchema), DataFusionController.getHistoricalComparison);

// Paginated historical device snapshots from Prisma database
router
  .route("/snapshots")
  .get(validateZodQuery(dataFusionHistoryQuerySchema), DataFusionController.getHistoricalSnapshots);

// On-demand trigger to pull and persist a fresh telemetry snapshot from ESP32 cloud gateway
router
  .route("/collect")
  .post(validateZodSchema(triggerSnapshotCollectionSchema), DataFusionController.triggerCollection);

export const DataFusionRoute = router;
