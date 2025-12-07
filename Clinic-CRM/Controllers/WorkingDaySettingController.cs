using Clinic_CRM.DTOs.WorkingDaySettingDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.UserServices;
using Clinic_CRM.Services.WorkingDaySettingServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingDaySettingController : ControllerBase
    {
        private readonly IWorkingDaySettingService _workingDaySettingService;
        private readonly IUserService _userService;

        public WorkingDaySettingController(IWorkingDaySettingService workingDaySettingService, IUserService userService)
        {
            _workingDaySettingService = workingDaySettingService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddWorkingDaySetting(AddWorkingDaySettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddWorkingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _workingDaySettingService.AddWorkingDaySetting(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateWorkingDaySetting(UpdateWorkingDaySettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditWorkingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _workingDaySettingService.UpdateWorkingDaySetting(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
        

        [HttpGet]
        public async Task<ActionResult> GetAllWorkingDaySettings()
        { 
            try
            {
                return Ok(await _workingDaySettingService.GetAll());
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetWorkingDaySettingById(int Id)
        { 
            try
            {
                return Ok(await _workingDaySettingService.GetWorkingDaySettingById(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteWorkingDaySetting(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddWorkingSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _workingDaySettingService.DeleteWorkingDaySetting(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
