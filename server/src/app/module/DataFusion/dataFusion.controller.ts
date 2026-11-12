import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { DataFusionService } from "./dataFusion.service.js";
import { DataFusionCronService } from "./dataFusion.cron.js";
import type { CalibrationProfile } from "./dataFusion.interface.js";

// GET /api/v1/data-fusion/run?deviceId=esp32-001&district=Dhaka&dateFrom=2024-01-01&dateTo=2025-12-31&calibrationProfile=DEFAULT
const getFusionRun = catchAsync(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as {
    deviceId: string;
    district: string;
    dateFrom: string;
    dateTo: string;
    calibrationProfile: CalibrationProfile;
  };

  const result = await DataFusionService.runDataFusion({
    deviceId: query.deviceId,
    district: query.district,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    calibrationProfile: query.calibrationProfile,
  });

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Data fusion analysis executed successfully",
    data: result,
  });
});

// GET /api/v1/data-fusion/comparison?district=Dhaka&dateFrom=2024-01-01&dateTo=2025-12-31
const getHistoricalComparison = catchAsync(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as {
    district: string;
    dateFrom: string;
    dateTo: string;
  };

  const result = await DataFusionService.getHistoricalComparisonSeries({
    district: query.district,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Historical comparison series retrieved successfully",
    data: result,
  });
});

// GET /api/v1/data-fusion/snapshots?deviceId=esp32-001&limit=50&offset=0
const getHistoricalSnapshots = catchAsync(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as {
    deviceId: string;
    limit: number;
    offset: number;
  };

  const result = await DataFusionService.getHistoricalSnapshots({
    deviceId: query.deviceId,
    limit: query.limit,
    offset: query.offset,
  });

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Historical telemetry snapshots fetched successfully",
    data: result,
  });
});

// POST /api/v1/data-fusion/collect
const triggerCollection = catchAsync(async (req: Request, res: Response) => {
  const body = req.body as { deviceId?: string };
  const deviceId = body?.deviceId || "esp32-001";

  const result = await DataFusionCronService.collectTelemetrySnapshot(deviceId);

  sendResponse(res, {
    httpStatus: result.status === "FAILED" ? status.BAD_GATEWAY : status.OK,
    success: result.status !== "FAILED",
    message: `Telemetry collection completed with status: ${result.status}`,
    data: result,
  });
});

export const DataFusionController = {
  getFusionRun,
  getHistoricalComparison,
  getHistoricalSnapshots,
  triggerCollection,
};
