using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.Helpers;
using Clinic_CRM.Models;
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

        [HttpPut("paymentRequest")]
        public async Task<ActionResult> CreateCardPaymentRequest(CreatePaymentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanRequestCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.CreatePayment(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("checkPayment")]
        public async Task<ActionResult> CheckPayemnt(CheckPaymentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanCheckCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.CheckPayemnt(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("approvePayment")]
        public async Task<ActionResult> ApprovePayment(ApprovePaymentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanApproveCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.ApprovePayment(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("cancelPayment")]        
        public async Task<ActionResult> CancelPayment(CancelPaymentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanCancelCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.CancelPayment(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("rejectPayment")]
        public async Task<ActionResult> RejectPayment(RejectPaymentDTO dto)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanRejectCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.RejectPayment(dto));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{Status}")]
        public async Task<ActionResult> GetPaymentByStatus(string Status)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.GetPaymentByStatus(Status));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllPayments()
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.GetAllPayments());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("/{Id}")]
        public async Task<ActionResult> GetPaymentById(int Id)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.GetPaymentById(Id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
      

        [HttpGet("bypatientId{patientId}")]

        public async Task<ActionResult> GetPaymentByPatientId(int patientId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.GetAllPaymentsByPatientId(patientId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("bycardId{cardId}")]

        public async Task<ActionResult> GetPaymentByCardId(int cardId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewCardPayment))
                    throw new UnauthorizedAccessException();

                return Ok(await _paymentService.GetAllPaymentsByCardId(cardId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
