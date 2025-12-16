using System;
using Clinic_CRM.ApplicationDbContext;

namespace Clinic_CRM.Services.CardServices
{
    public class CardExpiryBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CardExpiryBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();

                var cardService = scope.ServiceProvider
                                       .GetRequiredService<ICardService>();

                await cardService.AutoExpire();

                // Run once every 24 hours
                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }
    }

}
