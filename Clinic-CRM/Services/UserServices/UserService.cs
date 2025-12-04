using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public UserRole UserRole { get; }
        public User User { get; }


        public UserService(Context context, IConfiguration configuration, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;

            var User = context.Users
                .AsNoTracking()
                .Where(u => u.Id == GetMyId())
                .Include(u => u.UserRole)
                .FirstOrDefault();

            User = User == null ? null : User;
            UserRole = User == null ? null : User.UserRole;
        }

        public User GetCurrentUser()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            var parsedUserId = int.TryParse(userId, out var result) ? result : 0;


            var user = _context.Users
                .AsNoTracking()
                .Include(u => u.UserRole)
                .FirstOrDefault(u => u.Id == parsedUserId);

            return user;
        }

        public User GetCurrentUserNoInclude()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            var parsedUserId = int.TryParse(userId, out var result) ? result : 0;


            var user = _context.Users
                .AsNoTracking()
                .Where(u => u.Id == parsedUserId)
                .FirstOrDefaultAsync();

            return user.Result;
        }

        public string GetMyName()
        {
            var result = string.Empty;

            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            }

            return result;
        }

        public int GetMyId()
        {
            var employeeId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(employeeId, out var result) ? result : 0;
        }

        public async Task<GetUserDTO> CreateUserAsync(CreateUserAccountDTO dto)
        {

            using var hmac = new HMACSHA512();

            var user = _mapper.Map<User>(dto);
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            user.PasswordSalt = hmac.Key;

            var role = _context.UserRoles
                .FirstOrDefault(r => r.Id == dto.UserRoleId)
                ??
                throw new KeyNotFoundException("Role Not Found.");

            if (role.Name == USER_ROLES.SUPER_ADMIN)
            {
                var superAdminExists = await _context.Users
                    .AnyAsync(u => u.UserRole.Name == USER_ROLES.SUPER_ADMIN);

                if (superAdminExists)
                    throw new InvalidOperationException("There can only be one Super Admin.");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<GetUserDTO>(user);
        }

        public async Task<bool> ImportUserAsync(List<CreateUserAccountDTO> dto)
        {

            foreach (var user in dto)
            {
                CreateUserAsync(user);
            }

            return true;
        }


        public async Task<List<GetUserDTO>> GetAllUsersAsync()
        {
            var currentUser = await _context.Users
                .Include(u => u.UserRole)
                .Where(u => u.Id == GetCurrentUser().Id)
                .FirstOrDefaultAsync();

            var users = _context.Users
                .AsQueryable();

            if (currentUser.UserRole.Name == USER_ROLES.PATIENT)
            {
                users = users.Where(x => x.Id == currentUser.Id);
            }

            var usersReturn = await users.ToListAsync();

            var toReturn = _mapper.Map<List<GetUserDTO>>(usersReturn);

            return toReturn;
        }

        public async Task<GetUserDTO> GetUserByIdAsync(int id)
        {
            var currentUser = await _context.Users
               .Include(u => u.UserRole)
               .Where(u => u.Id == GetCurrentUser().Id)
               .FirstOrDefaultAsync();


            if (currentUser.UserRole.Name == USER_ROLES.PATIENT)
            {
                if (id != currentUser.Id)
                    throw new KeyNotFoundException("You don't have access to this user account.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id)
                ??
                throw new KeyNotFoundException("User Not Found.");

            return _mapper.Map<GetUserDTO>(user);

        }

        public async Task<GetUserDTO> UpdateUserAsync(UpdateUserAccountDTO dto)
        {
            var currentUser = await _context.Users
             .Include(u => u.UserRole)
             .Where(u => u.Id == GetCurrentUser().Id)
             .FirstOrDefaultAsync();


            if (currentUser.UserRole.Name == USER_ROLES.PATIENT)
            {
                if (dto.Id != currentUser.Id)
                    throw new KeyNotFoundException("You don't have access to this user account.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == dto.Id)
                ??
                throw new KeyNotFoundException("User Not Found.");

            

            user.Fullname = dto.FullName;
            user.FName = dto.FName;
            user.LName = dto.LName;
            user.MName = dto.MName;
            user.Email = dto.Email;
            user.UserRoleId = dto.UserRoleId;

            await _context.SaveChangesAsync();

            return _mapper.Map<GetUserDTO>(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var currentUser = await _context.Users
             .Include(u => u.UserRole)
             .Where(u => u.Id == GetCurrentUser().Id)
             .FirstOrDefaultAsync();


            if (currentUser.UserRole.Name == USER_ROLES.PATIENT)
            {
                if (id != currentUser.Id)
                    throw new KeyNotFoundException("You don't have access to this user account.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id)
                ??
                throw new KeyNotFoundException("User Not Found.");


            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // AUTH RELATED

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }

        }


        public async Task<LogInReturnDTO> CreateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.UserRole.Name)
            };

            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            //var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );
            var use = await _context.Users
                .AsNoTracking()
                .Where(x => x.Id == user.Id)
                .Include(x => x.UserRole)
                .FirstOrDefaultAsync();

            if (use == null)
            {
                throw new Exception("User not found");
            }
            LogInReturnDTO dto = new LogInReturnDTO
            {
                user = use,
                userRole = use.UserRole,
                token = new JwtSecurityTokenHandler().WriteToken(token)
            };
            return dto;
        }

        public Task<LogInReturnDTO> Login(LogInDTO dto)
        {
            var user = _context.Users.Where(u => (u.Email == dto.PhoneOrEmail) || (u.PhoneNumber == dto.PhoneOrEmail))
                .AsNoTracking()
                .Include(u => u.UserRole)
                .FirstOrDefault()
                ??
                throw new KeyNotFoundException("User Not Found.");


            if (!VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new InvalidOperationException("Wrong Password.");
            }

            var userReturn = user;
            var userRoleReturn = user.UserRole;

            var token = CreateToken(userReturn);

            return token;

        }

        public async Task<bool> SetPassword(ChangePasswordDTO dto)
        {
            var user = _context.Users.Where(u => (u.Email == dto.PhoneOrEmail) || (u.PhoneNumber == dto.PhoneOrEmail))
                .Include(u => u.UserRole)
                .FirstOrDefault()
                ??
                throw new KeyNotFoundException("User Not Found.");


            if (dto.Reset == false)
            {
                if (!VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
                {
                    throw new InvalidOperationException("Wrong Old Password.");
                }
            }

            if (dto.Reset)
            {
                dto.NewPassword = "12345678";
            }


            if (dto.NewPassword.Length < 8)
                throw new KeyNotFoundException("Password Is Too Short.");

            var user1 = _context.Users.First(u => (u.Email == dto.PhoneOrEmail) || (u.PhoneNumber == dto.PhoneOrEmail));

            CreatePasswordHash(dto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

            user1.PasswordHash = passwordHash;
            user1.PasswordSalt = passwordSalt;

            _context.SaveChangesAsync();

            return true;
        }
    }
}
