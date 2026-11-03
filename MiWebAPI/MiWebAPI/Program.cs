using MiWebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar CORS (Una sola vez)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Puerto de tu React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Agregar controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Inyección de dependencias
builder.Services.AddSingleton<EmpleadoData>();
builder.Services.AddScoped<AuthData>(); // Lo dejamos como Scoped (evitamos el duplicado Singleton)

var app = builder.Build();

// 2. Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Servir frontend si usas la carpeta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// 3. Aplicar CORS (Debe ir exactamente aquí, antes de la autorización)
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

// 4. Ejecutar la aplicación (Una sola vez al final)
app.Run();