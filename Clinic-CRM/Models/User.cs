using System.ComponentModel.DataAnnotations.Schema;

namespace Clinic_CRM.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }   
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        [ForeignKey("UserRole")]
        //public int UserRoleId { get; set; }
        //public UserRole UserRole { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
