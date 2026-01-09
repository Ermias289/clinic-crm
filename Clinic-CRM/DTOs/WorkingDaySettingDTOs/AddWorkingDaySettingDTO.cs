using System.ComponentModel.DataAnnotations.Schema;

namespace Clinic_CRM.DTOs.WorkingDaySettingDTOs
{
    public class AddWorkingDaySettingDTO
    {
        public string Day { get; set; } = string.Empty;
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public bool IsWorkingDay { get; set; } = true;
    }
}
