
using Microsoft.AspNetCore.Authentication.Cookies;
using MiWebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// CONTROLADORES
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// INYECCIÓN DE DEPENDENCIAS
builder.Services.AddScoped<AuthData>();
builder.Services.AddScoped<DashboardData>();

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

// SWAGGER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ARCHIVOS ESTÁTICOS
app.UseDefaultFiles();
app.UseStaticFiles();

// CORS
app.UseCors("NuevaPolitica");

// AUTENTICACIÓN Y AUTORIZACIÓN
app.UseAuthentication();
app.UseAuthorization();

// RUTAS API
app.MapControllers();

app.Run();
