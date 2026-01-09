using Clinic_CRM.DTOs.MedicalProfessionalDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.MedicalProfessionalServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalProfessionalController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMedicalProfessionalService _medicalProfessionalService;

        public MedicalProfessionalController(IUserService userService, IMedicalProfessionalService medicalProfessionalService)
        {
            _medicalProfessionalService = medicalProfessionalService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddMedicalProfessional(AddMedicalProfessionalDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalProfessionalService.AddMedicalProfessional(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpPut]
        public async Task<ActionResult> UpdateMedicalProfessional(UpdateMedicalProfessionalDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalProfessionalService.UpdateMedicalProfessional(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetMedicalProfessionalById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalProfessionalService.GetMedicalProfessionalById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteMedicalProfessionalById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalProfessionalService.DeleteMedicalProfessionalById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }

        [HttpGet]
        public async Task<ActionResult> GetAllMedicalProfessionals()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalProfessionalService.GetAllMedicalProfessionals());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }

        }
    }
}
