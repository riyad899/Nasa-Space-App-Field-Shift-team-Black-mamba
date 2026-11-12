import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { CropRotationService } from "./cropRotation.service.js";
import { ICropRotationAnalyzeInput } from "./cropRotation.interface.js";

const analyze = catchAsync(async (req: Request, res: Response) => {
    const payload = (res.locals.validatedBody || req.body) as ICropRotationAnalyzeInput;
    const result = await CropRotationService.analyzeCropRotation(payload);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Crop rotation recommendation generated successfully",
        data: result,
    });
});

const getCropsCatalog = catchAsync(async (_req: Request, res: Response) => {
    const result = CropRotationService.getSupportedCropsCatalog();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Supported crop catalog retrieved successfully",
        data: result,
    });
});

const validateSequence = catchAsync(async (req: Request, res: Response) => {
    const payload = res.locals.validatedBody || req.body;
    const result = CropRotationService.validateSequence(
        payload.previousCrop,
        payload.proposedCrops
    );

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Crop sequence validation completed",
        data: result,
    });
});

const getClimate = catchAsync(async (req: Request, res: Response) => {
    const payload = res.locals.validatedBody || (Object.keys(req.body).length > 0 ? req.body : req.query);
    const result = await CropRotationService.getClimateSummary(payload as any);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Location climate & soil summary retrieved successfully",
        data: result,
    });
});

const getHealth = catchAsync(async (_req: Request, res: Response) => {
    const result = CropRotationService.getHealthStatus();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "CropRotation module is operational",
        data: result,
    });
});

export const CropRotationController = {
    analyze,
    getCropsCatalog,
    validateSequence,
    getClimate,
    getHealth,
};
