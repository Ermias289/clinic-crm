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

        public async Task<List<CardSetting>> GetAllCardSettings()
        {
            var setting = await _context.CardSettings
                .Include(x => x.CardType)
                .ToListAsync();

            if (setting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            return setting;
        }
        
        public async Task<CardSetting> GetCardSettingById(int Id)
        {
            var cardSetting = await _context.CardSettings
                .Include(x => x.CardType)
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync();

            if (cardSetting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            return cardSetting;
        }


        public async Task<CardSetting> AddCardSetting(AddCardSettingDTO dto)
        {
            var setting = _mapper.Map<CardSetting>(dto);
            var existing = await _context.CardSettings.Where(x => x.CardTypeId == dto.CardTypeId).FirstOrDefaultAsync();

            if (existing != null)
                throw new Exception("Only One Card Setting Can be Set For This Card Type.");

            setting.CreatedAt = DateTime.UtcNow;
            _context.CardSettings.Add(setting);
            await _context.SaveChangesAsync();

            return setting;
        }

        public async Task<CardSetting> UpdateCardSettingService(UpdateCardSettingDTO dto)
        {
            var setting = await _context.CardSettings.FirstOrDefaultAsync();
            var existing = await _context.CardSettings.Where(x => x.CardTypeId == dto.CardTypeId).FirstOrDefaultAsync();

           
            if (setting == null)
                throw new KeyNotFoundException("Card Setting Not Found");

            if (existing == null)
                throw new Exception("Only One Card Setting Can be Set For This Card Type.");

            setting.UpdatedAt = DateTime.UtcNow;
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
