import { useState, useEffect } from 'react'
import { Mail, Briefcase, User } from 'lucide-react'
import { getDisplayName, getInitials, getRoleLabel } from '../utils/displayName'
import './Profile.css'

const API_URL = 'http://localhost/lawpal%20-%20AI%20Automation/lawpal-backend'

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) return
    let parsed
    try {
      parsed = JSON.parse(userData)
      if (parsed && (parsed.fullName != null) && (parsed.full_name == null || parsed.full_name === '')) {
        parsed.full_name = parsed.fullName
      }
      setUser(parsed)
    } catch (_) {
      return
    }
    if (!parsed || !parsed.id || !parsed.email) return
    // Refresh user from DB so full_name is always current
    fetch(`${API_URL}/get_user.php?id=${parsed.id}&email=${encodeURIComponent(parsed.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      })
      .catch(() => {})
  }, [])

  if (!user) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading profile...</p>
      </div>
    )
  }

  const dbFullName = (user.full_name ?? user.fullName ?? '').trim()
  const displayFullName = dbFullName && !dbFullName.includes('@') ? dbFullName : (getDisplayName(user) !== getRoleLabel(user.role) ? getDisplayName(user) : '—')

  return (
    <div className="profile-page">
      <div className="profile-header-section">
        <div className="profile-avatar-wrap">
          <span className="profile-avatar-initial">{getInitials(getDisplayName(user))}</span>
        </div>
        <div className="profile-name-block">
          <h1 className="profile-name">{getDisplayName(user)}</h1>
          <p className="profile-specialization">{getRoleLabel(user.role)}</p>
        </div>
      </div>

      <div className="profile-details-card">
        <h2 className="profile-details-title">Professional Details</h2>
        <div className="profile-detail-row">
          <User className="profile-detail-icon" size={20} />
          <span className="profile-detail-label">Full Name:</span>
          <span className="profile-detail-value">{displayFullName}</span>
        </div>
        <div className="profile-detail-row">
          <Briefcase className="profile-detail-icon" size={20} />
          <span className="profile-detail-label">Role:</span>
          <span className="profile-detail-value">{getRoleLabel(user.role)}</span>
        </div>
        <div className="profile-detail-row">
          <Mail className="profile-detail-icon" size={20} />
          <span className="profile-detail-label">Email:</span>
          <span className="profile-detail-value">{user.email || '—'}</span>
        </div>
      </div>
    </div>
  )
}
