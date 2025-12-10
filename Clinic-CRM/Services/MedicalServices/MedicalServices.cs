using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.MedicalServices
{
    public class MedicalServices : IMedicalService
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public MedicalServices(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MedicalService> GetMedicalServiceAsync(int Id)
        {
            var medicalService = await _context.MedicalServices.Include(x => x.MedicalProfessionals).FirstOrDefaultAsync(x => x.Id == Id);

            if (medicalService == null)
                throw new KeyNotFoundException("Medical Service Not Found");


            return medicalService;
        }

        public async Task<List<MedicalService>> GetAllMedicalervices()
        {
            return await _context.MedicalServices.Include(x => x.MedicalProfessionals).ToListAsync();
        }

        public async Task<MedicalService> AddMedicalService(AddMedicalServiceDTO dto)
        {
            var med = _mapper.Map<MedicalService>(dto);

            if (dto.MedicalProfessionalsId.Any())
            {
                med.MedicalProfessionals = await _context.MedicalProfessionals
                    .Where(mp => dto.MedicalProfessionalsId.Contains(mp.Id))
                    .ToListAsync();
            }
            _context.MedicalServices.Add(med);
            await _context.SaveChangesAsync();

            return med;
        }

        public async Task<MedicalService> UpdateMedicalService(UpdateMedicalServiceDTO dto)
        {
            var med = await _context.MedicalServices.FindAsync(dto.Id);

            if (med == null)
                throw new KeyNotFoundException("Medical Service Not Found.");

            _mapper.Map(dto, med);

            _context.MedicalServices.Update(med);
            await _context.SaveChangesAsync();

            return med;
        }

        public async Task<MedicalService> DeleteMedicalService(int Id)
        {
            var med = await _context.MedicalServices.FindAsync(Id);

            if (med == null)
                throw new KeyNotFoundException("Medical Service Not Found.");


            _context.MedicalServices.Remove(med);
            await _context.SaveChangesAsync();

            return med;
        }
    }
}
