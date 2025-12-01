using Clinic_CRM.Services.CompanySettingServices;

namespace Clinic_CRM
{
    public class AppServiceRegistration
    {
        public static void AddAppServiceRegistration(IServiceCollection services)
        {
            services.AddScoped<ICompanySettingServices, CompanySettingService>();

        }
    }
}
