using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinic_CRM.Models.Settings
{
    public class WorkingDaySetting
    {
        public int Id { get; set; }
        public string Day { get; set; } = string.Empty;
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public bool IsWorkingDay { get; set; } = true;

        // Relationship
        [ForeignKey("CompanySettingId")]
        public CompanySetting CompanySetting { get; set; }
        public int CompanySettingId { get; set; }
    }
}
