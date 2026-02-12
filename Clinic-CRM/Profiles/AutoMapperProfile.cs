using AutoMapper;
using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.DTOs.BankAccountDTOs;
using Clinic_CRM.DTOs.BankDTOs;
using Clinic_CRM.DTOs.BranchSettingDTOs;
using Clinic_CRM.DTOs.CardDTOs;
using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.DTOs.CardTypeDTOs;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.DTOs.DocServiceDTOs;
using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.DTOs.MedicalProfessionalDTOs;
using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.DTOs.PaymentDTOs;
using Clinic_CRM.DTOs.PaymentTypeDTOs;
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

            //Card Type
            CreateMap<AddCardTypeDTO, CardType>();
            CreateMap<CardType, AddCardTypeDTO>();
            CreateMap<UpdateCardTypeDTO, CardType>();
            CreateMap<CardType, UpdateCardTypeDTO>();

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
            CreateMap<AutoPaymentPrepareDTO, Payment>();
            CreateMap<Payment, AutoPaymentPrepareDTO>();


            //Appointment
            CreateMap<Appointment, AddAppointmentDTO>();
            CreateMap<AddAppointmentDTO, Appointment>();
            CreateMap<UpdateAppointmentDTO, Appointment>();
            CreateMap<Appointment, UpdateAppointmentDTO>();

            //Medical Professional
            CreateMap<MedicalProfessional, AddMedicalProfessionalDTO>();
            CreateMap<AddMedicalProfessionalDTO, MedicalProfessional>();
                //.ForMember(dest => dest.Branches, opt => opt.Ignore())
                //.ForMember(dest => dest.MedicalServices, opt => opt.Ignore());
            CreateMap<UpdateMedicalProfessionalDTO, MedicalProfessional>();
              //.ForMember(dest => dest.Branches, opt => opt.Ignore())
              //  .ForMember(dest => dest.MedicalServices, opt => opt.Ignore());
            CreateMap<MedicalProfessional, UpdateMedicalProfessionalDTO>();

            //Medical Service
            CreateMap<MedicalService, AddMedicalServiceDTO>();
            CreateMap<AddMedicalServiceDTO, MedicalService>()
                .ForMember(dest => dest.Branches, opt => opt.Ignore())
                .ForMember(dest => dest.MedicalProfessionals, opt => opt.Ignore());
            CreateMap<UpdateMedicalServiceDTO, MedicalService>()
                .ForMember(dest => dest.Branches, opt => opt.Ignore())
                .ForMember(dest => dest.MedicalProfessionals, opt => opt.Ignore());
            //CreateMap<MedicalService, UpdateMedicalServiceDTO>();
            CreateMap<MedicalService, UpdateMedicalServiceDTO>()
                .ForMember(dest => dest.Branches,
                    opt => opt.MapFrom(src => src.Branches.Select(b => b.Id)))
                .ForMember(dest => dest.MedicalProfessionalsId,
                    opt => opt.MapFrom(src => src.MedicalProfessionals.Select(mp => mp.Id)));


            //Bank
            CreateMap<AddBankDTO, Bank>();
            CreateMap<Bank, AddBankDTO>();
            CreateMap<UpdateBankDTO, Bank>();
            CreateMap<Bank, UpdateBankDTO>();

            //Bank Account
            CreateMap<BankAccount, AddBankAccountDTO>();
            CreateMap<AddBankAccountDTO, BankAccount>();
            CreateMap<UpdateBankAccountDTO, BankAccount>();
            CreateMap<BankAccount, UpdateBankAccountDTO>();


            //Payment Type
            CreateMap<AddPaymentTypeDTO, PaymentType>();
            CreateMap<PaymentType, AddPaymentTypeDTO>();
            CreateMap<UpdatePaymentTypeDTO, PaymentType>();
            CreateMap<PaymentType, UpdatePaymentTypeDTO>();

            //Doc Service
            CreateMap<DocService, AddDocServiceDTO>();
            CreateMap<AddDocServiceDTO, DocService>();
            CreateMap<UpdateDocServiceDTO, DocService>();
            CreateMap<DocService, UpdateDocServiceDTO>();

        }
    }
}
