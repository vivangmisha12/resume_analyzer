import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiEye, FiCheckCircle } from 'react-icons/fi'
import templateData from '../data/templates.json'
import '../styles/templates.css'

export default function Templates() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Derive unique categories from data + 'All'
  const categories = ['All', ...new Set(templateData.map(t => t.category))]

  const filteredTemplates = useMemo(() => {
    return templateData.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handlePreview = (templateId) => {
    navigate(`/templates/preview/${templateId}`)
  }

  const handleUseTemplate = (templateName) => {
    alert(`Selected ${templateName}! This will open the resume editor in a future update.`)
  }

  return (
    <div className="premium-dashboard templates-page">
      <header className="dashboard-header no-back">
        <div className="header-main">
          <div className="header-info">
            <h1 className="report-title">Resume Template Library</h1>
            <p className="text-gray-500 mt-1">Choose a premium template that matches your career goals</p>
          </div>
        </div>
      </header>

      <div className="templates-controls">
        <div className="search-bar-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="template-search-input"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-thumbnail-wrapper">
              <img src={encodeURI(template.image)} alt={template.name} className="template-thumbnail" />
              <div className="template-overlay">
                <button className="btn-secondary" onClick={() => handlePreview(template.id)}>
                  <FiEye /> Preview
                </button>
                <button className="btn-primary" onClick={() => handleUseTemplate(template.name)}>
                  <FiCheckCircle /> Use Template
                </button>
              </div>
            </div>
            <div className="template-info">
              <span className="template-category">{template.category}</span>
              <h3 className="template-name">{template.name}</h3>
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="empty-state">
            <p>No templates found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
