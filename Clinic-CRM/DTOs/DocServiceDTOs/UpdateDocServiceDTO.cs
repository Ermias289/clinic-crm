namespace Clinic_CRM.DTOs.DocServiceDTOs
{
    public class UpdateDocServiceDTO
    {
        public int Id { get; set; }
        public int MedicalProfessionalId { get; set; }
        public int MedicalServiceId { get; set; }
        public int BranchSettingId { get; set; }
    }
}
