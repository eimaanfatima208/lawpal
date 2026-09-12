import { useState } from 'react'
import {
  Map,
  Loader2,
  Copy,
  Download,
  ExternalLink,
  Phone,
  Scale,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import './LegalRoadmap.css'

const API_BASE = '/api'
const MOHTASIB_URL =
  'https://www.mohtasib.gov.pk/Detail/NWRkZDJmMTYtZmRiOC00MTAyLTk2ZDItZGVlNTkxMTdmNTEz'

export default function LegalRoadmap({ onBookAppointment }) {
  const [gender, setGender] = useState('female')
  const [city, setCity] = useState('Lahore')
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const userRaw = localStorage.getItem('user')
      const user = userRaw ? JSON.parse(userRaw) : null
      const res = await fetch(`${API_BASE}/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problem.trim(),
          city: city.trim() || 'Lahore',
          gender,
          userId: user?.id,
          userName: user?.full_name || user?.name || 'User',
        }),
      })
      const data = await res.json()
      if (!data.success && data.message) {
        setError(data.message)
      } else {
        setResult(data)
      }
    } catch (_) {
      setError('Could not reach the roadmap service. Check that the API and n8n are running.')
    } finally {
      setLoading(false)
    }
  }

  const copyComplaint = async (lang) => {
    if (!result) return
    const text =
      lang === 'ur'
        ? result.complaint_draft_ur || ''
        : result.complaint_draft_en || ''
    if (!text.trim()) {
      setError(lang === 'ur' ? 'Urdu draft is empty.' : 'English draft is empty.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(lang)
      setTimeout(() => setCopied(null), 2000)
    } catch (_) {
      setError('Could not copy to clipboard.')
    }
  }

  const downloadComplaint = () => {
    if (!result) return
    const text = [
      `Case: ${result.case_title || ''}`,
      `City: ${result.city || city}`,
      '',
      'Complaint (EN)',
      result.complaint_draft_en || '',
      '',
      'شکایت (UR)',
      result.complaint_draft_ur || '',
      '',
      `File online: ${result.complaint_portal?.url || MOHTASIB_URL}`,
      '',
      result.disclaimer || '',
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lawpal-complaint-draft.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <div className="roadmap-header-icon">
          <Map size={28} />
        </div>
        <div>
          <h1 className="roadmap-title">AI Legal Roadmap Generator</h1>
          <p className="roadmap-subtitle">
            Describe your problem. LawPal builds a step-by-step legal action plan —
            sections, documents, contacts, and a complaint draft.
          </p>
        </div>
      </div>

      <div className="roadmap-form-card">
        <div className="roadmap-form-row">
          <label>
            Your gender
            <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={loading}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="not_specified">Prefer not to say</option>
            </select>
          </label>
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lahore"
              disabled={loading}
            />
          </label>
        </div>
        <label className="roadmap-problem-label">
          What happened? / کیا ہوا؟
          <textarea
            dir="auto"
            rows={5}
            maxLength={4000}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: My husband stopped paying child support three months ago..."
            disabled={loading}
          />
        </label>
        <button
          type="button"
          className="roadmap-generate-btn"
          onClick={generate}
          disabled={loading || problem.trim().length < 10}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={18} /> Generating roadmap…
            </>
          ) : (
            <>
              <Map size={18} /> Generate Legal Roadmap
            </>
          )}
        </button>
      </div>

      {error && <div className="roadmap-error">{error}</div>}

      {result && (
        <div className="roadmap-results">
          <div className="roadmap-summary-card">
            <div className="roadmap-summary-top">
              <h2>{result.case_title || 'Legal Roadmap'}</h2>
              <span className={`urgency-badge urgency-${result.urgency || 'medium'}`}>
                {(result.urgency || 'medium').toUpperCase()}
              </span>
            </div>
            <p className="roadmap-summary-text">{result.summary}</p>
            <div className="roadmap-meta">
              <span>Category: {result.category || 'general'}</span>
              <span>City: {result.city || city}</span>
              {result.timeline_estimate && <span>Timeline: {result.timeline_estimate}</span>}
            </div>
          </div>

          {Array.isArray(result.steps) && result.steps.length > 0 && (
            <section className="roadmap-section">
              <h3>
                <CheckCircle2 size={18} /> Action steps
              </h3>
              <ol className="roadmap-steps">
                {result.steps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {Array.isArray(result.applicable_sections) && result.applicable_sections.length > 0 && (
            <section className="roadmap-section">
              <h3>
                <Scale size={18} /> Possible sections / charges
              </h3>
              <p className="roadmap-note">Preliminary guidance — confirm with a lawyer or police.</p>
              <div className="roadmap-sections-grid">
                {result.applicable_sections.map((s, i) => (
                  <div key={i} className="section-card">
                    <div className="section-code">{s.section}</div>
                    <div className="section-title">{s.title}</div>
                    <p>{s.why}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="roadmap-section complaint-section">
            <h3>
              <FileText size={18} /> File complaint
            </h3>
            <p>
              <strong>Where to file:</strong> {result.where_to_file || 'See draft and official portal'}
            </p>
            {Array.isArray(result.how_to_file) && result.how_to_file.length > 0 && (
              <ol className="how-to-file">
                {result.how_to_file.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
            <div className="complaint-drafts">
              <div>
                <h4>Complaint (EN)</h4>
                <pre>{result.complaint_draft_en}</pre>
                <button
                  type="button"
                  className="copy-lang-btn"
                  onClick={() => copyComplaint('en')}
                >
                  <Copy size={16} /> {copied === 'en' ? 'Copied' : 'Copy English draft'}
                </button>
              </div>
              <div>
                <h4>شکایت (UR)</h4>
                <pre dir="rtl">{result.complaint_draft_ur}</pre>
                <button
                  type="button"
                  className="copy-lang-btn"
                  onClick={() => copyComplaint('ur')}
                >
                  <Copy size={16} /> {copied === 'ur' ? 'Copied' : 'Copy Urdu draft'}
                </button>
              </div>
            </div>
            <div className="complaint-actions">
              <button type="button" onClick={downloadComplaint}>
                <Download size={16} /> Download both (.txt)
              </button>
              <a
                className="file-online-btn"
                href={result.complaint_portal?.url || MOHTASIB_URL}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} /> File Online Complaint (Wafaqi Mohtasib)
              </a>
            </div>
            <p className="roadmap-note">
              {result.complaint_portal?.note ||
                'Copy the English or Urdu draft, then open the official Wafaqi Mohtasib form.'}
            </p>
          </section>

          {Array.isArray(result.documents) && result.documents.length > 0 && (
            <section className="roadmap-section">
              <h3>
                <FileText size={18} /> Recommended documents / proof
              </h3>
              <p className="roadmap-note">
                If you already have these, keep them ready. If not, start collecting them.
              </p>
              <ul className="doc-list">
                {result.documents.map((doc, i) => (
                  <li key={i}>
                    <span className={`doc-priority ${doc.priority || 'recommended'}`}>
                      {doc.priority || 'recommended'}
                    </span>
                    <div>
                      <strong>{doc.name}</strong>
                      <p>{doc.why_needed}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(result.relevant_contacts) && result.relevant_contacts.length > 0 && (
            <section className="roadmap-section contacts-section">
              <h3>
                <Phone size={18} /> Relevant helplines for your situation
              </h3>
              <div className="contacts-grid">
                {result.relevant_contacts.map((c) => (
                  <div key={c.key || c.phone} className="contact-card">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>{c.name}</strong>
                      <a href={`tel:${c.phone}`}>{c.phone}</a>
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noreferrer" className="contact-link">
                          Open portal
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(result.lawyers) && result.lawyers.length > 0 && (
            <section className="roadmap-section">
              <h3>
                <Users size={18} />{' '}
                {result.show_female_lawyers
                  ? 'Recommended female lawyers'
                  : 'Recommended lawyers'}
              </h3>
              <div className="lawyers-grid-mini">
                {result.lawyers.slice(0, 6).map((lawyer) => (
                  <div key={lawyer.id} className="lawyer-mini-card">
                    <strong>{lawyer.full_name}</strong>
                    <span>{lawyer.email}</span>
                    {onBookAppointment && (
                      <button type="button" onClick={() => onBookAppointment(lawyer)}>
                        Book appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {result.disclaimer && <p className="roadmap-disclaimer">{result.disclaimer}</p>}
        </div>
      )}
    </div>
  )
}
