namespace Clinic_CRM.Models.Settings
{
    public class BankAccount
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public Bank Bank { get; set; }
        public int BankId { get; set; }
    }
}
