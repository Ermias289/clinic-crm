using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.DTOs.BankAccountDTOs
{
    public class UpdateBankAccountDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public int BankId { get; set; }
    }
}
