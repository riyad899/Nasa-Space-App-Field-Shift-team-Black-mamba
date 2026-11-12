import { Router } from "express";
import { validateZodSchema, validateZodQuery } from "../../../middleware/validateReq.js";
import { CropRotationController } from "./cropRotation.controller.js";
import {
    analyzeCropRotationSchema,
    validateCropSequenceSchema,
    getClimateSummarySchema,
} from "./cropRotation.validation.js";

const router = Router();

// Main Crop Rotation Recommendation Engine
router.post(
    "/analyze",
    validateZodSchema(analyzeCropRotationSchema),
    CropRotationController.analyze
);

// Crop Catalog (supported crops, traits, seasons, water & thermal ranges)
router.get(
    "/crops",
    CropRotationController.getCropsCatalog
);

// Sequence Validation (checks crop-family breaks, disease risks, legume benefits)
router.post(
    "/validate",
    validateZodSchema(validateCropSequenceSchema),
    CropRotationController.validateSequence
);

// Climate & Soil Moisture Summary (from NASA POWER, IMERG & SMAP)
router.post(
    "/climate",
    validateZodQuery(getClimateSummarySchema),
    CropRotationController.getClimate
);

router.get(
    "/climate",
    validateZodQuery(getClimateSummarySchema),
    CropRotationController.getClimate
);

// Health check endpoint
router.get(
    "/health",
    CropRotationController.getHealth
);

export const CropRotationRoute = router;
