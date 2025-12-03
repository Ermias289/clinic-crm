using Clinic_CRM.Services.CompanySettingServices;
using Clinic_CRM.Services.UserServices;

namespace Clinic_CRM
{
    public class AppServiceRegistration
    {
        public static void AddAppServiceRegistration(IServiceCollection services)
        {
            services.AddScoped<ICompanySettingServices, CompanySettingService>();
            services.AddScoped<IUserService, UserService>();

        }
    }
}
