using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.NotificationServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.DoctorScheduleServices
{
    public class DoctorScheduleServices : IDoctorScheduleServices
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly INotificationService _notify;
        private readonly IUserService _userService;

        public DoctorScheduleServices(IUserService userService,INotificationService notify,IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
            _notify = notify;
            _userService = userService;
        }

        public async Task<DoctorSchedule> AddDoctorSchedule(AddDoctorScheduleDTO dto)
        {
            var doc = _mapper.Map<DoctorSchedule>(dto);

            var doctor = await _context.MedicalProfessionals.FindAsync(doc.MedicalProfessionalId);


            if (doctor == null)
                throw new KeyNotFoundException("Medical professional not found.");

            var worksAtBranch = await _context.MedicalProfessionals
                     .Where(d => d.Id == doc.MedicalProfessionalId)
                     .AnyAsync(d => d.Branches.Any(b => b.Id == doc.BranchSettingId));

            if (!worksAtBranch)
                throw new InvalidOperationException(
                    "The chosen medical professional does not work at this branch."
                );


            _context.DoctorSchedules.Add(doc);
            await _context.SaveChangesAsync();

            await _notify.SendUserAsync(
                       $"New Doctor Schedule Added",
                       $"Medical Professional schedule has been successfully added.",
                       NOTIFICATION_CONSTANTS.DOCTORSCHEDULE,
                       new List<int> { _userService.GetCurrentUserNoInclude().Id }
                       );

            return doc;
        }


        public async Task<DoctorSchedule> UpdateDoctorSchedule(UpdateDoctorScheduleDTO dto)
        {
            var doc = await _context.DoctorSchedules.FindAsync(dto.Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");

            _mapper.Map(dto, doc);
            _context.DoctorSchedules.Update(doc);

            await _context.SaveChangesAsync();

            await _notify.SendUserAsync(
                       $"New Doctor Schedule Update",
                       $"Medical Professional schedule has been successfully updated.",
                       NOTIFICATION_CONSTANTS.DOCTORSCHEDULE,
                       new List<int> { _userService.GetCurrentUserNoInclude().Id, doc.Id }
                       );

            return doc;
        }



        public async Task<DoctorSchedule> GetDoctorScheduleById(int Id)
        {
            var doc = await _context.DoctorSchedules.FindAsync(Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");

            return doc;
        }
        public async Task<List<DoctorSchedule>> GetAllDoctorSchedules()
        {
            return await _context.DoctorSchedules.ToListAsync();
        }
        public async Task<DoctorSchedule> DeleteDoctorSchedule(int Id)
        {
            var doc = await _context.DoctorSchedules.FindAsync(Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");


            _context.DoctorSchedules.Remove(doc);
            await _context.SaveChangesAsync();

            await _notify.SendUserAsync(
                      $"New Doctor Schedule Deeleted",
                      $"Medical Professional schedule has been successfully deleted.",
                      NOTIFICATION_CONSTANTS.DOCTORSCHEDULE,
                      new List<int> { _userService.GetCurrentUserNoInclude().Id, doc.Id }
                      );

            return doc;
        }
    }
}
