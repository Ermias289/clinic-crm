using Clinic_CRM.DTOs.BankAccountDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.BankAccountServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BankAccountController : ControllerBase
    {
        private readonly IBankAccountService _bankAccountService;
        private readonly IUserService _userService;

        public BankAccountController(IBankAccountService bankAccountService, IUserService userService)
        {
            _bankAccountService = bankAccountService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> AddBankAccount([FromBody] AddBankAccountDTO addBankAccountDto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBankAccount))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankAccountService.AddBankAccount(addBankAccountDto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllBankAccounts(int? Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBankAccount))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankAccountService.GetAllBankAccountsByBankId(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBankAccountById(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewBankAccount))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankAccountService.GetBankAccountById(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut()]
        public async Task<ActionResult> UpdateBankAccount([FromBody] UpdateBankAccountDTO updateBankAccountDto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditBankAccount))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankAccountService.UpdateBankAccount(updateBankAccountDto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult> DeleteBankAccount(int id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddBankAccount))
                    throw new UnauthorizedAccessException();

                return Ok(await _bankAccountService.DeleteBankAccount(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
