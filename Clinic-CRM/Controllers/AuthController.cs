using System.Security.Cryptography;
using System.Text;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IUserService _userService;
        private readonly Context _context;

        public AuthController(IUserService userService, Context context)
        {
            _userService = userService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult> CreateUser(CreateUserAccountDTO dto)
        {
            try
            {
                return Ok(await _userService.CreateUserAsync(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LogInReturnDTO>> Login(LogInDTO dto)
        {
            var user = _context.Users
                .Include(x => x.UserRole)
                .FirstOrDefault(u => (u.PhoneNumber == dto.PhoneOrEmail) || (u.Email == dto.PhoneOrEmail));

            if (user == null) return Unauthorized("Invalid username");

            if (!VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid password");

            var token = await _userService.CreateToken(user);
            return token;
        }

        private bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        [HttpPost("changePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO dto)
        {
            try
            {
                return Ok(await _userService.SetPassword(dto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

    }
}
