import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarPlus, MessageCircle, FileSearch, BookOpen, Search, Shield, BarChart3, Heart, User, Map } from 'lucide-react'
import { getDisplayName, getInitials } from '../utils/displayName'
import logo from '../../assets/LOGOO.png'
import BookAppointment from './BookAppointment'
import Chat from './Chat'
import LegalQuiz from './LegalQuiz'
import DocumentAnalyzer from './DocumentAnalyzer'
import LegalTemplates from './LegalTemplates'
import WomenDedicated from './WomenDedicated'
import CaseTracking from './CaseTracking'
import Profile from './Profile'
import LegalSearch from './LegalSearch'
import LegalRoadmap from './LegalRoadmap'
import AccountMenu from '../components/AccountMenu'
import { useTabNavigation } from '../utils/useTabNavigation'
import './Dashboard.css'

const CLIENT_PAGES = [
  'dashboard',
  'book-appointment',
  'chat-lawyer',
  'women-dedicated',
  'legal-roadmap',
  'case-tracking',
  'document-analyzer',
  'legal-templates',
  'legal-search',
  'legal-quiz',
  'profile',
]

function Dashboard() {
  const [user, setUser] = useState(null)
  const [activePage, setActivePage] = useTabNavigation(CLIENT_PAGES, 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatTarget, setChatTarget] = useState(null)
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
    if (parsedUser.role === 'lawyer') {
      navigate('/lawyer-dashboard')
      return
    }
    setUser(parsedUser)
  }, [navigate])

  if (!user) {
    return null
  }

  // Get user initials — use shared helper from displayName

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'book-appointment', name: 'Book Appointment', icon: CalendarPlus },
    { id: 'chat-lawyer', name: 'Chat with Lawyer', icon: MessageCircle },
    { id: 'women-dedicated', name: "Women's Legal Support", icon: Heart },
    { id: 'legal-roadmap', name: 'Legal Roadmap', icon: Map },
    { id: 'case-tracking', name: 'Case Tracking', icon: BarChart3 },
    { id: 'document-analyzer', name: 'Document Analyzer', icon: FileSearch },
    { id: 'legal-templates', name: 'Legal Templates', icon: BookOpen },
    { id: 'legal-search', name: 'Legal Search', icon: Search },
    { id: 'legal-quiz', name: 'Legal Quiz', icon: Shield },
    { id: 'profile', name: 'Profile', icon: User }
  ]

  const features = [
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      icon: CalendarPlus,
      description: 'Schedule consultations with legal experts tailored to your needs.'
    },
    {
      id: 'women-dedicated',
      title: "Women's Legal Support",
      icon: Heart,
      description: 'Dedicated legal support and resources for women. Connect with experienced lawyers and get confidential, tailored guidance.'
    },
    {
      id: 'legal-roadmap',
      title: 'AI Legal Roadmap',
      icon: Map,
      description: 'Turn your problem into a step-by-step legal action plan with sections, documents, contacts, and a complaint draft.'
    },
    {
      id: 'chat-lawyer',
      title: 'Chat with Lawyer',
      icon: MessageCircle,
      description: 'Securely communicate with your assigned lawyer, share documents and updates.'
    },
    {
      id: 'document-analyzer',
      title: 'Smart Document Analyzer',
      icon: FileSearch,
      description: 'Upload legal documents for automated explanations and section breakdowns.'
    },
    {
      id: 'legal-templates',
      title: 'Legal Templates',
      icon: BookOpen,
      description: 'Access and download a variety of common legal document templates for your use.'
    },
    {
      id: 'case-tracking',
      title: 'Case Tracking',
      icon: BarChart3,
      description: 'Monitor the real-time progress and status of your active legal cases.'
    },
    {
      id: 'legal-search',
      title: 'Smart Legal Search',
      icon: Search,
      description: 'Intelligent search for legal acts, sections, and case laws for quick research.'
    },
    {
      id: 'legal-quiz',
      title: 'Quiz / Legal Awareness',
      icon: Shield,
      description: 'Enhance your legal knowledge with interactive quizzes and track your scores.'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const renderContent = () => {
    if (activePage === 'dashboard') {
      return (
        <div className="dashboard-main">
          <h1 className="page-title">Client Dashboard</h1>
          <p className="page-description">
            Welcome to your personal legal hub. Quickly access essential tools and resources designed to streamline your legal journey.
          </p>
          <div className="features-grid">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={feature.id} 
                  className="feature-card"
                  onClick={() => setActivePage(feature.id)}
                >
                  <IconComponent className="feature-icon" />
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    if (activePage === 'book-appointment') {
      return <BookAppointment 
        onOpenChat={(lawyer) => { setChatTarget(lawyer); setActivePage('chat-lawyer'); }} 
        initialLawyer={chatTarget}
      />
    }

    if (activePage === 'chat-lawyer') {
      return <Chat initialChat={chatTarget} onChatClosed={() => setChatTarget(null)} />
    }

    if (activePage === 'legal-quiz') {
      return <LegalQuiz />
    }

    if (activePage === 'document-analyzer') {
      return <DocumentAnalyzer />
    }

    if (activePage === 'legal-templates') {
      return <LegalTemplates />
    }

    if (activePage === 'women-dedicated') {
      return (
        <WomenDedicated
          onBookAppointment={(lawyer) => {
            setChatTarget(lawyer);
            setActivePage('book-appointment');
          }}
          onOpenChat={(lawyer) => {
            setChatTarget(lawyer);
            setActivePage('chat-lawyer');
          }}
        />
      )
    }

    if (activePage === 'legal-roadmap') {
      return (
        <LegalRoadmap
          onBookAppointment={(lawyer) => {
            setChatTarget(lawyer);
            setActivePage('book-appointment');
          }}
        />
      )
    }

    if (activePage === 'case-tracking') {
      return <CaseTracking />
    }

    if (activePage === 'profile') {
      return <Profile />
    }

    if (activePage === 'legal-search') {
      return <LegalSearch />
    }

    // For other pages, show just the page name centered
    const pageName = menuItems.find(item => item.id === activePage)?.name || activePage
    return (
      <div className="empty-page">
        <h1 className="empty-page-title">{pageName}</h1>
      </div>
    )
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="logo-section">
            <div className="logo-icon-box">
              <img src={logo} alt="LawPal Logo" className="logo-icon" />
            </div>
            <span className="logo-text">LawPal</span>
          </div>
        </div>
        <div className="header-right">
          <button className="notification-btn">🔔</button>
          <AccountMenu
            initials={getInitials(getDisplayName(user))}
            onProfile={() => setActivePage('profile')}
            onLogout={handleLogout}
            triggerClassName="user-profile"
          />
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <IconComponent className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`dashboard-content ${activePage === 'chat-lawyer' ? 'chat-view' : ''} ${activePage === 'women-dedicated' ? 'women-dedicated-view' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 LawPal. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Dashboard
