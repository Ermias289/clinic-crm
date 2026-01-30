using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class CreatePaymentDTO
    {
        public int Id { get; set; }
        //public int CardId { get; set; }
        public decimal RequestedAmount { get; set; } = 0;
        public string PaymentProof { get; set; } = string.Empty;
        public bool IsInsured { get; set; } = false;
        public int? PaymentTypeId { get; set; }
    }
}
