using System.Reflection.Metadata;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.CompanySettingServices;
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
    public class CompanySettingController : ControllerBase
    {
        private readonly ICompanySettingServices _companySettingServcies;
        private readonly IUserService _userService;
        public CompanySettingController(ICompanySettingServices companySettingServcies, IUserService userService)
        {
            _companySettingServcies = companySettingServcies;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetCompanySetting()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCompanySettings))
                    throw new UnauthorizedAccessException();

                return Ok(await _companySettingServcies.GetCompanySetting());

            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCompanySetting(UpdateCompanySettingDto updateCompanySettingDto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditCompanySettings))
                    throw new UnauthorizedAccessException();

                return Ok(await _companySettingServcies.UpdateCompanySetting(updateCompanySettingDto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
