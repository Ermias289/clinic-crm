using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.CardSettingServices
{
    public interface ICardSettingService
    {
        Task<CardSetting> AddCardSetting(AddCardSettingDTO dto);
        Task<CardSetting> UpdateCardSettingService(UpdateCardSettingDTO dto);
        Task<List<CardSetting>> GetAllCardSettings();
        Task<CardSetting> DeleteCardSetting(int Id);
        Task<CardSetting> GetCardSettingById(int Id);
    }
}
