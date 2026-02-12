using Clinic_CRM.DTOs.DocServiceDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.DocServiceServices
{
    public interface IDocServiceService
    {
        Task<DocService> GetDocServiceAsync(int Id);
        Task<List<DocService>> GetAllDocServices();
        Task<DocService> AddDocService(AddDocServiceDTO dto);
        Task<DocService> UpdateDocService(UpdateDocServiceDTO dto);
        Task<DocService> DeleteDocService(int Id);
        Task<List<DocService>> GetDocServicesForAppointment(int? serviceId, int? branchId, int? docId);
    }
}
