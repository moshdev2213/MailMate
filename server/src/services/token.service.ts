import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { decrypt } from '../utils/crypto.util';
import { logger } from '../utils/logger.util';

const oauth2Client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL
);

export interface TokenResponse {
  access_token: string;
  refresh_token?: string | null;
  expires_in: number;
  token_type: string;
}

class TokenService {
  async refreshAccessToken(encryptedRefreshToken: string): Promise<TokenResponse> {
    try {
      const refreshToken = decrypt(encryptedRefreshToken);
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token');
      }

      return {
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        expires_in: credentials.expiry_date
          ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
          : 3600,
        token_type: credentials.token_type || 'Bearer',
      };
    } catch (error) {
      logger.error('Token refresh failed', { error });
      throw new Error('Failed to refresh access token');
    }
  }

  async getAccessToken(code: string): Promise<TokenResponse> {
    try {
      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error('Failed to get access token');
      }

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expiry_date
          ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
          : 3600,
        token_type: tokens.token_type || 'Bearer',
      };
    } catch (error) {
      logger.error('Token exchange failed', { error });
      throw new Error('Failed to exchange authorization code');
    }
  }
};

export const tokenService = new TokenService()