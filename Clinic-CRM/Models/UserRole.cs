namespace Clinic_CRM.Models
{
    public class UserRole
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }


        public bool CanEditCompanySettings { get; set; } = false;
        public bool CanViewCompanySettings { get; set; } = false;
        






        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
