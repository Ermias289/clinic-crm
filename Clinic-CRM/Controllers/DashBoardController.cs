using Clinic_CRM.Helpers;
using Clinic_CRM.Services.DashBoardServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly IDashBoardService _dashBoardService;

        public DashBoardController(IDashBoardService dashBoardService)
        {
            _dashBoardService = dashBoardService;
        }


        [HttpGet("AppointmentReport")]
        public async Task<ActionResult> GetAppointmentReport(DateTime? fromDate, DateTime? toDate)
        {
            try
            {
                return Ok(await _dashBoardService.GetAppointmentReport(fromDate, toDate));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("MostBookedServices")]
        public async Task<ActionResult> GetMostBookedAppointments()
        {
            try
            {
                return Ok(await _dashBoardService.GetMostBookedServices());
            }catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
