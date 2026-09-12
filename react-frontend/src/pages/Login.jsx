import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/LOGOO.png'
import './Login.css'

const API_URL = 'http://localhost/lawpal%20-%20AI%20Automation/lawpal-backend'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'client'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          setError(errorData.message || 'Login failed')
        } catch {
          setError(`Server error: ${response.status}. Please check if Apache is running and the backend URL is correct.`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        const u = data.user || {}
        if (u.fullName != null && (u.full_name == null || u.full_name === '')) {
          u.full_name = u.fullName
        }
        localStorage.setItem('user', JSON.stringify(u))
        // Route based on role
        if (data.user.role === 'admin') {
          navigate('/admin')
        } else if (data.user.role === 'lawyer') {
          navigate('/lawyer-dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(`Network error: ${err.message}. Make sure XAMPP Apache is running and the backend is accessible at ${API_URL}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to LawPal</h1>
          <p className="welcome-description">
            Your intelligent legal assistant designed to streamline processes and enhance access to legal services with professionalism and clarity.
          </p>
          <div className="justice-scales">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Pillar with base */}
              <rect x="138" y="60" width="24" height="200" fill="#B0BEC5" rx="3"/>
              <rect x="130" y="260" width="40" height="10" fill="#B0BEC5" rx="2"/>
              <rect x="140" y="55" width="20" height="10" fill="#B0BEC5" rx="2"/>
              <circle cx="150" cy="50" r="6" fill="#B0BEC5"/>
              
              {/* Horizontal Beam */}
              <rect x="50" y="80" width="200" height="14" fill="#B0BEC5" rx="7"/>
              
              {/* C-shaped Hooks at beam ends */}
              <path d="M 50 80 Q 45 85 50 90" stroke="#B0BEC5" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M 250 80 Q 255 85 250 90" stroke="#B0BEC5" strokeWidth="3" fill="none" strokeLinecap="round"/>
              
              {/* Left Pan (Empty, Elevated) - Golden */}
              <ellipse cx="70" cy="110" rx="38" ry="12" fill="#FCD34D"/>
              <path d="M 32 110 Q 32 128 50 136 Q 68 142 70 142 Q 72 142 90 136 Q 108 128 108 110" 
                    stroke="#FCD34D" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <ellipse cx="70" cy="110" rx="35" ry="10" fill="#FCD34D" opacity="0.95"/>
              {/* Golden Chain */}
              <line x1="50" y1="90" x2="70" y2="110" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round"/>
              
              {/* Right Pan (With Document, Lower) - Golden */}
              <ellipse cx="230" cy="130" rx="38" ry="12" fill="#FCD34D"/>
              <path d="M 192 130 Q 192 148 210 156 Q 228 162 230 162 Q 232 162 250 156 Q 268 148 268 130" 
                    stroke="#FCD34D" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <ellipse cx="230" cy="130" rx="35" ry="10" fill="#FCD34D" opacity="0.95"/>
              {/* Golden Chain */}
              <line x1="250" y1="90" x2="230" y2="130" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round"/>
              
              {/* Document in Right Pan */}
              <rect x="215" y="135" width="30" height="40" fill="#FFFFFF" rx="2" transform="rotate(-5 230 155)"/>
              <line x1="220" y1="145" x2="240" y2="143" stroke="#9CA3AF" strokeWidth="1.2"/>
              <line x1="220" y1="152" x2="240" y2="150" stroke="#9CA3AF" strokeWidth="1.2"/>
              <line x1="220" y1="159" x2="240" y2="157" stroke="#9CA3AF" strokeWidth="1.2"/>
              <line x1="220" y1="166" x2="240" y2="164" stroke="#9CA3AF" strokeWidth="1.2"/>
              <line x1="220" y1="173" x2="235" y2="171" stroke="#9CA3AF" strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <div className="logo-section">
            <div className="logo-icon-box">
              <img src={logo} alt="LawPal Logo" className="logo-image" />
            </div>
            <h1 className="logo-text">LawPal</h1>
          </div>
          <h2 className="form-title">Sign In to Your Account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="client">Client</option>
                <option value="lawyer">Lawyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="form-links">
            <Link to="/register" className="link-text">
              Don't have an account? Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
