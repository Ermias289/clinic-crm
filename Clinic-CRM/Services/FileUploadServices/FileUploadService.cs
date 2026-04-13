using Microsoft.AspNetCore.Mvc;
using MimeTypes;

namespace Clinic_CRM.Services.FileUploadServices
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _env;

        private string _path;

        public FileUploadService(Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
        {
            _path = Path.Combine(env.ContentRootPath, "UploadedFiles");
        }

        public async Task<string> SaveFile(IFormFile file)
        {
            string name = $"file{DateTime.Now.ToString("_ffffff_yyyy_MM_dd_HH_mm_ss")}{Path.GetExtension(file.FileName)}";
            string savePath = Path.Combine(_path, name);

            using (var fileStream = new FileStream(savePath, FileMode.Create, FileAccess.Write))
                file.CopyTo(fileStream);

            return name;
        }

        public async Task<FileContentResult> GetFile(string fileName, ControllerBase controller)
        {
            string filePath = Path.Combine(_path, fileName);
            var file = File.ReadAllBytes(filePath);

            return controller.File(file, MimeTypeMap.GetMimeType(Path.GetExtension(fileName)));
        }

        public async Task<FileContentResult> DownloadFile(string fileName, ControllerBase controller)
        {
            string filePath = Path.Combine(_path, fileName);
            var file = File.ReadAllBytes(filePath);

            return controller.File(file, MimeTypeMap.GetMimeType(Path.GetExtension(fileName)), fileName);
        }

        public async Task<List<string>> SaveFiles(List<IFormFile> files)
        {
            List<string> fileNames = new();

            foreach (var file in files)
            {
                fileNames.Add(await SaveFile(file));
            }

            return fileNames;
        }

    }
}
