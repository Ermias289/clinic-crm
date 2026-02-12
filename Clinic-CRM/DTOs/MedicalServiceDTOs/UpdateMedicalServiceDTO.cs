namespace Clinic_CRM.DTOs.MedicalServiceDTOs
{
    public class UpdateMedicalServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DurationInMinutes { get; set; } = 0;
        public string ServicePicture { get; set; } = string.Empty;
        public ICollection<int>? MedicalProfessionalsId { get; set; } = new List<int>();
        public ICollection<int>? Branches { get; set; } = new List<int>();
    }
}
