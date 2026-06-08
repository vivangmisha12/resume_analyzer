using System.Collections.Generic;

namespace ResumeAnalyzer.API.Models
{
    public class ResumeQualityCheck
    {
        public bool ContactInfo { get; set; }
        public bool Skills { get; set; }
        public bool Projects { get; set; }
        public bool Experience { get; set; }
        public bool Education { get; set; }
    }

    public class AIResult
    {
        public bool AiAvailable { get; set; } = true;
        public string Warning { get; set; } = string.Empty;

        public int Score { get; set; }
        
        public int KeywordMatchScore { get; set; }
        public int ResumeStructureScore { get; set; }
        public int SkillsMatchScore { get; set; }
        public int ExperienceRelevanceScore { get; set; }
        public int EducationScore { get; set; }
        
        public List<string> Strengths { get; set; } = new();
        public List<string> MissingKeywords { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public List<string> ImprovementAreas { get; set; } = new();
        public List<string> InterviewPreparation { get; set; } = new();
        
        public string ExecutiveSummary { get; set; }
        public string JobRole { get; set; }
        
        public ResumeQualityCheck QualityCheck { get; set; } = new();
        
        public List<string> RequiredSkills { get; set; } = new();
        public List<string> PreferredSkills { get; set; } = new();
    }
}
