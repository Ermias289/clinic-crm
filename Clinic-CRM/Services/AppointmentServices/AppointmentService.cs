using AutoMapper;
using AutoMapper.Internal;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.NotificationServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Clinic_CRM.Services.AppointmentServices
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly INotificationService _notify;

        public AppointmentService(INotificationService notify,IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
            _notify = notify;
        }

        public async Task<Appointment> MakeAppointment(AddAppointmentDTO dto)
        {
            // Map DTO to entity
            var app = _mapper.Map<Appointment>(dto);

            // Load the service
            var service = await _context.MedicalServices.FindAsync(app.DentistryId);

            if (_userService.GetCurrentUser().UserRole.Name == USER_ROLES.PATIENT)
            {
                app.PatientId = _userService.GetCurrentUser().Id;
            }

            // Load patient
            var patient = await _context.Patients.FindAsync(app.PatientId);

            if (patient == null)
                throw new KeyNotFoundException("Patient not found.");

            // Check patient's card
            var card = await _context.Cards
                .Where(c => c.PatientId == app.PatientId)
                .FirstOrDefaultAsync();

            if (card == null)
                throw new KeyNotFoundException("Patient does not have a card. Please get a card to make an appointment.");

            var cardSetting = await _context.CardSettings
                           .Where(c => c.CardType.Name == card.CardType.Name)
                           .FirstOrDefaultAsync();

            if (cardSetting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            var cardExpiryDate = card.ActivatedAt.AddDays(cardSetting.ExpirationDuration);

            // appointmentDate = the date user selected
            if (app.Day.Day > cardExpiryDate.Day)
            {
                throw new InvalidOperationException(
                    $"Your card will expire on {cardExpiryDate:yyyy-MM-dd}. Please choose an appointment date before this date."
                );
            }

            if (service == null)
                throw new KeyNotFoundException("Medical service not found.");
     
            // Load doctor with schedules
            var doc = await _context.MedicalProfessionals
                .Include(d => d.DoctorSchedules)
                .FirstOrDefaultAsync(d => d.Id == app.MedicalProfessionalId);

            if (doc == null)
                throw new KeyNotFoundException("Doctor not found.");

            // Compute appointment weekday
            var appointmentWeekDay = app.Day.DayOfWeek.ToString();

            // Check if doctor has schedule on that day and time
            var scheduleAvailable = doc.DoctorSchedules?
                .Any(s =>
                    s.WeekDay.Equals(appointmentWeekDay, StringComparison.OrdinalIgnoreCase) &&
                    s.StartTime <= app.ReservationTime &&
                    s.EndTime >= app.ReservationTime
                ) ?? false;

            if (!scheduleAvailable)
                throw new KeyNotFoundException("The doctor isn't available at this time.");

            // Check company working hours
            var companyOpen = await _context.Workdays
                              .Where(x =>
                                  x.Day.ToLower() == appointmentWeekDay.ToLower() &&
                                  x.IsWorkingDay &&
                                  x.OpeningTime <= app.ReservationTime &&
                                  x.ClosingTime >= app.ReservationTime
                              )
                              .AnyAsync();

            if (!companyOpen)
                throw new KeyNotFoundException("The clinic is not open on this date.");

            var prefix = await _context.CompanySetting
                .AsNoTracking()
                .Select(x => x.Prefix)
                .FirstOrDefaultAsync() ?? "";
            // Set status
            app.Status = APPOINTMENT_STATUS.SCHEDULED;

            // Add appointment
            _context.Appointments.Add(app);
            await _context.SaveChangesAsync();
            app.Reference = $"{prefix}/{PREFIX.APPOINTMENT}/{app.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{app.CreatedAt.Year}";
            await _context.SaveChangesAsync();

            if (app.Patient.User != null)
            {
                await _notify.SendUserAsync(
                  $"Appointment for {app.DentistryService.Name} Service",
                  $"Dear {app.Patient.FName}, You have successfully made an appointment for {app.Day} at {app.ReservationTime}. Please arrive on time as scheduled. If you need to make any changes, contact the clinic in advance.",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> { app.Patient.User.Id }
                  );
            }

            if(app.MedicalProfessional.User != null)
            {
                await _notify.SendUserAsync(
                  $"New Appointment",
                  $"Dear {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName}, You have a new appointment for {app.Day} at {app.ReservationTime} with patient {app.Patient.FName}. If you need to make any changes, contact the clinic in advance.",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> {app.MedicalProfessional.Id}
                  );
            }

            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();
            
            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"New Appointment",
                    $"There is a new appointment for {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName} with patient {app.Patient.FName}. Please prepare accordingly.",
                    NOTIFICATION_CONSTANTS.APPOINTMENT,
                    receptions
                    );

            return app;
        }

        public async Task<Appointment> UpdateAppointment(UpdateAppointmentDTO dto)
        {
            var app = await _context.Appointments.FindAsync(dto.Id);

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");
            app.UpdateAt = DateTime.UtcNow;
            var services = await _context.MedicalServices.FindAsync(app.DentistryId);


            if (app.Day != dto.Day || app.ReservationTime != app.ReservationTime)
            {
                app.Status = APPOINTMENT_STATUS.RESCHEDULED;
            }

            var doc = await _context.MedicalProfessionals.FindAsync(app.MedicalProfessionalId);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Not Found.");

            var schedule = doc.DoctorSchedules?
                         .Where(x => x.StartTime <= app.ReservationTime && x.EndTime >= app.ReservationTime)
                         .ToList();

            if (schedule == null || !schedule.Any())
                throw new KeyNotFoundException("The doctor isn't available at this time.");

            var company = await _context.Workdays
                .Where(x => (x.Day == app.Day.DayOfWeek.ToString().ToLower())
                            && (x.IsWorkingDay)
                            && (x.OpeningTime <= app.ReservationTime
                            && x.ClosingTime >= app.ReservationTime))
                .ToListAsync();

            if (company == null)
                throw new KeyNotFoundException("We are not open on this date.");

            var patient = await _context.Patients.FindAsync(app.PatientId);

            if (patient == null)
                throw new KeyNotFoundException("Patient Not Found.");

            var card = await _context.Cards.Where(x => x.Id == patient.CardId && x.PatientId == app.PatientId).FirstOrDefaultAsync();

            if (card == null)
                throw new KeyNotFoundException("You don't have a card please get a card to make appointment.");

            if (card.Status != CARD_STATUS.ACTIVE)
                throw new KeyNotFoundException("Your Card Isn't Active. Please Activate your account to make Appointment.");

            _context.Appointments.Add(app);
            await _context.SaveChangesAsync();

            if (app.Day != dto.Day || app.ReservationTime != dto.ReservationTime || app.MedicalProfessionalId != dto.MedicalProfessionalId || app.BranchId != dto.BranchId)
            {
                if (app.Patient.User != null)
                {
                    await _notify.SendUserAsync(
                      $"Appointment Update",
                      $"Dear {app.Patient.FName}, You have successfully made a change on your appointment for {app.Day} at {app.ReservationTime}. Please arrive on time as scheduled. If you need to make any changes, contact the clinic in advance.",
                      NOTIFICATION_CONSTANTS.APPOINTMENT,
                      new List<int> { app.Patient.User.Id }
                      );
                }

                if (app.MedicalProfessional.User != null)
                {
                    await _notify.SendUserAsync(
                      $"Appointment Update",
                      $"Dear {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName}, there has been a change on appointment number {app.Reference} please check your new schedule. If you need to make any changes, contact the clinic in advance.",
                      NOTIFICATION_CONSTANTS.APPOINTMENT,
                      new List<int> { app.MedicalProfessional.Id }
                      );
                }

                var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

                if (receptions.Count > 0)
                    await _notify.SendUserAsync(
                        $"Appointment Update",
                        $"There has been a change on appointment no {app.Reference}. Please prepare accordingly.",
                        NOTIFICATION_CONSTANTS.APPOINTMENT,
                        receptions
                        );
            }


            return app;
        }

        public async Task<Appointment> GetAppointmentById(int Id)
        {
            var app = await _context.Appointments.FindAsync(Id);

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            return app;
        }

        public async Task<List<Appointment>> GetAllAppointment()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task<Appointment> DeleteAppointment(int Id)
        {
            var app = await _context.Appointments.FindAsync(Id);

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            _context.Appointments.Remove(app);
            await _context.SaveChangesAsync();
            return app;
        }

        public async Task<Appointment> CancelAppointment(int Id, string Reason)
        {
            var app = await _context.Appointments.FindAsync(Id);

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            app.CancelReason = Reason;
            app.CanceledAt = DateTime.UtcNow;

            _context.Appointments.Update(app);
            await _context.SaveChangesAsync();

            if (app.Patient.User != null)
            {
                await _notify.SendUserAsync(
                  $"Appointment Canceled",
                  $"Dear {app.Patient.FName}, You have successfully canceled your appointment for {app.Day} at {app.ReservationTime}.",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> { app.Patient.User.Id }
                  );
            }

            if (app.MedicalProfessional.User != null)
            {
                await _notify.SendUserAsync(
                  $"Appointment Canceled",
                  $"Dear {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName}, your appointment with appointment number {app.Reference} with patient {app.Patient.FName} has been canceled.",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> { app.MedicalProfessional.Id }
                  );
            }

            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Appointment Canceled",
                    $"The appointment with reference number {app.Reference} has been canceled by {_userService.GetCurrentUserNoInclude().FName}.",
                    NOTIFICATION_CONSTANTS.APPOINTMENT,
                    receptions
                    );

            return app;
        }

        public async Task<bool> CompleteAppointment(List<int> Ids)
        {
            foreach(int Id in Ids)
            {
                var app = await _context.Appointments.FindAsync(Id);

                if (app != null || app.Status != APPOINTMENT_STATUS.CANCELED)
                {
                    app.Status = APPOINTMENT_STATUS.COMPLETED;
                    app.CompletedAt = DateTime.Now;

                    _context.Appointments.Update(app);
                }

                if (app.Patient.User != null)
                {
                    await _notify.SendUserAsync(
                      $"Appointment Completed",
                      $"Dear {app.Patient.FName}, Your appointemnt has been successfully completed. Thank you for choosing us.",
                      NOTIFICATION_CONSTANTS.APPOINTMENT,
                      new List<int> { app.Patient.User.Id }
                      );
                }

                if (app.MedicalProfessional.User != null)
                {
                    await _notify.SendUserAsync(
                      $"Appointment Completed",
                      $"Dear {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName}, your appointment with appointment number {app.Reference} with patient {app.Patient.FName} has been completed. Thank you for your service.",
                      NOTIFICATION_CONSTANTS.APPOINTMENT,
                      new List<int> { app.MedicalProfessional.Id }
                      );
                }

                var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

                if (receptions.Count > 0)
                    await _notify.SendUserAsync(
                        $"Appointment Completed",
                        $"The appointment with reference number {app.Reference} has been completed successfully by {_userService.GetCurrentUserNoInclude().FName}.",
                        NOTIFICATION_CONSTANTS.APPOINTMENT,
                        receptions
                        );
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Appointment>> GetAppointmentsByPatientId(int Id)
        {
            return await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.MedicalProfessional)
                .Include(x => x.DentistryService)
                .Include(x => x.BranchSetting)
                .Where(x => x.PatientId == Id)
                .ToListAsync();
        }
    }
}
