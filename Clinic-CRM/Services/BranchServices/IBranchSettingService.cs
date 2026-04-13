using Clinic_CRM.DTOs.BranchSettingDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.BranchServices
{
    public interface IBranchSettingService
    {
        Task<BranchSetting> AddBranchSetting(AddBranchSettingDTO dto);
        Task<BranchSetting> UpdateBranchSetting(UpdateBranchSettingDTO dto);
        Task<BranchSetting> DeleteBranchSetting(int Id);
        Task<BranchSetting> GetBranchSettingById(int Id);
        Task<List<BranchSetting>> GetAllBranchSettings();
    }
}
