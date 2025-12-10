using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.MedicalProfessionalDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
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

            if (dto.MedicalServicesId.Any())
            {
                doc.MedicalServices = await _context.MedicalServices
                    .Where(ms => dto.MedicalServicesId.Contains(ms.Id))
                    .ToListAsync();
            }


            if (doc.RequiresUserAccount && role !=null)
            {
                var user = new CreateUserAccountDTO
                {
                    FName = doc.FName,
                    LName = doc.LName,
                    MName = doc.MName,
                    PhoneNumber = doc.PhoneNumber,
                    UserRoleId = role.Id,
                    Email = doc.Email,
                    Password = doc.PhoneNumber + doc.FName
                };

                await _userService.CreateUserAsync(user);
            }

            _context.MedicalProfessionals.Add(doc);
            await _context.SaveChangesAsync();

            return doc;
        }
        public async Task<MedicalProfessional> UpdateMedicalProfessional(UpdateMedicalProfessionalDTO dto)
        {
            var doc = await _context.MedicalProfessionals.FindAsync(dto.Id);

            if (doc == null)
                throw new KeyNotFoundException("Medical Professional Not Found");

            _mapper.Map(dto, doc);

            var role = await _context.UserRoles.Where(x => x.Name == USER_ROLES.ADMIN).FirstOrDefaultAsync();


            if (doc.RequiresUserAccount && role != null)
            {
                var user = new CreateUserAccountDTO
                {
                    FName = doc.FName,
                    LName = doc.LName,
                    MName = doc.MName,
                    PhoneNumber = doc.PhoneNumber,
                    UserRoleId = role.Id,
                    Email = doc.Email,
                    Password = doc.PhoneNumber + doc.FName
                };

                await _userService.CreateUserAsync(user);
            }

            _context.MedicalProfessionals.Update(doc);
            await _context.SaveChangesAsync();

            return doc;
        }

        public async Task<MedicalProfessional> GetMedicalProfessionalById(int Id)
        {
            var doc = await _context.MedicalProfessionals.Include(x => x.MedicalServices).FirstOrDefaultAsync(x => x.Id == Id);

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
            return await _context.MedicalProfessionals.Include(x => x.MedicalServices).ToListAsync();
        }
    }
}
