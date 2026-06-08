using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace ResumeAnalyzer.API.Services
{
    public interface IKeywordExtractor
    {
        /// <summary>
        /// Extracts a set of normalized keywords from the supplied text.
        /// Only keywords present in the configured skill dictionary are returned.
        /// </summary>
        HashSet<string> ExtractKeywords(string text);
    }

    public class KeywordExtractor : IKeywordExtractor
    {
        private readonly HashSet<string> _skillDictionary;

        public KeywordExtractor()
        {
            // Load skill dictionary from embedded JSON file (Data/skills.json)
            var skillFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "skills.json");
            if (File.Exists(skillFilePath))
            {
                var json = File.ReadAllText(skillFilePath);
                var skills = JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
                _skillDictionary = new HashSet<string>(skills, System.StringComparer.OrdinalIgnoreCase);
            }
            else
            {
                // Fallback to an empty set if file missing – prevents crashes.
                _skillDictionary = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
            }
        }

        public HashSet<string> ExtractKeywords(string text)
        {
            var result = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
            if (string.IsNullOrWhiteSpace(text))
                return result;

            // Simple tokenisation: split on whitespace and punctuation.
            var separators = new[] { ' ', '\t', '\r', '\n', ',', '.', ';', ':', '/', '\\', '(', ')', '[', ']', '{', '}', '-', '_' };
            var tokens = text.Split(separators, System.StringSplitOptions.RemoveEmptyEntries);
            foreach (var token in tokens)
            {
                var clean = token.Trim().ToLowerInvariant();
                if (_skillDictionary.Contains(clean))
                {
                    result.Add(clean);
                }
            }
            return result;
        }
    }
}
