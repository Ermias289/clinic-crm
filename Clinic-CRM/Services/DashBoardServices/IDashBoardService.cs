using Clinic_CRM.DTOs.DashboardDTOs;

namespace Clinic_CRM.Services.DashBoardServices
{
    public interface IDashBoardService
    {
        Task<DashboardDTO> GetAppointmentReport(DateTime? fromDate, DateTime? ToDate);
        Task<MostBookedServicesDTO> GetMostBookedServices();
    }
}
