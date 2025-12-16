using Clinic_CRM.Services.AppointmentServices;
using Clinic_CRM.Services.BranchServices;
using Clinic_CRM.Services.CardServices;
using Clinic_CRM.Services.CardSettingServices;
using Clinic_CRM.Services.CardTypeServices;
using Clinic_CRM.Services.CompanySettingServices;
using Clinic_CRM.Services.DoctorScheduleServices;
using Clinic_CRM.Services.EmailService;
using Clinic_CRM.Services.FileUploadServices;
using Clinic_CRM.Services.MedicalProfessionalServices;
using Clinic_CRM.Services.MedicalServices;
using Clinic_CRM.Services.OTPGenerator;
using Clinic_CRM.Services.PatientServices;
using Clinic_CRM.Services.PaymentServices;
using Clinic_CRM.Services.UserOnBoardingSettingServices;
using Clinic_CRM.Services.UserRoleServices;
using Clinic_CRM.Services.UserServices;
using Clinic_CRM.Services.WorkingDaySettingServices;

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

            //Card Type
            services.AddScoped<ICardTypeService, CardTypeService>();

            //File Upload
            services.AddScoped<IFileUploadService, FileUploadService>();

            //Branch Setting
            services.AddScoped<IBranchSettingService, BranchSettingService>();

            //Patient
            services.AddScoped<IPatientService, PatientServices>();

            //Doctor Schedule
            services.AddScoped<IDoctorScheduleServices, DoctorScheduleServices>();

            //WorkingDaySetting
            services.AddScoped<IWorkingDaySettingService, WorkingDaySettingService>();

            //Card Services
            services.AddScoped<ICardService, CardService>();

            //Payment 
            services.AddScoped<IPaymentService, PaymentService>();

            //Appointment
            services.AddScoped <IAppointmentService, AppointmentService>();
        
            //Medical Professional
            services.AddScoped<IMedicalProfessionalService, MedicalProfessionalService>();

            //Medical Service
            services.AddScoped<IMedicalService, MedicalServices>();

            //Email
            services.AddScoped<IEmailService, EmailService>();

            //OTP
            services.AddScoped<IOTPGeneratorService, OTPGeneratorService>();
        }
    }
}
