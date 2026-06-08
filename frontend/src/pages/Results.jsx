import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FiShare2, FiDownload, FiArrowLeft, FiAward, FiZap, 
  FiCheckCircle, FiXCircle, FiBriefcase, FiBookOpen, 
  FiTerminal, FiTrendingUp, FiAlertTriangle, FiMessageSquare,
  FiFileText
} from 'react-icons/fi'
import '../styles/results.css'

export default function Results() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isShared, setIsShared] = useState(false)
  
  const resultData = location.state?.result
  const atsResult = resultData?.atsResult || {}
  const aiResult = resultData?.aiResult || {}

  // 1. Report Header
  let extractedName = resultData?.resumeFileUrl?.split('/').pop() || 'Uploaded Resume'
  if (extractedName.includes('_')) {
    extractedName = extractedName.split('_').slice(1).join('_')
  }
  const resumeName = resultData?.fileName || decodeURIComponent(extractedName)
  const analysisDate = new Date().toLocaleString()
  const jobRole = aiResult?.jobRole || 'General Application'
  const reportId = `ATS-${Math.floor(100000 + Math.random() * 900000)}`

  // 2. ATS Score Overview
  const atsScore = atsResult?.atsScore || 0
  let status = "Poor"
  let statusClass = "status-poor"
  if (atsScore >= 90) { status = "Excellent"; statusClass = "status-excellent" }
  else if (atsScore >= 70) { status = "Good"; statusClass = "status-good" }
  else if (atsScore >= 50) { status = "Needs Improvement"; statusClass = "status-needs-improvement" }

  // 3. ATS Score Breakdown
  const keywordScore = atsResult?.keywordScore || 0
  const skillsScore = atsResult?.skillsScore || 0
  const experienceScore = atsResult?.experienceScore || 0
  const projectsScore = atsResult?.projectsScore || 0
  const educationScore = atsResult?.educationScore || 0
  const certScore = atsResult?.certificationsScore || 0
  const formattingScore = atsResult?.formattingScore || 0

  // 4. Job Description Summary & Strict Engine Outputs
  const detectedRole = atsResult?.detectedRole || 'General Role'
  const reqSkills = atsResult?.requiredSkills || []
  const prefSkills = atsResult?.preferredSkills || []
  const totalKeywords = atsResult?.totalJdKeywords || 0
  const criticalMissing = atsResult?.criticalMissingSkills || []
  const analysisValid = atsResult?.analysisValid ?? true
  const roleSpecificScores = atsResult?.roleSpecificScores || {}

  // 5 & 6. Matched & Missing Skills
  const matchedSkills = atsResult?.matchedKeywords || []
  const missingSkills = atsResult?.missingKeywords || []
  const partialMatches = atsResult?.partialMatches || []

  // AI Availability Check
  const aiAvailable = aiResult?.aiAvailable !== false
  const aiWarning = aiResult?.warning || "AI analysis unavailable"

  // 7, 8, 9, 10. AI Insights
  const strengths = aiResult?.strengths || []
  const weaknesses = aiResult?.improvementAreas || []
  const recommendations = aiResult?.recommendations || []
  const interviewPrep = aiResult?.interviewPreparation || []

  // 11. Quality Check
  const quality = atsResult?.qualityCheck || { contactInfo: false, skills: false, projects: false, experience: false, education: false }

  // 12. Executive Summary
  const execSummary = aiAvailable ? (aiResult?.executiveSummary || "Analysis summary is not available for this resume.") : `⚠️ ${aiWarning}`

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: 'ATS Resume Analysis',
      text: 'Check out my ATS Resume Analysis Report!',
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('User cancelled share or share failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`Check out my ATS Resume Analysis: ${shareUrl}`);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        alert('Failed to copy link.');
      }
    }
  }

  return (
    <div className="premium-dashboard">
      
      {/* 1. REPORT HEADER */}
      <header className="dashboard-header">
        <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', width: '100%', gap: '1.5rem' }}>
          <div className="header-info" style={{ flex: 1, minWidth: 0 }}>
            <h1 className="report-title" style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', wordBreak: 'break-word', color: '#0F172A', lineHeight: 1.2 }}>{resumeName}</h1>
            <div className="report-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem', color: '#64748B', alignItems: 'center' }}>
              <span><strong>Detected Role:</strong> {detectedRole}</span>
              <span className="meta-divider" style={{ color: '#CBD5E1' }}>•</span>
              <span><strong>Date:</strong> {analysisDate}</span>
              <span className="meta-divider" style={{ color: '#CBD5E1' }}>•</span>
              <span><strong>Report ID:</strong> {reportId}</span>
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <button className="btn-secondary" onClick={() => window.print()}>
              <FiDownload size={16} /> Download PDF
            </button>
            <button className="btn-primary" onClick={handleShare}>
              {isShared ? <FiCheckCircle size={16} /> : <FiShare2 size={16} />}
              {isShared ? 'Copied!' : 'Share Report'}
            </button>
          </div>
        </div>
      </header>

      {/* 12. EXECUTIVE SUMMARY (Moved up for better UX) */}
      <section className="dashboard-section exec-summary-section">
        <div className="exec-card glass-panel">
          <h3><FiFileText /> Executive Summary</h3>
          <p>{execSummary}</p>
        </div>
      </section>

      <div className="dashboard-grid-2col">
        {/* Left Column */}
        <div className="col-left">
          
          {/* 2. ATS SCORE OVERVIEW */}
          <section className="dashboard-section score-overview-section">
            <div className="score-card glass-panel">
              <div className="score-gauge-container">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className={`circle-fill ${statusClass}`}
                    strokeDasharray={`${atsScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{atsScore}%</text>
                </svg>
              </div>
              <div className="score-details">
                <h2>ATS Score: {atsScore}/100</h2>
                <p>Match Rate: <strong>{atsScore}%</strong></p>
                <div className={`status-badge ${statusClass}`}>{status}</div>
              </div>
            </div>
          </section>

          {/* 3. ATS SCORE BREAKDOWN */}
          <section className="dashboard-section breakdown-section">
            <div className="glass-panel">
              <h3 className="section-title"><FiTrendingUp /> Score Breakdown</h3>
              <div className="progress-group">
                <div className="progress-label"><span>Keyword Match (40%)</span><span>{keywordScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${keywordScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Skills Match (20%)</span><span>{skillsScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${skillsScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Experience Match (15%)</span><span>{experienceScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${experienceScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Projects Relevance (10%)</span><span>{projectsScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${projectsScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Education Match (5%)</span><span>{educationScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${educationScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Certifications (5%)</span><span>{certScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${certScore}%` }}></div></div>
              </div>
              <div className="progress-group">
                <div className="progress-label"><span>Resume Formatting (5%)</span><span>{formattingScore}/100</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${formattingScore}%` }}></div></div>
              </div>
            </div>
          </section>

          {/* 11. RESUME QUALITY CHECK */}
          <section className="dashboard-section quality-section">
            <div className="glass-panel">
              <h3 className="section-title"><FiCheckCircle /> Resume Quality Check</h3>
              <ul className="quality-list">
                <li className={quality.contactInfo ? 'present' : 'missing'}>
                  {quality.contactInfo ? <FiCheckCircle /> : <FiXCircle />} Contact Information
                </li>
                <li className={quality.skills ? 'present' : 'missing'}>
                  {quality.skills ? <FiCheckCircle /> : <FiXCircle />} Skills Section
                </li>
                <li className={quality.projects ? 'present' : 'missing'}>
                  {quality.projects ? <FiCheckCircle /> : <FiXCircle />} Projects Section
                </li>
                <li className={quality.experience ? 'present' : 'missing'}>
                  {quality.experience ? <FiCheckCircle /> : <FiXCircle />} Experience Section
                </li>
                <li className={quality.education ? 'present' : 'missing'}>
                  {quality.education ? <FiCheckCircle /> : <FiXCircle />} Education Section
                </li>
              </ul>
            </div>
          </section>

          {/* 4. JOB DESCRIPTION SUMMARY */}
          <section className="dashboard-section jd-summary-section">
            <div className="glass-panel">
              <h3 className="section-title"><FiBriefcase /> Job Description Summary</h3>
              <p className="total-kw">Total Keywords Found: {totalKeywords}</p>
              
              <div className="jd-skills-grid">
                <div>
                  <h4>Required Skills</h4>
                  <ul className="jd-list">
                    {reqSkills.map((s, i) => <li key={i}>{s}</li>)}
                    {reqSkills.length === 0 && <li className="empty-li">None detected</li>}
                  </ul>
                </div>
                <div>
                  <h4>Preferred Skills</h4>
                  <ul className="jd-list">
                    {prefSkills.map((s, i) => <li key={i}>{s}</li>)}
                    {prefSkills.length === 0 && <li className="empty-li">None detected</li>}
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="col-right">
          
          {/* 5 & 6. SKILLS ANALYSIS */}
          <section className="dashboard-section skills-chips-section">
            <div className="glass-panel">
              <h3 className="section-title"><FiTerminal /> Strict Skills Analysis</h3>
              
              <div className="skills-block">
                <div className="skills-header matched-header">
                  <h4>Matched Skills</h4>
                  <span className="count-badge green">{matchedSkills.length}</span>
                </div>
                <div className="chips-container">
                  {matchedSkills.map((s, i) => <span key={i} className="chip chip-green">{s}</span>)}
                  {matchedSkills.length === 0 && <span className="empty-msg">No skills matched.</span>}
                </div>
              </div>

              {/* Partial Matches Section */}
              <div className="skills-block mt-lg">
                <div className="skills-header partial-header">
                  <h4>Partial Matches</h4>
                  <span className="count-badge yellow">{partialMatches.length}</span>
                </div>
                <div className="chips-container">
                  {partialMatches.map((m, i) => (
                    <span key={i} className="chip chip-yellow">
                      {m.candidateSkill} → {m.requiredSkill} ({m.partialScore}%)
                    </span>
                  ))}
                  {partialMatches.length === 0 && <span className="empty-msg">No partial matches.</span>}
                </div>
              </div>

              <div className="skills-block mt-lg">
                <div className="skills-header missing-header">
                  <h4>Critical Missing Skills (Penalty Applied)</h4>
                  <span className="count-badge red">{missingSkills.length}</span>
                </div>
                <div className="chips-container">
                  {missingSkills.map((s, i) => <span key={i} className="chip chip-red" style={{fontWeight: 'bold', border: '1px solid var(--danger)'}}>{s}</span>)}
                  {missingSkills.length === 0 && <span className="empty-msg">No critical skills missing!</span>}
                </div>
              </div>
            </div>
          </section>

          {/* 7. RESUME STRENGTHS */}
          <section className="dashboard-section insights-section">
            <div className="glass-panel">
              <h3 className="section-title text-success"><FiAward /> Resume Strengths</h3>
              <div className="cards-list">
                {strengths.map((str, i) => (
                  <div key={i} className="insight-card success-card">
                    <FiCheckCircle className="insight-icon" />
                    <p>{str}</p>
                  </div>
                ))}
                {strengths.length === 0 && <p className="empty-msg">{aiAvailable ? "No key strengths detected." : aiWarning}</p>}
              </div>
            </div>
          </section>

          {/* 8. IMPROVEMENT AREAS */}
          <section className="dashboard-section insights-section">
            <div className="glass-panel">
              <h3 className="section-title text-warning"><FiAlertTriangle /> Improvement Areas</h3>
              <div className="cards-list">
                {weaknesses.map((w, i) => (
                  <div key={i} className="insight-card warning-card">
                    <FiAlertTriangle className="insight-icon" />
                    <p>{w}</p>
                  </div>
                ))}
                {weaknesses.length === 0 && <p className="empty-msg">{aiAvailable ? "No major weaknesses detected." : aiWarning}</p>}
              </div>
            </div>
          </section>

          {/* 9. AI RECOMMENDATIONS */}
          <section className="dashboard-section insights-section">
            <div className="glass-panel">
              <h3 className="section-title text-purple"><FiZap /> AI Recommendations</h3>
              <div className="cards-list">
                {recommendations.map((rec, i) => (
                  <div key={i} className="insight-card purple-card">
                    <div className="card-bullet"></div>
                    <p>{rec}</p>
                  </div>
                ))}
                {recommendations.length === 0 && <p className="empty-msg">{aiAvailable ? "No recommendations available." : aiWarning}</p>}
              </div>
            </div>
          </section>

          {/* 10. INTERVIEW PREP */}
          <section className="dashboard-section insights-section">
            <div className="glass-panel">
              <h3 className="section-title"><FiMessageSquare /> Interview Preparation Insights</h3>
              <div className="cards-list">
                {interviewPrep.map((prep, i) => (
                  <div key={i} className="insight-card default-card">
                    <FiBookOpen className="insight-icon" />
                    <p>{prep}</p>
                  </div>
                ))}
                {interviewPrep.length === 0 && <p className="empty-msg">{aiAvailable ? "No interview insights generated." : aiWarning}</p>}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
