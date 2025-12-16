using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.MedicalServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalServiceController : ControllerBase
    {
        private readonly IMedicalService _medicalService;
        private readonly IUserService _userService;

        public MedicalServiceController(IMedicalService medicalService, IUserService userService)
        {
            _medicalService = medicalService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllMedicalService()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.GetAllMedicalervices());
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("filteredService")]
        public async Task<ActionResult> GetMedicalServicesForAppointment(int? serviceId, int? branchId, int? docId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.GetMedicalServicesForAppointment(serviceId, branchId, docId));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetMedicalService(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.GetMedicalServiceAsync(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteMedicalService(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.DeleteMedicalService(Id));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddMedicalService(AddMedicalServiceDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.AddMedicalService(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMedicalService(UpdateMedicalServiceDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanUpdateMedicalService))
                    throw new UnauthorizedAccessException();

                return Ok(await _medicalService.UpdateMedicalService(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
