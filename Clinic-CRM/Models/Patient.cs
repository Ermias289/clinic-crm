using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinic_CRM.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }
        public string FName { get; set; } = string.Empty;
        public string MName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Alergies { get; set; } = string.Empty;
        public string ChronicConditions { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string SubCity { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User? User { get; set; }
        public int? UserId { get; set; }

        public DateOnly DateOfBirth { get; set; }
        public bool RequiresUserAccount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
