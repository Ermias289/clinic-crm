import api from "./axios";

// LOGIN
export const loginApi = (data) => {
  return api.post("/api/Auth/login", data);
};

// RESEND OTP
export const resendOtpApi = (email) => {
  return api.get("/api/OTP/resendOTP", {
    params: { email },
  });
};

// CHANGE PASSWORD (RESET)
export const resetPasswordApi = (data) => {
  return api.post("/api/Auth/changePassword", data);
};
