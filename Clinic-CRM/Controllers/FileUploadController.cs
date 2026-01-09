using Clinic_CRM.Models;
using Clinic_CRM.Services.FileUploadServices;
using Clinic_CRM.Services.UserRoleServices;
using Clinic_CRM.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Clinic_CRM.Services.FileUploadServices;

namespace Clinic_CRM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileUploadService _fileService;
        private readonly IUserRoleService _userRole;
        private readonly IUserService _userService;

        public FileUploadController(IFileUploadService fileService, IUserRoleService userRole, IUserService userService)
        {
            _fileService = fileService;
            _userRole = userRole;
            _userService = userService;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> Get(string fileName)
        {
           
            var file = await _fileService.GetFile(fileName, this);
            return file;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<string>> Upload(IFormFile file)
        {
           
            var name = await _fileService.SaveFile(file);
            return Ok(new { FileName = name });
        }

        [HttpPost("upload/multiple")]
        public async Task<ActionResult> UploadFiles([FromForm] List<IFormFile> files)
        {
            return Ok(await _fileService.SaveFiles(files));
        }

        [HttpGet("download/{fileName}")]
        public async Task<IActionResult> Download(string fileName)
        {
            
            var file = await _fileService.DownloadFile(fileName, this);

            return file;
        }
    }
}
