using System.Runtime.CompilerServices;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.PaymentServices;
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
        private readonly IPaymentService _paymentService;

        public CardService(IMapper mapper, Context context, IUserService userService, IPaymentService paymentService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
            _paymentService = paymentService;
        }

        public async Task<Card> RequestCard(RequestCardDTO dto)
        {
            var card = _mapper.Map<Card>(dto);
            var user = await _context.Users
             .Include(u => u.UserRole)
             .Where(u => u.Id == _userService.GetCurrentUser().Id)
             .FirstOrDefaultAsync();
            Console.WriteLine("Working...");

            var prefix = await _context.CompanySetting
              .AsNoTracking()
              .Select(x => x.Prefix)
              .FirstOrDefaultAsync() ?? "";

            card.CreatedAt = DateTime.UtcNow;

            if (user == null)
                throw new KeyNotFoundException("User Not Found. Please try again later.");
            Console.WriteLine("Working...");

            if (user.UserRole.Name == USER_ROLES.PATIENT)
            {
                card.RequestedById = _userService.GetCurrentUserNoInclude().Id;
                card.RequestRemark = "Requested By Patient.";
                card.Status = CARD_STATUS.PENDING;
            }

            Console.WriteLine("Working...");
            
            var price = await _context.CardSettings.Where(x => x.CardTypeId == card.CardTypeId).FirstOrDefaultAsync();
            Console.WriteLine("Working...");

          

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            card.CardNumber = $"{prefix}/{PREFIX.CARD}/{card.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{card.CreatedAt.Year}";


            var payCard = new CreatePaymentDTO
            {
                RequestedAmount = price.Price,
                CardId = card.Id,
            };
            await _paymentService.CreatePayment(payCard);

            await _context.SaveChangesAsync();
            Console.WriteLine("Working...");

            return card;
        }
        public async Task<Card> UpdateCard(UpdateCardDTO dto)
        {

        }
        //Task<Card> GetCardByReference(string Ref);
        //Task<Card> GetCardById(int Id);
        //Task<Card> GetAllCards();
    }
}
