using AutoMapper;
using AutoMapper.Internal;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.AppointmentServices
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public AppointmentService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Appointment> MakeAppointment(AddAppointmentDTO dto)
        {
            var app = _mapper.Map<Appointment>(dto);

            var services = await _context.DentistryServices.FindAsync(app.DentistryId);

            var doc = await _context.MedicalProfessionals.FindAsync(app.MedicalProfessionalId);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Not Found.");

            var schedule = doc.DoctorSchedules?.Where(x => x.StartTime <= app.ReservationTime && x.EndTime >= app.ReservationTime).ToList();

            if (schedule == null)
                throw new KeyNotFoundException("The doctor isn't available at this time. ");


            var company = await _context.Workdays
                .Where(x => (x.Day.ToLower() == app.Day.DayOfWeek.ToString().ToLower())
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
                throw new KeyNotFoundException("Your Card Isn't Active. Please Activate your account to make payment.");

            app.Status = APPOINTMENT_STATUS.SCHEDULED;

            _context.Appointments.Add(app);
            await _context.SaveChangesAsync();


            return app;


        }
        public async Task<Appointment> UpdateAppointment(UpdateAppointmentDTO dto)
        {
            var app = await _context.Appointments.FindAsync(dto.Id);
            var services = await _context.DentistryServices.FindAsync(app.DentistryId);


            if (app.Day != dto.Day || app.ReservationTime != app.ReservationTime)
            {
                app.Status = APPOINTMENT_STATUS.RESCHEDULED;
            }


            var doc = await _context.MedicalProfessionals.FindAsync(app.MedicalProfessionalId);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Not Found.");

            var schedule = doc.DoctorSchedules?.Where(x => x.StartTime <= app.ReservationTime && x.EndTime >= app.ReservationTime).ToList();

            if (schedule == null)
                throw new KeyNotFoundException("The doctor isn't available at this time. ");

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
                throw new KeyNotFoundException("Your Card Isn't Active. Please Activate your account to make payment.");

            _context.Appointments.Add(app);
            await _context.SaveChangesAsync();

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
            return app;
        }
        public async Task<bool> CompleteAppointment(List<int> Ids)
        {
            foreach(int Id in Ids)
            {
                var app = await _context.Appointments.FindAsync(Id);

                if (app != null)
                {
                    app.Status = APPOINTMENT_STATUS.COMPLETED;

                    _context.Appointments.Update(app);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
