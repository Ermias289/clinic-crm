using System.ComponentModel.DataAnnotations;
using static Clinic_CRM.Helpers.Constants;
namespace Clinic_CRM.Models
{
    public class MedicalProfessional
    {
        public int Id { get; set; }
        public string FName { get; set; } = string.Empty;
        public string MName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        public string ProfessionalName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string EducationalBackground { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; } = 0;
        public string Status { get; set; } = MEDICAL_PROFESSIONS_STATUS.ACTIVE;
        public string ProfilePicture { get; set; } = string.Empty;

        public bool RequiresUserAccount { get; set; }
        //public List<DentistryServiceToMedicalProfessionals>? DentistryServiceToMedicalProfessionals { get; set; }
        public ICollection<DoctorSchedule>? DoctorSchedules { get; set; }
        public ICollection<DentistryService>? DentistryServices { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set;}
    }
}
