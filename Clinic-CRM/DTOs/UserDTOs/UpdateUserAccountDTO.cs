namespace Clinic_CRM.DTOs.UserDTOs
{
    public class UpdateUserAccountDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public string FName { get; set; } = string.Empty;
        public string MName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        public string Password { get; set; }
        public int UserRoleId { get; set; }
    }
}
