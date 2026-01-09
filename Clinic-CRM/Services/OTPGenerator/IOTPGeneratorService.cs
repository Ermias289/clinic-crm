namespace Clinic_CRM.Services.OTPGenerator
{
    public interface IOTPGeneratorService
    {
        Task<bool> VerifyOtpAsync(string email, string submittedOtp);
        Task<string> SendOtpEmailAsync(string recipientEmail);
    }
}
