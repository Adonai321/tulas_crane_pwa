using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.Cookies;
using MiWebAPI.Data;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// CONTROLADORES
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// INYECCIÓN DE DEPENDENCIAS
builder.Services.AddScoped<AuthData>();
builder.Services.AddScoped<DashboardData>();
builder.Services.AddScoped<MaquinariaData>();
builder.Services.AddScoped<ExpedienteMaquinaData>();
builder.Services.AddScoped<EmpleadoData>();

// AUTENTICACIÓN POR COOKIES
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme
)
.AddCookie(options =>
{
    options.LoginPath = "/Acceso/Login";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    options.AccessDeniedPath = "/Acceso/Login";
});

// AUTORIZACIÓN
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("NuevaPolitica", app =>
    {
        app.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod();
    });
});

var app = builder.Build();

var rutaUploads = Path.Combine(builder.Environment.ContentRootPath, "Uploads");
if (!Directory.Exists(rutaUploads))
    Directory.CreateDirectory(rutaUploads);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rutaUploads),
    RequestPath = "/ArchivosUsuario" // Esta será la ruta pública en la web
});

// SWAGGER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. CORS DEBE IR ANTES de UseStaticFiles
app.UseCors("NuevaPolitica");

// 2. ARCHIVOS ESTÁTICOS
app.UseDefaultFiles();
app.UseStaticFiles();

// AUTENTICACIÓN Y AUTORIZACIÓN
app.UseAuthentication();
app.UseAuthorization();

// RUTAS API
app.MapControllers();

app.Run();
