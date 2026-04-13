using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Clinic_CRM.Models.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Clinic_CRM.Models
{
    public class DoctorSchedule
    {
        [Key]
        public int Id { get; set; }
        public MedicalProfessional MedicalProfessionals { get; set; }
        public int MedicalProfessionalId { get; set; }
        [ForeignKey("BranchSettingId")]
        public int BranchSettingId { get; set; }
        public BranchSetting BranchSetting { get; set; }
        public string WeekDay { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
