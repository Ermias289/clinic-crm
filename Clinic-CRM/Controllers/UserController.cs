using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Helpers;
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
    public class UserController : ControllerBase
    {
        IUserService _userService;
        IUserService _userRoleService;
        public UserController(IUserService userService)
        {
            _userService = userService;
            _userRoleService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser(CreateUserAccountDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUser))
                    throw new UnauthorizedAccessException();

                if (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !_userService.UserRole.CanAddUser)
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.CreateUserAsync(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        //[HttpPost("import")]
        //public async Task<ActionResult> ImportUser(List<CreateUserAccountDTO> dto)
        //{
        //    try
        //    {
        //        var currentUser = _userService.GetCurrentUser();

        //        if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUser))
        //            throw new UnauthorizedAccessException();

        //        if (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !_userService.UserRole.CanAddUser)
        //            throw new UnauthorizedAccessException();

        //        return Ok(await _userService.ImportUserAsync(dto));
        //    }
        //    catch (Exception ex)
        //    {
        //        return this.ParseException(ex);
        //    }
        //}

        [HttpGet]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.GetAllUsersAsync());

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.GetUserByIdAsync(id));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetUserDTO>> UpdateUser(UpdateUserAccountDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.UpdateUserAsync(dto));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.DeleteUserAsync(id));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("confirmAccount")]
        public async Task<IActionResult> ConfirmAccount(string OTP)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUser))
                    throw new UnauthorizedAccessException();

                return Ok(await _userService.ConfirmEmailAccount(OTP));

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}

