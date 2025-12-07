using System.Runtime.CompilerServices;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.CardServices
{
    public class CardService : ICardService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;

        public CardService(IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
        }

        public async Task<Card> RequestCard(RequestCardDTO dto)
        {
            var card = _mapper.Map<Card>(dto);
            var user = await _context.Users
             .Include(u => u.UserRole)
             .Where(u => u.Id == _userService.GetCurrentUser().Id)
             .FirstOrDefaultAsync();

            card.CreatedAt = DateTime.UtcNow;
            card.CardNumber = _context.CompanySetting.AsNoTracking().FirstOrDefault()?.Prefix ?? "" +
            PREFIX.CARD + card.Id.ToString().PadLeft(PREFIX.PADDING, '0') + "/" + card.CreatedAt.Year;

            if (user == null)
                throw new KeyNotFoundException("User Not Found. Please try again later.");

            if (user.UserRole.Name == USER_ROLES.PATIENT)
            {
                card.RequestedById = _userService.GetCurrentUserNoInclude().Id;
                card.RequestRemark = "Requested By Patient.";
                card.Status = CARD_STATUS.PENDING;
            }


            _context.Cards.Add(card);
            await _context.SaveChangesAsync();
            return card;
        }
        //Task<Card> UpdateCard(UpdateCardDTO dto);
        //Task<Card> GetCardByReference(string Ref);
        //Task<Card> GetCardById(int Id);
        //Task<Card> GetAllCards();
    }
}
