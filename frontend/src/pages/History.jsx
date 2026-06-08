import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiDownload, FiEye, FiTrash2, FiFileText, FiSliders, FiClock } from 'react-icons/fi'
import '../styles/history.css'

export default function History() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterScore, setFilterScore] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    fetch(`http://localhost:5275/api/resumes/history/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(item => ({
          id: item.id,
          filename: item.fileName,
          position: 'General Application', // Not saved in DB currently
          score: item.score,
          date: new Date(item.createdAt).toLocaleDateString(),
          status: item.status,
          fileSize: 'Uploaded File',
          rawData: item
        }))
        setAnalyses(mappedData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume report from your history?")) {
      try {
        const res = await fetch(`http://localhost:5275/api/resumes/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setAnalyses(analyses.filter(item => item.id !== id))
        } else {
          alert('Failed to delete report.')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const getFilteredAnalyses = () => {
    let result = analyses.filter(item => {
      const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.position.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (filterScore === 'all') return matchesSearch
      if (filterScore === 'high') return matchesSearch && item.score >= 85
      if (filterScore === 'mid') return matchesSearch && item.score >= 70 && item.score < 85
      if (filterScore === 'low') return matchesSearch && item.score < 70
      return matchesSearch
    })

    if (sortBy === 'recent') {
      // already sorted by recent in mock
    } else if (sortBy === 'highest-score') {
      result.sort((a, b) => b.score - a.score)
    } else if (sortBy === 'lowest-score') {
      result.sort((a, b) => a.score - b.score)
    }
    return result
  }

  const filteredData = getFilteredAnalyses()

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-page-header">
        <h1 className="history-title">Analysis History</h1>
        <p className="history-subtitle">Manage and compare all your optimized resume drafts.</p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="history-filter-board">
        <div className="history-search-input-wrapper">
          <FiSearch size={18} className="search-field-icon" />
          <input 
            type="text" 
            placeholder="Search by filename or position..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="history-selectors">
          <div className="selector-group">
            <FiSliders size={14} className="selector-field-icon" />
            <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)}>
              <option value="all">All Scores</option>
              <option value="high">Excellent (85+)</option>
              <option value="mid">Good (70-84)</option>
              <option value="low">Action Required (&lt;70)</option>
            </select>
          </div>

          <div className="selector-group">
            <FiClock size={14} className="selector-field-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="highest-score">Highest Score</option>
              <option value="lowest-score">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid count display */}
      <div className="filtered-results-count">
        Showing {filteredData.length} analyzed documents
      </div>

      {/* History Cards Grid */}
      {filteredData.length > 0 ? (
        <div className="history-cards-grid">
          {filteredData.map((item) => (
            <div key={item.id} className="history-doc-card">
              <div className="doc-card-header">
                <div className="doc-type-icon-wrapper">
                  <FiFileText size={20} />
                </div>
                <span className={`status-tag status-${item.score >= 85 ? 'success' : item.score >= 70 ? 'warning' : 'danger'}`}>
                  {item.status}
                </span>
              </div>

              <div className="doc-card-body">
                <h3 className="doc-card-filename" title={item.filename}>{item.filename}</h3>
                <p className="doc-card-position">{item.position}</p>

                <div className="doc-card-meta">
                  <span className="meta-text">{item.date}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-text">{item.fileSize}</span>
                </div>
              </div>

              <div className="doc-card-score-row">
                <div className="score-badge-circle">
                  <span className="score-badge-num">{item.score}%</span>
                  <span className="score-badge-lbl">ATS</span>
                </div>
              </div>

              <div className="doc-card-actions">
                <button 
                  className="action-pill-btn view-btn" 
                  onClick={() => {
                    navigate('/results', {
                      state: {
                        result: {
                          fileName: item.filename,
                          resumeFileUrl: item.rawData.filePath,
                          atsResult: {
                            atsScore: item.score,
                            detectedRole: 'General Application',
                            keywordScore: item.score,
                            skillsScore: item.score,
                            experienceScore: item.score,
                            projectsScore: item.score
                          },
                          aiResult: {
                            jobRole: 'General Application',
                            strengths: item.rawData.strengths ? item.rawData.strengths.split(';') : [],
                            missingKeywords: item.rawData.missingKeywords ? item.rawData.missingKeywords.split(';') : [],
                            recommendations: item.rawData.recommendations ? item.rawData.recommendations.split(';') : []
                          }
                        }
                      }
                    })
                  }}
                  title="View Report"
                >
                  <FiEye size={14} /> View
                </button>
                <button 
                  className="action-pill-btn download-btn" 
                  onClick={() => alert("Downloading PDF report...")}
                  title="Download Report"
                >
                  <FiDownload size={14} /> Report
                </button>
                <button 
                  className="action-pill-btn delete-btn" 
                  onClick={() => handleDelete(item.id)}
                  title="Delete Log"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="history-empty-state">
          <div className="empty-icon">📁</div>
          <h3 className="empty-title">No matching reports found</h3>
          <p className="empty-subtitle">Try refining your keyword query or resetting the score filters.</p>
        </div>
      )}
    </div>
  )
}
