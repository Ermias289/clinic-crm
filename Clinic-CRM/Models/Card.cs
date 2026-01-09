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
        public string CardNumber { get; set; } = string.Empty;
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
        public int PatientId { get; set; }
        [ForeignKey("CardTypeId")]
        public CardType CardType { get; set; }
        public int CardTypeId { get; set; }
        public string Status { get; set; } = string.Empty;

        public User? RequestedBy { get; set; }
        public int? RequestedById { get; set; }
        public string RequestRemark { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }


        public User? ActivatedBy { get; set; }
        public int? ActivatedById { get; set; }
        public string ActivationRemark { get; set; } = string.Empty;
        public DateTime ActivatedAt { get; set; }


        public DateTime ExpiredAt { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
