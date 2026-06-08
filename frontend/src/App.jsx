import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import Results from './pages/Results'
import History from './pages/History'
import Profile from './pages/Profile'
import Templates from './pages/Templates'
import TemplatePreview from './pages/TemplatePreview'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function AppContent() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/'

  if (isAuthPage) {
    return (
      <div className="content-area full-width">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="app-layout-container">
      <Navbar />
      <div className="app-layout-main">
        <Sidebar />
        <div className="content-area">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/preview/:id" element={<TemplatePreview />} />
            <Route path="/upload" element={<UploadResume />} />
            <Route path="/results" element={<Results />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
