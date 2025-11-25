import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger.util';

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface RefreshTokenPayload {
  userId: number;
}

class JwtService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(userId: number): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as any;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.userId,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }
};

export const jwtService = new JwtService()