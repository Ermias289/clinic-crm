using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.CardSettingServices;
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
    public class CardSettingController : ControllerBase
    {
        private readonly ICardSettingService _cardSettingService;
        private readonly IUserService _userService;

        public CardSettingController(ICardSettingService cardSettingService, IUserService userService)
        {
            _cardSettingService = cardSettingService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllCardSettings()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardSettingService.GetAllCardSettings());
            }
            catch(Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetCardSettingsById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardSettingService.GetCardSettingById(Id));
            }
            catch(Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddCardSettings(AddCardSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddCardSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardSettingService.AddCardSetting(dto));
            }
            catch(Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteCardSettings(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddCardSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardSettingService.DeleteCardSetting(Id));
            }
            catch(Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCardSetting(UpdateCardSettingDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditCardSetting))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardSettingService.UpdateCardSettingService(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
