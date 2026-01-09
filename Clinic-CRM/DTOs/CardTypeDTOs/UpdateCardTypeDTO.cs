using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.DTOs.CardTypeDTOs
{
    public class UpdateCardTypeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
