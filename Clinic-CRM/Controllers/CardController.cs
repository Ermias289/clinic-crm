using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Models;
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
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpPut]
        public async Task<ActionResult> UpdateCard(UpdateCardDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanEditCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.UpdateCard(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllCards()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.GetAllCards());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("getByRef/{reference}")]
        public async Task<ActionResult> GetByRef(string reference)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.GetCardByReference(reference));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.GetCardById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> ReActivateCard(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanRequestCard))
                    throw new UnauthorizedAccessException();

                return Ok(await _cardService.ReActivateCard(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("cardByUserId/{UserId}")]
        public async Task<ActionResult> GetCardByUserId(int UserId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();
                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCard))
                    throw new UnauthorizedAccessException();
                return Ok(await _cardService.GetCardByUserId(UserId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
