using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Clinic_CRM.Models
{
    public class DoctorSchedule
    {
        public int Id { get; set; }
        public MedicalProfessional MedicalProfessionals { get; set; }
        public int MedicalProfessionalId { get; set; }
        public List<string> WeekDay { get; set; } = new List<string>();
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
