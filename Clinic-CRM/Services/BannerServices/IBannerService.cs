using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.BannerServices
{
    public interface IBannerService
    {
        Task<Banner> AddBanner(string Image);
        Task<Banner> RemoveBanner(int Id);
        Task<List<Banner>> GetAllBanners();
        Task<Banner> GetBannerById(int Id); 
        Task<List<Banner>> GetAllActiveBanners();
        Task<Banner> UpdateBanner(int id, string image, bool isActive);
    }
}
