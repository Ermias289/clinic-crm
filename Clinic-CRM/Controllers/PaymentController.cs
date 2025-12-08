using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Services.PaymentServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IUserService _userService;

        public PaymentController(IPaymentService paymentService, IUserService userService)
        {
            _paymentService = paymentService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCardPayment(CreatePaymentDTO dto)
        {
            try
            {
                //var currentUser = _userService.GetCurrentUser();

                //if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddCardType))
                //    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.CreatePayment(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
