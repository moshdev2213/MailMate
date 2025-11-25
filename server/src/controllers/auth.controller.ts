import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger.util';
import { jwtService } from '../services/jwt.service';
import { OAuth2Client } from 'google-auth-library';
import { env } from 'process';
import { tokenService } from '../services/token.service';

const oauth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_CALLBACK_URL
);

class AuthController {
    initiateGoogleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
                prompt: 'consent',
            });

            res.redirect(authUrl);
        } catch (error) {
            logger.error('Failed to initiate Google auth', { error });
            next(error);
        }
    }
    async handleGoogleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, error } = req.query;

            if (error) {
                logger.error('Google OAuth error', { error });
                return sendError(res, 'Authentication failed', 'AUTH_ERROR', 401);
            }

            if (!code || typeof code !== 'string') {
                return sendError(res, 'Authorization code missing', 'VALIDATION_ERROR', 400);
            }

            // Exchange authorization code for tokens using tokenService
            const tokenResponse = await tokenService.getAccessToken(code);
            const { access_token, refresh_token } = tokenResponse;

            if (!access_token) {
                return sendError(res, 'Failed to get access token', 'AUTH_ERROR', 401);
            }

            // Get user info from Google using OAuth2Client
            oauth2Client.setCredentials({
                access_token,
            });

            const { data: profile } = await oauth2Client.request({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            });

            if (!profile || !(profile as any).id) {
                logger.error('Failed to get user info from Google');
                return sendError(res, 'Failed to get user information', 'AUTH_ERROR', 401);
            }

            const userInfo = profile as any;

            // Find or create user
            const user = await userService.findOrCreateUser({
                googleId: userInfo.id,
                email: userInfo.email || '',
                name: userInfo.name || null,
                refreshToken: refresh_token || null,
            });

            // Generate our JWT tokens
            const jwtAccessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            const jwtRefreshToken = jwtService.generateRefreshToken(user.id);

            sendSuccess(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
            });
        } catch (error) {
            logger.error('Google OAuth callback error', { error });
            next(error);
        }
    }
    // refresh the token
    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendError(res, 'Refresh token required', 'VALIDATION_ERROR', 400);
        }

        try {
            const { userId } = jwtService.verifyRefreshToken(refreshToken);
            const user = await userService.findById(userId);

            const newAccessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            sendSuccess(res, {
                accessToken: newAccessToken,
            });
        } catch (error: any) {
            logger.warn('Token refresh failed', { error: error.message });
            return sendError(res, 'Invalid or expired refresh token', 'UNAUTHORIZED', 401);
        }
    }
    async getCurrentUser(req: Request, res: Response) {
        if (!req.user) {
            return sendError(res, 'User not authenticated', 'UNAUTHORIZED', 401);
        }

        try {
            const user = await userService.findById(req.user.id);

            sendSuccess(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            logger.error('Failed to get user', { error });
            return sendError(res, 'Failed to get user', 'INTERNAL_ERROR', 500);
        }
    }
    logout(req: Request, res: Response) {
        sendSuccess(res, { message: 'Logged out successfully' });

    }
}

export const authController = new AuthController