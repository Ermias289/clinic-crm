using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class CreatePaymentDTO
    {
        public int CardId { get; set; }
        public decimal RequestedAmount { get; set; } = 0;
    }
}
