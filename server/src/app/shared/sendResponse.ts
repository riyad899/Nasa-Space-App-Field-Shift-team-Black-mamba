import { Response } from "express";

interface IResponseData<T> {
    httpStatus: number;
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export const sendResponse = <T>(res: Response, responsData: IResponseData<T>) => {
    const { httpStatus, success, message, data, error } = responsData;
    res.status(httpStatus).json({
        success,
        message,
        data,
        error
    });
}

