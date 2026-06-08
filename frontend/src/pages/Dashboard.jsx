import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiTrendingUp,
  FiFile,
  FiAward,
  FiBriefcase,
  FiArrowRight,
  FiTrash2,
  FiUpload,
  FiDownload,
  FiEye,
  FiStar,
  FiLayout
} from 'react-icons/fi'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts'
import '../styles/dashboard.css'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return;
    }
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`https://resume-analyzer-xgye.onrender.com/api/resumes/history/${user.id}`)
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      
      // Sort data by date ascending for the chart
      const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setResumes(sortedData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this resume?")) return

    try {
      const response = await fetch(`https://resume-analyzer-xgye.onrender.com/api/resumes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
      setResumes(resumes.filter(r => r.id !== id))
    } catch (err) {
      alert("Error deleting: " + err.message)
    }
  }

  // KPIs
  const totalResumes = resumes.length
  const avgScore = totalResumes > 0
    ? Math.round(resumes.reduce((acc, curr) => acc + curr.score, 0) / totalResumes)
    : 0
  const highestScore = totalResumes > 0
    ? Math.max(...resumes.map(r => r.score))
    : 0

  const kpiCards = [
    { title: 'Total Uploads', value: totalResumes, unit: 'Docs', trend: 'Lifetime tracked', icon: FiFile, color: '#7C3AED' },
    { title: 'Average ATS Score', value: avgScore, unit: '%', trend: 'Goal is > 85%', icon: FiTrendingUp, color: '#3B82F6' },
    { title: 'Highest Score', value: highestScore, unit: '%', trend: 'Top performing', icon: FiAward, color: '#10B981' },
    { title: 'Jobs Matched', value: totalResumes * 3, unit: 'Est.', trend: 'Algorithm projection', icon: FiBriefcase, color: '#F59E0B' }
  ]

  // Chart Data format
  const chartData = resumes.map((res, index) => ({
    name: `Upload ${index + 1}`,
    score: res.score,
    date: new Date(res.createdAt).toLocaleDateString()
  }))

  // Mock Company Formats
  const companyFormats = [
    { id: 1, name: 'Google Format', desc: 'Focuses on impact metrics (X by Y doing Z)', icon: 'G' },
    { id: 2, name: 'Amazon STAR', desc: 'Situation, Task, Action, Result focused structure', icon: 'A' },
    { id: 3, name: 'Standard ATS', desc: 'Clean, plain-text optimized for all major parsers', icon: 'ATS' },
  ]

  // Mock Sample Resumes
  const sampleResumes = [
    { id: 101, title: 'Senior SDE (95%)', role: 'Software Engineering', type: 'Tech' },
    { id: 102, title: 'Product Manager (92%)', role: 'Product Management', type: 'PM' },
    { id: 103, title: 'Data Scientist (89%)', role: 'Data & Analytics', type: 'Data' },
    { id: 104, title: 'Cloud Architect (94%)', role: 'Infrastructure', type: 'Cloud' },
  ]

  return (
    <div className="dashboard-container premium-dashboard-page">
      <div className="dashboard-header">
        <div className="header-info">
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Monitor your ATS scores and explore premium resume resources.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary-gradient" onClick={() => navigate('/upload')}>
            <FiUpload size={16} /> Upload New Resume
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="stats-grid">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="stat-card glass-morphism">
              <div className="stat-card-header">
                <span className="stat-card-title">{card.title}</span>
                <span className="stat-card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  <Icon size={20} />
                </span>
              </div>
              <div className="stat-card-value-group">
                <span className="stat-card-value">{card.value}</span>
                <span className="stat-card-unit">{card.unit}</span>
              </div>
              <div className="stat-card-trend">{card.trend}</div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-layout-complex">
        
        {/* Left Column: Charts and Table */}
        <div className="layout-col-left">
          
          {/* Chart Widget */}
          <div className="dashboard-widget-card glass-morphism chart-widget">
            <div className="widget-header">
              <h2 className="widget-title"><FiTrendingUp className="inline-icon"/> ATS Score Progress</h2>
              <p className="widget-subtitle">Track your resume improvement over time.</p>
            </div>
            
            {chartData.length > 1 ? (
              <div className="chart-container" style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.2)" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-chart-state">
                <p>Upload at least two resumes to see your progress trend.</p>
              </div>
            )}
          </div>

          {/* Recent Uploads Table */}
          <div className="dashboard-widget-card glass-morphism">
            <div className="widget-header flex-between">
              <div>
                <h2 className="widget-title">Recent Uploads</h2>
                <p className="widget-subtitle">Your previously analyzed documents.</p>
              </div>
              <button className="btn-text" onClick={() => navigate('/history')}>View All</button>
            </div>

            {loading ? (
              <p className="loading-text">Loading history...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : resumes.length === 0 ? (
              <div className="empty-state">
                <FiFile size={32} />
                <p>No resumes uploaded yet. Start optimizing now!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Reverse array to show newest first, limit to 4 */}
                    {[...resumes].reverse().slice(0, 4).map((res) => (
                      <tr key={res.id} onClick={() => navigate('/results', { state: { result: res } })}>
                        <td className="doc-name-cell"><FiFileText className="file-icn"/> {res.fileName}</td>
                        <td className="date-cell">{new Date(res.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`score-badge ${res.score >= 85 ? 'good' : res.score >= 70 ? 'avg' : 'poor'}`}>
                            {res.score}%
                          </span>
                        </td>
                        <td>{res.status}</td>
                        <td className="action-cell">
                          <button className="btn-icon delete" onClick={(e) => handleDelete(res.id, e)} title="Delete">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Templates and Samples */}
        <div className="layout-col-right">
          
          {/* Company Formats */}
          <div className="dashboard-widget-card glass-morphism">
            <div className="widget-header">
              <h2 className="widget-title"><FiLayout className="inline-icon"/> Company-wise Formats</h2>
              <p className="widget-subtitle">Download templates proven to pass specific parsers.</p>
            </div>
            
            <div className="formats-grid">
              {companyFormats.map(fmt => (
                <div key={fmt.id} className="format-card">
                  <div className="format-icon">{fmt.icon}</div>
                  <div className="format-info">
                    <h4>{fmt.name}</h4>
                    <p>{fmt.desc}</p>
                  </div>
                  <button className="download-fmt-btn" title="Download Template" onClick={() => alert("Downloading format...")}>
                    <FiDownload />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Resumes */}
          <div className="dashboard-widget-card glass-morphism">
            <div className="widget-header">
              <h2 className="widget-title"><FiStar className="inline-icon"/> High-Scoring Samples</h2>
              <p className="widget-subtitle">Draw inspiration from 90%+ ATS-matched resumes.</p>
            </div>
            
            <div className="samples-list">
              {sampleResumes.map(sample => (
                <div key={sample.id} className="sample-card">
                  <div className="sample-badge">{sample.type}</div>
                  <div className="sample-details">
                    <h4 className="sample-title">{sample.title}</h4>
                    <p className="sample-role">{sample.role}</p>
                  </div>
                  <div className="sample-actions">
                    <button className="btn-icon primary" onClick={() => alert("Opening sample...")} title="View Sample">
                      <FiEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function FiFileText(props) {
  return <FiFile {...props} />
}
