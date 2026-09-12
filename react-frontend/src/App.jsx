import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LawyerDashboard from './pages/LawyerDashboard'
import AdminDashboard from './Pages/ADashboard'
import UserManagement from './Pages/UserManagement'
import Sidebar from './SideBarr'
import NavBar from './NavBar'
import './App.css'

const ADMIN_PAGES = ['dashboard', 'user-management']
const ADMIN_TAB_LABELS = {
  dashboard: 'Dashboard',
  'user-management': 'User Management',
}

function AdminApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabParam = new URLSearchParams(location.search).get('tab')
  const currentTab =
    tabParam && ADMIN_PAGES.includes(tabParam) ? tabParam : 'dashboard'
  const currentPage = ADMIN_TAB_LABELS[currentTab] || 'Dashboard'
  const [user, setUser] = useState(null);

  const setCurrentPage = (pageName) => {
    const tab =
      pageName === 'User Management' ? 'user-management' : 'dashboard'
    const params = new URLSearchParams()
    if (tab !== 'dashboard') {
      params.set('tab', tab)
    }
    const search = params.toString()
    navigate({
      pathname: location.pathname,
      search: search ? `?${search}` : '',
    })
  }

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  if (!user) {
    return null;
  }

  const renderPage = () => {
    switch (currentTab) {
      case 'user-management':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Navbar at top */}
      <NavBar />
      
      {/* Sidebar and Content */}
      <div className="app-content">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Main Content Area */}
        <div className="app-main">
          {/* Dashboard Content */}
          <main className="app-main-content">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
