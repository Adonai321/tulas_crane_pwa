using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.Cookies;
using MiWebAPI.Data;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// CONTROLADORES (con camelCase global para JS)[cite: 17]
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// INYECCIÓN DE DEPENDENCIAS[cite: 7, 13]
builder.Services.AddScoped<AuthData>();
builder.Services.AddScoped<DashboardData>();
builder.Services.AddScoped<MaquinariaData>();
builder.Services.AddScoped<EmpleadoData>();
builder.Services.AddScoped<CalendarioData>();

// AUTENTICACIÓN POR COOKIES[cite: 13]
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme
)
.AddCookie(options =>
{
    options.LoginPath = "/Acceso/Login";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    options.AccessDeniedPath = "/Acceso/Login";
});

// AUTORIZACIÓN[cite: 13]
builder.Services.AddAuthorization();

// CORS[cite: 13]
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

// SWAGGER[cite: 13]
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. CORS DEBE IR ANTES de UseStaticFiles[cite: 12]
app.UseCors("NuevaPolitica");

// 2. ARCHIVOS ESTÁTICOS (Apuntando a la carpeta Frontend en la raíz)[cite: 13]
var rutaFrontend = Path.Combine(builder.Environment.ContentRootPath, "Frontend");

if (Directory.Exists(rutaFrontend))
{
    var fileProvider = new PhysicalFileProvider(rutaFrontend);

    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = fileProvider
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = fileProvider
    });
}

// AUTENTICACIÓN Y AUTORIZACIÓN[cite: 13]
app.UseAuthentication();
app.UseAuthorization();

// RUTAS API[cite: 13]
app.MapControllers();

app.Run();