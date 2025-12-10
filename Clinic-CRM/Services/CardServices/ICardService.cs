using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.CardServices
{
    public interface ICardService
    {
        Task<Card> RequestCard(RequestCardDTO dto);
        Task<Card> UpdateCard(UpdateCardDTO dto);
        Task<Card> GetCardByReference(string Ref);
        Task<Card> GetCardById(int Id);
        Task<List<Card>> GetAllCards();
    }
}
