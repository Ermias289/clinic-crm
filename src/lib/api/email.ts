import apiClient from './client';

export interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export const emailService = {
  sendTestEmail: async (params: SendEmailParams): Promise<void> => {
    await apiClient.get('/api/test-email', { params });
  },
};
