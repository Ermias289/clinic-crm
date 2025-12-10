using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.AppointmentServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IUserService _userService;
 
        public AppointmentController(IUserService userService, IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllAppointments()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewAppointment))
                    throw new UnauthorizedAccessException();
                return Ok(await _appointmentService.GetAllAppointment());

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetAppointmentById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewAppointment))
                    throw new UnauthorizedAccessException();
                return Ok(await _appointmentService.GetAppointmentById(Id));

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    
        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteAppointmentById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanMakeAppointment))
                    throw new UnauthorizedAccessException();
                return Ok(await _appointmentService.DeleteAppointment(Id));

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    
        [HttpPost]
        public async Task<ActionResult> MakeAppointment(AddAppointmentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanMakeAppointment))
                    throw new UnauthorizedAccessException();
                return Ok(await _appointmentService.MakeAppointment(dto));

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("cancelAppointment")]
        public async Task<ActionResult> CancelAppointment(int Id, string reason)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanCancelCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _appointmentService.CancelAppointment(Id, reason));

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("completeAppointments")]
        public async Task<ActionResult> CompleteAppointment(List<int> Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanCompleteAppointment))
                    throw new UnauthorizedAccessException();

                return Ok(await _appointmentService.CompleteAppointment(Id));

            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
