import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { FarmIntelligenceService } from "./farmIntelligence.service.js";

// GET /api/v1/farm-intelligence/overview?district=Dhaka&dateFrom=2024-01-01&dateTo=2025-12-31
const getOverview = catchAsync(async (req: Request, res: Response) => {
    const { district, dateFrom, dateTo } = (res.locals.validatedQuery ?? req.query) as {
        district: string;
        dateFrom: string;
        dateTo: string;
    };

    const result = await FarmIntelligenceService.getOverview(district, dateFrom, dateTo);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Farm intelligence overview fetched successfully",
        data: result,
    });
});

// GET /api/v1/farm-intelligence/timeseries?district=Dhaka&dateFrom=2024-01-01&dateTo=2025-12-31
const getTimeseries = catchAsync(async (req: Request, res: Response) => {
    const { district, dateFrom, dateTo } = (res.locals.validatedQuery ?? req.query) as {
        district: string;
        dateFrom: string;
        dateTo: string;
    };

    const result = await FarmIntelligenceService.getTimeseries(district, dateFrom, dateTo);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Farm intelligence timeseries data fetched",
        data: result,
    });
});

// GET /api/v1/farm-intelligence/districts
const getDistricts = catchAsync(async (_req: Request, res: Response) => {
    const result = await FarmIntelligenceService.getDistricts();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "All districts fetched successfully",
        data: result,
    });
});

// GET /api/v1/farm-intelligence/daily?district=Dhaka&dateFrom=...&dateTo=...&limit=50
const getDailyData = catchAsync(async (req: Request, res: Response) => {
    const params = (res.locals.validatedQuery ?? req.query) as {
        district?: string;
        dateFrom?: string;
        dateTo?: string;
        limit?: number;
        offset?: number;
    };

    const result = await FarmIntelligenceService.getDailyData(params);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Daily environmental data retrieved",
        data: result,
    });
});

// GET /api/v1/farm-intelligence/satellite?lat=23.8&lon=90.4&dataset=all
const getSatelliteData = catchAsync(async (req: Request, res: Response) => {
    const params = (res.locals.validatedQuery ?? req.query) as {
        lat: number;
        lon: number;
        dateFrom: string;
        dateTo: string;
        dataset: string;
    };

    const result = await FarmIntelligenceService.getSatelliteData(params);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Satellite dataset retrieved successfully",
        data: result,
    });
});

export const FarmIntelligenceController = {
    getOverview,
    getTimeseries,
    getDistricts,
    getDailyData,
    getSatelliteData,
};
