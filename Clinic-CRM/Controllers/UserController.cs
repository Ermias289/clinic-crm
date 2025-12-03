using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        IUserService _userService;
        //IUserRoleService _userRoleService;
        public UserController(IUserService userService)
        {
            _userService = userService;
            //_userRoleService = userRoleService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser(CreateUserAccountDTO dto)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!currentUser.UserRole.IsAdmin && !currentUser.UserRole.CanCreateUser))
                //    throw new UnauthorizedAccessException();

                //if (!_userService.UserRole.IsAdmin && !_userService.UserRole.CanCreateUser)
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.CreateUserAsync(dto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("import")]
        public async Task<ActionResult> ImportUser(List<CreateUserAccountDTO> dto)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!currentUser.UserRole.IsAdmin && !currentUser.UserRole.CanCreateUser))
                //    throw new UnauthorizedAccessException();

                //if (!_userService.UserRole.IsAdmin && !_userService.UserRole.CanCreateUser)
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.ImportUserAsync(dto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!_userService.UserRole.IsAdmin && !_userService.UserRole.CanViewUsers))
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.GetAllUsersAsync());

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!currentUser.UserRole.IsAdmin && !currentUser.UserRole.CanViewUsers))
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.GetUserByIdAsync(id));

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GetUserDTO>> UpdateUser(UpdateUserAccountDTO dto)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!currentUser.UserRole.IsAdmin && !currentUser.UserRole.CanEditUser))
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.UpdateUserAsync(dto));

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (!currentUser.UserRole.IsAdmin && !currentUser.UserRole.CanCreateUser))
                //    throw new UnauthorizedAccessException();

                return Ok(await _userService.DeleteUserAsync(id));

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}

