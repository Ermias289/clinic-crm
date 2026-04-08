namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class AutoPaymentPrepareDTO
    {
        public int CardId { get; set; }
        public decimal RequestedAmount { get; set; } = 0;
        public string PaymentProof { get; set; } = string.Empty;
        public bool IsInsuranceCovered { get; set; } = false;
    }
}
