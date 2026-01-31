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
            var currentUser = _userService.GetCurrentUser();
            var app = _mapper.Map<Appointment>(dto);

            // 🧠 Load service, doctor, and workday in parallel
            var serviceTask = await _context.MedicalServices
                .Where(s => s.Id == dto.DentistryId)
                .Select(s => new { s.Id, s.Name, s.DurationInMinutes })
                .FirstOrDefaultAsync();

            if(serviceTask == null)
                throw new KeyNotFoundException("Medical service not found.");

            var doctorTask = await _context.MedicalProfessionals
                .Include(d => d.DoctorSchedules)
                .Where(d => d.Id == dto.MedicalProfessionalId)
                .Select(d => new
                {
                    d.Id,
                    d.Prefix,
                    d.FName,
                    Schedules = d.DoctorSchedules
                })
                .FirstOrDefaultAsync();

            if(doctorTask == null)
                throw new KeyNotFoundException("Doctor not found.");

            var workdayTask = await _context.Workdays
                .Where(w => w.Day.ToLower() == dto.Day.DayOfWeek.ToString().ToLower())
                .Select(w => new { w.IsWorkingDay, w.OpeningTime, w.ClosingTime })
                .FirstOrDefaultAsync();

            if(workdayTask == null)
                throw new KeyNotFoundException("Workday information not found.");

            // 👤 Patient resolution
            if (currentUser.UserRole.Name == USER_ROLES.PATIENT)
            {
                var patientId = await _context.Patients
                    .Where(p => p.UserId == currentUser.Id)
                    .Select(p => p.Id)
                    .FirstOrDefaultAsync();

                if (patientId == 0)
                    throw new KeyNotFoundException("Patient profile not found.");

                app.PatientId = patientId;
            }

            // 💳 Load patient + card + card settings in ONE query
            var patientData = await _context.Patients
                .Where(p => p.Id == app.PatientId)
                .Include(p=> p.Card)
                .Include(p => p.User)
                .Select(p => new
                {
                    p.Id,
                    p.FName,
                    p.Card
                 
                })
                .FirstOrDefaultAsync();

            if (patientData == null)
                throw new KeyNotFoundException("Patient not found.");

            var card = await _context.Cards
                .Where(c => c.PatientId == patientData.Id)
                .FirstOrDefaultAsync();

            if (card == null)
                throw new KeyNotFoundException("Patient does not have a card.");

            var cardSettings = await _context.CardSettings
                .Where(cs => cs.CardTypeId == card.CardTypeId)
                .FirstOrDefaultAsync();

            if(cardSettings == null)
                throw new KeyNotFoundException("Card settings not found for patient's card type.");

            var expiryDate = DateOnly.FromDateTime(card.ActivatedAt.AddDays(cardSettings.ExpirationDuration));

            if (dto.Day > expiryDate)
                throw new InvalidOperationException($"Card expires on {expiryDate:yyyy-MM-dd}.");

            // 🕒 Doctor schedule check
            var weekday = dto.Day.DayOfWeek.ToString().ToLower();

            var schedule = doctorTask.Schedules.FirstOrDefault(s =>
                s.WeekDay.ToLower() == weekday &&
                s.StartTime <= dto.ReservationTime &&
                s.EndTime >= dto.ReservationTime);

            if (schedule == null)
                throw new KeyNotFoundException("Doctor not available at this time.");

            // 🏥 Clinic working hours check
            if (workdayTask == null || !workdayTask.IsWorkingDay ||
                workdayTask.OpeningTime > dto.ReservationTime ||
                workdayTask.ClosingTime < dto.ReservationTime)
                throw new KeyNotFoundException("Clinic is closed at this time.");

            var serviceDuration = serviceTask.DurationInMinutes;
            var appStart = dto.ReservationTime;
            var appEnd = appStart.AddMinutes(serviceDuration);

            if (appEnd > schedule.EndTime)
                throw new KeyNotFoundException("Service exceeds doctor's available time.");

            // 🔁 Overlap check
            var overlapping = await _context.Appointments
                .Where(x => x.BranchId == dto.BranchId &&
                            x.MedicalProfessionalId == dto.MedicalProfessionalId &&
                            x.Day == dto.Day &&
                            x.Status == APPOINTMENT_STATUS.SCHEDULED)
                .Select(x => new { x.ReservationTime, x.Dentistry.DurationInMinutes })
                .ToListAsync();

            if (overlapping != null && overlapping.Any(x =>
            {
                var start = x.ReservationTime;
                var end = start.AddMinutes(x.DurationInMinutes);
                return appStart < end && appEnd > start;
            }))
                throw new KeyNotFoundException("Time slot already booked.");

            // 🏷 Generate reference prefix
            var prefix = await _context.CompanySetting
                .AsNoTracking()
                .Select(x => x.Prefix)
                .FirstOrDefaultAsync() ?? "";

            app.Status = APPOINTMENT_STATUS.SCHEDULED;
            app.ScheduledAt = DateTime.Now;
            app.ScheduledById = currentUser.Id;

            _context.Appointments.Add(app);
            await _context.SaveChangesAsync();

            app.Reference = $"{prefix}/{PREFIX.APPOINTMENT}/{app.Id.ToString().PadLeft(PREFIX.PADDING, '0')}/{app.CreatedAt.Year}";
            await _context.SaveChangesAsync();

            // 🔔 Notifications (lightweight queries)
            // 🔔 --- SAFE NOTIFICATIONS START ---

            // Load navigation properties first
            await _context.Entry(app).Reference(a => a.Patient).LoadAsync();
            await _context.Entry(app).Reference(a => a.MedicalProfessional).LoadAsync();

            // Get the UserIds for medical professional and patient
            var medicalProId = await _context.MedicalProfessionals
                .Where(x => x.Id == app.MedicalProfessionalId && x.UserId != 0)
                .Select(x => x.UserId)
                .FirstOrDefaultAsync();

            var notifypatientId = await _context.Patients
                .Where(x => x.Id == app.PatientId && x.UserId != 0)
                .Select(x => x.UserId)
                .FirstOrDefaultAsync();

            // Load actual User entities safely
            User? medicalUser = null;
            User? patientUser = null;

            if (medicalProId != 0)
            {
                medicalUser = await _context.Users.FindAsync(medicalProId);
            }

            if (notifypatientId != 0)
            {
                patientUser = await _context.Users.FindAsync(notifypatientId);
            }


            var pId = await _context.Patients
                .Where(x => x.Id == app.PatientId && x.UserId != 0)
                .Select(x => x.UserId)
                .FirstOrDefaultAsync();

            var user = await _context.Users
                .Where(x => x.Id == pId)
                .FirstOrDefaultAsync();

            var service = await _context.MedicalServices
                .Where(x => x.Id == app.DentistryId)
                .FirstOrDefaultAsync();

            var doc = await _context.MedicalProfessionals
                .Where(x => x.Id == medicalProId)
                .FirstOrDefaultAsync();
            // --- 1️⃣ Notify patient ---
            try
            {
                if (patientUser != null)
                {
                    await _notify.SendUserAsync(
                        $"Appointment for {service?.Name} Service",
                        $"Dear {patientUser.FName}, You have successfully made an appointment for {app.Day} at {app.ReservationTime}. Please arrive on time as scheduled. If you need to make any changes, contact the clinic in advance.",
                        NOTIFICATION_CONSTANTS.APPOINTMENT,
                        new List<int> { patientUser.Id }
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send patient notification: {ex.Message}");
            }

            // --- 2️⃣ Notify medical professional ---
            try
            {
                if (medicalUser != null)
                {
                    await _notify.SendUserAsync(
                        $"New Appointment",
                        $"Dear {doc?.FName}, You have a new appointment for {app.Day} at {app.ReservationTime} with patient {app.Patient.FName}. If you need to make any changes, contact the clinic in advance.",
                        NOTIFICATION_CONSTANTS.APPOINTMENT,
                        new List<int> { medicalUser.Id }
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send medical professional notification: {ex.Message}");
            }

            // --- 3️⃣ Notify receptionists / admins / super admins ---
            try
            {
                var receptions = await _context.Users
                    .Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST
                             || x.UserRole.Name == USER_ROLES.ADMIN
                             || x.UserRole.Name == USER_ROLES.SUPER_ADMIN)
                    .Select(x => x.Id)
                    .ToListAsync();

                if (receptions.Count > 0)
                {
                    await _notify.SendUserAsync(
                        $"New Appointment",
                        $"There is a new appointment for {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName} with patient {app.Patient.FName}. Please prepare accordingly.",
                        NOTIFICATION_CONSTANTS.APPOINTMENT,
                        receptions
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send receptionist/admin notification: {ex.Message}");
            }

            // 🔔 --- SAFE NOTIFICATIONS END ---



            return app;

        }


        public async Task<Appointment> UpdateAppointment(UpdateAppointmentDTO dto)
        {
            var app = await _context.Appointments
                .Include(x => x.Patient)
                    .ThenInclude(x => x.User)
                .Include(x => x.MedicalProfessional)
                    .ThenInclude(x => x.User)
                .Include(x => x.Dentistry)
                .Where(x => x.Id == dto.Id).FirstOrDefaultAsync();

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
                      new List<int> { app.MedicalProfessional.User.Id }
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
            await _context.SaveChangesAsync();

            return app;
        }

        public async Task<Appointment> GetAppointmentById(int Id)
        {
            var app = await _context.Appointments
                .Where(x => x.Id == Id)
                .Include(x => x.Patient)
                    .ThenInclude(x => x.User)
                .FirstOrDefaultAsync();
                

          
            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            if (_userService.GetCurrentUser().UserRole.Name == USER_ROLES.PATIENT)
            {
                if (app.Patient.UserId != _userService.GetCurrentUserNoInclude().Id)
                    throw new UnauthorizedAccessException("You are not allowed to see the details of this Appointment.");
            }

            return app;
        }

        public async Task<List<Appointment>> GetAllAppointment()
        {
            return await _context.Appointments.Include(x => x.Patient).ThenInclude(x => x.User).ToListAsync();
        }

        public async Task<Appointment> DeleteAppointment(int Id)
        {
            var app = await _context.Appointments
               .Include(x => x.Patient)
                   .ThenInclude(x => x.User)
               .Include(x => x.MedicalProfessional)
                    .ThenInclude(x => x.User)
               .Include(x => x.Dentistry)
               .Where(x => x.Id == Id).FirstOrDefaultAsync();

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            if (app.Patient.User != null)
            {
                await _notify.SendUserAsync(
                  $"Appointment Deleted",
                  $"Dear {app.Patient.FName}, Your appointment for {app.Day} at {app.ReservationTime} was deleted successfully .",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> { app.Patient.User.Id }
                  );
            }

            if (app.MedicalProfessional.User != null)
            {
                await _notify.SendUserAsync(
                  $"Appointment Deleted",
                  $"Dear {app.MedicalProfessional.Prefix} {app.MedicalProfessional.FName}, your appointment with appointment number {app.Reference} with patient {app.Patient.FName} has been Deleted.",
                  NOTIFICATION_CONSTANTS.APPOINTMENT,
                  new List<int> { app.MedicalProfessional.User.Id }
                  );
            }

            var receptions = await _context.Users.Where(x => x.UserRole.Name == USER_ROLES.RECEPTIONIST || x.UserRole.Name == USER_ROLES.ADMIN || x.UserRole.Name == USER_ROLES.SUPER_ADMIN).Select(x => x.Id).ToListAsync();

            if (receptions.Count > 0)
                await _notify.SendUserAsync(
                    $"Appointment Canceled",
                    $"The appointment with reference number {app.Reference} has been deleted by {_userService.GetCurrentUserNoInclude().FName}.",
                    NOTIFICATION_CONSTANTS.APPOINTMENT,
                    receptions
                    );

            _context.Appointments.Remove(app);
            await _context.SaveChangesAsync();
            return app;
        }

        public async Task<Appointment> CancelAppointment(int Id, string Reason)
        {
            var app = await _context.Appointments
                .Include(x => x.Patient)
                    .ThenInclude(x => x.User)
                .Include(x => x.MedicalProfessional)
                    .ThenInclude(x => x.User)
                .Include(x => x.Dentistry)
                .Where(x => x.Id ==Id).FirstOrDefaultAsync();

            if (app == null)
                throw new KeyNotFoundException("Appointment Not Found");

            if (app.Status != APPOINTMENT_STATUS.SCHEDULED && app.Status != APPOINTMENT_STATUS.RESCHEDULED)
                throw new KeyNotFoundException("Appointment has to be scheduled to be canceled.");

            app.CancelReason = Reason;
            app.CanceledAt = DateTime.UtcNow;
            app.Status = APPOINTMENT_STATUS.CANCELED;

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
                  new List<int> { app.MedicalProfessional.User.Id }
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
                var app = await _context.Appointments
                    .Include(x => x.Patient)
                        .ThenInclude(x => x.User)
                    .Include(x => x.MedicalProfessional)
                        .ThenInclude(x => x.User)
                    .Where(x => x.Id == Id)
                    .FirstOrDefaultAsync();

                if (app == null)
                    continue;
                 
                if (app.Status != APPOINTMENT_STATUS.SCHEDULED && app.Status != APPOINTMENT_STATUS.RESCHEDULED)
                    continue;

                app.Status = APPOINTMENT_STATUS.COMPLETED;
                app.CompletedAt = DateTime.Now;

                _context.Appointments.Update(app);
               

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
                      new List<int> { app.MedicalProfessional.User.Id }
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
                .Include(x => x.Dentistry)
                .Include(x => x.BranchSetting)
                .Where(x => x.PatientId == Id)
                .OrderByDescending(x => x.ScheduledAt)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetAppointmentByUserId(int userId)
        {
            var patient = await _context.Patients.Where(x => x.UserId == userId).FirstOrDefaultAsync();
           
            if (patient == null)
                throw new KeyNotFoundException("Patient Not Found");

            return await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.MedicalProfessional)
                .Include(x => x.Dentistry)
                .Include(x => x.BranchSetting)
                .Where(x => x.PatientId == patient.Id)
                .OrderByDescending(x => x.ScheduledAt)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetAppointmentsByDocId(int Id)
        {
            return await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.MedicalProfessional)
                .Include(x => x.Dentistry)
                .Include(x => x.BranchSetting)
                .Where(x => x.MedicalProfessionalId == Id)
                .OrderByDescending(x => x.ScheduledAt)
                .ToListAsync();
        }

        public async Task<List<TimeOnly>> GetFreeAppointmentHours(int docId, DateOnly day, int branchId)
        {
            var daySchedule = await _context.DoctorSchedules
                .Where(x => x.MedicalProfessionalId == docId &&
                        x.WeekDay.ToLower() == day.DayOfWeek.ToString().ToLower())
                .FirstOrDefaultAsync();

            if (daySchedule == null)
                throw new KeyNotFoundException("No Medical Professional Schedule Found.");


            var appointments = await _context.Appointments
                .Where(x => x.BranchId == branchId &&
                            x.MedicalProfessionalId == docId &&
                            x.Day == day &&
                            x.Status == APPOINTMENT_STATUS.SCHEDULED)
                .Select(x => new
                {
                    x.ReservationTime,
                    Duration = x.Dentistry.DurationInMinutes
                })
                .ToListAsync();


            //if (Enum.TryParse<DayOfWeek>(daySchedule.WeekDay, true, out var scheduledDay))
            //{
            //    appointments = [.. appointments.Where(x => x.Day.DayOfWeek.ToString().Equals(daySchedule.WeekDay, StringComparison.OrdinalIgnoreCase))];
            //}

            DateTime now = DateTime.Now;
            // 2026-01-28 14:35:42

            TimeOnly time = TimeOnly.FromDateTime(now);
            DateOnly today = DateOnly.FromDateTime(now);

            var freeSlots = new List<TimeOnly>();
            var slotDuration = 30; // standard appointment slot
            var tempTime = daySchedule.StartTime;

            while (tempTime <= daySchedule.EndTime)
            {
                var slotEnd = tempTime.AddMinutes(slotDuration);

                bool overlaps = appointments.Any(a =>
                     tempTime < a.ReservationTime.AddMinutes(a.Duration) &&
                     slotEnd > a.ReservationTime
                );

                
                if (!overlaps && (tempTime > time || day != today)) // clearer than !(time >= tempTime)
                {
                    freeSlots.Add(tempTime);
                }

                tempTime = tempTime.AddMinutes(slotDuration);

            }

            return freeSlots;
        }


    }
}
