using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ArchivosController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("SubirDocumentoMaquina")]
        public async Task<IActionResult> SubirDocumentoMaquina(
            [FromForm] long idMaquina,
            [FromForm] IFormFile? certificado,
            [FromForm] IFormFile? tarjetaCirculacion,
            [FromForm] IFormFile? tenencia,
            [FromForm] IFormFile? otros)
        {
            try
            {
                // Definir ruta física donde se guardarán los archivos en el servidor
                string carpetaUploads = Path.Combine(_env.ContentRootPath, "Uploads", "Maquinaria", idMaquina.ToString());

                if (!Directory.Exists(carpetaUploads))
                {
                    Directory.CreateDirectory(carpetaUploads);
                }

                // Función auxiliar para guardar archivos de forma segura
                async Task GuardarArchivoAsync(IFormFile? archivo, string nombrePrefijo)
                {
                    if (archivo != null && archivo.Length > 0)
                    {
                        string extension = Path.GetExtension(archivo.FileName);
                        string nombreArchivo = $"{nombrePrefijo}_{DateTime.Now:yyyyMMddHHmmss}{extension}";
                        string rutaCompleta = Path.Combine(carpetaUploads, nombreArchivo);

                        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                        {
                            await archivo.CopyToAsync(stream);
                        }
                        // Aquí puedes registrar la ruta en la base de datos si manejas tabla de archivos
                    }
                }

                await GuardarArchivoAsync(certificado, "certificado");
                await GuardarArchivoAsync(tarjetaCirculacion, "tarjeta_circulacion");
                await GuardarArchivoAsync(tenencia, "tenencia");
                await GuardarArchivoAsync(otros, "otro");

                return Ok(new { success = true, message = "Archivos subidos y vinculados correctamente." });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { success = false, message = ex.Message });
            }
        }
    }
}