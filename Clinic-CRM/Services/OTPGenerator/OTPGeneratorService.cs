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

namespace Clinic_CRM.Services.OTPGenerator
{
    public class OTPGeneratorService : IOTPGeneratorService
    {
        private readonly IEmailService _emailService;
        private readonly Context _context; // Replace with your actual DbContext

        public OTPGeneratorService(IEmailService emailService, Context context)
        {
            _emailService = emailService;
            _context = context;
        }

        public async Task<string> SendOtpEmailAsync(string recipientEmail)
        {
            using var hmac = new HMACSHA512();

            string otp = OTPGenerator.GenerateAlphaNumericOtp();

            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "OTP.html");
            string htmlBody = await File.ReadAllTextAsync(templatePath);

            htmlBody = htmlBody.Replace("{{OTP}}", otp);

            try
            {
                await _emailService.SendEmailAsync(recipientEmail, "Verify Email - One Time Password", htmlBody, true);
                Console.WriteLine("Email sent successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }


            var otpEntity = new OTP
            {
                Email = recipientEmail,
                OtpHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(otp)),
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
            using var hmac = new HMACSHA512();

            var otpRecord = await _context.Set<OTP>()
                .Where(x => x.Email == email)
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                throw new KeyNotFoundException("Invalid OTP.");

            if (otpRecord.ExpiresAt < DateTime.UtcNow)
                throw new KeyNotFoundException("OTP Has Expired.");

            if (otpRecord.IsUsed)
                throw new KeyNotFoundException("OTP Has Been Used.");

            byte[] otp = hmac.ComputeHash(Encoding.UTF8.GetBytes(submittedOtp));

            if (!otpRecord.OtpHash.SequenceEqual(otp))
                throw new KeyNotFoundException("Wrong OTP.");

            // Mark OTP as used
            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
