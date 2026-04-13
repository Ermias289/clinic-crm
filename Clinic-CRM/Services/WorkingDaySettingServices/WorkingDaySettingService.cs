using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.WorkingDaySettingDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.WorkingDaySettingServices
{
    public class WorkingDaySettingService : IWorkingDaySettingService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public WorkingDaySettingService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<WorkingDaySetting> AddWorkingDaySetting(AddWorkingDaySettingDTO dto)
        {
            var day = _mapper.Map<WorkingDaySetting>(dto);

            var company = await _context.CompanySetting.FirstOrDefaultAsync();
            if (company == null)
                throw new KeyNotFoundException("Company Profile hasn't been set yet.");
            day.CompanySettingId = company.Id;

            _context.Add(day);
            await _context.SaveChangesAsync();
            return day;
        }

        public async Task<WorkingDaySetting> UpdateWorkingDaySetting(UpdateWorkingDaySettingDTO dto)
        {
            var day = await _context.Workdays.FindAsync(dto.Id);

            if (day == null)
                throw new KeyNotFoundException("Working Day Not Found");

            _mapper.Map(dto, day);
            _context.Update(day);
            await _context.SaveChangesAsync();

            return day;
        }

        public async Task<List<WorkingDaySetting>> GetAll()
        {
            return await _context.Workdays.ToListAsync();
        }

        public async Task<WorkingDaySetting> GetWorkingDaySettingById(int Id)
        {
            var day = await _context.Workdays.FindAsync(Id);

            if (day == null)
                throw new KeyNotFoundException("Working Day Not Found");

            return day;
        }

        public async Task<WorkingDaySetting> DeleteWorkingDaySetting(int Id)
        {
            var day = await _context.Workdays.FindAsync(Id);

            if (day == null)
                throw new KeyNotFoundException("Working Day Not Found");

            _context.Remove(day);
            await _context.SaveChangesAsync();

            return day;
        }
    }
}
