using Clinic_CRM.Helpers;
using Clinic_CRM.Services.BannerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly IBannerService _bannerService;

        public BannerController(IBannerService bannerService)
        {
            _bannerService = bannerService;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddBanner(string Image)
        {
            try
            {
                return Ok(await _bannerService.AddBanner(Image));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBanner(int id)
        {
            try
            {
                return Ok(await _bannerService.GetBannerById(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllBanners()
        {
            try
            {
                return Ok(await _bannerService.GetAllBanners());
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveBanner(int id)
        {
            try
            {
                return Ok(await _bannerService.RemoveBanner(id));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBanner(int id, string image, bool isActive)
        {
            try
            {
                return Ok(await _bannerService.UpdateBanner(id, image, isActive));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
