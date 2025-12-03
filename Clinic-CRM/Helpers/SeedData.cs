using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Helpers
{
    public class SeedData
    {
        Context _context;
        IMapper _mapper;
        IUserService _userService;
        public SeedData(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            
        }

        public async Task Seed()
        {
            await SeedCompanySetting();
            await SeedRoles();
            await SeedUser();


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


        async Task SeedRoles()
        {
            var existingRoles = await _context.UserRoles.ToListAsync();

            var roles = new UserRole[]
            {
                new UserRole
                {
                    Name = USER_ROLES.SUPER_ADMIN,
                },
                new UserRole
                {
                    Name = USER_ROLES.ADMIN,
                },
                new UserRole
                {
                    Name = USER_ROLES.RECEPTIONIST,
                }
            };

            foreach(var role in roles)
            {
                if (!existingRoles.Any(r => r.Name == role.Name))
                {
                    _context.UserRoles.Add(role);
                }
            }

            await _context.SaveChangesAsync();
        }

        async Task SeedUser()
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserRole.Name == USER_ROLES.SUPER_ADMIN);
            var superAdminRole = await _context.UserRoles.FirstOrDefaultAsync(r => r.Name == USER_ROLES.SUPER_ADMIN);

            var users = new CreateUserAccountDTO[]
            {
                new CreateUserAccountDTO
                {
                    FName = "Nexa Tech",
                    LName = "Super Admin",
                    Username = "Nexa",
                    Email = "example@gmail.com",
                    PhoneNumber = "+251984534724",
                    Password = "Nexa@12345",
                    UserRoleId = superAdminRole.Id,
                },
            };

            foreach(var u in users)
            {
                if (existingUser == null)
                {
                    var user = _mapper.Map<User>(u);
                    using var hmac = new HMACSHA512();

                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(u.Password));
                    user.PasswordSalt = hmac.Key;

                    _context.Users.Add(user);
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
