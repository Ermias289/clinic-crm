using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Models
{
    public class DocService
    {
        public int Id { get; set; }
        public MedicalProfessional MedicalProfessional { get; set; }
        public int MedicalProfessionalId { get; set; }
        public MedicalService MedicalService { get; set; }
        public int MedicalServiceId { get; set; }
        public BranchSetting BranchSetting { get; set; }
        public int BranchSettingId { get; set; }
    }
}
