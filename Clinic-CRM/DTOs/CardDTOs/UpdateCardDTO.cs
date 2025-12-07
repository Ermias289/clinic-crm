using System.ComponentModel.DataAnnotations.Schema;
using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.CardDTOs
{
    public class UpdateCardDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int CardTypeId { get; set; }
        public string RequestRemark { get; set; } = string.Empty;
        public int? ActivatedById { get; set; }
        public string ActivationRemark { get; set; } = string.Empty;
    }
}
