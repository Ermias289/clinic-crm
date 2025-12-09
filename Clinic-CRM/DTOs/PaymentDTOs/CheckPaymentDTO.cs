using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class CheckPaymentDTO
    {
        public int Id { get; set; }

        public decimal ChekedAmount { get; set; }
        public string CheckRemark { get; set; } = string.Empty;
        public string PaymentProof { get; set; } = string.Empty;
        public int CardId { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
