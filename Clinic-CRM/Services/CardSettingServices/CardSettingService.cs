using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.CardSettingDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.CardSettingServices
{
    public class CardSettingService : ICardSettingService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public CardSettingService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<CardSetting> GetCardSetting()
        {
            var setting = await _context.CardSettings.FirstOrDefaultAsync();

            if (setting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            return setting;
        }

        public async Task<CardSetting> AddCardSetting(AddCardSettingDTO dto)
        {
            var setting = _mapper.Map<CardSetting>(dto);

            if (await _context.CardSettings.AnyAsync())
                throw new Exception("Only One Card Setting Can be Set.");

            _context.CardSettings.Add(setting);
            await _context.SaveChangesAsync();

            return setting;
        }

        public async Task<CardSetting> UpdateCardSettingService(UpdateCardSettingDTO dto)
        {
            var setting = await _context.CardSettings.FindAsync(dto.Id);

            if (setting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            _mapper.Map<CardSetting>(dto);
            _context.CardSettings.Update(setting);

            await _context.SaveChangesAsync();

            return setting;
        }

        public async Task<CardSetting> DeleteCardSetting(int Id)
        {
            var setting = await _context.CardSettings.FindAsync(Id);

            if (setting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            _context.CardSettings.Remove(setting);

            await _context.SaveChangesAsync();

            return setting;
        }

    }
}
