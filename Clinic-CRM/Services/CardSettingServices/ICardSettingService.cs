using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.CardSettingServices
{
    public interface ICardSettingService
    {
        Task<CardSetting> AddCardSetting(AddCardSettingDTO dto);
        Task<CardSetting> UpdateCardSettingService(UpdateCardSettingDTO dto);
        Task<CardSetting> GetCardSetting();
        Task<CardSetting> DeleteCardSetting(int Id);
    }
}
