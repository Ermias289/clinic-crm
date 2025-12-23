namespace Clinic_CRM.DTOs.UserDTOs
{
    public class ChangePasswordDTO
    {
        public string PhoneOrEmail { get; set; } = string.Empty;
        public string? Password { get; set; } = string.Empty;
        public string? NewPassword { get; set; } = string.Empty;
        public string? OTP { get; set; } = string.Empty;
        public bool Reset { get; set; } = false;
    }
}
