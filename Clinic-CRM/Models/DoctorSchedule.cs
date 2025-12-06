using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Clinic_CRM.Models
{
    public class DoctorSchedule
    {
        [Key]
        public int Id { get; set; }
        public MedicalProfessional MedicalProfessionals { get; set; }
        public int MedicalProfessionalId { get; set; }
        public string WeekDay { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
