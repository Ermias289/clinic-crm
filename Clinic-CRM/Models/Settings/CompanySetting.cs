using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models.Settings
{
    public class CompanySetting
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
        public string Prefix { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string SubCity { get; set; } = string.Empty;
        public ICollection<BranchSetting>? Branches { get; set; }
        public ICollection<WorkingDaySetting>? Workdays { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
