namespace Clinic_CRM.DTOs.UserDTOs
{
    public class GetUserDTO
    {
        public int Id { get; set; }

        public string Username { get; set; }
        public string FName { get; set; }
        public string MName { get; set; }
        public string LName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;

        public int UserRoleId { get; set; }

    }
}
