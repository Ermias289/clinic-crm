namespace Clinic_CRM.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public DentistryService DentistryService { get; set; }
        public int DentistryId { get; set; }
        public MedicalProfessional MedicalProfessionals { get; set; }
        public int MedicalProfessionalId { get; set; }
        public Patient Patient { get; set; }
        public int PatientId { get; set; }
        public Card Card { get; set; }
        public int CardId { get; set; }

    }
}
