using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models.Settings
{
    public class BranchSetting
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string SubCity { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<MedicalService>? DentistryServices { get; set; }
        public ICollection<DoctorSchedule>? DoctorSchedules { get; set; }
        public ICollection<MedicalProfessional>? MedicalProfessionals { get; set; }
        //public ICollection<>
    }
}
