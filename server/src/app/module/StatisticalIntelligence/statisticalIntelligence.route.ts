import { Router } from "express";
import { validateZodQuery } from "../../../middleware/validateReq.js";
import { statisticalOverviewQuerySchema } from "./statisticalIntelligence.validation.js";
import { StatisticalIntelligenceController } from "./statisticalIntelligence.controller.js";

const router = Router();

// Full multi-approach statistical intelligence analysis & comparison
router
  .route("/overview")
  .get(
    validateZodQuery(statisticalOverviewQuerySchema),
    StatisticalIntelligenceController.getOverview
  );

export const StatisticalIntelligenceRoute = router;
