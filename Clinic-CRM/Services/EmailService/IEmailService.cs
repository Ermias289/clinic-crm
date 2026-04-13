namespace Clinic_CRM.Services.EmailService
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string recipientEmail, string subject, string body, bool isHtml = false);
    }
}
