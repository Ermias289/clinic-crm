using Clinic_CRM.Helpers;
using Clinic_CRM.Services.EmailService;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/test-email")]
public class TestEmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public TestEmailController()
    {
        _emailService = new EmailService();
    }

    [HttpGet]
    public async Task<IActionResult> Send(string recipientEmail, string subject, string body, bool isHtml = false)
    {
        try
        {
            return Ok(await _emailService.SendEmailAsync(recipientEmail, subject, body, isHtml = false));
        }catch (Exception ex)
        {
            return this.ParseException(ex);
        }
    }
}
