using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Helpers
{
    public class SeedData
    {
        Context _context;
        IMapper _mapper;
        public SeedData(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task Seed()
        {
            await SeedCompanySetting();

        }

        async Task SeedCompanySetting()
        {
            var existingCompanySetting = await _context.CompanySetting.FirstOrDefaultAsync();

            if (existingCompanySetting == null)
            {
                var companySetting = new CompanySetting
                {
                    Name = "Clinic CRM",
                    Logo = "logo.png",
                    Prefix = "CCR",
                    Email = "companyemail@gmail.com",
                    PhoneNumber = "+251984534724",
                    Address = "Bole Dembel",
                    City = "Addis Ababa",
                    Country = "Ethiopia",
                    SubCity = "Bole",
                };
                _context.CompanySetting.Add(companySetting);
            }
            await _context.SaveChangesAsync();
        }
    }
}
