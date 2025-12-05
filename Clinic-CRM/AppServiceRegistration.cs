using Clinic_CRM.Services.CardSettingServices;
using Clinic_CRM.Services.CompanySettingServices;
using Clinic_CRM.Services.FileUploadServices;
using Clinic_CRM.Services.UserOnBoardingSettingServices;
using Clinic_CRM.Services.UserRoleServices;
using Clinic_CRM.Services.UserServices;

namespace Clinic_CRM
{
    public class AppServiceRegistration
    {
        public static void AddAppServiceRegistration(IServiceCollection services)
        {
            //Company Setting Services
            services.AddScoped<ICompanySettingServices, CompanySettingService>();
            
            //User Service
            services.AddScoped<IUserService, UserService>();

            //User Role Service
            services.AddScoped<IUserRoleService, UserRoleService>();

            //User OnBoarding Setting Services
            services.AddScoped<IUserOnBoardingService, UserOnBoardingService>();

            //Card Setting
            services.AddScoped<ICardSettingService, CardSettingService>();

            //File Upload
            services.AddScoped<IFileUploadService, FileUploadService>();
        }
    }
}
