using Clinic_CRM.DTOs.DashboardDTOs;

namespace Clinic_CRM.Services.DashBoardServices
{
    public interface IDashBoardService
    {
        Task<DashboardDTO> GetAppointmentReport(DateOnly? fromDate, DateOnly? ToDate);
        Task<MostBookedServicesDTO> GetMostBookedServices();
    }
}
