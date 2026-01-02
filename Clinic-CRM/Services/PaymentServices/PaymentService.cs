using System.Threading.Tasks;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.NotificationServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.AppConfig;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.PaymentServices
{
    public class PaymentService : IPaymentService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly INotificationService _notify;



        public PaymentService(INotificationService notify,IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
            _notify = notify;
        }

        public async Task<bool> AutoPrepare(AutoPaymentPrepareDTO dto)
        {
            //mapping the dto to the model
            var payment = _mapper.Map<Payment>(dto);

            payment.Status = PAYMENT_STATUS.AUTOPREPARED;

            //checks if the card is prepared
            var card = await _context.Cards.FindAsync(payment.CardId);

            if (card == null)
                throw new KeyNotFoundException("Card Not Found");

            //checks if the card type exists
            var cardType = await _context.CardTypes.FindAsync(card.CardTypeId);

            if (cardType == null)
                throw new KeyNotFoundException("Card Type Does not exist.");

            //gets card price by card type from card setting
            var cardPrice = await _context.CardSettings.FirstOrDefaultAsync(x => x.CardTypeId == cardType.Id);

            var existingPayment = await _context.Payments.Where(x => x.CardId == card.Id && (x.Status != PAYMENT_STATUS.APPROVED && x.Status != PAYMENT_STATUS.CANCELED && x.Status != PAYMENT_STATUS.REJECTED)).FirstOrDefaultAsync();

            if (existingPayment != null)
                return false;

            //prepares prefix for the card
            var prefix = await _context.CompanySetting
                .AsNoTracking()
                .Select(x => x.Prefix)
                .FirstOrDefaultAsync() ?? "";
            //card.RequestedById = _userService.GetCurrentUser().Id;

            if (cardPrice == null)
                throw new KeyNotFoundException("Card Price with the specified Card type does not exist.");

            payment.ExpectedAmount = cardPrice.Price;
            payment.UnPaidAmount = cardPrice.Price;
           
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            payment.Reference = $"{prefix}/{PREFIX.CARD_PAYMENT}/{payment.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{payment.CreatedAt.Year}";
            await _context.SaveChangesAsync();

            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Auto payment created",
                    $"The payment with reference number {payment.Reference} has been auto created.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                    );


            return true;
        }


        public async Task<Payment> CreatePayment(CreatePaymentDTO dto)
        {
            var payment = await _context.Payments
                .Include(x => x.Card)
                    .ThenInclude(x => x.Patient)
                        .ThenInclude(x => x.User)
                .Where(x => x.Id == dto.Id)
                .FirstOrDefaultAsync();


            if (payment == null)
                throw new KeyNotFoundException("Payment Not Prepared Yet.");

            var pendingPayments = await _context.Payments
                .Where(x =>
                    x.CardId == payment.CardId &&
                    (
                        x.Status == PAYMENT_STATUS.REQUESTED ||
                        x.Status == PAYMENT_STATUS.CHECKED
                    )
                )
                .ToListAsync();

            if (pendingPayments.Any())
                throw new KeyNotFoundException("You have a pending payment.");

            _mapper.Map(payment, dto);

            var card = await _context.Cards.FindAsync(payment.CardId);

            if (card == null)
                throw new KeyNotFoundException("Card Not Found");

            if (card.Status == CARD_STATUS.ACTIVE)
                throw new KeyNotFoundException("Card Is Already Active. No Pending Payment");

            payment.Status = PAYMENT_STATUS.REQUESTED;
            payment.CreatedAt = DateTime.UtcNow;
            payment.UnPaidAmount = payment.ExpectedAmount;
            payment.RequestedById = _userService.GetCurrentUserNoInclude().Id;

            //var existPayment = await _context.Payments.Where(x => x.CardId == payment.CardId && x.Status == PAYMENT_STATUS.AUTOPREPARED)
            //    .OrderBy(x => x.UnPaidAmount)
            //    .FirstOrDefaultAsync();


            //if (existPayment.Any(x => x.Status != PAYMENT_STATUS.APPROVED || x.Status != PAYMENT_STATUS.CANCELED || x.Status == PAYMENT_STATUS.REJECTED && x.Reference != payment.Reference))
            //    throw new KeyNotFoundException("There is incomplete payment process, please complete that first.");

            //if (existPayment.Any())
            //{
            //    var existingPayment = existPayment.Where( x => x.Status == PAYMENT_STATUS.PARTIALLYPAID).FirstOrDefault();
            //    var paid = existPayment.Sum(x => x.PaidAmount);

            //    if(existingPayment != null)
            //    {
            //        payment.ExpectedAmount = existingPayment.UnPaidAmount;
            //        payment.UnPaidAmount = existingPayment.UnPaidAmount;
            //        payment.PaidAmount = paid;
            //        payment.RequestedById = _userService.GetCurrentUserNoInclude().Id;
            //    }
            //}



            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

            //var prefix = await _context.CompanySetting
            //    .AsNoTracking()
            //    .Select(x => x.Prefix)
            //    .FirstOrDefaultAsync() ?? "";

            ////payment.Reference = $"{prefix}/{PREFIX.CARD_PAYMENT}/{payment.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{payment.CreatedAt.Year}";
            //await _context.SaveChangesAsync();

            //var user = await _context.Users.Where(x => x.Id == card.Patient.UserId).FirstOrDefaultAsync();

            var receptions = await _context.Users
                .Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST
                         || x.UserRole.Name == USER_ROLES.ADMIN
                         || x.UserRole.Name == USER_ROLES.SUPER_ADMIN)
                .Select(x => x.Id)
                .ToListAsync();

            if (receptions.Any())
            {
                await _notify.SendUserAsync(
                    "Payment Request",
                    $"Payment has been requested with reference number {payment.Reference}.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                );
            }


            if (_userService.GetCurrentUser().UserRole.Name == USER_ROLES.PATIENT)
            {
                await _notify.SendUserAsync(
                    "Payment Request",
                    $"Payment has been requested with reference number {payment.Reference}.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    new List<int> { _userService.GetCurrentUser().Id }
                );
            }


            return payment;
        }

        public async Task<Payment> CheckPayemnt(CheckPaymentDTO dto)
        {
            var payment = await _context.Payments
                .Include(x => x.Card)
                    .ThenInclude(x => x.Patient)
                        .ThenInclude(x => x.User)
                .Where(x => x.Id == dto.Id)
                .FirstOrDefaultAsync();

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");

            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.REQUESTED)
                throw new KeyNotFoundException("Payment should be requested first to be checked.");


            payment.CheckedById = _userService.GetCurrentUserNoInclude().Id;
            payment.CheckedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            payment.Status = PAYMENT_STATUS.CHECKED;

            _mapper.Map(dto, payment);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            
            var user = await _context.Users.Where(x => x.Id == payment.Card.Patient.UserId).FirstOrDefaultAsync();

            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Payment Checked",
                    $"Payment request with reference number {payment.Reference} has been checked.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                    );

            if(user != null)
                await _notify.SendUserAsync(
                    $"Payment Ckecked",
                    $"Your Payment has request with reference number {payment.Reference} has been checked.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    new List<int> { user.Id }
                    );


            return payment;
        }

        public async Task<Payment> ApprovePayment(ApprovePaymentDTO dto)
        {

            var payment = await _context.Payments
                .Include(x => x.Card)
                    .ThenInclude(x => x.Patient)
                        .ThenInclude(x => x.User)
                .Where(x => x.Id == dto.Id)
                .FirstOrDefaultAsync();

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");
            _mapper.Map(dto, payment);
            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.CHECKED)
                throw new KeyNotFoundException("Payment should be checked first to be approved.");

            var card = await _context.Cards.FindAsync(payment.CardId);

            payment.ApprovedById = _userService.GetCurrentUserNoInclude().Id;
            payment.ApprovedAt = DateTime.UtcNow;
            payment.PaidAmount = payment.ApprovedAmount;
            payment.UnPaidAmount = payment.ExpectedAmount - payment.ApprovedAmount;
            payment.UpdatedAt = DateTime.UtcNow;

            if(payment.PaidAmount != payment.ExpectedAmount)
            {
                payment.Status = PAYMENT_STATUS.PARTIALLYPAID;
            }
            else 
            {
                if (card == null)
                    throw new KeyNotFoundException("Card Not Found.");

                payment.Status = PAYMENT_STATUS.APPROVED;
                card.Status = CARD_STATUS.ACTIVE;
                card.ActivatedAt = DateTime.UtcNow;
            }

            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.Where(x => x.Id == payment.Card.Patient.UserId).FirstOrDefaultAsync();
            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Payment Approved",
                    $"Payment request with reference number {payment.Reference} has been Approved.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                    );
            if(user != null)
                await _notify.SendUserAsync(
                    $"Payment Approved",
                    $"Your Payment has request with reference number {payment.Reference} has been Approved.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    new List<int> { user.Id }
                    );

            return payment;
        }

     
        public async Task<Payment> CancelPayment(CancelPaymentDTO dto)
        {
            var payment = await _context.Payments
               .Include(x => x.Card)
                   .ThenInclude(x => x.Patient)
                       .ThenInclude(x => x.User)
               .Where(x => x.Id == dto.Id)
               .FirstOrDefaultAsync();

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");

            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.CHECKED || payment.Status != PAYMENT_STATUS.REQUESTED)
                throw new KeyNotFoundException("Payment should be either on checked or requested status to cancel.");

            payment.Status = PAYMENT_STATUS.CANCELED;
            payment.UpdatedAt = DateTime.UtcNow;
            _mapper.Map(dto, payment);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.Where(x => x.Id == payment.Card.Patient.UserId).FirstOrDefaultAsync();
            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Payment Canceled",
                    $"Payment request with reference number {payment.Reference} has been canceled.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                    );
            if(user != null)
                await _notify.SendUserAsync(
                    $"Payment Canceled",
                    $"Your Payment has request with reference number {payment.Reference} has been canceled.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    new List<int> { user.Id }
                    );


            return payment;
        }


        public async Task<Payment> RejectPayment(RejectPaymentDTO dto)
        {
            var payment = await _context.Payments
               .Include(x => x.Card)
                   .ThenInclude(x => x.Patient)
                       .ThenInclude(x => x.User)
               .Where(x => x.Id == dto.Id)
               .FirstOrDefaultAsync();

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");

            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.CHECKED || payment.Status != PAYMENT_STATUS.REQUESTED)
                throw new KeyNotFoundException("Payment should be either on checked or requested status to reject.");

            payment.Status = PAYMENT_STATUS.REJECTED;
            payment.RejectedById = _userService.GetCurrentUserNoInclude().Id;
            payment.RejectedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            _mapper.Map(dto, payment);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            var user = await _context.Users.Where(x => x.Id == payment.Card.Patient.UserId).FirstOrDefaultAsync();
            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Payment Rejection",
                    $"Payment request with reference number {payment.Reference} has been rejected.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    receptions
                    );
            if(user != null)
                await _notify.SendUserAsync(
                    $"Payment Rejection",
                    $"Your Payment has request with reference number {payment.Reference} has been Approved.",
                    NOTIFICATION_CONSTANTS.PAYMENT,
                    new List<int> { user.Id }
                    );


            return payment;
        }

        public async Task<List<Payment>> GetPaymentByStatus(string Status)
        {
            var payment = await _context.Payments
                .Where(x => x.Status.ToLower() == Status.ToLower())
                .ToListAsync();

            return payment;
        }
        
        public async Task<List<Payment>> GetAllPayments()
        {
            return await _context.Payments
                .Include(x => x.Card)
                .Include(x => x.RequestedBy)
                .Include(x => x.ApprovedBy)
                .Include(x => x.CheckedBy)
                .Include(x => x.CanceledBy)
                .Include(x => x.RejectedBy)
                .ToListAsync();
        }


        public async Task<Payment> GetPaymentById(int Id)
        {
            var payment = await _context.Payments
                .Include(x => x.Card)
                .Include(x => x.RequestedBy)
                .Include(x => x.ApprovedBy)
                .Include(x => x.CheckedBy)
                .Include(x => x.CanceledBy)
                .Include(x => x.RejectedBy)
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync();

            if (payment == null)
                throw new KeyNotFoundException("Payment not found.");

            return payment;
        }


        public async Task<List<Payment>> GetAllPaymentsByCardId(int CardId)
        {
            return await _context.Payments
                .Include(x => x.Card)
                .Include(x => x.RequestedBy)
                .Include(x => x.ApprovedBy)
                .Include(x => x.CheckedBy)
                .Include(x => x.CanceledBy)
                .Include(x => x.RejectedBy)
                .Where(x => x.CardId == CardId)
                .ToListAsync();
        }
       
        public async Task<List<Payment>> GetAllPaymentsByPatientId(int patientId)
        {
            return await _context.Payments
                .Include(x => x.Card)
                    .ThenInclude(x => x.Patient)
                .Include(x => x.RequestedBy)
                .Include(x => x.ApprovedBy)
                .Include(x => x.CheckedBy)
                .Include(x => x.CanceledBy)
                .Include(x => x.RejectedBy)
                .Where(x => x.Card.PatientId == patientId)
                .ToListAsync();
        }
       

    }
}
