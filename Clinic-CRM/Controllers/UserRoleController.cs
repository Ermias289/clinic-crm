using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Helpers;
using Clinic_CRM.Models;
using Clinic_CRM.Services.CompanySettingServices;
using Clinic_CRM.Services.UserRoleServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleService _userRoleService;
        private readonly Context _context;
        private readonly IMapper _mapper;
        IUserService _userService;

        public UserRoleController(IUserService userService, Context context, IMapper mapper, IUserRoleService userRoleService)
        {
            _context = context;
            _mapper = mapper;
            _userRoleService = userRoleService;
            _userService = userService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateRole(UserRole role)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddRole))
                    throw new UnauthorizedAccessException();


                return Ok(await _userRoleService.CreateRoleAsync(role));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddRole))
                    throw new UnauthorizedAccessException();

                return Ok(await _userRoleService.GetAllRolesAsync());

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddRole))
                    throw new UnauthorizedAccessException();

                return Ok(await _userRoleService.GetRoleByIdAsync(id));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRole(UserRole role)
        {

            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userRoleService.UpdateRoleAsync(role));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddRole))
                    throw new UnauthorizedAccessException();

                return Ok(await _userRoleService.DeleteRoleAsync(id));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
