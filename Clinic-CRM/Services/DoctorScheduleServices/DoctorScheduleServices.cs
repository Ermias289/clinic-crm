using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.DoctorScheduleServices
{
    public class DoctorScheduleServices : IDoctorScheduleServices
    {
        private readonly IMapper _mapper;
        private readonly Context _context;

        public DoctorScheduleServices(IMapper mapper, Context context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<DoctorSchedule> AddDoctorSchedule(AddDoctorScheduleDTO dto)
        {
            var doc = _mapper.Map<DoctorSchedule>(dto);

            _context.DoctorSchedules.Add(doc);
            await _context.SaveChangesAsync();
            return doc;
        }


        public async Task<DoctorSchedule> UpdateDoctorSchedule(UpdateDoctorScheduleDTO dto)
        {
            var doc = await _context.DoctorSchedules.FindAsync(dto.Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");

            _mapper.Map(dto, doc);
            _context.DoctorSchedules.Update(doc);
            await _context.SaveChangesAsync();
            return doc;
        }



        public async Task<DoctorSchedule> GetDoctorScheduleById(int Id)
        {
            var doc = await _context.DoctorSchedules.FindAsync(Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");

            return doc;
        }
        public async Task<List<DoctorSchedule>> GetAllDoctorSchedules()
        {
            return await _context.DoctorSchedules.ToListAsync();
        }
        public async Task<DoctorSchedule> DeleteDoctorSchedule(int Id)
        {
            var doc = await _context.DoctorSchedules.FindAsync(Id);

            if (doc == null)
                throw new KeyNotFoundException("Doctor Schedule Not Found.");

            _context.DoctorSchedules.Remove(doc);
            await _context.SaveChangesAsync();
            return doc;
        }
    }
}
