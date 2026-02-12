using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs;
using Clinic_CRM.DTOs.CardTypeDTOs;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.CardTypeServices
{
    public class CardTypeService : ICardTypeService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public CardTypeService(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<CardType> AddCardType(AddCardTypeDTO dto)
        {
            var type = _mapper.Map<CardType>(dto);

            var existingTypes = await _context.CardTypes.ToListAsync();

            foreach(var t in  existingTypes)
            {
                if(t.Name.ToLower() == type.Name.ToLower())
                {
                    throw new KeyNotFoundException("Type Already Exists.");
                }
            }

            _context.CardTypes.Add(type);
            await _context.SaveChangesAsync();

            return type;
        }

        public async Task<CardType> UpdateCardType(UpdateCardTypeDTO dto)
        {
            var type = await _context.CardTypes.FindAsync(dto.Id);

            if (type == null)
                throw new KeyNotFoundException("Card Type Not Found.");

            //var existingTypes = await _context.CardTypes.ToListAsync();

            //foreach (var t in existingTypes)
            //{
            //    if (t.Name == dto.Name)
            //    {
            //        throw new KeyNotFoundException("Type Already Exists.");
            //    }
            //}

            _mapper.Map(dto, type);
            _context.CardTypes.Update(type);
            await _context.SaveChangesAsync();
            return type;
        }

        public async Task<List<CardType>> GetAllCardTypes()
        {
            return await _context.CardTypes.ToListAsync();
        }

        public async Task<CardType> GetCardTypeById(int Id)
        {
            var type = await _context.CardTypes.FindAsync(Id);

            if (type == null)
                throw new KeyNotFoundException("Card Type Not Found.");

            return type;
        }

        public async Task<CardType> DeleteCardType(int Id)
        {
            var type = await _context.CardTypes.FindAsync(Id);

            if (type == null)
                throw new KeyNotFoundException("Card Type Not Found.");

            _context.CardTypes.Remove(type);
            await _context.SaveChangesAsync();

            return type;
        }
    }
}
