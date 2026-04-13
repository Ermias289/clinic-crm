using Clinic_CRM.Helpers;
using Clinic_CRM.Services.NotificationServices;
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
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notify;
        private readonly IUserService _userService;

        public NotificationController(INotificationService notify, IUserService userService)
        {
            _notify = notify;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetUserNotificationsAsync(int userId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanViewNotification))
                    throw new UnauthorizedAccessException();

                return Ok(await _notify.GetUserNotificationsAsync(userId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("markAllasRead")]
        public async Task<ActionResult> MarkAllAsReadAsync(int userId)
        {
            try
            {
                var currentUser = _userService.GetCurrentUser();

                if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanReadNotification))
                    throw new UnauthorizedAccessException();

                return Ok(await _notify.MarkAllAsReadAsync(userId));
            }
            catch (Exception ex)
            {
                return this.ParseException(ex);
            }
        }

        [HttpPut("markAsRead")]
        public async Task<ActionResult> MarkAsReadAsync(int userId, int notificationId)
        {
            {
                try
                {
                    var currentUser = _userService.GetCurrentUser();

                    if (currentUser == null || (currentUser.UserRole.Name != USER_ROLES.SUPER_ADMIN && !currentUser.UserRole.CanReadNotification))
                        throw new UnauthorizedAccessException();

                    return Ok(await _notify.MarkAsReadAsync(userId, notificationId));
                }
                catch (Exception ex)
                {
                    return this.ParseException(ex);
                }
            }

        }
    }
}
