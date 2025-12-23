using Clinic_CRM.ApplicationDbContext;

namespace Clinic_CRM.Services.NotificationServices
{
    public class SystemNotificationBackgroundService : BackgroundService
    {

        private readonly IServiceProvider _serviceProvider;
        private const int PDCReminderDays = 1; // e.g., remind 3 days before

        public SystemNotificationBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAndSendNotifications();

                // Run every 12 hours
                await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
            }
        }

        private async Task CheckAndSendNotifications()
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<Context>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();


        }
    }
}

