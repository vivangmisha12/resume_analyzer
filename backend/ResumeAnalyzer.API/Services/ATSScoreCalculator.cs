using System.Collections.Generic;
using ResumeAnalyzer.API.Models;

namespace ResumeAnalyzer.API.Services
{
    public interface IATSScoreCalculator
    {
        ATSResult Calculate(string resumeText, string jdText, HashSet<string> resumeKeywords, HashSet<string> jdKeywords);
    }

    public class ATSScoreCalculator : IATSScoreCalculator
    {
        private readonly Microsoft.Extensions.Logging.ILogger<ATSScoreCalculator> _logger;

        public ATSScoreCalculator(Microsoft.Extensions.Logging.ILogger<ATSScoreCalculator> logger)
        {
            _logger = logger;
        }

        // Master Universal Skill Dictionary (JD-Driven)
        private static readonly HashSet<string> _masterSkills = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase)
        {
            // Frontend
            "React", "Angular", "Vue", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Next.js", "SASS", "Bootstrap",
            // Backend
            "Node.js", "Java", "Spring Boot", "Spring MVC", "C#", "ASP.NET", "ASP.NET Core", "Python", "Django", "Flask", "Ruby", "Go", "PHP",
            // Mobile
            "Android", "Kotlin", "Swift", "iOS", "Flutter", "React Native", "Firebase", "Retrofit", "Android SDK", "Jetpack",
            // Databases
            "SQL", "MySQL", "PostgreSQL", "SQL Server", "MongoDB", "NoSQL", "Redis", "Cassandra", "Oracle",
            // Cloud & DevOps
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Linux", "Terraform", "Git", "GitHub", "GitLab",
            // Data & AI
            "Data Analysis", "Excel", "Tableau", "PowerBI", "Pandas", "Statistics", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "LLM", "AI",
            // Other
            "REST API", "GraphQL", "Microservices", "MVC", "Entity Framework", "LINQ", "Express"
        };

        // Alias Dictionary
        private static readonly Dictionary<string, string> _aliasMap = new Dictionary<string, string>(System.StringComparer.OrdinalIgnoreCase)
        {
            // JavaScript
            { "js", "JavaScript" }, { "java script", "JavaScript" },
            // Node.js
            { "nodejs", "Node.js" }, { "node js", "Node.js" }, { "node", "Node.js" },
            // React
            { "reactjs", "React" }, { "react.js", "React" },
            // Angular
            { "angularjs", "Angular" }, { "angular.js", "Angular" },
            // SQL Server
            { "mssql", "SQL Server" }, { "ms sql", "SQL Server" }, { "ms sql server", "SQL Server" },
            // REST API
            { "rest apis", "REST API" }, { "restful api", "REST API" }, { "restful apis", "REST API" }, { "rest services", "REST API" }, { "rest service", "REST API" }, { "rest api design", "REST API" },
            // ASP.NET Core
            { "asp net core", "ASP.NET Core" }, { ".net core", "ASP.NET Core" }, { "dotnet core", "ASP.NET Core" }, { "asp.net core web api", "ASP.NET Core" },
            // ASP.NET
            { ".net framework", "ASP.NET" }, { "dotnet framework", "ASP.NET" }, { ".net", "ASP.NET" }, { "dotnet", "ASP.NET" },
            // C#
            { "c sharp", "C#" },
            // Android
            { "android development", "Android" },
            // Vue
            { "vue.js", "Vue" }, { "vuejs", "Vue" }
        };

        // Partial Match Dictionary: Key = JD Required Skill, Value = Dictionary<Partial Skill, Score Percentage>
        private static readonly Dictionary<string, Dictionary<string, int>> _weightedPartialMatchMap = new Dictionary<string, Dictionary<string, int>>(System.StringComparer.OrdinalIgnoreCase)
        {
            { "SQL Server", new Dictionary<string, int>(System.StringComparer.OrdinalIgnoreCase) {
                { "SQL", 60 }, { "MySQL", 40 }, { "PostgreSQL", 40 }, { "Oracle", 40 }
            }},
            { "ASP.NET Core", new Dictionary<string, int>(System.StringComparer.OrdinalIgnoreCase) {
                { "ASP.NET", 70 }
            }},
            { "React", new Dictionary<string, int>(System.StringComparer.OrdinalIgnoreCase) {
                { "React Native", 70 }, { "Next.js", 60 }
            }},
            { "Node.js", new Dictionary<string, int>(System.StringComparer.OrdinalIgnoreCase) {
                { "Express", 60 }
            }}
        };

