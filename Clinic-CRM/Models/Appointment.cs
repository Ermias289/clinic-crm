using System.ComponentModel.DataAnnotations;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public MedicalService Dentistry { get; set; }
        public int DentistryId { get; set; }
        public MedicalProfessional MedicalProfessional { get; set; }
        public int MedicalProfessionalId { get; set; }
        public Patient Patient { get; set; }
        public int? PatientId { get; set; }
        public BranchSetting? BranchSetting { get; set; }
        public int? BranchId { get; set; }
        public TimeOnly ReservationTime { get; set; }
        public DateOnly Day { get; set; }

        public string Status { get; set; } = string.Empty;

        public User ScheduledBy { get; set; }
        public int? ScheduledById { get; set; }
        public DateTime ScheduledAt { get; set; }

        public User CompletedBy { get; set; }
        public int? CompletedById { get; set; }
        public DateTime CompletedAt { get; set; }

        public User CanceledBy { get; set; }
        public int? CanceledById { get; set; }
        public DateTime CanceledAt { get; set; }
        public string CancelReason { get; set; } = string.Empty;


        public bool OneDayReminderSent { get; set; } = false;
        public bool OneHourReminderSent { get; set; } = false;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
