import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiLayout, FiUploadCloud, FiBarChart2, FiClock, FiUser, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi'
import { useState } from 'react'
import '../styles/sidebar.css'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/templates', label: 'Template Library', icon: FiGrid },
    { path: '/upload', label: 'Upload Resume', icon: FiUploadCloud },
    { path: '/results', label: 'Analysis Results', icon: FiBarChart2 },
    { path: '/history', label: 'History', icon: FiClock },
    { path: '/profile', label: 'Profile & Settings', icon: FiUser },
  ]

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-header">
            {!isCollapsed && <span className="nav-section-label">MAIN MENU</span>}
            <button 
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <FiChevronLeft style={{ transform: 'rotate(180deg)' }} size={18} /> : <FiChevronLeft size={18} />}
            </button>
          </div>
          <ul className="sidebar-menu">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              // Differentiate settings active state or keep active check simple
              const isItemActive = isActive(item.path) && (item.label !== 'Settings' || location.hash === '#settings')
              
              return (
                <li key={idx} className="sidebar-item">
                  <Link 
                    to={item.path}
                    className={`sidebar-link ${isItemActive ? 'active' : ''}`}
                    title={item.label}
                  >
                    <span className="sidebar-icon">
                      <Icon size={18} />
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                    {isItemActive && <span className="active-indicator"></span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
