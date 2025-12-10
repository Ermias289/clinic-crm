using AutoMapper;
using Clinic_CRM.DTOs.BranchSettingDTOs;
using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.DTOs.UserOnBoardingSettingDTOs;
using Clinic_CRM.DTOs.UserRoleDTOs;
using Clinic_CRM.DTOs.WorkingDaySettingDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //User Mappings
            CreateMap<UpdateUserAccountDTO, User>();
            CreateMap<User, UpdateUserAccountDTO>();
            CreateMap<CreateUserAccountDTO, User>();
            CreateMap<GetUserDTO, User>();
            CreateMap<User, GetUserDTO>();
            CreateMap<User, CreateUserAccountDTO>();
            CreateMap<User, LogInDTO>();
            CreateMap<LogInDTO, User>();
            CreateMap<ChangePasswordDTO, User>();
            CreateMap<User, ChangePasswordDTO>();
            CreateMap<CreateUserAccountDTO, User>();

            // Company Setting Mappings 
            CreateMap<CompanySetting, UpdateCompanySettingDto>();
            CreateMap<UpdateCompanySettingDto, CompanySetting>();

            // User role
            CreateMap<UpdateUserRoleDTO, UserRole>();
            CreateMap<UserRole, UpdateUserRoleDTO>();

            //User OnBoarding Page
            CreateMap<AddUserOnBoardingSettingDTO, UserOnBoardingSetting>();
            CreateMap<UserOnBoardingSetting, AddUserOnBoardingSettingDTO>();
            CreateMap<UpdateUserOnBoardingSettingDTO, UserOnBoardingSetting>();
            CreateMap<UserOnBoardingSetting, UpdateUserOnBoardingSettingDTO>();

            //Card Setting
            CreateMap<AddCardSettingDTO, CardSetting>();
            CreateMap<CardSetting, AddCardSettingDTO>();
            CreateMap<UpdateCardSettingDTO, CardSetting>();
            CreateMap<CardSetting, UpdateCardSettingDTO>();

            //Patients
            CreateMap<AddPatientDTO, Patient>();
            CreateMap<Patient, AddPatientDTO>();
            CreateMap<Patient, UpdatePatientDTO>();
            CreateMap<UpdatePatientDTO, Patient>();

            //Branch Setting
            CreateMap<BranchSetting, AddBranchSettingDTO>();
            CreateMap<AddBranchSettingDTO, BranchSetting>();
            CreateMap<UpdateBranchSettingDTO, BranchSetting>();
            CreateMap<BranchSetting, UpdateBranchSettingDTO>();

            //Doctor Schedule
            CreateMap<DoctorSchedule, AddDoctorScheduleDTO>();
            CreateMap<AddDoctorScheduleDTO, DoctorSchedule>();
            CreateMap<UpdateDoctorScheduleDTO, DoctorSchedule>();
            CreateMap<DoctorSchedule, UpdateDoctorScheduleDTO>();

            //Working Day Setting
            CreateMap<AddWorkingDaySettingDTO, WorkingDaySetting>();
            CreateMap<WorkingDaySetting, AddWorkingDaySettingDTO>();
            CreateMap<UpdateWorkingDaySettingDTO, WorkingDaySetting>();
            CreateMap<WorkingDaySetting, UpdateWorkingDaySettingDTO>();

            //Card 
            CreateMap<RequestCardDTO, Card>();
            CreateMap<Card, RequestCardDTO>();
            CreateMap<UpdateCardDTO, Card>();
            CreateMap<Card, UpdateCardDTO>();

            //Payment
            CreateMap<Payment, CreatePaymentDTO>();
            CreateMap<CreatePaymentDTO, Payment>();
            CreateMap<CheckPaymentDTO, Payment>();
            CreateMap<Payment, CheckPaymentDTO>();
            CreateMap<ApprovePaymentDTO, Payment>();
            CreateMap<Payment, ApprovePaymentDTO>();
            CreateMap<CancelPaymentDTO, Payment>();
            CreateMap<Payment, CancelPaymentDTO>();
            CreateMap<RejectPaymentDTO, Payment>();
            CreateMap<Payment, RejectPaymentDTO>();

        }
    }
}
