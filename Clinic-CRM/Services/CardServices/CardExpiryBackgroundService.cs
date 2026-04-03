using System;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Services.NotificationServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

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
            var timer = new PeriodicTimer(TimeSpan.FromMinutes(30));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();

                    // Resolve all scoped services here
                    var _context = scope.ServiceProvider.GetRequiredService<Context>();
                    var _notify = scope.ServiceProvider.GetRequiredService<INotificationService>();
                    var cardService = scope.ServiceProvider.GetRequiredService<ICardService>();

                    // --- Expire Cards ---
                    await cardService.AutoExpire();

                    // --- 1-Day Appointment Reminders ---
                    var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

                    var appointmentsTomorrow = await _context.Appointments
                        .Include(a => a.Patient)
                            .ThenInclude(p => p.User)
                        .Include(a => a.Dentistry)
                        .Where(a => a.Status == APPOINTMENT_STATUS.SCHEDULED &&
                                    a.Day == tomorrow &&
                                    !a.OneDayReminderSent)
                        .ToListAsync();

                    foreach (var appointment in appointmentsTomorrow)
                    {
                        var patientUser = appointment.Patient.User;
                        if (patientUser != null)
                        {
                            await _notify.SendUserAsync(
                                $"Appointment Reminder for {appointment.Dentistry.Name} Service",
                                $"Dear {appointment.Patient.FName}, your appointment is tomorrow ({appointment.Day}) at {appointment.ReservationTime}. This is a reminder that you have 1 day left until your appointment. Please arrive on time or contact the clinic if you need to reschedule.",
                                NOTIFICATION_CONSTANTS.APPOINTMENT,
                                new List<int> { patientUser.Id }
                            );

                            appointment.OneDayReminderSent = true;
                        }
                    }

                    // --- 1-Hour Appointment Reminders ---
                    var nowUtc = DateTime.UtcNow;
                    var oneHourLaterUtc = nowUtc.AddHours(1);

                    var appointmentsInHour = await _context.Appointments
                        .Include(a => a.Patient)
                            .ThenInclude(p => p.User)
                        .Include(a => a.Dentistry)
                        .Where(a => a.Status == APPOINTMENT_STATUS.SCHEDULED &&
                                    a.ScheduledAt >= nowUtc &&
                                    a.ScheduledAt <= oneHourLaterUtc &&
                                    !a.OneHourReminderSent)
                        .ToListAsync();

                    foreach (var appointment in appointmentsInHour)
                    {
                        var patientUser = appointment.Patient.User;
                        if (patientUser != null)
                        {
                            await _notify.SendUserAsync(
                                $"Appointment Reminder for {appointment.Dentistry.Name} Service",
                                $"Dear {appointment.Patient.FName}, your appointment is in an hour at {appointment.ReservationTime}. This is a reminder that you have 1 hour left until your appointment. Please arrive on time or contact the clinic if you need to reschedule.",
                                NOTIFICATION_CONSTANTS.APPOINTMENT,
                                new List<int> { patientUser.Id }
                            );
                            appointment.OneHourReminderSent = true;
                        }

                    }
                    await _context.SaveChangesAsync();

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[CardExpiryBackgroundService Error]: {ex}");
                }
            }
        }
    }
}
