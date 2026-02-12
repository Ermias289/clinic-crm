
using Clinic_CRM.DTOs.DocServiceDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.DocServiceServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DocServiceController : ControllerBase
    {
        private readonly IDocServiceService _docService;
        private readonly IUserService _userService;
        public DocServiceController(IDocServiceService docService, IUserService userService)
        {
            _docService = docService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllDocServices()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _docService.GetAllDocServices());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpGet("{Id}")]

        public async Task<ActionResult> GetDocServiceById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalProfessional))
                    throw new UnauthorizedAccessException();
                return Ok(await _docService.GetDocServiceAsync(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteDocService(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalProfessional))
                    throw new UnauthorizedAccessException();
                return Ok(await _docService.DeleteDocService(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDocService(UpdateDocServiceDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditMedicalProfessional))
                    throw new UnauthorizedAccessException();
                return Ok(await _docService.UpdateDocService(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddDocService(AddDocServiceDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddMedicalProfessional))
                    throw new UnauthorizedAccessException();

                return Ok(await _docService.AddDocService(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("docService")]
        public async Task<ActionResult> GetDocServicesForAppointment(int? serviceId, int? branchId, int? docId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();
                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewMedicalProfessional))
                    throw new UnauthorizedAccessException();
                return Ok(await _docService.GetDocServicesForAppointment(serviceId, branchId, docId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }

}
