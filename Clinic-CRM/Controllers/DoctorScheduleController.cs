using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.DoctorScheduleServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IDoctorScheduleServices _doctorSchedule;

        public DoctorScheduleController(IUserService userService, IDoctorScheduleServices doctorSchedule)
        {
            _userService = userService;
            _doctorSchedule = doctorSchedule;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllDoctorSchedules()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewDoctorSchedule))
                    throw new UnauthorizedAccessException();

                return Ok(await _doctorSchedule.GetAllDoctorSchedules());
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddDoctorSchedule(AddDoctorScheduleDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddDoctorSchedule))
                    throw new UnauthorizedAccessException();

                return Ok(await _doctorSchedule.AddDoctorSchedule(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDoctorSchedule(UpdateDoctorScheduleDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditDoctorSchedule))
                    throw new UnauthorizedAccessException();

                return Ok(await _doctorSchedule.UpdateDoctorSchedule(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetDoctorScheduleById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewDoctorSchedule))
                    throw new UnauthorizedAccessException();

                return Ok(await _doctorSchedule.GetDoctorScheduleById(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteDoctorSchedule(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddDoctorSchedule))
                    throw new UnauthorizedAccessException();

                return Ok(await _doctorSchedule.DeleteDoctorSchedule(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        
    }
}
