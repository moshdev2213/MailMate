import api from './api';
import type { EmailResponse } from '../types/email.types';

export interface GetEmailsParams {
  limit?: number;
  offset?: number;
  refresh?: boolean;
  fetchLimit?: number;
}

export const emailService = {
  // Get emails with pagination
  getEmails: async (params: GetEmailsParams = {}): Promise<EmailResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());
    if (params.refresh) queryParams.set('refresh', 'true');
    if (params.fetchLimit) queryParams.set('fetchLimit', params.fetchLimit.toString());

    const response = await api.get(`/email?${queryParams.toString()}`);
    return response.data.data;
  },
};

