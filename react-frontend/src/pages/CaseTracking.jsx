import React from 'react'
import './CaseTracking.css'

const COURTS = [
  {
    id: 'supreme',
    name: 'Supreme Court of Pakistan',
    url: 'https://www.supremecourt.gov.pk/cause-list-search/',
    image: '/courts/supreme-court.png',
  },
  {
    id: 'lahore-high',
    name: 'Lahore High Court',
    url: 'https://lhc.gov.pk/case_management',
    image: '/courts/lahore-high-court.png',
  },
  {
    id: 'district-punjab',
    name: 'District Judiciary Punjab',
    url: 'https://dsj.punjab.gov.pk/',
    image: '/courts/district-judiciary-punjab.png',
  },
  {
    id: 'pap',
    name: 'Provincial Assembly of Punjab',
    url: 'https://www.pap.gov.pk/bills/show/en',
    image: '/courts/provincial-assembly-punjab.png',
  },
]

export default function CaseTracking() {
  return (
    <div className="case-tracking-page">
      <div className="case-tracking-header">
        <h1 className="case-tracking-title">Judiciary - Case Status</h1>
      </div>
      <div className="case-tracking-grid">
        {COURTS.map((court) => (
          <a
            key={court.id}
            href={court.url}
            target="_blank"
            rel="noopener noreferrer"
            className="case-tracking-card"
            title={`Open ${court.name} (new tab)`}
          >
            <div className="case-tracking-card-image-wrap">
              <img
                src={court.image}
                alt={court.name}
                className="case-tracking-card-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling?.classList.add('show')
                }}
              />
              <div className="case-tracking-card-placeholder" aria-hidden="true">
                <span className="case-tracking-card-initial">{court.name.charAt(0)}</span>
              </div>
            </div>
            <span className="case-tracking-card-name">{court.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
