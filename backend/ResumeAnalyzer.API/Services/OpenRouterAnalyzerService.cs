using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ResumeAnalyzer.API.Models;

namespace ResumeAnalyzer.API.Services
{
    public class OpenRouterAnalyzerService : IResumeAnalyzerService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenRouterAnalyzerService> _logger;
        private const string OpenRouterEndpoint = "https://openrouter.ai/api/v1/chat/completions";

        // Fallback list of free models on OpenRouter
        private readonly string[] _freeModels = new[]
        {
            "openai/gpt-oss-120b:free",
            "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            "liquid/lfm-2.5-1.2b-instruct:free"
        };

        public OpenRouterAnalyzerService(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<OpenRouterAnalyzerService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AIResult> AnalyzeAsync(string atsSummary)
        {
            var apiKey = _configuration["OpenRouterSettings:ApiKey"];
            
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogError("OpenRouter API key is missing in configuration.");
                return new AIResult { AiAvailable = false, Warning = "OpenRouter API key not configured." };
            }

            var prompt = $@"
You are an expert ATS (Applicant Tracking System) and Resume Analyzer. 
You will be provided with a locally calculated ATS Summary, which includes matched skills, missing skills, and role relevance.

CRITICAL RULES:
1. You MUST NOT invent, assume, or hallucinate any technologies.
2. If the ATS Summary says a skill is missing, you must treat it as missing.
3. If the ATS engine does NOT detect a specific technology (e.g. .NET), you must never claim the candidate has strong experience in it. Every statement must be strictly grounded in the ATS Summary.
4. Your ONLY job is to generate qualitative insights based on this summary. DO NOT calculate any scores.

Return your entire response as a single valid JSON object that exactly matches this schema:
{{
  ""strengths"": [""strength 1"", ""strength 2""],
  ""missingKeywords"": [""keyword 1"", ""keyword 2""],
  ""recommendations"": [""rec 1"", ""rec 2""],
  ""improvementAreas"": [""area 1"", ""area 2""],
  ""interviewPreparation"": [""prep 1"", ""prep 2""],
  ""executiveSummary"": ""A brief executive summary of the candidate's profile against the target role..."",
  ""jobRole"": ""Infer the primary job role""
}}

Make sure the JSON is clean, with NO markdown code block wrappers (like ```json), just the raw JSON string.

ATS Summary:
{atsSummary}
";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.DefaultRequestHeaders.Add("HTTP-Referer", "http://localhost:5173"); // Required by OpenRouter sometimes
            client.DefaultRequestHeaders.Add("X-Title", "AI Resume Analyzer");

            foreach (var model in _freeModels)
            {
                try
                {
                    _logger.LogInformation("Attempting OpenRouter analysis with model: {Model}", model);
                    
                    var payload = new
                    {
                        model = model,
                        messages = new[]
                        {
                            new { role = "user", content = prompt }
                        }
                    };

                    var json = JsonSerializer.Serialize(payload);
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(OpenRouterEndpoint, httpContent);
                    if (!response.IsSuccessStatusCode)
                    {
                        var errorBody = await response.Content.ReadAsStringAsync();
                        _logger.LogWarning("Model {Model} failed with status {Status}: {ErrorBody}", model, response.StatusCode, errorBody);
                        continue; // Try next model
                    }

                    var responseString = await response.Content.ReadAsStringAsync();
                    
                    using var doc = JsonDocument.Parse(responseString);
                    var root = doc.RootElement;
                    var text = root.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
                    
                    // Robust parsing using Regex to find JSON block
                    var jsonMatch = System.Text.RegularExpressions.Regex.Match(text, @"\{[\s\S]*\}");
                    if (jsonMatch.Success)
                    {
                        text = jsonMatch.Value;
                    }
                    else
                    {
                        _logger.LogWarning("Regex could not find JSON brackets in model {Model} response. Raw: {Raw}", model, text);
                        continue; // Invalid JSON structure from this model, try next
                    }

                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var result = JsonSerializer.Deserialize<AIResult>(text, options);
                    
                    if (result == null)
                    {
                        _logger.LogWarning("Failed to deserialize JSON from model {Model}", model);
                        continue; // Try next model
                    }

                    _logger.LogInformation("Successfully analyzed resume using model: {Model}", model);
                    result.AiAvailable = true;
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error while processing with model {Model}", model);
                    // Continue to the next model in the fallback array
                }
            }

            _logger.LogError("All OpenRouter fallback models failed.");
            return new AIResult { AiAvailable = false, Warning = "AI analysis unavailable (all fallback models failed)." };
        }
    }
}
