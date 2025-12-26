using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.NotificationServices
{
    public class NotificationService : INotificationService
    {
        private readonly Context _context;

        public NotificationService(Context context)
        {
            _context = context;
        }

        public async Task SendUserAsync(
        string title,
        string message,
        string category,
        IEnumerable<int> userIds)
        {
            if (userIds == null || !userIds.Any())
                return; // Nothing to send

            var notification = new Notification
            {
                Title = title,
                Message = message,
                Type = NOTIFICATION_CONSTANTS.USER,
                Category = category
            };

            foreach (var userId in userIds.Distinct())
            {
                notification.UserNotifications.Add(new UserNotification
                {
                    UserId = userId
                });
            }

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }



        public async Task SendSystemAsync(
        string title,
        string message,
        string category,
        IEnumerable<int> userIds)
        {
            var notification = new Notification
            {
                Title = title,
                Message = message,
                Type = NOTIFICATION_CONSTANTS.SYSTEM,
                Category = category
            };

            foreach (var userId in userIds.Distinct())
            {
                notification.UserNotifications.Add(new UserNotification
                {
                    UserId = userId
                });
            }

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }


        public async Task<List<UserNotification>> GetUserNotificationsAsync(int userId)
        {
            return await _context.UserNotifications
                .Where(un => un.UserId == userId && !un.IsRead)
                .Include(x => x.Notification)
                .OrderByDescending(un => un.Notification.CreatedAt)
                .ToListAsync();
        }

        public async Task<UserNotification> MarkAsReadAsync(int userId, int notificationId)
        {

            var userNotification = await _context.UserNotifications
                .FirstOrDefaultAsync(un =>
                    un.UserId == userId &&
                    un.NotificationId == notificationId);

            if (userNotification == null)
                throw new KeyNotFoundException("Notification Not Found.");

            if (!userNotification.IsRead)
            {
                userNotification.IsRead = true;
                userNotification.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return userNotification;
        }

        public async Task<bool> MarkAllAsReadAsync(int userId)
        {
            var notifications = await _context.UserNotifications.Where(x => x.UserId == userId).ToListAsync();
            
            foreach(var notify in notifications){
                notify.IsRead = true;
                _context.UserNotifications.Update(notify);
            }
            await _context.SaveChangesAsync();

            return true;
        }


    }
}
