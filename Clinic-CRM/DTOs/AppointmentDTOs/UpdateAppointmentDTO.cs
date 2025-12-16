using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.AppointmentDTOs
{
    public class UpdateAppointmentDTO
    {
        public int Id { get; set; }
        public int DentistryId { get; set; }
        public int MedicalProfessionalId { get; set; }
        public int? PatientId { get; set; }
        public int? BranchId { get; set; }
        public TimeOnly ReservationTime { get; set; }
        public DateOnly Day { get; set; }
    }
}
