using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Clinic_CRM.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FName { get; set; } = string.Empty;
        public string MName { get; set; } = string.Empty;

        public string LName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        [JsonIgnore]
        public byte[] PasswordHash { get; set; }
        [JsonIgnore]
        public byte[] PasswordSalt { get; set; }
        [ForeignKey("UserRole")]
        public int UserRoleId { get; set; }
        public UserRole UserRole { get; set; }

        public bool IsEmailConfirmed { get; set; } 

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
