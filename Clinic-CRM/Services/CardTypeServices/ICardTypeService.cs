using Clinic_CRM.DTOs.CardTypeDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.CardTypeServices
{
    public interface ICardTypeService
    {
        Task<List<CardType>> GetAllCardTypes();
        Task<CardType> GetCardTypeById(int Id);
        Task<CardType> AddCardType(AddCardTypeDTO dto);
        Task<CardType> UpdateCardType(UpdateCardTypeDTO dto);
        Task<CardType> DeleteCardType(int Id);
    }
}
