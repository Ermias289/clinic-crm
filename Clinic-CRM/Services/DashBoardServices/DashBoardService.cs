using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.DashboardDTOs;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.DashBoardServices
{
    public class DashBoardService : IDashBoardService
    {
        private readonly Context _context;

        public DashBoardService(Context context)
        {
            _context = context;

        }

        // Implement methods defined in IDashBoardService interface here

        public async Task<DashboardDTO> GetAppointmentReport(DateOnly? fromDate, DateOnly? toDate)
        {
            var query = _context.Appointments.AsQueryable();

            while (true)
            {
                if (!fromDate.HasValue)
                {
                    fromDate = DateOnly.FromDateTime(DateTime.Now);
                }
                else
                    break;

                if (fromDate.Value.DayOfWeek.ToString().ToLower() != "monday")
                {
                    fromDate = fromDate.Value.AddDays(-1);
                    continue;
                }
                break;
            }

            while (true)
            {
                if (!toDate.HasValue)
                {
                    toDate = fromDate.Value.AddDays(6);
                }
                else
                    break;

                if (toDate.Value.DayOfWeek.ToString().ToLower() != "sunday")
                {
                    toDate = toDate.Value.AddDays(1);
                    continue;
                }
                break;
            }

            if (fromDate.HasValue)
                query = query.Where(a => a.Day >= fromDate.Value);


            if (toDate.HasValue)
                query = query.Where(a => a.Day <= toDate.Value);

            var groupedData = new DashboardDTO();

            while(fromDate <= toDate)
            {
                var dayData = await query
                    .Where(a => a.Day == fromDate.Value)
                    .GroupBy(a => a.Status)
                    .Select(g => new
                    {
                        Status = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();
                var dashBoardData = new DashBoardData
                {
                    CompletedAppointmentsCount = dayData.FirstOrDefault(d => d.Status == APPOINTMENT_STATUS.COMPLETED)?.Count ?? 0,
                    CanceledAppointmentsCount = dayData.FirstOrDefault(d => d.Status == APPOINTMENT_STATUS.CANCELED)?.Count ?? 0,
                    ScheduledAppointmentsCount = dayData.FirstOrDefault(d => d.Status == APPOINTMENT_STATUS.SCHEDULED)?.Count ?? 0,
                };
                switch (fromDate.Value.DayOfWeek)
                {
                    case DayOfWeek.Monday:
                        groupedData.Monday = dashBoardData;
                        break;
                    case DayOfWeek.Tuesday:
                        groupedData.Tuesday = dashBoardData;
                        break;
                    case DayOfWeek.Wednesday:
                        groupedData.Wednesday = dashBoardData;
                        break;
                    case DayOfWeek.Thursday:
                        groupedData.Thursday = dashBoardData;
                        break;
                    case DayOfWeek.Friday:
                        groupedData.Friday = dashBoardData;
                        break;
                    case DayOfWeek.Saturday:
                        groupedData.Saturday = dashBoardData;
                        break;
                    case DayOfWeek.Sunday:
                        groupedData.Sunday = dashBoardData;
                        break;
                }
                fromDate = fromDate.Value.AddDays(1);
            }

            return groupedData;
        }

        public async Task<MostBookedServicesDTO> GetMostBookedServices()
        {
            var query = _context.Appointments.AsQueryable();

            //if (fromDate.HasValue)
            //    query = query.Where(a => a.ScheduledAt >= fromDate.Value);

            //if (toDate.HasValue)
            //    query = query.Where(a => a.ScheduledAt <= toDate.Value);

            var topServices = await query
                .Where(a => a.DentistryId != null)
                .GroupBy(a => new { a.DentistryId, a.Dentistry.Name })
                .Select(g => new ServiceUsageDTO
                {
                    Id = g.Key.DentistryId,
                    ServiceName = g.Key.Name,
                    BookingCount = g.Count()
                })
                .OrderByDescending(x => x.BookingCount)
                .Take(5)
                .ToListAsync();

            var topServiceIds = topServices.Select(s => s.Id).ToList();

            var othersCount = await query
                .Where(a => !topServiceIds.Contains(a.DentistryId))
                .CountAsync();

            var Others = new ServiceUsageDTO
            {
                Id = 0,
                ServiceName = "Others",
                BookingCount = othersCount
            };

            topServices.Add(Others);

            return new MostBookedServicesDTO
            {
                TopServices = topServices
            };
        }



    }
}
