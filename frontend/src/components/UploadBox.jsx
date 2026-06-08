import { useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import '../styles/uploadbox.css'

export default function UploadBox({ onFileSelect }) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const file = files[0]
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className={`upload-box ${isDragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <FiUploadCloud className="upload-icon" />
      <h3>Drop your resume here</h3>
      <p className="or">or</p>
      <input
        type="file"
        id="file-input"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-input" className="upload-btn">
        Browse Files
      </label>
      <p className="file-info">Supported: PDF, DOC, DOCX (Max 5MB)</p>
    </div>
  )
}
