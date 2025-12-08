namespace Clinic_CRM.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public Card Card { get; set; }
        public int CardId { get; set; }
        public decimal ExpectedAmount { get; set; } = 0;
        public decimal UnPaidAmount { get; set; } = 0;
        public decimal PaidAmount { get; set; } = 0;
        public string PaymentProof { get; set; } = string.Empty;


        public decimal RequestedAmount { get; set; } = 0;
        public User RequestedBy { get; set; }
        public int RequestedById { get; set; }
        public DateTime RequestedAt { get; set; }

        public DateTime ApprovedAt { get; set; }
        public User ApprovedBy { get;set; }
        public int? ApprovedById { get; set; }
        public decimal ApprovedAmount { get; set; } = 0;
        public string ApprovalRemark { get; set; } = string.Empty;


        public DateTime RejectedAt { get; set; }
        public User RejectedBy { get; set; }
        public int? RejectedById { get; set; }
        public string RejectionRemark { get; set; } = string.Empty;


        public DateTime CheckedAt { get; set; }
        public User CheckedBy { get; set; }
        public int? CheckedById { get; set; }
        public string CheckRemark { get; set; } = string.Empty;


        public DateTime CanceledAt { get; set; }
        public User CanceledBy { get; set; }
        public int? CanceledById { get; set; }
        public string CanceledRemark { get; set; } = string.Empty;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


    }
}
