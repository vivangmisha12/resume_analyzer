import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { FiLogOut, FiSearch } from 'react-icons/fi'
import '../styles/navbar.css'

export default function Navbar() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest User', email: 'guest@example.com' }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.6)', border: '1px solid rgba(124, 58, 237, 0.1)' }} />
          <div className="logo-text">
            <span className="logo-title">Resume Analyzer</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" title="Search Resumes">
          <FiSearch size={20} />
        </button>



        <div className="navbar-divider"></div>

        <div className="navbar-profile">
          <button
            className="profile-avatar"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            title="Profile Menu"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Profile" />
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <span>👤</span>
                <div>
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }} className="dropdown-item">
                <span>⚙️</span> Profile & Settings
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item danger">
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        <button className="navbar-icon-btn logout-btn" onClick={handleLogout} title="Logout">
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  )
}
