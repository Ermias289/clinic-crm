using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.BranchSettingDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.BranchServices
{
    public class BranchSettingService : IBranchSettingService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public BranchSettingService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<BranchSetting> AddBranchSetting(AddBranchSettingDTO dto)
        {
            var branch = _mapper.Map<BranchSetting>(dto);

            _context.BranchSettings.Add(branch);
            await _context.SaveChangesAsync();
            return branch;
        }
        public async Task<BranchSetting> UpdateBranchSetting(UpdateBranchSettingDTO dto)
        {
            var branch = await _context.BranchSettings.FindAsync(dto.Id);

            if (branch == null)
                throw new KeyNotFoundException("Branch Not Found.");

            _mapper.Map<BranchSetting>(dto);
            _context.BranchSettings.Update(branch);
            await _context.SaveChangesAsync();
            return branch;
        }
        public async Task<BranchSetting> DeleteBranchSetting(int Id)
        {
            var branch = await _context.BranchSettings.FindAsync(Id);

            if (branch == null)
                throw new KeyNotFoundException("Branch Not Found.");

            _context.BranchSettings.Remove(branch);
            await _context.SaveChangesAsync();
            return branch;
        }
        public async Task<BranchSetting> GetBranchSettingById(int Id)
        {
            var branch = await _context.BranchSettings.FindAsync(Id);

            if (branch == null)
                throw new KeyNotFoundException("Branch Not Found.");

            return branch;
        }
        public async Task<List<BranchSetting>> GetAllBranchSettings()
        {
            return await _context.BranchSettings.ToListAsync();
        }
    }
}
