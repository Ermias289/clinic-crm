using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.PatientServices;
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
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IUserService _userService;

        public PatientController(IPatientService patientService, IUserService userService)
        {
            _patientService = patientService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllPatients()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewPatient))
                    throw new UnauthorizedAccessException();

                return Ok(await _patientService.GetAllPatients());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetPatientById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewPatient))
                    throw new UnauthorizedAccessException();

                return Ok(await _patientService.GetPatientById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeletePatient(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddPatient))
                    throw new UnauthorizedAccessException();

                return Ok(await _patientService.DeletePatient(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddPatients(AddPatientDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddPatient))
                    throw new UnauthorizedAccessException();

                return Ok(await _patientService.AddPatient(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdatePatient(UpdatePatientDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditPatient))
                    throw new UnauthorizedAccessException();

                return Ok(await _patientService.UpdatePatient(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpGet("byUserId/{Id}")]
        public async Task<ActionResult> GetPatientByUserId(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();
                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewPatient))
                    throw new UnauthorizedAccessException();
                return Ok(await _patientService.GetPatientByUserId(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
