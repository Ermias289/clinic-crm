using Clinic_CRM.Services.PaymentTypeServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentTypeController : ControllerBase
    {
        private readonly IPaymentTypeService _paymentTypeService;
        private readonly IUserService _userService;
        public PaymentTypeController(IPaymentTypeService paymentTypeService, IUserService userService)
        {
            _paymentTypeService = paymentTypeService;
            _userService = userService;
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeletePaymentType(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();
                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddPaymentType))
                    throw new UnauthorizedAccessException();
                return Ok(await _paymentTypeService.DeletePaymentTypeAsync(Id));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }     
    }
}
