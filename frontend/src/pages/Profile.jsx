import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiEdit2,
  FiSave,
  FiX,
  FiBell,
  FiLock,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiShield
} from 'react-icons/fi'
import '../styles/profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const user = JSON.parse(localStorage.getItem('user')) || { username: 'John Doe', email: 'john@example.com' }

  const [formData, setFormData] = useState({
    fullName: user.username,
    email: user.email,
    phone: '+91 99999 99999',
    location: 'India',
    bio: 'Software Developer specializing in backend cloud infrastructure and full-stack systems.'
  })

  const [resumes, setResumes] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login')
      return
    }

    fetch(`https://resume-analyzer-xgye.onrender.com/api/resumes/history/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history')
        return res.json()
      })
      .then(data => setResumes(data))
      .catch(err => console.error(err))
  }, [])

  const totalResumes = resumes.length
  const avgScore = totalResumes > 0
    ? Math.round(resumes.reduce((acc, curr) => acc + curr.score, 0) / totalResumes)
    : 0

  const stats = [
    { label: 'Resumes Analyzed', value: totalResumes.toString(), icon: FiFileText, color: '#7C3AED' },
    { label: 'Avg ATS Score', value: `${avgScore}%`, icon: FiCheckCircle, color: '#10B981' },
    { label: 'Optimizations Made', value: (totalResumes * 12).toString(), icon: FiShield, color: '#3B82F6' },
  ]

  const activity = [
    { action: `Created account for ${user.username}`, time: 'Just now', tag: 'Session' },
    { action: 'Setup SQL Database connection', time: '1 hour ago', tag: 'System' },
    { action: 'Configured local API routing parameters', time: '2 hours ago', tag: 'Setup' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    alert("Profile saved successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-banner-color"></div>
        <div className="profile-header-meta">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt="Profile Avatar"
            className="profile-large-avatar"
          />
          <div className="profile-title-block">
            <div className="name-row">
              <h1 className="user-profile-name">{formData.fullName}</h1>

            </div>
            <p className="user-profile-email">{formData.email}</p>
            <div className="profile-quick-tags">
              <span className="profile-tag-item"><FiMapPin size={12} /> {formData.location}</span>
              <span className="profile-tag-item"><FiCalendar size={12} /> Joined Jan 2024</span>
            </div>
          </div>
          <button
            className="btn-secondary edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <><FiX size={14} /> Cancel</> : <><FiEdit2 size={14} /> Edit Details</>}
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="profile-stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="profile-stat-card">
              <span className="p-stat-icon" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                <Icon size={18} />
              </span>
              <div className="p-stat-info">
                <span className="p-stat-val">{stat.value}</span>
                <span className="p-stat-lbl">{stat.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column details section */}
      <div className="profile-details-grid">
        {/* Left Column: Form / Info card */}
        <div className="details-col-main">
          <div className="profile-card">
            <h2 className="profile-section-title">Account Information</h2>

            {isEditing ? (
              <div className="profile-edit-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="form-action-row">
                  <button className="btn-primary" onClick={handleSave}>
                    <FiSave size={16} /> Save Settings
                  </button>
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-view-details">
                <div className="view-detail-row">
                  <span className="detail-field-lbl">Full Name</span>
                  <span className="detail-field-val">{formData.fullName}</span>
                </div>
                <div className="view-detail-row">
                  <span className="detail-field-lbl">Email Address</span>
                  <span className="detail-field-val">{formData.email}</span>
                </div>
                <div className="view-detail-row">
                  <span className="detail-field-lbl">Phone Number</span>
                  <span className="detail-field-val">{formData.phone}</span>
                </div>
                <div className="view-detail-row">
                  <span className="detail-field-lbl">Location Address</span>
                  <span className="detail-field-val">{formData.location}</span>
                </div>
                <div className="view-detail-row vertical">
                  <span className="detail-field-lbl">Professional Bio</span>
                  <span className="detail-field-val bio-text">{formData.bio}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings and Activity timeline */}
        <div className="details-col-sidebar">
          {/* Settings links */}
          <div className="profile-card compact-padding">
            <h2 className="profile-section-title">System Settings</h2>
            <div className="profile-settings-list">
              <button className="profile-setting-row" onClick={() => alert("Notification settings configured!")}>
                <FiBell size={18} className="sett-icon" />
                <div className="sett-info">
                  <span className="sett-title">Notifications</span>
                  <span className="sett-desc">Configure email report summaries</span>
                </div>
              </button>

              <button className="profile-setting-row" onClick={() => alert("Password reset prompt initialized!")}>
                <FiLock size={18} className="sett-icon" />
                <div className="sett-info">
                  <span className="sett-title">Password Key</span>
                  <span className="sett-desc">Update and change passkey validation</span>
                </div>
              </button>

              <button className="profile-setting-row danger" onClick={handleLogout}>
                <FiLogOut size={18} className="sett-icon" />
                <div className="sett-info">
                  <span className="sett-title">Sign Out Account</span>
                  <span className="sett-desc">Disconnect active analyzer sessions</span>
                </div>
              </button>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="profile-card compact-padding">
            <h2 className="profile-section-title">Activity Timeline</h2>
            <div className="profile-activity-timeline">
              {activity.map((item, idx) => (
                <div key={idx} className="p-activity-item">
                  <div className="p-activity-badge"></div>
                  <div className="p-activity-content">
                    <span className="p-activity-action">{item.action}</span>
                    <div className="p-activity-meta">
                      <span className="p-activity-time">{item.time}</span>
                      <span className="p-activity-tag">{item.tag}</span>
                    </div>
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