        private string NormalizeText(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";
            var normalized = text.ToLowerInvariant();
            
            normalized = normalized.Replace(",", " ").Replace(";", " ").Replace("(", " ").Replace(")", " ").Replace("[", " ").Replace("]", " ");
            // Remove duplicate spaces
            normalized = System.Text.RegularExpressions.Regex.Replace(normalized, @"\s+", " ").Trim();
            
            foreach (var alias in _aliasMap)
            {
                // Use lookarounds for safer word boundaries (handles c# and .net)
                normalized = System.Text.RegularExpressions.Regex.Replace(normalized, $@"(?<![a-zA-Z0-9]){System.Text.RegularExpressions.Regex.Escape(alias.Key)}(?![a-zA-Z0-9])", alias.Value.ToLowerInvariant());
            }

            return normalized;
        }

        private int ExtractYearsOfExperience(string text)
        {
            // Tries to find patterns like "5+ years", "3-5 years", "minimum 4 years"
            var match = System.Text.RegularExpressions.Regex.Match(text, @"\b(\d+)\+?\s*(?:to|-)?\s*(\d+)?\s*years?\b", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (match.Success)
            {
                if (int.TryParse(match.Groups[1].Value, out int minYears))
                {
                    return minYears;
                }
            }
            return 0; // 0 means not explicitly found or Entry Level
        }

        private string ExtractProjectsSection(string resumeText)
        {
            var rLower = resumeText.ToLowerInvariant();
            var projectIndexes = new[] { rLower.IndexOf("projects"), rLower.IndexOf("personal work"), rLower.IndexOf("academic projects") };
            int startIdx = projectIndexes.Where(i => i >= 0).DefaultIfEmpty(-1).Min();
            
            if (startIdx == -1) return "";

            // Attempt to cut off at the next major section (Education, Experience, etc.)
            int endIdx = rLower.Length;
            var nextSections = new[] { rLower.IndexOf("education", startIdx + 10), rLower.IndexOf("experience", startIdx + 10), rLower.IndexOf("certifications", startIdx + 10) };
            int possibleEnd = nextSections.Where(i => i >= 0).DefaultIfEmpty(-1).Min();
            
            if (possibleEnd > startIdx) endIdx = possibleEnd;

            return resumeText.Substring(startIdx, endIdx - startIdx);
        }

        public ATSResult Calculate(string resumeText, string jdText, HashSet<string> resumeKeywords, HashSet<string> jdKeywords)
        {
            var rLower = NormalizeText(resumeText);
            var jdLower = NormalizeText(jdText);

            _logger.LogInformation("Starting JD-Driven ATS Calculation");

            // 1. Explicit Role Priority
            string explicitRole = "";
            var roleMatch = System.Text.RegularExpressions.Regex.Match(jdText, @"(?:Job Title|Position|Role|Opening For|Hiring For)\s*[:\-\n]+\s*([A-Za-z0-9\.\-\s]{3,50})(?:\r|\n|$)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (roleMatch.Success)
            {
                explicitRole = roleMatch.Groups[1].Value.Trim();
                if (explicitRole.Contains("  ")) explicitRole = System.Text.RegularExpressions.Regex.Replace(explicitRole, @"\s+", " ");
            }

            // 2. Dynamic JD Analysis (Source of Truth)
            var extractedRawSkills = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
            foreach (var skill in _masterSkills)
            {
                var normSkill = skill.ToLowerInvariant();
                if (System.Text.RegularExpressions.Regex.IsMatch(jdLower, $@"\b{System.Text.RegularExpressions.Regex.Escape(normSkill)}\b", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                {
                    extractedRawSkills.Add(skill);
                }
            }

            // 3. Parent-Child Skill Deduplication (Eliminate specific duplicates)
            var requiredSkills = new HashSet<string>(extractedRawSkills, System.StringComparer.OrdinalIgnoreCase);
            foreach (var child in extractedRawSkills)
            {
                foreach (var parent in extractedRawSkills)
                {
                    // If the child contains the parent string (e.g. "Spring MVC" contains "MVC"), remove the parent
                    if (child.Length > parent.Length && child.IndexOf(parent, System.StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        requiredSkills.Remove(parent);
                    }
                }
            }

            _logger.LogInformation("Extracted Deduplicated JD Skills: {Skills}", string.Join(", ", requiredSkills));

            // 4. Validation Gate
            if (requiredSkills.Count == 0)
            {
                _logger.LogWarning("Analysis Incomplete: No known required skills found in JD.");
                return new ATSResult
                {
                    AnalysisValid = false,
                    AtsScore = 0,
                    DetectedRole = "Unknown Role",
                    CriticalMissingSkills = new List<string>(),
                    RequiredSkills = new List<string>(),
                    PreferredSkills = new List<string>(),
                    MatchedKeywords = new List<string>(),
                    MissingKeywords = new List<string>()
                };
            }

            // 5. Resume Skills Matching
            var matchedReq = new List<string>();
            var missingReq = new List<string>();
            var partialMatchesObj = new List<ResumeAnalyzer.API.Models.PartialMatchResult>();

            double partialMatchScoreSum = 0;

            foreach (var skill in requiredSkills)
            {
                var normSkill = skill.ToLowerInvariant();
                if (System.Text.RegularExpressions.Regex.IsMatch(rLower, $@"(?<![a-zA-Z0-9]){System.Text.RegularExpressions.Regex.Escape(normSkill)}(?![a-zA-Z0-9])", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                {
                    matchedReq.Add(skill);
                }
                else
                {
                    // Check for weighted partial match
                    bool isPartial = false;
                    int maxPartialScore = 0;
                    string bestPartialCandidate = "";

                    if (_weightedPartialMatchMap.TryGetValue(skill, out var partialDict))
                    {
                        foreach (var kvp in partialDict)
                        {
                            if (System.Text.RegularExpressions.Regex.IsMatch(rLower, $@"(?<![a-zA-Z0-9]){System.Text.RegularExpressions.Regex.Escape(kvp.Key.ToLowerInvariant())}(?![a-zA-Z0-9])", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                            {
                                if (kvp.Value > maxPartialScore)
                                {
                                    maxPartialScore = kvp.Value;
                                    bestPartialCandidate = kvp.Key;
                                }
                                isPartial = true;
                            }
                        }
                    }

                    if (isPartial)
                    {
                        partialMatchesObj.Add(new ResumeAnalyzer.API.Models.PartialMatchResult
                        {
                            RequiredSkill = skill,
                            CandidateSkill = bestPartialCandidate,
                            PartialScore = maxPartialScore
                        });
                        partialMatchScoreSum += (double)maxPartialScore / 100.0;
                    }
                    else
                    {
                        missingReq.Add(skill);
                    }
                }
            }

            if (matchedReq.Count == 0 && partialMatchesObj.Count == 0 && rLower.Length < 100)
            {
                _logger.LogWarning("Analysis Incomplete: Resume is too short or unreadable.");
                return new ATSResult { AnalysisValid = false, AtsScore = 0 };
            }

            // 6. Experience Matching & Strict Validation
            int jdExp = ExtractYearsOfExperience(jdText);
            int resumeExp = ExtractYearsOfExperience(resumeText);
            
            // Basic Experience Match scoring
            int experienceScore = 0;
            if (jdExp > 0)
            {
                if (resumeExp >= jdExp) experienceScore = 100;
                else if (resumeExp > 0 && resumeExp >= jdExp - 1) experienceScore = 50; // Close enough
                else 
                {
                    experienceScore = 0; // Heavy penalty for missing experience
                    _logger.LogWarning("Experience Penalty Applied: Required {Req}, Found {Found}", jdExp, resumeExp);
                }
            }
            else
            {
                experienceScore = rLower.Contains("experience") ? 100 : 50; // No strict requirement in JD
            }

            // 7. Project Relevance
            string projectSection = ExtractProjectsSection(resumeText);
            var projLower = NormalizeText(projectSection);
            int matchedInProjects = 0;
            if (!string.IsNullOrWhiteSpace(projLower))
            {
                foreach (var skill in requiredSkills)
                {
                    if (System.Text.RegularExpressions.Regex.IsMatch(projLower, $@"\b{System.Text.RegularExpressions.Regex.Escape(skill.ToLowerInvariant())}\b"))
                    {
                        matchedInProjects++;
                    }
                }
            }
            int projectsScore = requiredSkills.Count > 0 ? (int)(((double)matchedInProjects / requiredSkills.Count) * 100) : 0;
            // Boost slightly if they just have a projects section but missing strict keywords
            if (projectsScore == 0 && projLower.Length > 20) projectsScore = 20;

            // 8. Component Scoring
            // Partial Matches give dynamic value based on weight
            double keywordValue = matchedReq.Count + partialMatchScoreSum;
            int keywordScore = requiredSkills.Count > 0 ? (int)((keywordValue / requiredSkills.Count) * 100) : 0;
            int roleRelevance = keywordScore; // Role relevance is fundamentally tied to having the right skills
            int educationScore = (rLower.Contains("education") || rLower.Contains("degree") || rLower.Contains("b.tech")) ? 100 : 0;
            int certificationsScore = (rLower.Contains("certification") || rLower.Contains("certificate")) ? 100 : 0;

            // 9. Strict Universal Formula Calculation
            int rawScore = (int)(
                (keywordScore * 0.45) +
                (projectsScore * 0.20) +
                (experienceScore * 0.15) +
                (roleRelevance * 0.10) +
                (educationScore * 0.05) +
                (certificationsScore * 0.05)
            );

            // 10. Mandatory Caps based on Missing %
            int finalScore = rawScore;
            // Missing is exactly fully missing (partial is not fully missing)
            double missingPercentage = (double)missingReq.Count / requiredSkills.Count;

            if (missingPercentage >= 0.70) finalScore = System.Math.Min(40, finalScore);
            else if (missingPercentage >= 0.50) finalScore = System.Math.Min(55, finalScore);
            else if (missingPercentage >= 0.30) finalScore = System.Math.Min(70, finalScore);

            // Experience Penalty Override
            if (jdExp > 0 && resumeExp < jdExp && resumeExp == 0)
            {
                finalScore = System.Math.Min(45, finalScore); // Fresher applying for experienced role cap
            }

            // 11. Job Role Display (Prioritize Explicit Role, else Infer)
            string detectedRole = "";
            int roleConfidence = 0;
            string roleSource = "";

            if (!string.IsNullOrWhiteSpace(explicitRole))
            {
                detectedRole = explicitRole;
                roleConfidence = 95;
                roleSource = "Explicit Job Title";
            }
            else
            {
                if (jdLower.Contains("java developer") || jdLower.Contains(" j2ee ") || (jdLower.Contains("java") && jdLower.Contains("spring"))) detectedRole = "Java Developer";
                else if (jdLower.Contains("frontend")) detectedRole = "Frontend Developer";
                else if (jdLower.Contains("backend")) detectedRole = "Backend Developer";
                else if (jdLower.Contains("full stack")) detectedRole = "Full Stack Developer";
                else if (jdLower.Contains("android")) detectedRole = "Android Developer";
                else if (jdLower.Contains(".net")) detectedRole = ".NET Developer";
                else if (jdLower.Contains("data")) detectedRole = "Data Analyst/Engineer";
                else detectedRole = "Software Engineer";

                roleConfidence = 60;
                roleSource = "Skill-Based Inference";
            }

            _logger.LogInformation("Role Detection: Detected Role = {Role}, Confidence = {Confidence}%, Source = {Source}", detectedRole, roleConfidence, roleSource);

            // Quality Check
            var quality = new ResumeQualityCheck
            {
                ContactInfo = rLower.Contains("@") && System.Text.RegularExpressions.Regex.IsMatch(rLower, @"\d{10}"),
                Skills = rLower.Contains("skills"),
                Projects = rLower.Contains("projects") || rLower.Contains("project"),
                Experience = rLower.Contains("experience") || rLower.Contains("work history"),
                Education = rLower.Contains("education") || rLower.Contains("university") || rLower.Contains("college") || rLower.Contains("b.tech")
            };

            return new ATSResult
            {
                AnalysisValid = true,
                AtsScore = finalScore,
                KeywordScore = keywordScore,
                SkillsScore = keywordScore,
                ExperienceScore = experienceScore,
                ProjectsScore = projectsScore,
                EducationScore = educationScore,
                CertificationsScore = certificationsScore,
                FormattingScore = 100, // Legacy
                RoleRelevanceScore = roleRelevance,
                ProjectRelevanceScore = projectsScore,
                DetectedRole = detectedRole,
                RoleConfidence = roleConfidence,
                RoleSource = roleSource,
                CriticalMissingSkills = missingReq,
                MatchedKeywords = matchedReq,
                MissingKeywords = missingReq,
                PartialMatches = partialMatchesObj,
                TotalJdKeywords = requiredSkills.Count,
                QualityCheck = quality,
                RequiredSkills = requiredSkills.ToList(),
                PreferredSkills = new List<string>(), // We merged preferred into master JD extraction
                RoleSpecificScores = new Dictionary<string, int> { { detectedRole, finalScore } }
            };
        }
    }
}
