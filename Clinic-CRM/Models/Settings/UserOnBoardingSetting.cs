using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models.Settings
{
    public class UserOnBoardingSetting
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PictureUploaded { get; set; } = string.Empty;
    }
}
