using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public MedicalService DentistryService { get; set; }
        public int DentistryId { get; set; }
        public MedicalProfessional MedicalProfessionals { get; set; }
        public int MedicalProfessionalId { get; set; }
        public Patient Patient { get; set; }
        public int? PatientId { get; set; }
        public BranchSetting? BranchSetting { get; set; }
        public int? BranchId { get; set; }
        public TimeOnly ReservationTime { get; set; }
        public DateOnly Day { get; set; }

        public string Status { get; set; } = string.Empty;

        public User CompletedBy { get; set; }
        public int? CompletedById { get; set; }
        public DateTime CompletedAt { get; set; }

        public User CanceledBy { get; set; }
        public int? CanceledById { get; set; }
        public DateTime CanceledAt { get; set; }
        public string CancelReason { get; set; } = string.Empty;
    }
}
