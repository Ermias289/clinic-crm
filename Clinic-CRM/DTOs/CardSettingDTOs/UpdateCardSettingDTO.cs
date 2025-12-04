namespace Clinic_CRM.DTOs.CardSettingDTOs
{
    public class UpdateCardSettingDTO
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int ExpirationDuration { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}
