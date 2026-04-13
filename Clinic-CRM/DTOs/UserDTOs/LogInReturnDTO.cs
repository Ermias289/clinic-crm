using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.UserDTOs
{
    public class LogInReturnDTO
    {
        public string token { get; set; }
        public UserRole userRole { get; set; }
        public User user { get; set; }
    }
}
