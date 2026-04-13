namespace Clinic_CRM.DTOs.CardSettingDTOs
{
    public class AddCardSettingDTO
    {
        public decimal Price { get; set; }
        //Expiration Duration In Days
        public int ExpirationDuration { get; set; }
        public int CardTypeId { get; set; }

    }
}
