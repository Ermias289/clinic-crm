using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.PaymentServices
{
    public interface IPaymentService
    {
        Task<Payment> CreatePayment(CreatePaymentDTO dto);
    }
}
