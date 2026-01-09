using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Models;
using Clinic_CRM.Services.EmailService;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Macs;
using Microsoft.AspNetCore.Hosting;

namespace Clinic_CRM.Services.OTPGenerator
{
    public class OTPGeneratorService : IOTPGeneratorService
    {
        private readonly IEmailService _emailService;
        private readonly Context _context; // Replace with your actual DbContext
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        public OTPGeneratorService(IEmailService emailService, Context context,IWebHostEnvironment env, IConfiguration config)
        {
            _emailService = emailService;
            _context = context;
            _env = env;
            _config = config;
        }

        public async Task<string> SendOtpEmailAsync(string recipientEmail)
        {
            var secretKey = Encoding.UTF8.GetBytes(_config["OtpSecret"]);

            using var hmac = new HMACSHA512(secretKey);

            string otp = OTPGenerator.GenerateAlphaNumericOtp();

            string templatePath = Path.Combine(_env.ContentRootPath, "OTP.html");
            string htmlBody = await File.ReadAllTextAsync(templatePath);
            htmlBody = htmlBody.Replace("{{OTP}}", otp);

            await _emailService.SendEmailAsync(
                recipientEmail,
                "Verify Email - One Time Password",
                htmlBody,
                true
            );

            var otpEntity = new OTP
            {
                Email = recipientEmail.ToLower(),
                OtpHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(otp.Trim())),
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.OTPs.Add(otpEntity);
            await _context.SaveChangesAsync();

            return "Email Sent.";
        }

        public async Task<bool> VerifyOtpAsync(string email, string submittedOtp)
        {
            var otpRecord = await _context.OTPs
                .Where(x => x.Email == email.ToLower())
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                throw new InvalidOperationException("OTP not found.");

            if (otpRecord.ExpiresAt < DateTime.UtcNow)
                throw new InvalidOperationException("OTP expired.");

            if (otpRecord.IsUsed)
                throw new InvalidOperationException("OTP already used.");

            var secretKey = Encoding.UTF8.GetBytes(_config["OtpSecret"]);
            using var hmac = new HMACSHA512(secretKey);

            var submittedHash = hmac.ComputeHash(
                Encoding.UTF8.GetBytes(submittedOtp.Trim())
            );

            if (!CryptographicOperations.FixedTimeEquals(
                    otpRecord.OtpHash,
                    submittedHash))
            {
                throw new InvalidOperationException("Wrong OTP.");
            }

            var user = await _context.Users.Where(x => x.Email == otpRecord.Email).FirstOrDefaultAsync();

            if (user == null)
                throw new KeyNotFoundException("There is no User account with this email.");

            user.IsEmailConfirmed = true;

            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
