using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.PaymentServices
{
    public class PaymentService : IPaymentService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;

        public PaymentService(IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
        }

        public async Task<Payment> CreatePayment(CreatePaymentDTO dto)
        {
            var payment = _mapper.Map<Payment>(dto);

            var card = await _context.Cards.FindAsync(payment.CardId);

            if (card == null)
                throw new KeyNotFoundException("Card Not Found");

            var cardType = await _context.CardTypes.FindAsync(card.CardTypeId);

            if (cardType == null)
                throw new KeyNotFoundException("Card Type Does not exist.");

            Console.WriteLine("Working...");
            var cardPrice = await _context.CardSettings.FirstOrDefaultAsync(x => x.CardTypeId == cardType.Id);

            Console.WriteLine("Working...");
            if (cardPrice == null)
                throw new KeyNotFoundException("Card Price with the specified Card type does not exist.");
            Console.WriteLine("Working...");
            payment.Status = PAYMENT_STATUS.REQUESTED;
            payment.CreatedAt = DateTime.UtcNow;
            payment.ExpectedAmount = cardPrice.Price;
            payment.UnPaidAmount = payment.ExpectedAmount;
            payment.RequestedById = _userService.GetCurrentUserNoInclude().Id;
            Console.WriteLine("Working...");
            // Save first so ID is generated
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            Console.WriteLine("Working...");
            // Load prefix
            var prefix = await _context.CompanySetting
                .AsNoTracking()
                .Select(x => x.Prefix)
                .FirstOrDefaultAsync() ?? "";
            Console.WriteLine("Working...");
            payment.Reference = $"{prefix}/{PREFIX.CARD_PAYMENT}/{payment.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{payment.CreatedAt.Year}";
            Console.WriteLine("Working...");
            await _context.SaveChangesAsync();
            Console.WriteLine("Working...");
            return payment;
        }

    }
}
