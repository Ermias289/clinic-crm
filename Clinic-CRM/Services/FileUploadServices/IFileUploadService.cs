using Microsoft.AspNetCore.Mvc;

namespace Clinic_CRM.Services.FileUploadServices
{
    public interface IFileUploadService
    {
        Task<FileContentResult> DownloadFile(string fileName, ControllerBase controller);
        Task<FileContentResult> GetFile(string fileName, ControllerBase controller);
        Task<string> SaveFile(IFormFile file);
        Task<List<string>> SaveFiles(List<IFormFile> files);
    }
}
