using Microsoft.EntityFrameworkCore;
using ResumeAnalyzer.API.Data;
using CloudinaryDotNet;
using ResumeAnalyzer.API.Services;
var builder = WebApplication.CreateBuilder(args);

// 1. Configure EF Core MySql (Pomelo)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 1.5. Configure Cloudinary Service (Yaha add karna hai)
var cloudinarySection = builder.Configuration.GetSection("CloudinarySettings");
var account = new Account(
    cloudinarySection["CloudName"],
    cloudinarySection["ApiKey"],
    cloudinarySection["ApiSecret"]
);
var cloudinary = new Cloudinary(account);
builder.Services.AddSingleton(cloudinary);

// 2. Add API Controllers
builder.Services.AddControllers();

// 3. Add CORS to allow frontend integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. OpenAPI Setup
builder.Services.AddOpenApi();

builder.Services.AddScoped<IResumeAnalyzerService, OpenRouterAnalyzerService>();
builder.Services.AddSingleton<IKeywordExtractor, KeywordExtractor>();
builder.Services.AddScoped<IATSScoreCalculator, ATSScoreCalculator>();
builder.Services.AddHttpClient();
var app = builder.Build();

// Configure HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
// Duplicate registration removed
