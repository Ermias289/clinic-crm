using Clinic_CRM.DTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.OTPGenerator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OTPController : ControllerBase
    {
        private readonly IOTPGeneratorService _otpGeneratorService;
        
        public OTPController(IOTPGeneratorService otpGeneratorService)
        {
            _otpGeneratorService = otpGeneratorService;
        }

        [HttpGet("resendOTP")]
        public async Task<ActionResult> SendOTP(string recipientEmail)
        {
            try
            {
                return Ok(await _otpGeneratorService.SendOtpEmailAsync(recipientEmail));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost("verifyOTP")]
        public async Task<ActionResult> VerifyOTP(string email, string submittedOtp)
        {
            try
            {
                return Ok(await _otpGeneratorService.VerifyOtpAsync(email, submittedOtp));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
