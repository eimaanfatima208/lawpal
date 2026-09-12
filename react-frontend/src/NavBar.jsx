import { useNavigate } from 'react-router-dom'
import { getDisplayName, getInitials } from './utils/displayName'
import AccountMenu from './components/AccountMenu'
import './NavBar.css'

export default function NavBar() {
  const navigate = useNavigate()

  const userData = localStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleProfile = () => {
    if (!user) return
    if (user.role === 'lawyer') {
      navigate('/lawyer-dashboard?tab=profile')
    } else if (user.role === 'client') {
      navigate('/dashboard?tab=profile')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-icon-box">
          <span className="logo-icon">⚖</span>
        </div>
        <span className="navbar-logo-text">LawPal</span>
      </div>

      <div className="navbar-right">
        <button className="notification-button" type="button">
          🔔
          <span className="notification-badge"></span>
        </button>

        <AccountMenu
          initials={user ? getInitials(getDisplayName(user)) : 'A'}
          onProfile={handleProfile}
          onLogout={handleLogout}
          triggerClassName="profile-button"
        />
      </div>
    </nav>
  )
}
