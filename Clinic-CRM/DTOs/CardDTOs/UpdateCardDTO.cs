using System.ComponentModel.DataAnnotations.Schema;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.CardDTOs
{
    public class UpdateCardDTO
    {
        public int Id { get; set; }
        public UpdatePatientDTO PatientDTO { get; set; }
        public int PatientId { get; set; }
        public int CardTypeId { get; set; }
    }
}
