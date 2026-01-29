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

        public async Task<DashboardDTO> GetAppointmentReport(DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Appointments.AsQueryable();

            // Apply date filters only if provided
            if (fromDate.HasValue)
                query = query.Where(a => a.ScheduledAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(a => a.ScheduledAt <= toDate.Value);

            var scheduledCount = await query
                .Where(a => a.Status == APPOINTMENT_STATUS.SCHEDULED)
                .CountAsync();

            var completedCount = await query
                .Where(a => a.Status == APPOINTMENT_STATUS.COMPLETED)
                .CountAsync();

            var canceledCount = await query
                .Where(a => a.Status == APPOINTMENT_STATUS.CANCELED)
                .CountAsync();

            return new DashboardDTO
            {
                ScheduledAppointmentsCount = scheduledCount,
                CompletedAppointmentsCount = completedCount,
                CanceledAppointmentsCount = canceledCount
            };
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
                    ServiceName = g.Key.Name,
                    BookingCount = g.Count()
                })
                .OrderByDescending(x => x.BookingCount)
                .Take(5)
                .ToListAsync();

            return new MostBookedServicesDTO
            {
                TopServices = topServices
            };
        }



    }
}
