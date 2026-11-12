import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { StatisticalIntelligenceService } from "./statisticalIntelligence.service.js";

// GET /api/v1/statistical-intelligence/overview?district=Dhaka&dateFrom=2024-01-01&dateTo=2025-12-31&k=3
const getOverview = catchAsync(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as {
    district: string;
    dateFrom: string;
    dateTo: string;
    k: number;
  };

  const result = await StatisticalIntelligenceService.getStatisticalOverview({
    district: query.district || "Dhaka",
    dateFrom: query.dateFrom || "2024-01-01",
    dateTo: query.dateTo || "2025-12-31",
    k: Number(query.k) || 3,
  });

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    message: "Statistical intelligence analysis executed successfully",
    data: result,
  });
});

export const StatisticalIntelligenceController = {
  getOverview,
};
