using System.Security.Cryptography;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;
namespace Clinic_CRM.Services.PatientServices
{
    public class PatientServices : IPatientService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;
        private readonly IUserService _userService;

        public PatientServices(IMapper mapper, Context context, IUserService userService)
        {
            _mapper = mapper;
            _context = context;
            _userService = userService;
        }
       

        public async Task<Patient> AddPatient(AddPatientDTO dto)
        {
            var patient = _mapper.Map<Patient>(dto);


            var User = await _context.Users.Where(x => x.Id == dto.UserId).FirstOrDefaultAsync();

            var existingPatient = await _context.Patients.Where(x => x.UserId ==_userService.GetCurrentUser().Id).FirstOrDefaultAsync();

            if (existingPatient != null)
                throw new KeyNotFoundException("User already registered as patient.");

            if (_userService.GetCurrentUser().UserRole.Name == USER_ROLES.PATIENT)
            {
                Console.WriteLine("It works here on if");
                if (User == null)
                    throw new KeyNotFoundException("User Account Not Found.");

                patient.FName = User.FName;
                patient.MName = User.MName;
                patient.LName = User.LName;
                patient.Email = User.Email;
                patient.PhoneNumber = User.PhoneNumber;
            }

            if (patient.RequiresUserAccount)
            {
                var userRole = await _context.UserRoles.Where(x => x.Name == USER_ROLES.PATIENT).FirstOrDefaultAsync();

                if (userRole == null)
                    throw new KeyNotFoundException("Role Not Found To Create User Account.");

                var UserN = new CreateUserAccountDTO
                {
                    FName = patient.FName,
                    MName = patient.MName,
                    LName = patient.LName,
                    Email = patient.Email,
                    PhoneNumber = patient.PhoneNumber,
                    Username = patient.FName,
                    UserRoleId = userRole.Id,
                    Password = patient.FName + patient.PhoneNumber
                };

                await _userService.CreateUserAsync(UserN);

                var userN = await _context.Users.Where(x => x.PhoneNumber == patient.PhoneNumber || x.Email == patient.Email).FirstOrDefaultAsync();

                if (userN != null)
                    throw new KeyNotFoundException("Error Creating User Account. Please Try Again Later.");

                patient.UserId = userN.Id;
            }

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient> UpdatePatient(UpdatePatientDTO dto)
        {
            var patient = await _context.Patients.FindAsync(dto.Id);
            var userRole = await _context.UserRoles.Where(x => x.Name.ToLower() == USER_ROLES.PATIENT.ToLower()).FirstOrDefaultAsync();

            if (patient == null)
                throw new KeyNotFoundException("Patient Data Not Found.");

           
            if (patient.RequiresUserAccount)
            {
                if (userRole != null)
                    throw new KeyNotFoundException("Role Not Found To Create User Account.");

                var user = new CreateUserAccountDTO
                {
                    FName = patient.FName,
                    MName = patient.MName,
                    LName = patient.LName,
                    Email = patient.Email,
                    PhoneNumber = patient.PhoneNumber,
                    Username = patient.FName,
                    UserRoleId = userRole.Id,
                    Password = patient.FName + patient.PhoneNumber
                };

                await _userService.CreateUserAsync(user);
            }

            var userN = await _context.Users.Where(x => x.PhoneNumber == patient.PhoneNumber || x.Email == patient.Email).FirstOrDefaultAsync();

            if (userN != null)
                throw new KeyNotFoundException("Error Creating User Account. Please Try Again Later.");

            patient.UserId = userN.Id;
            patient.UpdatedAt = DateTime.UtcNow;

            _mapper.Map(dto, patient);
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return patient;
        }
        
        public async Task<Patient> GetPatientById(int Id)
        {
            var patient = await _context.Patients.Include(x => x.User).Where(x => x.Id == Id).FirstOrDefaultAsync();

            if (patient == null)
                throw new KeyNotFoundException("Patient Data Not Found.");

            return patient;
        }

        public async Task<Patient> DeletePatient(int Id)
        {
            var patient = await _context.Patients.FindAsync(Id);

            if (patient == null)
                throw new KeyNotFoundException("Patient Data Not Found.");
          
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<List<Patient>> GetAllPatients()
        {
            return await _context.Patients.Include(x => x.User).ToListAsync();
        }
    }
}
