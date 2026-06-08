using System.ComponentModel.DataAnnotations;

namespace ResumeAnalyzer.API.Models;

public class Resume
{
    public int Id { get; set; }
    public int UserId { get; set; }
    
    [Required]
    public string FileName { get; set; } = string.Empty;
    
    public string FilePath { get; set; } = string.Empty;
    public int Score { get; set; }
    
    [Required]
    public string Status { get; set; } = "Needs Review"; // e.g., Optimized, Needs Review, Action Required
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Analysis reports saved as semicolon separated strings
    public string Strengths { get; set; } = string.Empty;
    public string MissingKeywords { get; set; } = string.Empty;
    public string Recommendations { get; set; } = string.Empty;
}
