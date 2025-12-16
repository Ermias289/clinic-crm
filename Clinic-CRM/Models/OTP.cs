using System;

namespace Clinic_CRM.Models
{
    public class OTP
    {
        public int Id { get; set; }

        public byte[] OtpHash { get; set; }  // Stores the hashed OTP

        public string Email { get; set; }    // Links OTP to user/email

        public DateTime ExpiresAt { get; set; }  // When OTP is no longer valid

        public bool IsUsed { get; set; } = false;   // Has the OTP been used

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Timestamp for logging/cleanup
    }
}
