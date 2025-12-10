using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.AppointmentDTOs
{
    public class AddAppointmentDTO
    {
        public int DentistryId { get; set; }
        public int MedicalProfessionalId { get; set; }
        public int PatientId { get; set; }
        public TimeOnly ReservationTime { get; set; }
        public DateOnly Day { get; set; }
    }
}
