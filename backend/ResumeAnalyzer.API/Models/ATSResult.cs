namespace ResumeAnalyzer.API.Models
{
    public class ATSResult
    {
        public int AtsScore { get; set; }
        public List<string> MatchedKeywords { get; set; } = new();
        public List<string> MissingKeywords { get; set; } = new();
        public int TotalJdKeywords { get; set; }
        public int KeywordScore { get; set; }
        public int SkillsScore { get; set; }
        public int ExperienceScore { get; set; }
        public int EducationScore { get; set; }
        public int ProjectsScore { get; set; }
        public int CertificationsScore { get; set; }
        public int FormattingScore { get; set; }
        public int RoleRelevanceScore { get; set; }
        public int ProjectRelevanceScore { get; set; }
        public string DetectedRole { get; set; } = string.Empty;
        public int RoleConfidence { get; set; }
        public string RoleSource { get; set; } = string.Empty;
        public List<string> CriticalMissingSkills { get; set; } = new();
        public List<PartialMatchResult> PartialMatches { get; set; } = new();
        public bool AnalysisValid { get; set; } = true;
        public Dictionary<string, int> RoleSpecificScores { get; set; } = new();

        public ResumeQualityCheck QualityCheck { get; set; } = new();

        public List<string> RequiredSkills { get; set; } = new();
        public List<string> PreferredSkills { get; set; } = new();
    }


    public class PartialMatchResult
    {
        public string CandidateSkill { get; set; } = string.Empty;
        public string RequiredSkill { get; set; } = string.Empty;
        public int PartialScore { get; set; }
    }
}
