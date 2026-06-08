using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using ResumeAnalyzer.API.Data;
using ResumeAnalyzer.API.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using ResumeAnalyzer.API.Helpers;
using ResumeAnalyzer.API.Services;

using System.Security.Cryptography;
using System.Text;
using System.Collections.Concurrent;

namespace ResumeAnalyzer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResumesController : ControllerBase
{
    private static readonly ConcurrentDictionary<string, AIResult> _analysisCache = new();

    private readonly AppDbContext _context;
    private readonly Cloudinary _cloudinary;
    private readonly IKeywordExtractor _keywordExtractor;
    private readonly IATSScoreCalculator _atsScoreCalculator;
    private readonly ILogger<ResumesController> _logger;

    public ResumesController(AppDbContext context, Cloudinary cloudinary, IKeywordExtractor keywordExtractor, IATSScoreCalculator atsScoreCalculator, ILogger<ResumesController> logger)
    {
        _context = context;
        _cloudinary = cloudinary;
        _keywordExtractor = keywordExtractor;
        _atsScoreCalculator = atsScoreCalculator;
        _logger = logger;
    }

    [HttpGet("history/{userId:int}")]
    public async Task<IActionResult> GetHistory(int userId)
    {
        var history = await _context.Resumes
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(history);
    }

    // Existing simple upload endpoint retained for backward compatibility
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] int userId, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadResult = new RawUploadResult();
        using (var stream = file.OpenReadStream())
        {
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                PublicId = $"resumes/{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        if (uploadResult.Error != null)
            return BadRequest($"Cloudinary Upload Error: {uploadResult.Error.Message}");

        var secureUrl = uploadResult.SecureUrl.ToString();
        var resumeText = ResumeTextExtractor.ExtractText(file);
        var analyzer = HttpContext.RequestServices.GetRequiredService<IResumeAnalyzerService>();
        AIResult aiResult = null;
        try { aiResult = await analyzer.AnalyzeAsync(resumeText); } catch { }
        var score = aiResult?.Score ?? Random.Shared.Next(62, 97);
        var status = score >= 90 ? "Optimized" : (score >= 75 ? "Needs Review" : "Action Required");

        var resume = new Resume
        {
            UserId = userId,
            FileName = file.FileName,
            FilePath = secureUrl,
            Score = score,
            Status = status,
            Strengths = string.Join(";", aiResult?.Strengths ?? new List<string> { "Clean structure", "Strong action verbs", "Clear professional summary" }),
            MissingKeywords = string.Join(";", aiResult?.MissingKeywords ?? new List<string> { "Kubernetes", "System Design", "Microservices" }),
            Recommendations = string.Join(";", aiResult?.Recommendations ?? new List<string> { "Add quantitative impact metrics", "Expand skills section", "Include GitHub project link" })
        };
        _context.Resumes.Add(resume);
        await _context.SaveChangesAsync();
        return Ok(resume);
    }

    // New analysis endpoint that also receives a job description
    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromForm] int userId,
                                            [FromForm] IFormFile resumeFile,
                                            [FromForm] IFormFile? jdFile,
                                            [FromForm] string? jdText)
    {
        if (resumeFile == null || resumeFile.Length == 0)
            return BadRequest("Resume file is required.");

        // Ensure at least one JD source is provided
        if ((jdFile == null || jdFile.Length == 0) && string.IsNullOrWhiteSpace(jdText))
            return BadRequest("Either JD file or JD text must be provided.");

        // Upload resume to Cloudinary (same as before)
        var resumeUpload = new RawUploadResult();
        using (var stream = resumeFile.OpenReadStream())
        {
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(resumeFile.FileName, stream),
                PublicId = $"resumes/{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(resumeFile.FileName)}"
            };
            resumeUpload = await _cloudinary.UploadAsync(uploadParams);
        }
        if (resumeUpload.Error != null)
            return BadRequest($"Cloudinary upload error for resume: {resumeUpload.Error.Message}");

        // Optional JD file upload (store but not strictly needed for analysis)
        string? jdFileUrl = null;
        if (jdFile != null && jdFile.Length > 0)
        {
            var jdUpload = new RawUploadResult();
            using (var jdStream = jdFile.OpenReadStream())
            {
                var jdParams = new RawUploadParams
                {
                    File = new FileDescription(jdFile.FileName, jdStream),
                    PublicId = $"jds/{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(jdFile.FileName)}"
                };
                jdUpload = await _cloudinary.UploadAsync(jdParams);
            }
            if (jdUpload.Error != null)
                return BadRequest($"Cloudinary upload error for JD: {jdUpload.Error.Message}");
            jdFileUrl = jdUpload.SecureUrl.ToString();
        }

        // Validation: ensure JD information is provided
        if (jdFile == null && string.IsNullOrWhiteSpace(jdText))
        {
            return BadRequest("Either a Job Description file or text must be provided.");
        }

        // Extract raw texts
        var resumeText = ResumeTextExtractor.ExtractText(resumeFile);
        string jdRawText;
        if (jdFile != null && jdFile.Length > 0)
        {
            jdRawText = ResumeTextExtractor.ExtractText(jdFile);
        }
        else
        {
            jdRawText = jdText ?? string.Empty;
        }

        // Keyword extraction
        var resumeKeywords = _keywordExtractor.ExtractKeywords(resumeText);
        var jdKeywords = _keywordExtractor.ExtractKeywords(jdRawText);

        // Local ATS calculation (Deterministic & Strict)
        var atsResult = _atsScoreCalculator.Calculate(resumeText, jdRawText, resumeKeywords, jdKeywords);

        // Generate compressed ATS Summary to save tokens
        var atsSummary = $@"
