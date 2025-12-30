using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.BannerServices
{
    public class BannerService : IBannerService
    {
        private readonly Context _context;

        public BannerService(Context context)
        {
            _context = context;
        }

        public async Task<Banner> AddBanner(string image)
        {
            var banner = new Banner
            {
                Image = image,
                IsActive = true
            };

            await _context.Banners.AddAsync(banner);
            await _context.SaveChangesAsync();

            return banner;
        }
        public async Task<Banner> RemoveBanner(int Id)
        {
            var banner = await _context.Banners
                .FirstOrDefaultAsync(b => b.Id == Id);

            if (banner == null)
                throw new KeyNotFoundException("Banner not found");

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return banner;
        }

        public async Task<Banner> GetBannerById(int id)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null)
                throw new KeyNotFoundException("Banner not found");

            return banner;
        }

        public async Task<List<Banner>> GetAllBanners()
        {
            return await _context.Banners.ToListAsync();
        }

        public async Task<List<Banner>> GetAllActiveBanners()
        {
            return await _context.Banners
                .Where(b => b.IsActive)
                .ToListAsync();
        }

    }
}
