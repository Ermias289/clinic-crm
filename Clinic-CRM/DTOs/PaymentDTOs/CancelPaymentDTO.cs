using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.PaymentDTOs
{
    public class CancelPaymentDTO
    {
        public int Id { get; set; }
        public string CanceledRemark { get; set; } = string.Empty;

    }
}
