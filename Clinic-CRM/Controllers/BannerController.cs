using Clinic_CRM.Helpers;
using Clinic_CRM.Services.BannerServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using static Clinic_CRM.Helpers.Constants;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly IBannerService _bannerService;
        private readonly IUserService _userService;

        public BannerController(IBannerService bannerService, IUserService userService)
        {
            _bannerService = bannerService;
            _userService = userService;
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddBanner(string Image)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUserOnBoarding))
                    throw new UnauthorizedAccessException();

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
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUserOnBoarding))
                    throw new UnauthorizedAccessException();

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
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanAddUserOnBoarding))
                    throw new UnauthorizedAccessException();

                return Ok(await _bannerService.UpdateBanner(id, image, isActive));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }
    }
}
