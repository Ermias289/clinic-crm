using AutoMapper;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;

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
        }
    }
}
