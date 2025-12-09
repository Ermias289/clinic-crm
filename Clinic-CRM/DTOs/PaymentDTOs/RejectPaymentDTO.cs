using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class RejectPaymentDTO
    {
        public int Id { get; set; }

        public string RejectionRemark { get; set; } = string.Empty;
    }
}
