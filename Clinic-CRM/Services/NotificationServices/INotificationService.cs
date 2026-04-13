using Clinic_CRM.Models;

namespace Clinic_CRM.Services.NotificationServices
{
    public interface INotificationService
    {
        Task SendUserAsync(
        string title,
        string message,
        string category,
        IEnumerable<int> userIds);

        Task SendSystemAsync(
        string title,
        string message,
        string category,
        IEnumerable<int> userIds);

        Task<List<UserNotification>> GetUserNotificationsAsync(int userId);

        Task<UserNotification> MarkAsReadAsync(int userId, int notificationId);

        Task<bool> MarkAllAsReadAsync(int userId);
    }
}
