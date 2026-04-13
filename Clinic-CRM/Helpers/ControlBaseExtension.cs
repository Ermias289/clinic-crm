using Clinic_CRM.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Helpers
{
    public static class ControlBaseExtension
    {
        public static ActionResult ParseException(this ControllerBase controller, Exception exception)
        {
            try
            {
                throw exception;
            }
            catch (KeyNotFoundException ex)
            {
                return controller.NotFound(ReturnMessage.Parse(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return controller.BadRequest(ReturnMessage.Parse(ex.Message));
            }
            catch (ConfirmRequiredException ex)
            {
                return controller.BadRequest(ReturnMessage.Parse(ex.Message, true));
            }

            catch (UnauthorizedAccessException)
            {
                return new ObjectResult("Forbidden")
                {
                    StatusCode = 403,
                    Value = ReturnMessage.Parse("Access Denied.")
                };
            }
        }
    }
}
