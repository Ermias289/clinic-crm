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
using Org.BouncyCastle.Math;
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

            var patient = await _context.Patients.FindAsync(dto.PatientId);

            if (patient == null)
                throw new KeyNotFoundException("Patient Not Registered Yet.");
            
            var existingCard = await _context.Cards.Where(x => x.PatientId == dto.PatientId).FirstOrDefaultAsync();

            if (existingCard != null)
                throw new KeyNotFoundException("You already have a card.");

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
            card.RequestedAt = DateTime.UtcNow;

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            patient.CardId = card.Id;

            var payCard = new AutoPaymentPrepareDTO
            {
                RequestedAmount = price.Price,
                CardId = card.Id,
            };

            await _paymentService.AutoPrepare(payCard);
            card.CardNumber = $"{prefix}/{PREFIX.CARD}/{card.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{card.CreatedAt.Year}";


            if (user == null)
                throw new KeyNotFoundException("User Not Found. Please try again later.");

           

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

            if (card == null)
                throw new KeyNotFoundException($"Card Not Found.");
            _mapper.Map(card, dto);

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

            var payment = await _context.Payments.Where(x => x.CardId == card.Id 
            && 
            (x.Status != PAYMENT_STATUS.APPROVED && x.Status != PAYMENT_STATUS.CANCELED && x.Status != PAYMENT_STATUS.REJECTED)).FirstOrDefaultAsync();

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
            var now = DateTime.UtcNow;

            var cards = await _context.Cards
                .Where(c => c.Status == CARD_STATUS.ACTIVE && c.ActivatedAt != null)
                .ToListAsync();

            var cardSettings = await _context.CardSettings.ToListAsync();

            int expiredCount = 0;

            foreach (var card in cards)
            {
                try
                {
                    var setting = cardSettings.FirstOrDefault(x => x.CardTypeId == card.CardTypeId);
                    if (setting == null)
                        continue;

                    var daysUsed = (now - card.ActivatedAt).TotalDays;

                    if (daysUsed < setting.ExpirationDuration)
                        continue;

                    // expire card
                    card.Status = CARD_STATUS.EXPIRED;
                    card.ExpiredAt = now;
                    expiredCount++;

                    // prepare payment (safe, no throw)
                    var prepared = await _paymentService.AutoPrepare(new AutoPaymentPrepareDTO
                    {
                        RequestedAmount = setting.Price,
                        CardId = card.Id
                    });

                    // notify user (best effort)
                    var patient = await _context.Patients.FindAsync(card.PatientId);
                    var user = patient != null
                        ? await _context.Users.FindAsync(patient.UserId)
                        : null;

                    if (user != null)
                    {
                        await _notify.SendSystemAsync(
                            "Card Expired",
                            $"Dear {patient!.FName}, your card has expired. Please renew it to continue enjoying premium services.",
                            NOTIFICATION_CONSTANTS.CARD,
                            new List<int> { user.Id }
                        );
                    }
                }
                catch (Exception ex)
                {
                    //_logger.LogError(ex, $"Failed processing Card {card.Id}");
                    // continue loop
                    Console.WriteLine($"Error expiring card {card.Id}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            return $"{expiredCount} cards expired successfully.";
        }

        public async Task<Card> GetCardByUserId(int UserId)
        {
            var patient = await _context.Patients.Where(x => x.UserId == UserId).FirstOrDefaultAsync();
            
            if (patient == null)
                throw new KeyNotFoundException("User does not have a patient record.");
           
            var card = await _context.Cards.Where(x => x.PatientId == patient.Id).FirstOrDefaultAsync();
            
            if (card == null)
                throw new KeyNotFoundException("Card Not Found.");

            return card;
        }
    }
}
