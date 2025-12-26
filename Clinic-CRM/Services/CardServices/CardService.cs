using System.Diagnostics;
using System.IO.Pipelines;
using System.Runtime.CompilerServices;
using System.Security.AccessControl;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.NotificationServices;
using Clinic_CRM.Services.PatientServices;
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
        private readonly IPatientService _patientService;
        private readonly INotificationService _notify;

        public CardService(IMapper mapper, Context context, IUserService userService, IPaymentService paymentService, IPatientService patientService, INotificationService notify)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
            _paymentService = paymentService;
            _patientService = patientService;
            _notify = notify;
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
            var price = await _context.CardSettings.Where(x => x.CardTypeId == card.CardTypeId).FirstOrDefaultAsync();
            card.RequestedById = _userService.GetCurrentUserNoInclude().Id;
            card.RequestRemark = "Requested By Patient.";
            card.Status = CARD_STATUS.PENDING;


            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            card.Patient.CardId = card.Id;

            var payCard = new AutoPaymentPrepareDTO
            {
                RequestedAmount = price.Price,
                CardId = card.Id,
            };

            await _paymentService.AutoPrepare(payCard);
            card.CardNumber = $"{prefix}/{PREFIX.CARD}/{card.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{card.CreatedAt.Year}";


            if (user == null)
                throw new KeyNotFoundException("User Not Found. Please try again later.");

            var existingCard = await _context.Cards.Where(x => x.PatientId == dto.PatientId).FirstOrDefaultAsync();

            if (existingCard != null)
                throw new KeyNotFoundException("You already have a card.");

            Console.WriteLine("Working...");
            
            Console.WriteLine("Requesting early");


            //if (user.UserRole.Name == USER_ROLES.PATIENT)
            //{
            //    if (dto.PatientId == 0)
            //    {
            //        var patient = _mapper.Map<AddPatientDTO>(dto.Patient);
                    
            //        patient.CardId = card.Id;

            //        await _patientService.AddPatient(patient);

            //    }
            //}
            Console.WriteLine("Requesting");
       
            var users = await _context.Users.Where(x => x.Id == card.Patient.UserId || x.UserRole.Name == USER_ROLES.RECEPTIONIST).Select(x => x.Id).ToListAsync();
            await _context.SaveChangesAsync();
           
            await _notify.SendUserAsync(
                "Card Request",
                $"Card Request has successfully been made by {_userService.GetCurrentUserNoInclude().FName}",
                NOTIFICATION_CONSTANTS.CARD,
                users
                );

            return card;
        }

        public async Task<Card> UpdateCard(UpdateCardDTO dto)
        {
            var card = await _context.Cards.FindAsync(dto.Id);

            _mapper.Map(card, dto);

            await _patientService.UpdatePatient(dto.PatientDTO);
            _context.Cards.Update(card);

            return card;
        }
        public async Task<Card> GetCardByReference(string Ref)
        {
            var card = await _context.Cards.Where(x => x.CardNumber == Ref).FirstOrDefaultAsync();

            if (card == null)
                throw new KeyNotFoundException("Card Not Found.");

            return card;
        }
        public async Task<Card> GetCardById(int Id)
        {
            var card = await _context.Cards.FindAsync(Id);
            
            if (card == null)
                throw new KeyNotFoundException("Card Not Found.");

            return card;
        }
       public async Task<List<Card>> GetAllCards()
       {
            return await _context.Cards.ToListAsync();
       }

       public async Task<Card> ReActivateCard(int Id)
       {
            var card = await _context.Cards.FindAsync(Id);

            if (card == null)
                throw new KeyNotFoundException("Card Not Found");


            var price = await _context.CardSettings.Where(x => x.CardTypeId == card.CardTypeId).FirstOrDefaultAsync();

            if (price == null)
                throw new KeyNotFoundException("Card Price Not Found");

            var payment = await _context.Payments.Where(x => x.CardId == card.Id && (x.Status != PAYMENT_STATUS.APPROVED || x.Status != PAYMENT_STATUS.CANCELED || x.Status != PAYMENT_STATUS.REJECTED)).FirstOrDefaultAsync();

            if (payment != null)
                throw new KeyNotFoundException("You have a pending payment. Please complete that first.");

            var payCard = new AutoPaymentPrepareDTO
            {
                RequestedAmount = price.Price,
                CardId = card.Id,
            };
            await _paymentService.AutoPrepare(payCard);

            var users = await _context.Users.Where(x => x.Id == card.Patient.UserId || x.UserRole.Name == USER_ROLES.RECEPTIONIST).Select(x => x.Id).ToListAsync();

            await _notify.SendUserAsync(
                "Card Reactivation",
                $"Card has been successfully reactivated by {_userService.GetCurrentUserNoInclude().FName}",
                NOTIFICATION_CONSTANTS.CARD,
                users
                );

            return card;
        }


        public async Task<string> AutoExpire()
        {
            var cards = await _context.Cards.ToListAsync();
            var cardSettings = await _context.CardSettings.ToListAsync();

            int expiredCount = 0;

            foreach (var card in cards)
            {
                if (card.Status != CARD_STATUS.ACTIVE || card?.ActivatedAt == null)
                    continue;

                var expiry = cardSettings
                    .FirstOrDefault(x => x.CardTypeId == card.CardTypeId);

                if (expiry == null)
                    continue;

                var daysUsed = (DateTime.UtcNow - card.ActivatedAt).TotalDays;

                if (daysUsed >= expiry.ExpirationDuration)
                {
                    card.Status = CARD_STATUS.EXPIRED;
                    card.ExpiredAt = DateTime.UtcNow;
                    expiredCount++;
                }


                var patient = await _context.Patients.FindAsync(card.PatientId);

                var user = await _context.Users.FindAsync(patient?.UserId);

                if(user != null)
                {
                   await _notify.SendSystemAsync(
                   "Card Expired",
                   $"Dear {card.Patient.FName},your card has expired. Please make a payment to renew it and enjoy unlimited appointments along with our full range of premium services.",
                   NOTIFICATION_CONSTANTS.CARD,
                   new List<int> { user.Id }
                   );
                }
               
            }

            await _context.SaveChangesAsync();


            return $"{expiredCount} cards expired successfully.";
        }
    }
}
