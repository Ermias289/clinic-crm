using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.CardServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICardService _cardService;

        public CardController(IUserService userService, ICardService cardService)
        {
            _cardService = cardService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> RequestCard(RequestCardDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanRequestCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.RequestCard(dto));
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
