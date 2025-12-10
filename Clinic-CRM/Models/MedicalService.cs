using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models
{
    public class MedicalService
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DurationInMinutes { get; set; } = 0;
        public string ServicePicture {  get; set; } = string.Empty;
        public ICollection<MedicalProfessional>? MedicalProfessionals { get; set; }
        //public ICollection<DentistryServiceToMedicalProfessionals>? DentistryServiceToMedicalProfessionals { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
