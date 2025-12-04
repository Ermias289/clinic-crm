using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.UserOnBoardingSettingDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.UserOnBoardingSettingServices
{
    public class UserOnBoardingService : IUserOnBoardingService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

    
        public UserOnBoardingService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }


        public async Task<List<UserOnBoardingSetting>> GetAllUserOnBoardingSetting()
        {
            return await _context.UserOnBoardingSettings.ToListAsync();
        }
        public async Task<UserOnBoardingSetting> GetUserOnBoardingSetting(int Id)
        {
            var onBoarding = await _context.UserOnBoardingSettings.FindAsync(Id);

            if (onBoarding == null)
                throw new KeyNotFoundException("User On Boarding Page Not Found");

            return onBoarding;
        }
        
        public async Task<UserOnBoardingSetting> DeleteUserOnBoarding(int Id)
        {
            var onBoarding = await _context.UserOnBoardingSettings.FindAsync(Id);

            if (onBoarding == null)
                throw new KeyNotFoundException("User OnBoarding Page Not Found");

            _context.UserOnBoardingSettings.Remove(onBoarding);
            await _context.SaveChangesAsync();
            return onBoarding;
        }
        public async Task<UserOnBoardingSetting> AddUserOnBoardingSetting(AddUserOnBoardingSettingDTO dto)
        {
            var onBoarding = _mapper.Map<UserOnBoardingSetting>(dto);

            _context.UserOnBoardingSettings.Add(onBoarding);
            await _context.SaveChangesAsync();
            return onBoarding;
        }
        public async Task<UserOnBoardingSetting> UpdateUserOnBoardingSetting(UpdateUserOnBoardingSettingDTO dto)
        {
            var onBoarding = await _context.UserOnBoardingSettings.FindAsync(dto.Id);

            if (onBoarding == null)
                throw new KeyNotFoundException("User OnBoarding Page Not Found");

            _mapper.Map(dto, onBoarding);
            _context.UserOnBoardingSettings.Update(onBoarding);
            await _context.SaveChangesAsync();
            return onBoarding;
        }
    }
}
