using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Models.Settings;
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
            await SeedCardType();
            //await SeedPatients();


        }

        //async Task SeedPatients()
        //{
        //    // 1. Ensure Nexa (Super Admin) has a Patient record
        //    var nexaUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == "Nexa");
        //    if (nexaUser != null)
        //    {
        //        await CreatePatientForUser(nexaUser);
        //    }

        //    // 2. Repair any other users (like 'mamaruyirga...') who are missing Patient records
        //    // Get all User IDs
        //    var allUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
        //    // Get all Patient IDs
        //    var allPatientIds = await _context.Patients.Select(p => p.Id).ToListAsync();
            
        //    // Find users who don't have a patient record
        //    var missingPatientUserIds = allUserIds.Except(allPatientIds).ToList();

        //    foreach (var userId in missingPatientUserIds)
        //    {
        //        var user = await _context.Users.FindAsync(userId);
        //        if (user != null)
        //        {
        //            await CreatePatientForUser(user);
        //        }
        //    }
        //}

        //async Task CreatePatientForUser(User user)
        //{
        //    var existingPatient = await _context.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.Id == user.Id);
        //    if (existingPatient == null)
        //    {
        //        // Use raw SQL to force insert with specific ID (matching User ID)
        //        var query = @"
        //            SET IDENTITY_INSERT Patients ON;
        //            INSERT INTO Patients (Id, FName, MName, LName, Email, PhoneNumber, Gender, Alergies, ChronicConditions, EmergencyContactName, EmergencyContactPhone, Address, SubCity, City, Country, CreatedAt, UpdatedAt, DateOfBirth, RequiresUserAccount, UserId)
        //            VALUES ({0}, {1}, '', {2}, {3}, {4}, 'Male', '', '', '', '', 'Addis Ababa', 'Bole', 'Addis Ababa', 'Ethiopia', GETDATE(), GETDATE(), '1990-01-01', 0, {0});
        //            SET IDENTITY_INSERT Patients OFF;";
                
        //        try
        //        {
        //            await _context.Database.ExecuteSqlRawAsync(query, user.Id, user.FName ?? "Unknown", user.LName ?? "Unknown", user.Email ?? "noemail@test.com", user.PhoneNumber ?? "0000000000");
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine($"Error creating patient for user {user.Username} (ID: {user.Id}): {ex.Message}");
        //            // Continue to next user
        //        }
        //    }
        //}


        async Task SeedCompanySetting()
        {
            var existingCompanySetting = await _context.CompanySetting.FirstOrDefaultAsync();

            if (existingCompanySetting == null)
            {
                var companySetting = new CompanySetting
                {
                    Name = "Lucid Dental Clinic",
                    Logo = "file_997207_2025_12_23_17_13_26.png",
                    Prefix = "LDC",
                    Email = "",
                    EmergencyPhoneNumber = "+2510909090909",
                    PhoneNumber = "+2510909090909",
                    Address = "Bole Dembel",
                    City = "Addis Ababa",
                    Country = "Ethiopia",
                    SubCity = "Bole",
                    LocationOnMap = "non for now"
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
                },
                new UserRole
                {
                    Name = USER_ROLES.PATIENT,
                    CanAddUser = true,
                    CanEditUser = true,
                    CanViewUser = true,
                    CanRequestCard = true,
                    CanViewCardSetting = true, // Added Permission
                    CanEditPatient = true,
                    CanViewPatient = true,
                    CanAddPatient = true,
                    CanRequestCardPayment = true,
                    CanViewCardPayment = true,
                    CanCancelCardPayment = true,
                    CanViewCard = true,
                    CanEditCard = true,
                    CanViewUserOnBoardingSetting = true,
                    CanViewCardType = true,
                    CanViewBranchSetting = true,
                    CanViewDoctorSchedule = true,
                    CanMakeAppointment = true,
                    CanCancelAppointment = true,
                    CanViewAppointment = true,
                    CanEditAppointment = true,
                    CanViewMedicalProfessional = true,
                    CanViewMedicalService = true,
                    CanViewBank = true,
                    CanViewBankAccount = true,
                    CanReadNotification = true,
                    CanViewNotification = true
                }
            };

            foreach(var role in roles)
            {
                var existingRole = existingRoles.FirstOrDefault(r => r.Name.ToLower() == role.Name.ToLower());
                if (existingRole == null)
                {
                    _context.UserRoles.Add(role);
                }
                else if (role.Name == USER_ROLES.PATIENT)
                {
                    // Force update permissions for Patient if they already exist
                    existingRole.CanViewCardSetting = true;
                    existingRole.CanRequestCard = true;
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
                    Password = "12345",
                    UserRoleId = superAdminRole?.Id,
                },
            };

            foreach(var u in users)
            {
                if (existingUser == null)
                {
                    var user = _mapper.Map<User>(u);
                    user.IsEmailConfirmed = true;
                    using var hmac = new HMACSHA512();

                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(u.Password));
                    user.PasswordSalt = hmac.Key;

                    _context.Users.Add(user);
                }
            }

            await _context.SaveChangesAsync();
        }



        async Task SeedCardType()
        {
            var exostingTypes = await _context.CardTypes.ToListAsync();
            var cardTypes = new CardType[]
            {
                new CardType{Name = "Regular", Description = "Standard membership card"},
                new CardType{Name = "Gold", Description = "Premium gold membership with priority access"},
                new CardType{Name = "Platinum", Description = "Exclusive platinum membership with full benefits"}
            };

            foreach (var cardType in cardTypes)
            {
                if (!exostingTypes.Any(x => x.Name.ToLower() == cardType.Name.ToLower()))
                {
                    _context.CardTypes.Add(cardType);
                }
            }

            await _context.SaveChangesAsync();
            await SeedCardSetting();
        }

        async Task SeedCardSetting()
        {
            var existingSettings = await _context.CardSettings.Include(x => x.CardType).ToListAsync();
            var regularType = await _context.CardTypes.FirstOrDefaultAsync(x => x.Name == "Regular");
            var goldType = await _context.CardTypes.FirstOrDefaultAsync(x => x.Name == "Gold");
            var platinumType = await _context.CardTypes.FirstOrDefaultAsync(x => x.Name == "Platinum");

            var settings = new List<CardSetting>();

            if (regularType != null)
            {
                settings.Add(new CardSetting
                {
                    CardTypeId = regularType.Id,
                    Price = 500,
                    ExpirationDuration = 1// 1 Year
                });
            }

            if (goldType != null)
            {
                settings.Add(new CardSetting
                {
                    CardTypeId = goldType.Id,
                    Price = 1500,
                    ExpirationDuration = 365 // 1 Year
                });
            }

            if (platinumType != null)
            {
                settings.Add(new CardSetting
                {
                    CardTypeId = platinumType.Id,
                    Price = 3000,
                    ExpirationDuration = 730 // 2 Years
                });
            }

            foreach (var setting in settings)
            {
                // Check if a setting for this card type already exists with the same price/duration
                if (!existingSettings.Any(x => x.CardTypeId == setting.CardTypeId && x.Price == setting.Price))
                {
                    _context.CardSettings.Add(setting);
                }
            }
            
            await _context.SaveChangesAsync();
        }


    }
}
