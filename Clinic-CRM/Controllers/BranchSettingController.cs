using Clinic_CRM.DTOs.BranchSettingDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.BranchServices;
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
    public class BranchSettingController : ControllerBase
    {
        private readonly IBranchSettingService _branchSettingService;
        private readonly IUserService _userService;

        public BranchSettingController(IBranchSettingService branchSettingService, IUserService userService)
        {
            _branchSettingService = branchSettingService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllBranchSettings()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBranchSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _branchSettingService.GetAllBranchSettings());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetBranchSettingById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBranchSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _branchSettingService.GetBranchSettingById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteBranchSetting(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBranchSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _branchSettingService.DeleteBranchSetting(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddBranchSettin(AddBranchSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBranchSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _branchSettingService.AddBranchSetting(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateBranchSettin(UpdateBranchSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditBranchSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _branchSettingService.UpdateBranchSetting(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
