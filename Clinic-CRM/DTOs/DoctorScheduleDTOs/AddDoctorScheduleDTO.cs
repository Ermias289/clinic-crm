using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.DoctorScheduleDTOs
{
    public class AddDoctorScheduleDTO
    {
        public int MedicalProfessionalId { get; set; }
        public string WeekDay { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
