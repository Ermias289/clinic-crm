using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Services.CompanySettingServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CompanySettingController : ControllerBase
    {
        private readonly ICompanySettingServices _companySettingServcies;

        public CompanySettingController(ICompanySettingServices companySettingServcies)
        {
            _companySettingServcies = companySettingServcies;
        }

        [HttpGet]
        public async Task<ActionResult> GetCompanySetting()
        {
            try
            {
                return Ok(await _companySettingServcies.GetCompanySetting());

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCompanySetting(UpdateCompanySettingDto updateCompanySettingDto)
        {
            try
            {
                return Ok(await _companySettingServcies.UpdateCompanySetting(updateCompanySettingDto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpDelete]
        //public async Task<ActionResult> D
    }
}
