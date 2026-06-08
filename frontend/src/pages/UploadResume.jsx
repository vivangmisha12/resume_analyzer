import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUploadCloud, FiFile, FiX, FiZap } from 'react-icons/fi'
import '../styles/upload.css'

export default function UploadResume() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const navigate = useNavigate()
  const [jdMode, setJdMode] = useState('file') // 'file' or 'text'
  const [jdFile, setJdFile] = useState(null)
  const [jdRawFile, setJdRawFile] = useState(null)
  const [jdText, setJdText] = useState('')

  const user = JSON.parse(localStorage.getItem('user'))

  // JD handlers
  const handleJdFile = (file) => {
    if (!file) return
    const extension = file.name.split('.').pop().toLowerCase()
    if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
      setJdRawFile(file)
      setJdFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        type: extension === 'pdf' ? 'PDF Document' : 'Word Document',
      })
    } else {
      alert('Unsupported JD file format! Please upload PDF or DOCX.')
    }
  }

  const handleJdInputChange = (e) => {
    const files = e.target.files
    if (files && files[0]) handleJdFile(files[0])
  }

  const handleJdTextChange = (e) => {
    setJdText(e.target.value)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleFile = (file) => {
    if (!file) return
    const extension = file.name.split('.').pop().toLowerCase()
    if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
      setRawFile(file)
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        type: extension === 'pdf' ? 'PDF Document' : 'Word Document',
      })
    } else {
      alert('Unsupported file format! Please upload PDF or DOCX.')
    }
  }

  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleJdInputChangeWrapper = (e) => {
    const files = e.target.files
    if (files && files[0]) handleJdFile(files[0])
  }

  const handleAnalyze = async () => {
    // Validate inputs
    if (!rawFile) {
      alert('Please upload a resume file first!')
      return
    }
    if (jdMode === 'file' && !jdFile) {
      alert('Please upload a Job Description file!')
      return
    }
    if (jdMode === 'text' && !jdText.trim()) {
      alert('Please enter Job Description text!')
      return
    }
    if (!user) {
      alert('Please login first!')
      navigate('/login')
      return
    }

    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('resumeFile', rawFile)
      if (jdMode === 'file' && jdRawFile) {
        formData.append('jdFile', jdRawFile)
      } else if (jdMode === 'text') {
        formData.append('jdText', jdText)
      }
      const response = await fetch('http://localhost:5275/api/resumes/analyze', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(errText || 'Failed to upload and analyze')
      }
      const data = await response.json()
      navigate('/results', { state: { result: { ...data, fileName: rawFile.name } } })
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-page-header">
        <h1 className="upload-title">New Analysis</h1>
        <p className="upload-subtitle">Upload your resume and the target job description to get a comprehensive ATS score.</p>
      </div>

      <div className="upload-layout-grid">
        {/* Left Column: Upload Inputs */}
        <div className="upload-inputs-column">
          {/* Resume Upload Card */}
          <div className="upload-card">
            <h2 className="card-section-title">1. Upload Resume</h2>
            <p className="card-section-desc">We support PDF and Word documents. Your data is processed securely.</p>
            
            {!uploadedFile ? (
              <div
                className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <FiUploadCloud size={48} className="upload-cloud-icon" />
                <p className="upload-prompt">Drag & drop your resume</p>
                <div className="divider-or"><span>OR</span></div>
                <button className="btn-secondary browse-btn" onClick={(e) => { e.stopPropagation(); document.getElementById('fileInput').click() }}>
                  Browse Files
                </button>
                <span className="upload-subtext" style={{ marginTop: '15px' }}>Supports PDF, DOCX (Max 5MB)</span>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="upload-success-container">
                <FiZap size={40} className="success-check-icon" />
                <p className="success-prompt">Resume Ready for Analysis!</p>
                <div className="uploaded-file-row">
                  <FiFile size={24} className="doc-icon" />
                  <div className="uploaded-meta">
                    <div className="uploaded-filename">{uploadedFile.name}</div>
                    <div className="uploaded-details">{uploadedFile.size} KB • {uploadedFile.type}</div>
                  </div>
                  <button className="remove-file-btn" onClick={() => { setUploadedFile(null); setRawFile(null) }}>
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Card */}
          <div className="upload-card" style={{ opacity: uploadedFile ? 1 : 0.6, transition: 'opacity 0.3s ease' }}>
            <h2 className="card-section-title">2. Target Job Description</h2>
            <p className="card-section-desc">Tailor your analysis against a specific job role.</p>
            
            <div className="jd-mode-toggle" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="radio" name="jdMode" value="text" checked={jdMode === 'text'} onChange={() => setJdMode('text')} />
                Paste Text
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: '15px', cursor: 'pointer' }}>
                <input type="radio" name="jdMode" value="file" checked={jdMode === 'file'} onChange={() => setJdMode('file')} />
                Upload File
              </label>
            </div>

            {jdMode === 'text' ? (
              <div className="jd-input-wrapper">
                <textarea
                  className="job-description-textarea"
                  placeholder="Paste the job requirements here to find missing keywords..."
                  value={jdText}
                  onChange={handleJdTextChange}
                  rows={6}
                />
                <div className="word-count-badge">{jdText.split(/\s+/).filter(w => w.length > 0).length} words</div>
              </div>
            ) : (
              <div
                className={`drag-drop-zone ${jdFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('jdFileInput').click()}
                style={{ padding: '30px 20px' }}
              >
                {!jdFile ? (
                  <>
                    <FiUploadCloud size={32} className="upload-cloud-icon" />
                    <p className="upload-prompt" style={{ fontSize: '0.9rem' }}>Upload JD Document</p>
                  </>
                ) : (
                  <div className="uploaded-file-row" style={{ maxWidth: '100%' }}>
                    <FiFile size={20} className="doc-icon" />
                    <div className="uploaded-meta">
                      <div className="uploaded-filename">{jdFile.name}</div>
                    </div>
                    <button className="remove-file-btn" onClick={(e) => { e.stopPropagation(); setJdFile(null); setJdRawFile(null) }}>
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="jdFileInput"
                  accept=".pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={handleJdInputChangeWrapper}
                />
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="action-button-row">
            <button className="btn-secondary cancel-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button
              className="btn-primary analyze-action-btn"
              onClick={handleAnalyze}
              disabled={analyzing || !rawFile || (jdMode === 'file' ? !jdFile : !jdText.trim())}
            >
              {analyzing ? (
                <><FiZap className="spin-icon" /> Processing Engine...</>
              ) : (
                <><FiZap /> Generate ATS Report</>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Widgets */}
        <div className="upload-widgets-column">
          {/* Predictive Widget */}
          <div className="upload-card highlight-card">
            <div className="predict-widget-header">
              <div className="predict-icon-badge"><FiZap size={18} /></div>
              <div>
                <div className="predict-title">Predictive AI Analysis</div>
                <div className="predict-subtitle">Powered by OpenRouter Models</div>
              </div>
            </div>
            
            <div className="predict-score-display">
              <div className="score-value-block">
                <span className="score-number">{uploadedFile ? '95' : '00'}</span>
                <span className="score-total">%</span>
              </div>
              <div style={{ paddingBottom: '8px' }}>
                <div className="score-desc" style={{ color: uploadedFile ? 'var(--success)' : '' }}>
                  {uploadedFile ? 'Resume Detected' : 'Awaiting Resume'}
                </div>
                <div className="score-desc" style={{ fontSize: '0.75rem' }}>Potential ATS Match</div>
              </div>
            </div>

            <div className="prediction-details-list">
              <div className="predict-detail-row">
                <span className="detail-label">Keyword Extraction</span>
                <span className="detail-value">{jdText.length > 0 || jdFile ? 'Active' : 'Pending JD'}</span>
              </div>
              <div className="predict-detail-row">
                <span className="detail-label">Structure Validation</span>
                <span className="detail-value">{uploadedFile ? 'Ready' : 'Pending Resume'}</span>
              </div>
              <div className="predict-detail-row">
                <span className="detail-label">Deep AI Insights</span>
                <span className="detail-value">Enabled</span>
              </div>
            </div>
          </div>

          {/* Terminal Console Simulation */}
          <div className="upload-card terminal-card">
            <div className="terminal-header">
              Terminal Output
              <div className="terminal-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="terminal-console">
              {analyzing ? (
                <>
                  <p className="console-line console-cyan">[System] Initiating LLM connection...</p>
                  <p className="console-line console-green">[Auth] OpenRouter API verified.</p>
                  <p className="console-line">[Upload] Parsing {uploadedFile?.name || 'document'}...</p>
                  <p className="console-line console-purple">[Engine] Extracting text vectors...</p>
                  <p className="console-line console-yellow">[Model] Running meta-llama/llama-3.3-70b-instruct...</p>
                  <p className="console-line">[Process] Calculating keyword density metrics...</p>
                  <p className="console-line console-cyan">[Sync] Generating qualitative feedback...</p>
                </>
              ) : uploadedFile ? (
                <>
                  <p className="console-line console-green">[Success] File loaded into memory.</p>
                  <p className="console-line">[System] Ready for AI analysis.</p>
                  <p className="console-line console-yellow">Waiting for Job Description input...</p>
                </>
              ) : (
                <>
                  <p className="console-line">[System] ATS Engine Initialized v2.1</p>
                  <p className="console-line console-yellow">Awaiting file payload...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
