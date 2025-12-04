namespace Clinic_CRM.Models.Settings
{
    public class CardSetting
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        //Expiration Duration In Days
        public int ExpirationDuration { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
