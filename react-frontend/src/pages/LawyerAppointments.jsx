import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check,
  X,
  MessageCircle,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import './LawyerAppointments.css'

const API_BASE = import.meta.env.VITE_CHAT_API_URL || '/api'
const POLL_MS = 3000

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function toDateKey(dateStr) {
  if (!dateStr) return ''
  const s = String(dateStr)
  return s.includes('T') ? s.split('T')[0] : s.slice(0, 10)
}

function formatDateDisplay(dateStr) {
  const key = toDateKey(dateStr)
  if (!key) return ''
  const [y, m, d] = key.split('-').map(Number)
  if (!y || !m || !d) return key
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimeDisplay(t) {
  if (!t) return ''
  const s = String(t)
  if (/AM|PM/i.test(s)) return s.trim()
  const parts = s.split(':')
  if (parts.length < 2) return s
  const h = parseInt(parts[0], 10)
  const m = String(parts[1]).padStart(2, '0').slice(0, 2)
  if (isNaN(h)) return s
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${String(h12).padStart(2, '0')}:${m} ${ampm}`
}

function todayKey() {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
}

function buildMonthDays(year, month) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function LawyerAppointments({ user, onOpenChat, onStatsChange }) {
  const lawyerId = user?.id
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionId, setActionId] = useState(null)
  const [toast, setToast] = useState(null)
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date()
    return { year: n.getFullYear(), month: n.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [filter, setFilter] = useState('pending')

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3200)
  }

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!lawyerId) return
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/appointments/${lawyerId}?role=lawyer`)
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to load appointments')
        return
      }
      const list = Array.isArray(data.appointments) ? data.appointments : []
      setAppointments(list)
      setError(null)
      if (onStatsChange) {
        const pending = list.filter((a) => a.status === 'pending').length
        const upcoming = list.filter((a) => {
          if (a.status !== 'accepted') return false
          return toDateKey(a.date) >= todayKey()
        }).length
        const next7End = new Date()
        next7End.setDate(next7End.getDate() + 7)
        const next7Key = `${next7End.getFullYear()}-${String(next7End.getMonth() + 1).padStart(2, '0')}-${String(next7End.getDate()).padStart(2, '0')}`
        const next7 = list.filter((a) => {
          if (a.status !== 'accepted') return false
          const d = toDateKey(a.date)
          return d >= todayKey() && d <= next7Key
        }).length
        onStatsChange({ pending, upcoming, next7 })
      }
    } catch (_) {
      setError('Could not connect to server. Make sure the backend is running.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [lawyerId, onStatsChange])

  useEffect(() => {
    fetchAppointments(false)
    const timer = setInterval(() => fetchAppointments(true), POLL_MS)
    return () => clearInterval(timer)
  }, [fetchAppointments])

  const updateStatus = async (appointmentId, status) => {
    if (!lawyerId) return
    setActionId(appointmentId)
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: lawyerId, status }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', status === 'accepted' ? 'Appointment accepted' : status === 'rejected' ? 'Request rejected' : 'Appointment updated')
        await fetchAppointments(true)
      } else {
        showToast('error', data.message || 'Action failed')
      }
    } catch (_) {
      showToast('error', 'Could not update appointment')
    } finally {
      setActionId(null)
    }
  }

  const pending = useMemo(
    () => appointments.filter((a) => a.status === 'pending').sort((a, b) => `${toDateKey(a.date)} ${a.time}`.localeCompare(`${toDateKey(b.date)} ${b.time}`)),
    [appointments]
  )

  const accepted = useMemo(
    () => appointments.filter((a) => a.status === 'accepted'),
    [appointments]
  )

  const datesWithAppointments = useMemo(() => {
    const map = {}
    accepted.forEach((a) => {
      const k = toDateKey(a.date)
      if (!map[k]) map[k] = 0
      map[k] += 1
    })
    pending.forEach((a) => {
      const k = toDateKey(a.date)
      if (!map[k]) map[k] = 0
    })
    return map
  }, [accepted, pending])

  const daySchedule = useMemo(() => {
    return accepted
      .filter((a) => toDateKey(a.date) === selectedDate)
      .sort((a, b) => String(a.time).localeCompare(String(b.time)))
  }, [accepted, selectedDate])

  const filteredList = useMemo(() => {
    if (filter === 'pending') return pending
    if (filter === 'accepted') {
      return accepted
        .filter((a) => toDateKey(a.date) >= todayKey())
        .sort((a, b) => `${toDateKey(a.date)} ${a.time}`.localeCompare(`${toDateKey(b.date)} ${b.time}`))
    }
    return appointments
      .filter((a) => a.status === 'rejected' || a.status === 'cancelled')
      .sort((a, b) => `${toDateKey(b.date)} ${b.time}`.localeCompare(`${toDateKey(a.date)} ${a.time}`))
  }, [filter, pending, accepted, appointments])

  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const monthDays = buildMonthDays(viewMonth.year, viewMonth.month)

  const shiftMonth = (delta) => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div className="lawyer-appointments-page">
      {toast && (
        <div className={`lawyer-apt-toast lawyer-apt-toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="lawyer-apt-header">
        <div>
          <h1 className="lawyer-apt-title">Appointments</h1>
          <p className="lawyer-apt-subtitle">
            Live requests from clients — updates every few seconds
          </p>
        </div>
        <button
          type="button"
          className="lawyer-apt-refresh"
          onClick={() => fetchAppointments(false)}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="lawyer-apt-stats">
        <div className="lawyer-apt-stat">
          <span className="lawyer-apt-stat-value">{pending.length}</span>
          <span className="lawyer-apt-stat-label">Pending</span>
        </div>
        <div className="lawyer-apt-stat">
          <span className="lawyer-apt-stat-value">
            {accepted.filter((a) => toDateKey(a.date) >= todayKey()).length}
          </span>
          <span className="lawyer-apt-stat-label">Upcoming</span>
        </div>
        <div className="lawyer-apt-stat">
          <span className="lawyer-apt-stat-value">{daySchedule.length}</span>
          <span className="lawyer-apt-stat-label">On selected day</span>
        </div>
      </div>

      {error && (
        <div className="lawyer-apt-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="lawyer-appointments-layout">
        <section className="lawyer-pending-section">
          <div className="lawyer-apt-tabs">
            <button
              type="button"
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending ({pending.length})
            </button>
            <button
              type="button"
              className={filter === 'accepted' ? 'active' : ''}
              onClick={() => setFilter('accepted')}
            >
              Accepted
            </button>
            <button
              type="button"
              className={filter === 'history' ? 'active' : ''}
              onClick={() => setFilter('history')}
            >
              History
            </button>
          </div>

          <div className="lawyer-pending-list">
            {loading && appointments.length === 0 && (
              <div className="lawyer-apt-empty">Loading appointments…</div>
            )}
            {!loading && filteredList.length === 0 && (
              <div className="lawyer-apt-empty">
                {filter === 'pending'
                  ? 'No pending requests right now.'
                  : filter === 'accepted'
                    ? 'No upcoming accepted appointments.'
                    : 'No rejected or cancelled appointments.'}
              </div>
            )}
            {filteredList.map((req) => (
              <div key={req.appointment_id} className={`lawyer-pending-card status-${req.status}`}>
                <div className="lawyer-pending-card-header">
                  <div className="lawyer-pending-avatar">{getInitials(req.client_name)}</div>
                  <div className="lawyer-pending-meta">
                    <span className="lawyer-pending-client-name">{req.client_name}</span>
                    <span className={`lawyer-pending-status-badge status-${req.status}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
                <div className="lawyer-pending-details">
                  <p className="lawyer-pending-date">
                    <Calendar size={14} /> Date: {formatDateDisplay(req.date)}
                  </p>
                  <p className="lawyer-pending-time">
                    <Clock size={14} /> Time: {formatTimeDisplay(req.time)}
                  </p>
                  {req.notes ? (
                    <p className="lawyer-pending-message">{req.notes}</p>
                  ) : (
                    <p className="lawyer-pending-message muted">Consultation request</p>
                  )}
                </div>
                <div className="lawyer-pending-actions">
                  {req.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="lawyer-pending-btn lawyer-pending-btn-accept"
                        disabled={actionId === req.appointment_id}
                        onClick={() => updateStatus(req.appointment_id, 'accepted')}
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      <button
                        type="button"
                        className="lawyer-pending-btn lawyer-pending-btn-reject"
                        disabled={actionId === req.appointment_id}
                        onClick={() => updateStatus(req.appointment_id, 'rejected')}
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <button
                      type="button"
                      className="lawyer-pending-btn lawyer-pending-btn-reject"
                      disabled={actionId === req.appointment_id}
                      onClick={() => updateStatus(req.appointment_id, 'cancelled')}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    className="lawyer-pending-btn lawyer-pending-btn-chat"
                    onClick={() =>
                      onOpenChat &&
                      onOpenChat({
                        id: req.citizen_id,
                        full_name: req.client_name,
                        role: 'client',
                      })
                    }
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="lawyer-schedule-section">
          <h2 className="lawyer-schedule-title">My Schedule</h2>
          <div className="lawyer-schedule-calendar">
            <div className="lawyer-calendar-header">
              <button type="button" className="cal-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <span className="lawyer-calendar-month">{monthLabel}</span>
              <button type="button" className="cal-nav" onClick={() => shiftMonth(1)} aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="lawyer-calendar-days">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="lawyer-calendar-grid">
              {monthDays.map((d, idx) => {
                if (d == null) return <span key={`e-${idx}`} className="lawyer-calendar-day empty" />
                const key = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                const has = datesWithAppointments[key] > 0
                const hasPending = pending.some((a) => toDateKey(a.date) === key)
                const isSelected = selectedDate === key
                const isToday = key === todayKey()
                return (
                  <button
                    key={key}
                    type="button"
                    className={[
                      'lawyer-calendar-day',
                      isSelected ? 'selected' : '',
                      isToday ? 'today' : '',
                      has ? 'has-apt' : '',
                      hasPending ? 'has-pending' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelectedDate(key)}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lawyer-day-schedule">
            <h3 className="lawyer-day-title">{formatDateDisplay(selectedDate)}</h3>
            {daySchedule.length === 0 ? (
              <p className="lawyer-day-empty">No accepted appointments this day.</p>
            ) : (
              <ul className="lawyer-day-list">
                {daySchedule.map((a) => (
                  <li key={a.appointment_id}>
                    <span className="day-time">{formatTimeDisplay(a.time)}</span>
                    <span className="day-client">{a.client_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
