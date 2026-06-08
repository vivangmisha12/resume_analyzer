import { useParams, useNavigate } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import templateData from '../data/templates.json'
import '../styles/templates.css'

export default function TemplatePreview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const template = templateData.find(t => t.id === id)

  if (!template) {
    return (
      <div className="premium-dashboard templates-page">
        <div className="empty-state">
          <h2>Template Not Found</h2>
          <button className="btn-primary mt-4" onClick={() => navigate('/templates')}>
            Back to Library
          </button>
        </div>
      </div>
    )
  }

  const handleUseTemplate = () => {
    alert(`Selected ${template.name}! This will open the resume editor in a future update.`)
  }

  return (
    <div className="premium-dashboard templates-page" style={{ paddingBottom: '2rem' }}>
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 2rem 1rem 2rem', borderBottom: '1px solid #E2E8F0', background: 'white' }}>
        <div className="header-info" style={{ textAlign: 'left' }}>
          <h1 className="report-title" style={{ fontSize: '2rem', margin: 0, color: '#0F172A' }}>{template.name}</h1>
          <span className="template-category" style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-block', fontWeight: 'bold', color: '#A855F7', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {template.category}
          </span>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleUseTemplate} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle size={18} /> Use This Template
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '900px', background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid #E2E8F0' }}>
          <img 
            src={encodeURI(template.image)} 
            alt={template.name} 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
          />
        </div>
      </div>
    </div>
  )
}
