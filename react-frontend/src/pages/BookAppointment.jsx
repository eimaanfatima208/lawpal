import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Calendar, Clock, Trash2, MessageCircle } from 'lucide-react'
import './BookAppointment.css'

const API_BASE = '/api'
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
]

// Prefer full name; only hide email and use fallback when no real name
function lawyerDisplayName(lawyer) {
  const name = lawyer?.full_name || lawyer?.fullName || ''
  if (!name || String(name).includes('@')) return 'Lawyer'
  return name
}

function BookAppointment({ onOpenChat, initialLawyer }) {
  const [user, setUser] = useState(null)
  const [lawyers, setLawyers] = useState([])
  const [lawyersError, setLawyersError] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [selectedLawyer, setSelectedLawyer] = useState(initialLawyer || null)
  const [appointments, setAppointments] = useState([])
  const [allAppointments, setAllAppointments] = useState([]) // All appointments for availability check
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [alertModal, setAlertModal] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    fetchLawyers()
  }, [])

  useEffect(() => {
    if (initialLawyer) {
      setSelectedLawyer(initialLawyer)
    }
  }, [initialLawyer])

  useEffect(() => {
    if (user?.id) fetchAppointments()
  }, [user?.id])

  // Live updates for status changes from lawyer
  useEffect(() => {
    if (!user?.id) return
    const t = setInterval(fetchAppointments, 4000)
    return () => clearInterval(t)
  }, [user?.id])

  const fetchLawyers = async () => {
    try {
      setLawyersError(null)
      const res = await fetch(`${API_BASE}/lawyers`)
      const data = await res.json()
      if (data.success && Array.isArray(data.lawyers)) {
        setLawyers(data.lawyers)
      } else {
        setLawyersError('Could not load lawyers.')
      }
    } catch (err) {
      setLawyersError('Could not connect to server. Make sure the backend is running (npm start from project root).')
    }
  }

  const fetchAppointments = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`${API_BASE}/appointments/${user.id}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments)
      }
    } catch (_) {}
  }

  // Fetch all appointments for availability checking
  const fetchAllAppointments = async (lawyerId, date) => {
    if (!lawyerId || !date) {
      setAllAppointments([])
      return
    }
    try {
      // Try to fetch appointments for the specific lawyer and date
      const res = await fetch(`${API_BASE}/appointments/availability?lawyerId=${lawyerId}&date=${date}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.appointments)) {
        setAllAppointments(data.appointments)
      } else {
        // Fallback: if endpoint doesn't exist, use empty array
        setAllAppointments([])
      }
    } catch (err) {
      // If endpoint doesn't exist, we'll check on booking
      setAllAppointments([])
    }
  }

  const filteredLawyers = lawyers.filter(l =>
    !searchName.trim() || (l.full_name || '').toLowerCase().includes(searchName.toLowerCase())
  )

  const handleBookAppointment = async () => {
    if (!user?.id) {
      setAlertModal({
        type: 'error',
        title: 'Login Required',
        message: 'Please log in as a Client to book a lawyer. Refresh the page if you already logged in.',
      })
      return
    }
    if (user.role && user.role !== 'client') {
      setAlertModal({
        type: 'error',
        title: 'Client Account Required',
        message: 'Only client accounts can book appointments. Log in with role "Client".',
      })
      return
    }
    if (!selectedLawyer?.id) {
      setAlertModal({
        type: 'error',
        title: 'Select a Lawyer',
        message: 'Please select a lawyer first.',
      })
      return
    }
    if (!selectedDate || !selectedSlot) {
      setAlertModal({
        type: 'error',
        title: 'Select Date & Time',
        message: 'Please choose an appointment date and time slot.',
      })
      return
    }

    // Check if current user already has ANY appointment at this date/time (any lawyer)
    const normalizedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate
    const normalizedTime = normalizeTime(selectedSlot)
    const userBookedSameSlot = appointments.some(apt => {
      if (apt.status === 'cancelled' || apt.status === 'rejected') return false
      const aptDate = apt.date ? (apt.date.includes('T') ? apt.date.split('T')[0] : apt.date) : ''
      const aptTime = normalizeTime(apt.time || '')
      return aptDate === normalizedDate && aptTime === normalizedTime
    })
    
    if (userBookedSameSlot) {
      setAlertModal({ 
        type: 'error', 
        title: 'Already Booked', 
        message: 'You already have an appointment at this date and time. Please choose a different slot.' 
      })
      return
    }

    // Check if slot is booked by any user
    if (checkDuplicateBooking(selectedLawyer.id, selectedDate, selectedSlot)) {
      setAlertModal({ 
        type: 'error', 
        title: 'Slot Unavailable', 
        message: 'This time slot is already booked by another user. Please choose a different time.' 
      })
      return
    }

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId: Number(user.id),
          lawyerId: Number(selectedLawyer.id),
          date: normalizedDate,
          time: selectedSlot,
        })
      })
      const data = await res.json()
      if (data.success) {
        setAlertModal({ type: 'success', title: 'Request Sent!', message: 'Appointment request sent. Waiting for lawyer approval.' })
        setSelectedLawyer(null)
        setSelectedDate('')
        setSelectedSlot(null)
        setAllAppointments([])
        fetchAppointments()
      } else {
        const errorMessage = data.message || 'Failed to book.'
        if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('booked') || errorMessage.toLowerCase().includes('unavailable')) {
          setAlertModal({ type: 'error', title: 'Cannot Book', message: errorMessage })
        } else {
          setAlertModal({ type: 'error', title: 'Error', message: errorMessage })
        }
      }
    } catch (err) {
      setAlertModal({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not reach server. Make sure LawPal is running at http://localhost:3001'
      })
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!user?.id) return
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      const data = await res.json()
      if (data.success) {
        setAlertModal({ type: 'success', title: 'Cancelled', message: 'Appointment cancelled.' })
        fetchAppointments()
      } else {
        setAlertModal({ type: 'error', title: 'Error', message: data.message || 'Failed to cancel.' })
      }
    } catch (err) {
      setAlertModal({ type: 'error', title: 'Error', message: 'Could not cancel appointment.' })
    }
  }

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    
    // Handle ISO format strings like "2002-03-19T19:00:00.000Z" or "2002-03-19"
    let date = String(dateStr)
    
    // Extract just the date part (before 'T' if present)
    if (date.includes('T')) {
      date = date.split('T')[0]
    }
    
    // Remove timezone if present
    date = date.replace(/Z$/, '').trim()
    
    // Parse and format the date
    try {
      const dateObj = new Date(date + 'T00:00:00') // Add time to ensure proper parsing
      if (isNaN(dateObj.getTime())) {
        // If parsing fails, try to format the string directly
        const parts = date.split('-')
        if (parts.length === 3) {
          const year = parts[0]
          const month = parseInt(parts[1], 10)
          const day = parseInt(parts[2], 10)
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          return `${monthNames[month - 1]} ${day}, ${year}`
        }
        return date
      }
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (e) {
      return date
    }
  }

  const formatTimeDisplay = (t) => {
    if (!t) return ''
    
    // Handle ISO format strings like "19:00:00.000Z" or "19:00:00" or full ISO datetime
    let timeStr = String(t)
    
    // If it's a full ISO datetime, extract just the time part
    if (timeStr.includes('T')) {
      const timePart = timeStr.split('T')[1]
      if (timePart) {
        timeStr = timePart
      }
    }
    
    // Remove timezone and milliseconds if present
    timeStr = timeStr.replace(/\.\d{3}Z?$/, '').replace(/Z$/, '').trim()
    
    // If already in AM/PM format, return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr
    
    // Parse time string
    const parts = timeStr.split(':')
    if (parts.length < 2) return timeStr
    
    const h = parseInt(parts[0], 10)
    const m = parts[1] || '00'
    
    // Handle invalid hours
    if (isNaN(h) || h < 0 || h > 23) return timeStr
    
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    const minutes = m.split('.')[0] || m // Remove any decimal seconds
    
    return `${String(h12).padStart(2, '0')}:${minutes.padStart(2, '0')} ${ampm}`
  }

  // Normalize time format for comparison
  const normalizeTime = (timeStr) => {
    if (!timeStr) return ''
    let time = String(timeStr)
    
    // If already in AM/PM format, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time.trim()
    }
    
    // Handle ISO format
    if (time.includes('T')) {
      const timePart = time.split('T')[1]
      if (timePart) {
        time = timePart
      }
    }
    
    // Remove timezone and milliseconds
    time = time.replace(/\.\d{3}Z?$/, '').replace(/Z$/, '').trim()
    
    // Convert 24h to 12h format
    const parts = time.split(':')
    if (parts.length < 2) return time
    
    const h = parseInt(parts[0], 10)
    const m = parts[1] || '00'
    
    if (isNaN(h) || h < 0 || h > 23) return time
    
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    const minutes = m.split('.')[0] || m
    
    return `${String(h12).padStart(2, '0')}:${minutes.padStart(2, '0')} ${ampm}`
  }

  // Check if a time slot is already booked: by anyone for this lawyer, OR by current user at this date/time (any lawyer)
  const isSlotBooked = (slot, lawyerId, date) => {
    if (!lawyerId || !date) return false
    
    const normalizedSlot = normalizeTime(slot)
    const normalizedDate = date.includes('T') ? date.split('T')[0] : date
    
    // This lawyer's slot is taken by any user
    const isBookedByAnyone = allAppointments.some(apt => {
      const aptLawyerId = apt.lawyer_id || apt.lawyerId
      const aptDate = apt.date ? (apt.date.includes('T') ? apt.date.split('T')[0] : apt.date) : ''
      const aptTime = normalizeTime(apt.time || apt.date)
      return aptLawyerId === lawyerId && aptDate === normalizedDate && aptTime === normalizedSlot
    })
    
    // Current user already has ANY active appointment at this date/time (with any lawyer)
    const userHasSlot = appointments.some(apt => {
      if (apt.status === 'cancelled' || apt.status === 'rejected') return false
      const aptDate = apt.date ? (apt.date.includes('T') ? apt.date.split('T')[0] : apt.date) : ''
      const aptTime = normalizeTime(apt.time || apt.date)
      return aptDate === normalizedDate && aptTime === normalizedSlot
    })
    
    return isBookedByAnyone || userHasSlot
  }

  // Check if booking already exists: current user has this slot (any lawyer) OR any user has this lawyer's slot
  const checkDuplicateBooking = (lawyerId, date, time) => {
    if (!lawyerId || !date || !time) return false
    
    const normalizedTime = normalizeTime(time)
    const normalizedDate = date.includes('T') ? date.split('T')[0] : date
    
    // Current user already has ANY active appointment at this date/time
    const userBookedSlot = appointments.some(apt => {
      if (apt.status === 'cancelled' || apt.status === 'rejected') return false
      const aptDate = apt.date ? (apt.date.includes('T') ? apt.date.split('T')[0] : apt.date) : ''
      const aptTime = normalizeTime(apt.time || apt.date)
      return aptDate === normalizedDate && aptTime === normalizedTime
    })
    
    // This lawyer's slot is already booked by any user
    const anyoneBooked = allAppointments.some(apt => {
      const aptLawyerId = apt.lawyer_id || apt.lawyerId
      const aptDate = apt.date ? (apt.date.includes('T') ? apt.date.split('T')[0] : apt.date) : ''
      const aptTime = normalizeTime(apt.time || apt.date)
      return aptLawyerId === lawyerId && aptDate === normalizedDate && aptTime === normalizedTime
    })
    
    return userBookedSlot || anyoneBooked
  }

  const visibleAppointments = appointments.filter(
    (apt) => apt.status !== 'cancelled' && apt.status !== 'rejected'
  )

  return (
    <div className="book-appointment-container">
      <section className="section">
        <h1 className="section-title">Find a Lawyer</h1>
        <p className="section-subtitle">Search and book appointments with qualified lawyers.</p>

        <div className="search-box">
          <div className="search-filters">
            <div className="filter-item" style={{ flex: 1 }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {lawyersError && (
          <p className="no-results lawyers-error-text">{lawyersError}</p>
        )}

        <h2 className="available-lawyers-heading">Available Lawyers</h2>

        <div className="lawyers-grid">
          {!lawyersError && filteredLawyers.length === 0 && lawyers.length > 0 && (
            <div className="no-results"><p>No lawyers match your search.</p></div>
          )}
          {!lawyersError && filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="lawyer-card">
              <div className="lawyer-avatar">
                {(lawyerDisplayName(lawyer) || 'L').charAt(0).toUpperCase()}
              </div>
              <h3 className="lawyer-name">{lawyerDisplayName(lawyer)}</h3>
              <p className="lawyer-specialization">{lawyer.specialty || 'Legal Professional'}</p>
              {(lawyer.city || lawyer.location) && (
                <div className="lawyer-info">
                  <MapPin className="info-icon" size={16} />
                  <span>{lawyer.city || lawyer.location}</span>
                </div>
              )}
              <div className="lawyer-card-buttons">
                <button
                  type="button"
                  className="btn-view-profile"
                  onClick={() => {
                    setSelectedLawyer(lawyer)
                    // Reset date and appointments when lawyer is selected
                    setSelectedDate('')
                    setSelectedSlot(null)
                    setAllAppointments([])
                  }}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className="btn-chat"
                  onClick={() => onOpenChat && onOpenChat(lawyer)}
                >
                  <MessageCircle className="btn-chat-icon" size={16} />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">My Appointments</h2>
        <div className="appointments-grid">
          {visibleAppointments.length === 0 && (
            <div className="no-results"><p>No appointments yet.</p></div>
          )}
          {visibleAppointments.map((apt) => (
            <div key={apt.appointment_id} className="appointment-card">
              <div className="appointment-header">
                <div className="appointment-avatar">
                  {(apt.lawyer_name || 'L').charAt(0).toUpperCase()}
                </div>
                <div className="appointment-info">
                  <h4 className="appointment-lawyer-name">{apt.lawyer_name || 'Lawyer'}</h4>
                  <p className={`appointment-status-badge status-${apt.status || 'pending'}`}>
                    {(apt.status || 'pending').charAt(0).toUpperCase() + (apt.status || 'pending').slice(1)}
                  </p>
                </div>
              </div>
              <div className="appointment-details">
                <div className="appointment-detail-item">
                  <Calendar className="detail-icon" size={16} />
                  <span>{formatDateDisplay(apt.date)}</span>
                </div>
                <div className="appointment-detail-item">
                  <Clock className="detail-icon" size={16} />
                  <span>{formatTimeDisplay(apt.time || apt.date)}</span>
                </div>
              </div>
              {(apt.status === 'pending' || apt.status === 'accepted' || !apt.status) && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => handleCancelAppointment(apt.appointment_id)}
                >
                  <Trash2 className="trash-icon" size={16} />
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {selectedLawyer && (
        <div className="modal-overlay" onClick={() => setSelectedLawyer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Lawyer Profile</h2>
              <button className="modal-close-btn" onClick={() => setSelectedLawyer(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {(lawyerDisplayName(selectedLawyer) || 'L').charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{lawyerDisplayName(selectedLawyer)}</h2>
                  <p className="profile-specialization">
                    {selectedLawyer.specialty || 'Legal Professional'}
                  </p>
                  {selectedLawyer.education && (
                    <p className="profile-meta">{selectedLawyer.education}</p>
                  )}
                  {(selectedLawyer.city || selectedLawyer.serial_no_hc) && (
                    <p className="profile-meta">
                      {[selectedLawyer.city, selectedLawyer.serial_no_hc && `HC #${selectedLawyer.serial_no_hc}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-chat-from-modal"
                  onClick={() => {
                    onOpenChat && onOpenChat(selectedLawyer)
                    setSelectedLawyer(null)
                  }}
                >
                  <MessageCircle size={18} />
                  Chat
                </button>
                <button className="btn-close-modal" onClick={() => setSelectedLawyer(null)}>
                  Close
                </button>
              </div>
              <div className="form-group" style={{ marginTop: 24 }}>
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedSlot(null) // Reset slot when date changes
                    // Fetch all appointments for availability when date is selected
                    if (selectedLawyer?.id && e.target.value) {
                      fetchAllAppointments(selectedLawyer.id, e.target.value)
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select Time</label>
                <div className="time-slots">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = isSlotBooked(slot, selectedLawyer?.id, selectedDate)
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={`time-slot-btn ${selectedSlot === slot ? 'active' : ''} ${isBooked ? 'booked' : ''}`}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        title={isBooked ? 'This time slot is already booked' : ''}
                      >
                        <Clock className="clock-icon" size={16} />
                        {slot}
                        {isBooked && <span className="booked-badge">Booked</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button
                type="button"
                className="btn-book"
                disabled={!selectedDate || !selectedSlot}
                onClick={handleBookAppointment}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {alertModal && (
        <div className="modal-overlay" onClick={() => setAlertModal(null)}>
          <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="alert-modal-header">
              <div className="alert-modal-icon-wrapper">
                <div className={alertModal.type === 'success' ? 'alert-icon-success' : alertModal.type === 'error' ? 'alert-icon-error' : 'alert-icon-confirm'}>
                  <span className="alert-icon">{alertModal.type === 'success' ? '✓' : alertModal.type === 'error' ? '✕' : '?'}</span>
                </div>
              </div>
              <h3 className="alert-modal-title">{alertModal.title}</h3>
            </div>
            <div className="alert-modal-body">
              <p className="alert-modal-message">{alertModal.message}</p>
            </div>
            <div className="alert-modal-footer">
              <button className="alert-btn-confirm" onClick={() => setAlertModal(null)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookAppointment
