using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.CompanySettingServices
{
    public class CompanySettingService : ICompanySettingServices
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public CompanySettingService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<CompanySetting> UpdateCompanySetting(UpdateCompanySettingDto updateCompanySettingDto)
        {
            var existingCompanySetting = await _context.CompanySetting.FirstOrDefaultAsync();

            if (existingCompanySetting == null)
            {
                var newCompanySetting = _mapper.Map<CompanySetting>(updateCompanySettingDto);
                _context.CompanySetting.Add(newCompanySetting);

                await _context.SaveChangesAsync();
                return newCompanySetting;
            }

            _mapper.Map(updateCompanySettingDto, existingCompanySetting);
            _context.CompanySetting.Update(existingCompanySetting);

            await _context.SaveChangesAsync();

            return existingCompanySetting;
        }

        public async Task<CompanySetting> GetCompanySetting()
        {
            var companySetting = await _context.CompanySetting.FirstOrDefaultAsync();

            return companySetting;
        }

        public async Task<CompanySetting> DeleteCompanySetting()
        {
            var existingCompanySetting = await _context.CompanySetting.FirstOrDefaultAsync();
            if (existingCompanySetting != null)
            {
                _context.CompanySetting.Remove(existingCompanySetting);
                await _context.SaveChangesAsync();
            }
            return existingCompanySetting;
        }
    }
}
