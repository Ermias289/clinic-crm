using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;

        public string? Type { get; set; }
        public string? Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();
    }
}
