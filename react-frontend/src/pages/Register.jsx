import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Register.css'

const API_URL = 'http://localhost/lawpal%20-%20AI%20Automation/lawpal-backend'

const SPECIALTIES = [
  'Family Law',
  'Criminal Law',
  'Civil Litigation',
  'Corporate Law',
  'Property & Land',
  'Constitutional Law',
  'Tax Law',
  'Labour & Employment',
  'Banking & Finance',
  "Women's Rights",
]

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'client',
    serial_no_hc: '',
    father_name: '',
    lc_enr_date: '',
    hc_enr_date: '',
    specialty: '',
    education: '',
    city: 'Lahore',
    gender: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isLawyer = formData.role === 'lawyer'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/register.php`, {
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
          setError(errorData.message || 'Registration failed')
        } catch {
          setError(`Server error: ${response.status}. Please check if Apache is running and the backend URL is correct.`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(`Network error: ${err.message}. Make sure XAMPP Apache is running and the backend is accessible at ${API_URL}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Register for LawPal</h1>
        <p className="register-subtitle">Create your account to access legal services.</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
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
                <label htmlFor="role">Select Your Role</label>
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
            </div>

            <div className="form-column">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@lawpal.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          {isLawyer && (
            <div className="lawyer-fields">
              <h3 className="lawyer-fields-title">High Court / Lawyer Details</h3>
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="serial_no_hc">Serial No (HC)</label>
                    <input
                      type="text"
                      id="serial_no_hc"
                      name="serial_no_hc"
                      value={formData.serial_no_hc}
                      onChange={handleChange}
                      placeholder="e.g. 94899"
                      required={isLawyer}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lc_enr_date">LC Enrolment Date</label>
                    <input
                      type="date"
                      id="lc_enr_date"
                      name="lc_enr_date"
                      value={formData.lc_enr_date}
                      onChange={handleChange}
                      required={isLawyer}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty">Specialty</label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      required={isLawyer}
                    >
                      <option value="">Select specialty</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                    />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="father_name">Father Name</label>
                    <input
                      type="text"
                      id="father_name"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                      placeholder="Father's name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hc_enr_date">HC Enrolment Date</label>
                    <input
                      type="date"
                      id="hc_enr_date"
                      name="hc_enr_date"
                      value={formData.hc_enr_date}
                      onChange={handleChange}
                      required={isLawyer}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g. LL.B (University of the Punjab)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="form-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="link-text">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
