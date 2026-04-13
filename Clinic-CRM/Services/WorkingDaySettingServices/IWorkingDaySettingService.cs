using Clinic_CRM.DTOs.WorkingDaySettingDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.WorkingDaySettingServices
{
    public interface IWorkingDaySettingService
    {
        Task<WorkingDaySetting> AddWorkingDaySetting(AddWorkingDaySettingDTO dto);
        Task<WorkingDaySetting> UpdateWorkingDaySetting(UpdateWorkingDaySettingDTO dto);
        Task<WorkingDaySetting> GetWorkingDaySettingById(int Id);
        Task<List<WorkingDaySetting>> GetAll();
        Task<WorkingDaySetting> DeleteWorkingDaySetting(int Id);
    }
}
