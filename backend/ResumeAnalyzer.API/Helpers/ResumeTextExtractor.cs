using System;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace ResumeAnalyzer.API.Helpers
{
    public static class ResumeTextExtractor
    {
        public static string ExtractText(Microsoft.AspNetCore.Http.IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            using var stream = file.OpenReadStream();
            if (extension == ".pdf")
            {
                using var document = UglyToad.PdfPig.PdfDocument.Open(stream);
                var text = new System.Text.StringBuilder();
                foreach (var page in document.GetPages())
                {
                    text.AppendLine(page.Text);
                }
                return text.ToString();
            }
            else if (extension == ".docx" || extension == ".doc")
            {
                using var wordDoc = WordprocessingDocument.Open(stream, false);
                var body = wordDoc.MainDocumentPart?.Document?.Body;
                return body?.InnerText ?? string.Empty;
            }
            else
            {
                // fallback: read as plain text
                using var reader = new StreamReader(stream);
                return reader.ReadToEnd();
            }
        }
    }
}
