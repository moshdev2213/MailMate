import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
  timestamp: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500
): void {
  const response: ApiResponse = {
    success: false,
    data: null,
    error: {
      message,
      code,
    },
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

