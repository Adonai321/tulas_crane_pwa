using Microsoft.AspNetCore.Authentication.Cookies;
using MiWebAPI.Data;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// CONTROLADORES (con camelCase global para JS)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

// INYECCIÓN DE DEPENDENCIAS
builder.Services.AddScoped<AuthData>();
builder.Services.AddScoped<DashboardData>();
builder.Services.AddScoped<MaquinariaData>();
builder.Services.AddScoped<EmpleadoData>();
builder.Services.AddScoped<CalendarioData>();

// AUTENTICACIÓN POR COOKIES
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
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

// SWAGGER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. CORS SIEMPRE ANTES DE ARCHIVOS ESTÁTICOS
app.UseCors("NuevaPolitica");

// 2. ARCHIVOS ESTÁTICOS (Sirve directamente tu carpeta wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

// AUTENTICACIÓN Y AUTORIZACIÓN
app.UseAuthentication();
app.UseAuthorization();

// RUTAS API
app.MapControllers();

app.Run();