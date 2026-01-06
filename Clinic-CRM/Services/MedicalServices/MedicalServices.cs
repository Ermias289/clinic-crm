using System.Runtime.ConstrainedExecution;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Models.Settings;
using Clinic_CRM.Services.NotificationServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.MedicalServices
{
    public class MedicalServices : IMedicalService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly INotificationService _notify;
        private readonly IUserService _userService;
        public MedicalServices(IUserService userService,INotificationService notify,IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
            _notify = notify;
            _userService = userService;
        }

        public async Task<MedicalService> GetMedicalServiceAsync(int Id)
        {
            var medicalService = await _context.MedicalServices
                .Include(x => x.MedicalProfessionals)
                .Include(x => x.Branches)
                .FirstOrDefaultAsync(x => x.Id == Id);

            if (medicalService == null)
                throw new KeyNotFoundException("Medical Service Not Found");


            return medicalService;
        }

        public async Task<List<MedicalService>> GetAllMedicalervices()
        {
            return await _context.MedicalServices
                .Include(x => x.MedicalProfessionals)
                .Include(x => x.Branches)
                .ToListAsync();
        }

        public async Task<MedicalService> AddMedicalService(AddMedicalServiceDTO dto)
        {
            var med = _mapper.Map<MedicalService>(dto);

            if (dto.MedicalProfessionalsId.Any())
            {
                med.MedicalProfessionals = await _context.MedicalProfessionals
                    .Where(mp => dto.MedicalProfessionalsId.Contains(mp.Id))
                    .ToListAsync();
            }

            if (dto.BranchesId.Any())
            {
                med.Branches = await _context.BranchSettings
                    .Where(ms => dto.BranchesId.Contains(ms.Id))
                    .ToListAsync();
            }

            _context.MedicalServices.Add(med);
            await _context.SaveChangesAsync();


            var patientUserIds = await _context.Patients
                 .Where(p => p.UserId != null)
                 .Select(p => p.UserId.Value)
                 .ToListAsync();

            if (patientUserIds.Any())
            {
                await _notify.SendUserAsync(
                    "New Service Available",
                    $"Dear Customer, we have a new {med.Name} service onboard. Be the first to get this service.",
                    NOTIFICATION_CONSTANTS.SERVICE,
                    patientUserIds
                );
            }


            if (_userService.GetCurrentUser() != null)
                await _notify.SendUserAsync(
                          $"New Service Available",
                          $" A new {med.Name} service has been successfully added.",
                          NOTIFICATION_CONSTANTS.SERVICE,
                          new List<int> { _userService.GetCurrentUserNoInclude().Id}
                          );

            return med;
        }

        public async Task<MedicalService> UpdateMedicalService(UpdateMedicalServiceDTO dto)
        {
            var med = await _context.MedicalServices.FindAsync(dto.Id);

            if (med == null)
                throw new KeyNotFoundException("Medical Service Not Found.");

            _mapper.Map(dto, med);

            _context.MedicalServices.Update(med);
            await _context.SaveChangesAsync();

            return med;
        }

        public async Task<MedicalService> DeleteMedicalService(int Id)
        {
            var med = await _context.MedicalServices.FindAsync(Id);

            if (med == null)
                throw new KeyNotFoundException("Medical Service Not Found.");


            _context.MedicalServices.Remove(med);
            await _context.SaveChangesAsync();

            return med;
        }

        public async Task<List<MedicalService>> GetMedicalServicesForAppointment(int? serviceId, int? branchId,  int? docId)
        {
            var service = await _context.MedicalServices
                .Include(x => x.Branches)
                .Include(x => x.MedicalProfessionals)
                .Where(x => (serviceId == null || x.Id == serviceId) &&
                        (branchId == null || x.Id == branchId) &&
                        (docId == null || x.Id == docId)
                )
                .ToListAsync();

            return service;
        }
    }
}
