import apiClient from './client';

export const otpService = {
  resendOTP: async (recipientEmail: string): Promise<void> => {
    await apiClient.get('/api/OTP/resendOTP', { params: { recipientEmail } });
  },

  verifyOTP: async (email: string, submittedOtp: string): Promise<void> => {
    await apiClient.post('/api/OTP/verifyOTP', null, { params: { email, submittedOtp } });
  },
};
