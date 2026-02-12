using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.MedicalProfessionalDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Models.Settings;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.MedicalProfessionalServices
{
    public class MedicalProfessionalService : IMedicalProfessionalService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;

        public MedicalProfessionalService(IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
        }

        public async Task<MedicalProfessional> AddMedicalProfessional(AddMedicalProfessionalDTO dto)
        {
            var doc = _mapper.Map<MedicalProfessional>(dto);

            var role = await _context.UserRoles.Where(x => x.Name == USER_ROLES.ADMIN).FirstOrDefaultAsync();

            //if (dto.MedicalServicesId.Any())
            //{
            //    doc.MedicalServices = await _context.MedicalServices
            //        .Where(ms => dto.MedicalServicesId.Contains(ms.Id))
            //        .ToListAsync();
            //}

            //if (dto.Branches.Any())
            //{
            //    doc.Branches = await _context.BranchSettings
            //        .Where(ms => dto.Branches.Contains(ms.Id))
            //        .ToListAsync();
            //}


            if (doc.RequiresUserAccount)
            {
                if (role == null)
                    throw new KeyNotFoundException("User Role Not Found");
                var user = new CreateUserAccountDTO
                {
                    Username = doc.FName,
                    FName = doc.FName,
                    LName = doc.LName,
                    MName = doc.MName,
                    PhoneNumber = doc.PhoneNumber,
                    UserRoleId = role.Id,
                    Email = doc.Email,
                    Password = doc.PhoneNumber
                };

                await _userService.CreateUserAsync(user);
            }

            doc.CreatedAt = DateTime.UtcNow;
            _context.MedicalProfessionals.Add(doc);
            await _context.SaveChangesAsync();

            return doc;
        }
        public async Task<MedicalProfessional> UpdateMedicalProfessional(UpdateMedicalProfessionalDTO dto)
        {
            var doc = await _context.MedicalProfessionals
                .Include(x => x.DocServices)
                .FirstOrDefaultAsync(d => d.Id == dto.Id);

            if (doc == null)
                throw new KeyNotFoundException("Medical Professional Not Found");

            _mapper.Map(dto, doc);

            //// ================= MEDICAL SERVICES =================
            //if (dto.MedicalServicesId != null)
            //{
            //    var newServiceIds = dto.MedicalServicesId.Distinct().ToList();
            //    var existingServiceIds = doc.MedicalServices.Select(s => s.Id).ToList();

            //    // Remove unchecked
            //    var servicesToRemove = doc.MedicalServices
            //        .Where(s => !newServiceIds.Contains(s.Id))
            //        .ToList();

            //    foreach (var service in servicesToRemove)
            //        doc.MedicalServices.Remove(service);

            //    // Add new
            //    var servicesToAddIds = newServiceIds.Except(existingServiceIds).ToList();

            //    var servicesToAdd = await _context.MedicalServices
            //        .Where(s => servicesToAddIds.Contains(s.Id))
            //        .ToListAsync();

            //    foreach (var service in servicesToAdd)
            //        doc.MedicalServices.Add(service);
            //}

            //// ================= BRANCHES =================
            //if (dto.Branches != null)
            //{
            //    var newBranchIds = dto.Branches.Distinct().ToList();
            //    var existingBranchIds = doc.Branches.Select(b => b.Id).ToList();

            //    var branchesToRemove = doc.Branches
            //        .Where(b => !newBranchIds.Contains(b.Id))
            //        .ToList();

            //    foreach (var branch in branchesToRemove)
            //        doc.Branches.Remove(branch);

            //    var branchesToAddIds = newBranchIds.Except(existingBranchIds).ToList();

            //    var branchesToAdd = await _context.BranchSettings
            //        .Where(b => branchesToAddIds.Contains(b.Id))
            //        .ToListAsync();

            //    foreach (var branch in branchesToAdd)
            //        doc.Branches.Add(branch);
            //}

            // ================= USER ACCOUNT =================
            var role = await _context.UserRoles
                .FirstOrDefaultAsync(x => x.Name == USER_ROLES.ADMIN);

            if (doc.RequiresUserAccount)
            {
                if (role == null)
                    throw new KeyNotFoundException("User Role Not Found");

                var user = new CreateUserAccountDTO
                {
                    FName = doc.FName,
                    LName = doc.LName,
                    MName = doc.MName,
                    PhoneNumber = doc.PhoneNumber,
                    UserRoleId = role.Id,
                    Email = doc.Email,
                    Password = doc.PhoneNumber
                };

                await _userService.CreateUserAsync(user);
            }

            doc.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return doc;
        }


        public async Task<MedicalProfessional> GetMedicalProfessionalById(int Id)
        {
            var doc = await _context.MedicalProfessionals
                .AsNoTracking()
                .Include(x => x.DocServices)
                .Select(x => new MedicalProfessional
                {
                    Id = x.Id,
                    FName = x.FName,
                    LName = x.LName,
                    MName = x.MName,
                    PhoneNumber = x.PhoneNumber,
                    CreatedAt = x.CreatedAt,
                    JobTitle = x.JobTitle,
                    EducationalBackground = x.EducationalBackground,
                    Email = x.Email,
                    ProfilePicture = x.ProfilePicture,
                    Specialty = x.Specialty,
                    UpdatedAt = x.UpdatedAt,
                    Prefix = x.Prefix,
                    Status = x.Status,
                    YearsOfExperience = x.YearsOfExperience,
                    LicenseNumber = x.LicenseNumber,
                    UserId = x.UserId,
                })
                .FirstOrDefaultAsync(x => x.Id == Id);

            if (doc == null)
                throw new KeyNotFoundException("Medical Professional Not Found");

            return doc;
        }

        public async Task<MedicalProfessional> DeleteMedicalProfessionalById(int Id)
        {
            var doc = await _context.MedicalProfessionals.FindAsync(Id);

            if (doc == null)
                throw new KeyNotFoundException("Medical Professional Not Found");

            _context.MedicalProfessionals.Remove(doc);
            await _context.SaveChangesAsync();
            return doc;
        }

        public async Task<List<MedicalProfessional>> GetAllMedicalProfessionals()
        {
            return await _context.MedicalProfessionals.Include(x => x.DocServices).AsNoTracking()
                 .Select(x => new MedicalProfessional
                 {
                     Id = x.Id,
                     FName = x.FName,
                     LName = x.LName,
                     MName = x.MName,
                     PhoneNumber = x.PhoneNumber,
                     CreatedAt = x.CreatedAt,
                     JobTitle = x.JobTitle,
                     EducationalBackground = x.EducationalBackground,
                     Email = x.Email,
                     ProfilePicture = x.ProfilePicture,
                     Specialty = x.Specialty,
                     UpdatedAt = x.UpdatedAt,
                     Prefix = x.Prefix,
                     Status = x.Status,
                     YearsOfExperience = x.YearsOfExperience,
                     LicenseNumber = x.LicenseNumber,
                     UserId = x.UserId,

                     //Branches = x.Branches.Select(x => new BranchSetting
                     //{
                     //    Id = x.Id,
                     //    Name = x.Name,
                     //    Address = x.Address,
                     //    SubCity = x.SubCity,
                     //    City = x.City,
                     //    Location = x.Location,
                     //    PhoneNumber = x.PhoneNumber,
                     //}).ToList(),

                     //MedicalServices = x.MedicalServices.Select(x => new MedicalService
                     //{
                     //    Id = x.Id,
                     //    Name = x.Name,
                     //    DurationInMinutes = x.DurationInMinutes,
                     //    CreatedAt = x.CreatedAt,
                     //    ServicePicture = x.ServicePicture,
                     //    Description = x.Description,
                     //    UpdatedAt = x.UpdatedAt,
                     //    ServiceReference = x.ServiceReference,
                     //}).ToList()

                 })
                .ToListAsync();
        }
    }
}
