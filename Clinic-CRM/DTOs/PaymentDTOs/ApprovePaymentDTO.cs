using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class ApprovePaymentDTO
    {
        public int Id { get; set; }
        public decimal ApprovedAmount { get; set; } = 0;
        public string ApprovalRemark { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
