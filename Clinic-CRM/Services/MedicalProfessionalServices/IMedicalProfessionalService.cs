using Clinic_CRM.DTOs.MedicalProfessionalDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.MedicalProfessionalServices
{
    public interface IMedicalProfessionalService
    {
        Task<MedicalProfessional> AddMedicalProfessional(AddMedicalProfessionalDTO dto);
        Task<MedicalProfessional> UpdateMedicalProfessional(UpdateMedicalProfessionalDTO dto);
        Task<MedicalProfessional> GetMedicalProfessionalById(int Id);
        Task<MedicalProfessional> DeleteMedicalProfessionalById(int Id);
        Task<List<MedicalProfessional>> GetAllMedicalProfessionals();
        
    }

}
