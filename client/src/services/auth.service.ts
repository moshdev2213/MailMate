import api from './api';
import type { User } from '../types/auth.types';
import { API_BASE_URL } from '../config/api';

export const authService = {
  // Initiate Google OAuth - redirects to Google
  initiateGoogleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

