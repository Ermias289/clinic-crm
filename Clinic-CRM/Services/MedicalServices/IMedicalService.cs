using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.MedicalServices
{
    public interface IMedicalService
    {
        Task<MedicalService> GetMedicalServiceAsync(int Id);
        Task<List<MedicalService>> GetAllMedicalServices();
        Task<MedicalService> AddMedicalService(AddMedicalServiceDTO dto);
        Task<MedicalService> UpdateMedicalService(UpdateMedicalServiceDTO dto);
        Task<MedicalService> DeleteMedicalService(int Id);
        Task<List<MedicalService>> GetMedicalServicesForAppointment(int? serviceId, int? branchId, int? docId);
    }
}
