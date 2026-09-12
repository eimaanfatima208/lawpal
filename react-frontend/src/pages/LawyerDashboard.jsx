import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, MessageCircle, FileSearch, FileText, Search, User, FolderCog } from 'lucide-react'
import { getDisplayName, getInitials } from '../utils/displayName'
import logo from '../../assets/LOGOO.png'
import Chat from './Chat'
import DocumentAnalyzer from './DocumentAnalyzer'
import LegalTemplates from './LegalTemplates'
import CaseTracking from './CaseTracking'
import Profile from './Profile'
import LawyerAppointments from './LawyerAppointments'
import LegalSearch from './LegalSearch'
import AccountMenu from '../components/AccountMenu'
import { useTabNavigation } from '../utils/useTabNavigation'
import './LawyerDashboard.css'

const LAWYER_PAGES = [
  'dashboard',
  'appointments',
  'chats',
  'case-tracking',
  'document-analyzer',
  'legal-templates',
  'legal-search',
  'profile',
]

function LawyerDashboard() {
  const [user, setUser] = useState(null)
  const [activePage, setActivePage] = useTabNavigation(LAWYER_PAGES, 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatTarget, setChatTarget] = useState(null)
  const [aptStats, setAptStats] = useState({ pending: 0, upcoming: 0, next7: 0 })
  const mainRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role === 'admin') {
      navigate('/admin')
      return
    }
    if (parsedUser.role === 'client') {
      navigate('/dashboard')
      return
    }
    setUser(parsedUser)
  }, [navigate])

  useEffect(() => {
    if (!user?.id) return
    const API = import.meta.env.VITE_CHAT_API_URL || '/api'
    const loadStats = async () => {
      try {
        const res = await fetch(`${API}/appointments/stats/${user.id}`)
        const data = await res.json()
        if (data.success && data.stats) setAptStats(data.stats)
      } catch (_) {}
    }
    loadStats()
    const t = setInterval(loadStats, 5000)
    return () => clearInterval(t)
  }, [user?.id])

  // Remove scroll indicator arrows
  useEffect(() => {
    const removeScrollIndicators = () => {
      // Find and hide any scroll indicator elements
      const header = document.querySelector('.lawyer-dashboard-header')
      if (header) {
        // Remove any elements that look like scroll indicators
        const allElements = header.querySelectorAll('*')
        allElements.forEach(el => {
          const style = window.getComputedStyle(el)
          if (style.content && (style.content.includes('▲') || style.content.includes('△') || style.content.includes('scroll'))) {
            el.style.display = 'none'
          }
        })
        
        // Hide pseudo-elements
        const style = document.createElement('style')
        style.textContent = `
          .lawyer-dashboard-header *::before,
          .lawyer-dashboard-header *::after {
            display: none !important;
            content: none !important;
            visibility: hidden !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    // Run immediately and after a short delay
    removeScrollIndicators()
    const timer = setTimeout(removeScrollIndicators, 100)
    const observer = new MutationObserver(removeScrollIndicators)
    
    const header = document.querySelector('.lawyer-dashboard-header')
    if (header) {
      observer.observe(header, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  if (!user) {
    return null
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'chats', name: 'Chats', icon: MessageCircle },
    { id: 'case-tracking', name: 'Case Tracking', icon: FolderCog },
    { id: 'document-analyzer', name: 'Document Analyzer', icon: FileSearch },
    { id: 'legal-templates', name: 'Legal Templates', icon: FileText },
    { id: 'legal-search', name: 'Legal Search', icon: Search },
    { id: 'profile', name: 'Profile', icon: User }
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const metricCards = [
    { icon: Calendar, title: 'Pending Appointments', value: String(aptStats.pending ?? 0), desc: 'New requests to review', pageId: 'appointments' },
    { icon: Calendar, title: 'Upcoming Bookings', value: String(aptStats.upcoming ?? 0), desc: 'Accepted, from today', pageId: 'appointments' },
    { icon: Calendar, title: 'Next 7 Days', value: String(aptStats.next7 ?? 0), desc: 'Accepted this week', pageId: 'appointments' }
  ]

  const featureCards = [
    { icon: FileSearch, title: 'Smart Document Analyzer', desc: 'Upload and analyze legal documents', pageId: 'document-analyzer' },
    { icon: FileText, title: 'Legal Templates', desc: 'Access and download legal forms', pageId: 'legal-templates' },
    { icon: FolderCog, title: 'Case Tracking', desc: 'Monitor ongoing cases', pageId: 'case-tracking' },
    { icon: Search, title: 'Smart Legal Search', desc: 'Search acts, sections, and case laws', pageId: 'legal-search' }
  ]

  const openClientChat = (client) => {
    setChatTarget(client)
    setActivePage('chats')
  }

  const renderContent = () => {
    if (activePage === 'chats') {
      return (
        <Chat
          initialChat={chatTarget}
          onChatClosed={() => setChatTarget(null)}
        />
      )
    }

    if (activePage === 'document-analyzer') {
      return <DocumentAnalyzer />
    }

    if (activePage === 'legal-templates') {
      return <LegalTemplates />
    }

    if (activePage === 'case-tracking') {
      return <CaseTracking />
    }

    if (activePage === 'profile') {
      return <Profile />
    }

    if (activePage === 'appointments') {
      return (
        <LawyerAppointments
          user={user}
          onOpenChat={openClientChat}
          onStatsChange={setAptStats}
        />
      )
    }

    if (activePage === 'legal-search') {
      return <LegalSearch />
    }

    if (activePage === 'dashboard') {
      return (
        <div className="lawyer-dashboard-main">
          <h1 className="lawyer-page-title">Lawyer Dashboard</h1>
          <div className="lawyer-cards-row lawyer-cards-row-metrics">
            {metricCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="lawyer-card lawyer-metric-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePage(card.pageId)}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePage(card.pageId)}
                >
                  <Icon className="lawyer-card-icon" />
                  <h3 className="lawyer-card-title">{card.title}</h3>
                  <p className="lawyer-card-value">{card.value}</p>
                  <p className="lawyer-card-desc">{card.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="lawyer-cards-row lawyer-cards-row-features">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="lawyer-card lawyer-feature-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePage(card.pageId)}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePage(card.pageId)}
                >
                  <Icon className="lawyer-card-icon" />
                  <h3 className="lawyer-card-title">{card.title}</h3>
                  <p className="lawyer-card-desc">{card.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    const pageName = menuItems.find(item => item.id === activePage)?.name || activePage
    return (
      <div className="lawyer-empty-page">
        <h1 className="lawyer-empty-page-title">{pageName}</h1>
      </div>
    )
  }

  return (
    <div className="lawyer-dashboard-wrapper">
      <header className="lawyer-dashboard-header">
        <div className="lawyer-header-left">
          <button className="lawyer-menu-toggle" type="button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            ☰
          </button>
          <div className="logo-section">
            <div className="logo-icon-box">
              <img src={logo} alt="LawPal Logo" className="logo-icon" />
            </div>
            <span className="logo-text">LawPal</span>
          </div>
        </div>
        <div className="lawyer-header-right">
          <button className="lawyer-notification-btn" type="button">🔔</button>
          <AccountMenu
            initials={getInitials(getDisplayName(user))}
            onProfile={() => setActivePage('profile')}
            onLogout={handleLogout}
            triggerClassName="lawyer-user-profile"
          />
        </div>
      </header>

      <div className="lawyer-dashboard-body">
        <aside className={`lawyer-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="lawyer-sidebar-nav">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`lawyer-nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <IconComponent className="lawyer-nav-icon" />
                  <span className="lawyer-nav-text">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main ref={mainRef} className={`lawyer-dashboard-content ${activePage === 'chats' ? 'chat-view' : ''}`}>
          {renderContent()}
        </main>
      </div>

      <footer className="lawyer-dashboard-footer">
        <p>© 2025 LawPal. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LawyerDashboard
