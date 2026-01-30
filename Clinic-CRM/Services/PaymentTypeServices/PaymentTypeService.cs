using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.PaymentTypeDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.PaymentTypeServices
{
    public class PaymentTypeService : IPaymentTypeService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public PaymentTypeService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<PaymentType>> GetAllPaymentTypesAsync()
        {
            return await _context.PaymentTypes.ToListAsync();
        }

        public async Task<PaymentType?> GetPaymentTypeByIdAsync(int id)
        {
            return await _context.PaymentTypes.FindAsync(id);

        }

        public async Task<PaymentType> AddPaymentTypeAsync(AddPaymentTypeDTO newPaymentType)
        {
            var paymentType = _mapper.Map<PaymentType>(newPaymentType);
            _context.PaymentTypes.Add(paymentType);
            await _context.SaveChangesAsync();
            return paymentType;
        }

        public async Task<PaymentType?> UpdatePaymentTypeAsync(UpdatePaymentTypeDTO updatedPaymentType)
        {
            var existingPaymentType = await _context.PaymentTypes.FindAsync(updatedPaymentType.Id);
            if (existingPaymentType == null)
            {
                throw new KeyNotFoundException("Payment Type Not Found.");
            }
            _mapper.Map(updatedPaymentType, existingPaymentType);
            await _context.SaveChangesAsync();
            return existingPaymentType;
        }

        public async Task<bool> DeletePaymentTypeAsync(int id)
        {
            var paymentType = await _context.PaymentTypes.FindAsync(id);
            if (paymentType == null)
            {
                throw new KeyNotFoundException("Payment Type Not Found.");
            }
            _context.PaymentTypes.Remove(paymentType);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
