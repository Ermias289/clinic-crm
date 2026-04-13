using Clinic_CRM.DTOs.BankDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.BankServices;
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
    public class BankController : ControllerBase
    {
        private readonly IBankService _bankService;
        private readonly IUserService _userService;

        public BankController(IBankService bankService, IUserService userService)
        {
            _bankService = bankService;
            _userService = userService;
        }


        [HttpPost]
        public async Task<ActionResult> AddBank([FromBody] AddBankDTO addBankDto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBank))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankService.AddBank(addBankDto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

       
        [HttpGet]
        public async Task<ActionResult> GetAllBanks()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBank))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankService.GetAllBanks());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetBankById(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBank))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankService.GetBankById(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateBank([FromBody] UpdateBankDTO updateBankDto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditBank))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankService.UpdateBank(updateBankDto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBankById(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBank))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankService.DeleteBankById(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
