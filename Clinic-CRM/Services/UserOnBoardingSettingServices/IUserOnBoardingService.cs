using Clinic_CRM.DTOs.UserOnBoardingSettingDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.UserOnBoardingSettingServices
{
    public interface IUserOnBoardingService
    {
        Task<List<UserOnBoardingSetting>> GetAllUserOnBoardingSetting();
        Task<UserOnBoardingSetting> GetUserOnBoardingSetting(int Id);
        Task<UserOnBoardingSetting> DeleteUserOnBoarding(int Id);
        Task<UserOnBoardingSetting> AddUserOnBoardingSetting(AddUserOnBoardingSettingDTO dto);
        Task<UserOnBoardingSetting> UpdateUserOnBoardingSetting(UpdateUserOnBoardingSettingDTO dto);
    }
}
