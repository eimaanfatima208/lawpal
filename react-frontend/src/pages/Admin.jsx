import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

function Admin() {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    setUser(parsedUser)
  }, [navigate])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getInitials = (fullName) => {
    const names = fullName.trim().split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="logo-section">
            <div className="logo-icon-box">
              <span className="logo-icon">⚖</span>
            </div>
            <span className="logo-text">LawPal</span>
          </div>
        </div>
        <div className="header-right">
          <button className="notification-btn">🔔</button>
          <div className="user-profile">
            <span className="user-initials">{getInitials(user.full_name)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-body">
        {/* Sidebar */}
        <div className={`admin-sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-nav">
            <button className="nav-item active">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Users</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </button>
            <button className="nav-item" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          <div className="admin-main">
            <div className="welcome-section">
              <h1 className="admin-title">Welcome, {user.full_name}!</h1>
              <p className="admin-subtitle">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="admin-footer">
        <p>© 2025 LawPal. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Admin
