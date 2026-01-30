using Clinic_CRM.DTOs.PaymentTypeDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.PaymentTypeServices
{
    public interface IPaymentTypeService
    {
        Task<List<PaymentType>> GetAllPaymentTypesAsync();
        Task<PaymentType?> GetPaymentTypeByIdAsync(int id);
        Task<PaymentType> AddPaymentTypeAsync(AddPaymentTypeDTO newPaymentType);
        Task<PaymentType?> UpdatePaymentTypeAsync(UpdatePaymentTypeDTO updatedPaymentType);
        Task<bool> DeletePaymentTypeAsync(int id);
    }
}
