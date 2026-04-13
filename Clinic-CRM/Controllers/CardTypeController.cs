using Clinic_CRM.DTOs.CardTypeDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.CardTypeServices;
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
    public class CardTypeController : ControllerBase
    {
        private readonly ICardTypeService _cardTypeService;
        private readonly IUserService _userService;

        public CardTypeController(ICardTypeService cardTypeService, IUserService userService)
        {
            _cardTypeService = cardTypeService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllCardTypes()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardType))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardTypeService.GetAllCardTypes());
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetCardTypeById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardType))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardTypeService.GetCardTypeById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteCardType(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddCardType))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardTypeService.DeleteCardType(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCardType(UpdateCardTypeDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditCardType))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardTypeService.UpdateCardType(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddCardType(AddCardTypeDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddCardType))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardTypeService.AddCardType(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


    }
}
