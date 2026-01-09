using System.Security.Cryptography;

namespace Clinic_CRM.Services.OTPGenerator
{
    public class OTPGenerator
    {
        private const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public static string GenerateAlphaNumericOtp(int length = 6)
        {
            if (length <= 0) throw new ArgumentException("Length must be positive", nameof(length));

            using var rng = RandomNumberGenerator.Create();
            var otp = new char[length];

            for (int i = 0; i < length; i++)
            {
                byte[] randomByte = new byte[1];
                rng.GetBytes(randomByte);
                otp[i] = chars[randomByte[0] % chars.Length];
            }

            return new string(otp);
        }
    }
}
