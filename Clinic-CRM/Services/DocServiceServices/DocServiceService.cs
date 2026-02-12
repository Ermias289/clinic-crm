using System.Runtime.CompilerServices;
using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.DocServiceDTOs;
using Clinic_CRM.DTOs.MedicalServiceDTOs;
using Clinic_CRM.Models;
using Clinic_CRM.Services.MedicalServices;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto;

namespace Clinic_CRM.Services.DocServiceServices
{
    public class DocServiceService : IDocServiceService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IMedicalService _medService;

        public DocServiceService(Context context, IMapper mapper, IMedicalService medService)
        {
            _context = context;
            _mapper = mapper;
            _medService = medService;
        }

        public async Task<DocService> GetDocServiceAsync(int Id)
        {
            var docSer  = await _context.DocServices
                .Include(x => x.MedicalProfessional)
                .Include(x => x.MedicalService)
                .Include(x => x.BranchSetting)
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync();

            if (docSer == null)
            {
                throw new Exception("DocService not found");
            }

            return docSer;  
        }
        public async Task<List<DocService>> GetAllDocServices()
        {
            return await _context.DocServices
                .Include(x => x.MedicalProfessional)
                .Include(x => x.MedicalService)
                .Include(x => x.BranchSetting)
                .ToListAsync();
        }

        public async Task<DocService> AddDocService(AddDocServiceDTO dto)
        {
            var docSer = _mapper.Map<DocService>(dto);

            var medicalService = await _context.MedicalServices.Include(x => x.MedicalProfessionals).Include(x => x.Branches).Where(x => x.Id == dto.MedicalServiceId).FirstOrDefaultAsync();

            if (medicalService == null)
            {
                throw new KeyNotFoundException("Medical Service not found");
            
            }

            var updatedMedicalService = new UpdateMedicalServiceDTO();

            var doc = _mapper.Map(medicalService, updatedMedicalService);

            doc.MedicalProfessionalsId ??= new List<int>();
            doc.Branches ??= new List<int>();

            if (!doc.MedicalProfessionalsId.Contains(dto.MedicalProfessionalId))
                doc.MedicalProfessionalsId.Add(dto.MedicalProfessionalId);

            if (!doc.Branches.Contains(dto.BranchSettingId))
                doc.Branches.Add(dto.BranchSettingId);

            await _medService.UpdateMedicalService(doc);


            _context.DocServices.Add(docSer);
            await _context.SaveChangesAsync();
            return docSer;
        }

        public async Task<DocService> UpdateDocService(UpdateDocServiceDTO dto)
        {
            var docSer = await _context.DocServices.FindAsync(dto.Id);

            if (docSer == null)
            {
                throw new Exception("DocService not found");
            }

            //var medicalService = await _context.MedicalServices.Include(x => x.MedicalProfessionals).Include(x => x.Branches).Where(x => x.Id == dto.MedicalServiceId).FirstOrDefaultAsync();


            //var updatedMedicalService = new UpdateMedicalServiceDTO();

            //var doc = _mapper.Map(medicalService, updatedMedicalService);

            //doc.MedicalProfessionalsId ??= new List<int>();
            //doc.Branches ??= new List<int>();

            //if (!doc.MedicalProfessionalsId.Contains(dto.MedicalProfessionalId))
            //    doc.MedicalProfessionalsId.Add(dto.MedicalProfessionalId);

            //if (!doc.Branches.Contains(dto.BranchSettingId))
            //    doc.Branches.Add(dto.BranchSettingId);

            //await _medService.UpdateMedicalService(doc);

            _mapper.Map(dto, docSer);
            _context.DocServices.Update(docSer);
            await _context.SaveChangesAsync();
            return docSer;
        }

        public async Task<DocService> DeleteDocService(int Id)
        {
            var docSer = await _context.DocServices.FindAsync(Id);

            if (docSer == null)
            {
                throw new Exception("DocService not found");
            }

            var medicalService = await _context.MedicalServices.Include(x => x.MedicalProfessionals).Include(x => x.Branches).Where(x => x.Id == docSer.MedicalServiceId).FirstOrDefaultAsync();

            if (medicalService == null)
            {
                throw new KeyNotFoundException("Medical Service not found");

            }

            var updatedMedicalService = new UpdateMedicalServiceDTO();

            var doc = _mapper.Map(medicalService, updatedMedicalService);

            doc.MedicalProfessionalsId ??= new List<int>();
            doc.Branches ??= new List<int>();

            if (doc.MedicalProfessionalsId.Contains(docSer.MedicalProfessionalId))
                doc.MedicalProfessionalsId.Remove(docSer.MedicalProfessionalId);

            if (doc.Branches.Contains(docSer.BranchSettingId))
                doc.Branches.Remove(docSer.BranchSettingId);

            await _medService.UpdateMedicalService(doc);

            _context.DocServices.Remove(docSer);
            await _context.SaveChangesAsync();
            return docSer;
        }

        public async Task<List<DocService>> GetDocServicesForAppointment(int? serviceId, int? branchId, int? docId)
        {
            var query = _context.DocServices
                .Include(x => x.MedicalProfessional)
                .Include(x => x.MedicalService)
                .Include(x => x.BranchSetting)
                .AsQueryable();

            if (serviceId.HasValue)
            {
                query = query.Where(x => x.MedicalServiceId == serviceId.Value);
            }
            if (branchId.HasValue)
            {
                query = query.Where(x => x.BranchSettingId == branchId.Value);
            }
            if (docId.HasValue)
            {
                query = query.Where(x => x.MedicalProfessionalId == docId.Value);
            }

            return await query.ToListAsync();
        }
    }

}
