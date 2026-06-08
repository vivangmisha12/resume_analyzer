namespace ResumeAnalyzer.API.Services
{
    using System.Threading.Tasks;
    using ResumeAnalyzer.API.Models;

    public interface IResumeAnalyzerService
    {
        Task<AIResult> AnalyzeAsync(string atsSummary);
    }
}
