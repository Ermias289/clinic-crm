using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.PaymentServices
{
    public interface IPaymentService
    {
        Task<Payment> CreatePayment(CreatePaymentDTO dto);
        Task<Payment> ApprovePayment(ApprovePaymentDTO dto);
        Task<Payment> CheckPayemnt(CheckPaymentDTO dto);
        Task<Payment> CancelPayment(CancelPaymentDTO dto);
        Task<Payment> RejectPayment(RejectPaymentDTO dto);
        Task<List<Payment>> GetPaymentByStatus(string Status);
        Task<List<Payment>> GetAllPayments();
        Task<Payment> GetPaymentById(int Id);
        Task<Payment> AutoPrepare(AutoPaymentPrepareDTO dto);
    }
}
