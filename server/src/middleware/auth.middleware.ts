import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { jwtService } from '../services/jwt.service';
import { logger } from '../utils/logger.util';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwtService.verifyAccessToken(token);
    
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error: any) {
    logger.warn('JWT verification failed', { error: error.message });
    
    if (error.message === 'Token expired') {
      return sendError(res, 'Token expired', 'TOKEN_EXPIRED', 401);
    }
    
    return sendError(res, 'Invalid token', 'UNAUTHORIZED', 401);
  }
}