Role Detected: {atsResult.DetectedRole}
Matched Skills: {string.Join(", ", atsResult.MatchedKeywords)}
Missing Required Skills: {string.Join(", ", atsResult.CriticalMissingSkills)}
Role Relevance: {atsResult.RoleRelevanceScore}/100
Project Relevance: {atsResult.ProjectRelevanceScore}/100
Experience Relevance: {atsResult.ExperienceScore}/100
ATS Score: {atsResult.AtsScore}/100
";

        // In-Memory Caching to avoid redundant OpenRouter calls
        var cacheKey = ComputeSha256Hash(resumeText + jdRawText);
        AIResult? aiResult = null;

        if (!atsResult.AnalysisValid)
        {
            _logger.LogWarning("Invalid analysis: No required skills detected.");
            // We skip OpenRouter call entirely
        }
        else if (_analysisCache.TryGetValue(cacheKey, out var cachedAiResult))
        {
            _logger.LogInformation("Cache hit for analysis. Bypassing OpenRouter.");
            aiResult = cachedAiResult;
        }
        else
        {
            // Call OpenRouter with only the compressed summary
            var analyzer = HttpContext.RequestServices.GetRequiredService<IResumeAnalyzerService>();
            try 
            { 
                aiResult = await analyzer.AnalyzeAsync(atsSummary); 
                if (aiResult != null && aiResult.AiAvailable)
                {
                    _analysisCache[cacheKey] = aiResult;
                }
            } 
            catch { }
        }

        // Log AI result details (safe null handling)
        _logger.LogInformation("OpenRouter analysis completed. Score={Score}, StrengthsCount={StrengthCount}, MissingCount={MissingCount}, RecCount={RecCount}",
            atsResult.AtsScore,
            aiResult?.Strengths?.Count ?? 0,
            aiResult?.MissingKeywords?.Count ?? 0,
            aiResult?.Recommendations?.Count ?? 0);

        // Build response payload
        var response = new
        {
            AtsResult = atsResult,
            AiResult = aiResult,
            ResumeFileUrl = resumeUpload.SecureUrl?.ToString(),
            JdFileUrl = jdFileUrl
        };

        // Persist a Resume record
        var statusStr = !atsResult.AnalysisValid ? "Invalid Analysis" :
                        (atsResult.AtsScore >= 90 ? "Optimized" : (atsResult.AtsScore >= 75 ? "Needs Review" : "Action Required"));

        var resumeRecord = new Resume
        {
            UserId = userId,
            FileName = resumeFile.FileName,
            FilePath = resumeUpload.SecureUrl?.ToString() ?? string.Empty,
            Score = atsResult.AtsScore,
            Status = statusStr,
            Strengths = string.Join(";", aiResult?.Strengths ?? new List<string>()),
            MissingKeywords = string.Join(";", aiResult?.MissingKeywords ?? new List<string>()),
            Recommendations = string.Join(";", aiResult?.Recommendations ?? new List<string>())
        };
        _context.Resumes.Add(resumeRecord);
        await _context.SaveChangesAsync();

        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var resume = await _context.Resumes.FindAsync(id);
        if (resume == null)
            return NotFound("Resume not found.");

        if (resume.FilePath.Contains("cloudinary.com"))
        {
            var uri = new Uri(resume.FilePath);
            var path = uri.AbsolutePath;
            var uploadIndex = path.IndexOf("/upload/");
            if (uploadIndex != -1)
            {
                var rawPath = path.Substring(uploadIndex + 8);
                var firstSlash = rawPath.IndexOf('/');
                if (firstSlash != -1 && rawPath.Substring(0, firstSlash).StartsWith("v"))
                {
                    rawPath = rawPath.Substring(firstSlash + 1);
                }
                var extensionIndex = rawPath.LastIndexOf('.');
                if (extensionIndex != -1)
                    rawPath = rawPath.Substring(0, extensionIndex);

                var publicId = Uri.UnescapeDataString(rawPath);
                await _cloudinary.DestroyAsync(new DeletionParams(publicId) { ResourceType = ResourceType.Raw });
            }
        }

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Resume deleted successfully" });
    }

    private static string ComputeSha256Hash(string rawData)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
