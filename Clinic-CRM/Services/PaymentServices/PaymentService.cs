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

            
            var cardPrice = await _context.CardSettings.FirstOrDefaultAsync(x => x.CardTypeId == cardType.Id);

           

            if (cardPrice == null)
                throw new KeyNotFoundException("Card Price with the specified Card type does not exist.");


            payment.Status = PAYMENT_STATUS.REQUESTED;
            payment.CreatedAt = DateTime.UtcNow;
            payment.ExpectedAmount = cardPrice.Price - payment.PaidAmount; 
            payment.UnPaidAmount = payment.ExpectedAmount;
            payment.RequestedById = _userService.GetCurrentUserNoInclude().Id;

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var prefix = await _context.CompanySetting
                .AsNoTracking()
                .Select(x => x.Prefix)
                .FirstOrDefaultAsync() ?? "";

            payment.Reference = $"{prefix}/{PREFIX.CARD_PAYMENT}/{payment.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{payment.CreatedAt.Year}";
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment> CheckPayemnt(CheckPaymentDTO dto)
        {
            var payment = await _context.Payments.FindAsync(dto.Id);

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

            return payment;
        }

        public async Task<Payment> ApprovePayment(ApprovePaymentDTO dto)
        {
            var payment = await _context.Payments.FindAsync(dto.Id);

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");

            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.CHECKED)
                throw new KeyNotFoundException("Payment should be checked first to be approved.");

            payment.ApprovedBy = _userService.GetCurrentUserNoInclude();
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
                payment.Status = PAYMENT_STATUS.APPROVED;    
            }

             _mapper.Map(dto, payment);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
           
            return payment;
        }

     
        public async Task<Payment> CancelPayment(CancelPaymentDTO dto)
        {
            var payment = await _context.Payments.FindAsync(dto.Id);

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

            return payment;
        }


        public async Task<Payment> RejectPayment(RejectPaymentDTO dto)
        {
            var payment = await _context.Payments.FindAsync(dto.Id);

            if (payment == null)
                throw new KeyNotFoundException("Payment Request Not Found.");

            if (payment.Status == PAYMENT_STATUS.REJECTED)
                throw new KeyNotFoundException("Payment request has already been rejected.");

            if (payment.Status != PAYMENT_STATUS.CHECKED || payment.Status != PAYMENT_STATUS.REQUESTED)
                throw new KeyNotFoundException("Payment should be either on checked or requested status to cancel.");

            payment.Status = PAYMENT_STATUS.REJECTED;
            payment.RejectedById = _userService.GetCurrentUserNoInclude().Id;
            payment.RejectedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            _mapper.Map(dto, payment);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

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

       

    }
}
