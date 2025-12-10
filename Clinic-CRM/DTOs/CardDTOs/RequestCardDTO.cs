using System.ComponentModel.DataAnnotations.Schema;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.DTOs.CardDTOs
{
    public class RequestCardDTO
    {
        public AddPatientDTO? Patient { get; set; }
        public int PatientId { get; set; }
        public int CardTypeId { get; set; }
        public string RequestRemark { get; set; } = string.Empty;
    }
}
