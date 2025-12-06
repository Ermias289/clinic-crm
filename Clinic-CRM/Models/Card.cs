using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Clinic_CRM.Models
{
    public class Card
    {
        [Key]
        public int Id { get; set; }
        public string CardNumebr { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }
        public int? PatientId { get; set; }
        public CardType CardType { get; set; }
        public int CardTypeId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
