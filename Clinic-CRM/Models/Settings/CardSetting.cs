using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinic_CRM.Models.Settings
{
    public class CardSetting
    {
        [Key]
        public int Id { get; set; }
        public decimal Price { get; set; }
        //Expiration Duration In Days
        public int ExpirationDuration { get; set; }
        [ForeignKey("CardTypeId")]
        public int? CardTypeId { get; set; }
        public CardType CardType { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
