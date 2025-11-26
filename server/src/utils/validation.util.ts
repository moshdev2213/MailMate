import { Request, Response, NextFunction } from 'express';
import { sendError } from './response.util';

export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

  if (isNaN(limit) || limit < 1 || limit > 100) {
    sendError(res, 'Invalid limit parameter. Must be between 1 and 100', 'VALIDATION_ERROR', 400);
    return;
  }

  if (isNaN(offset) || offset < 0) {
    sendError(res, 'Invalid offset parameter. Must be >= 0', 'VALIDATION_ERROR', 400);
    return;
  }

  req.query.limit = limit.toString();
  req.query.offset = offset.toString();
  next();
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

