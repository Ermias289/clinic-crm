using Clinic_CRM.DTOs.UserOnBoardingSettingDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.UserOnBoardingSettingServices;
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
    public class UserOnBoardingSettingController : ControllerBase
    {
        private readonly IUserOnBoardingService _userOnBoardingService;
        private readonly IUserService _userService;

        public UserOnBoardingSettingController(IUserOnBoardingService userOnBoardingService, IUserService userService)
        {
            _userOnBoardingService = userOnBoardingService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddUserOnBoardingSetting(AddUserOnBoardingSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUserOnBoarding))
                    throw new UnauthorizedAccessException();

                return Ok(await _userOnBoardingService.AddUserOnBoardingSetting(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUserOnBoardingSetting(UpdateUserOnBoardingSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditUserOnBoarding))
                    throw new UnauthorizedAccessException();

                return Ok(await _userOnBoardingService.UpdateUserOnBoardingSetting(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetUserOnBoardingSetting(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewUserOnBoardingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _userOnBoardingService.GetUserOnBoardingSetting(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteUserOnBoardingSetting(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewUserOnBoardingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _userOnBoardingService.DeleteUserOnBoarding(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpGet]
        public async Task<ActionResult> GetAllUserOnBoardingSettings()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewUserOnBoardingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _userOnBoardingService.GetAllUserOnBoardingSetting());
            }
            catch(Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
