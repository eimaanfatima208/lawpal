import { useState, useMemo } from 'react'
import { Search as SearchIcon, Eye, X, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import agricultureLaws from '../data/agriculture-laws.json'
import auqafLaws from '../data/auqaf-and-religious-affairs-laws.json'
import boardOfRevenueLaws from '../data/board-of-revenue-laws.json'
import communicationsLaws from '../data/communications-and-works-laws.json'
import cooperativesLaws from '../data/cooperatives-laws.json'
import energyLaws from '../data/energy-laws.json'
import environmentLaws from '../data/environment-protection-laws.json'
import exciseLaws from '../data/excise-taxation-and-narcotics-control-laws.json'
import financeLaws from '../data/finance-laws.json'
import foodLaws from '../data/food-laws.json'
import forestryLaws from '../data/forestry-wildlife-and-fisheries-laws.json'
import higherEducationLaws from '../data/higher-education-laws.json'
import homeLaws from '../data/home-laws.json'
import housingLaws from '../data/housing-urban-development-and-public-health-engineering-laws.json'
import humanRightsLaws from '../data/human-rights-and-minorities-affairs-laws.json'
import industriesLaws from '../data/industries-commerce-investment-and-skill-department-laws.json'
import informationLaws from '../data/information-and-culture-laws.json'
import irrigationLaws from '../data/irrigation-laws.json'
import labourLaws from '../data/labour-and-human-resource-laws.json'
import lawParliamentaryLaws from '../data/law-and-parliamentary-affairs-laws.json'
import livestockLaws from '../data/livestock-and-dairy-development-laws.json'
import localGovLaws from '../data/local-government-and-community-development-laws.json'
import minesLaws from '../data/mines-and-minerals-laws.json'
import planningLaws from '../data/planning-and-development-laws.json'
import populationWelfareLaws from '../data/population-welfare-laws.json'
import primaryHealthcareLaws from '../data/primary-and-secondary-healthcare-laws.json'
import publicProsecutionLaws from '../data/public-prosecution-laws.json'
import schoolEducationLaws from '../data/school-education-laws.json'
import servicesLaws from '../data/services-and-general-administration-laws.json'
import socialWelfareLaws from '../data/social-welfare-and-bait-ul-mal-laws.json'
import specialEducationLaws from '../data/special-education-laws.json'
import specializedHealthcareLaws from '../data/specialized-healthcare-and-medical-education-laws.json'
import transportLaws from '../data/transport-laws.json'
import womenDevelopmentLaws from '../data/women-development-laws.json'
import youthAffairsLaws from '../data/youth-affairs-sports-archeology-and-tourism-laws.json'
import zakatLaws from '../data/zakat-and-ushr-laws.json'
import departments from '../data/departments.json'
import './LegalSearch.css'

const ALL_LAWS = [
  ...agricultureLaws,
  ...auqafLaws,
  ...boardOfRevenueLaws,
  ...communicationsLaws,
  ...cooperativesLaws,
  ...energyLaws,
  ...environmentLaws,
  ...exciseLaws,
  ...financeLaws,
  ...foodLaws,
  ...forestryLaws,
  ...higherEducationLaws,
  ...homeLaws,
  ...housingLaws,
  ...humanRightsLaws,
  ...industriesLaws,
  ...informationLaws,
  ...irrigationLaws,
  ...labourLaws,
  ...lawParliamentaryLaws,
  ...livestockLaws,
  ...localGovLaws,
  ...minesLaws,
  ...planningLaws,
  ...populationWelfareLaws,
  ...primaryHealthcareLaws,
  ...publicProsecutionLaws,
  ...schoolEducationLaws,
  ...servicesLaws,
  ...socialWelfareLaws,
  ...specialEducationLaws,
  ...specializedHealthcareLaws,
  ...transportLaws,
  ...womenDevelopmentLaws,
  ...youthAffairsLaws,
  ...zakatLaws,
]
const PAGE_SIZE = 6

function normalizeCategory(category) {
  if (!category) return ''
  const key = category.trim().toLowerCase()
  if (key === 'act') return 'Act'
  if (key === 'ordinance') return 'Ordinance'
  if (key === 'order') return 'Order'
  if (key === 'regulation') return 'Regulation'
  return category.trim()
}

function getLawYear(law) {
  const year = parseInt(law.datePublished?.slice(0, 4), 10)
  return Number.isNaN(year) ? null : year
}

const { minYear, yearOptions, categoryOptions } = (() => {
  let min = Infinity
  let max = 0
  const categoryMap = new Map()

  ALL_LAWS.forEach((law) => {
    const year = getLawYear(law)
    if (year) {
      min = Math.min(min, year)
      max = Math.max(max, year)
    }
    const cat = normalizeCategory(law.category)
    if (cat) categoryMap.set(cat.toLowerCase(), cat)
  })

  const currentYear = new Date().getFullYear()
  max = Math.max(max, currentYear)
  if (!Number.isFinite(min)) min = currentYear

  const years = []
  for (let y = min; y <= max; y += 1) years.push(y)

  return {
    minYear: min,
    yearOptions: years,
    categoryOptions: [...categoryMap.values()].sort((a, b) => a.localeCompare(b)),
  }
})()

export default function LegalSearch() {
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [previewResult, setPreviewResult] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredResults = useMemo(() => {
    let results = ALL_LAWS

    if (filterDepartment !== 'all') {
      results = results.filter((law) => law.department === filterDepartment)
    }

    if (filterCategory !== 'all') {
      results = results.filter(
        (law) => normalizeCategory(law.category) === filterCategory
      )
    }

    if (filterYear !== 'all') {
      const year = parseInt(filterYear, 10)
      results = results.filter((law) => getLawYear(law) === year)
    }

    const term = appliedQuery.trim().toLowerCase()
    if (term) {
      results = results.filter((law) => {
        const haystack = [
          law.title,
          law.department,
          law.category,
          law.reference,
        ].join(' ').toLowerCase()
        return haystack.includes(term)
      })
    }

    return results
  }, [appliedQuery, filterDepartment, filterCategory, filterYear])

  const filterSummary = useMemo(() => {
    const parts = []
    if (filterDepartment !== 'all') parts.push(filterDepartment)
    if (filterCategory !== 'all') parts.push(filterCategory)
    if (filterYear !== 'all') parts.push(String(filterYear))
    if (appliedQuery.trim()) parts.push(appliedQuery.trim())
    return parts.length ? parts.join(' · ') : 'All Departments'
  }, [filterDepartment, filterCategory, filterYear, appliedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageResults = filteredResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const startIndex = filteredResults.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(safePage * PAGE_SIZE, filteredResults.length)

  const handleSearch = (e) => {
    e?.preventDefault()
    setAppliedQuery(query.trim())
    setCurrentPage(1)
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilterDepartment('all')
    setFilterCategory('all')
    setFilterYear('all')
    setQuery('')
    setAppliedQuery('')
    setCurrentPage(1)
  }

  const handleViewDetails = (result) => {
    setPreviewResult(result)
  }

  const closePreview = () => {
    setPreviewResult(null)
  }

  const handleDownload = (result) => {
    if (!result?.file) return
    const link = document.createElement('a')
    link.href = result.file
    link.download = `${result.title.replace(/\s+/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="legal-search-container">
      <div className="legal-search-header">
        <h1 className="legal-search-title">Smart Legal Search</h1>
        <p className="legal-search-subtitle">
          Empower your legal research with our intelligent search engine for acts, sections, and case laws.
        </p>
      </div>

      <div className="legal-search-card find-card">
        <h2 className="legal-search-card-title">Find Legal Information</h2>
        <p className="legal-search-instruction">
          Search across Punjab department laws. Use filters for department, category, or year, or type your query below.
        </p>

        <div className="legal-search-filters">
          <div className="legal-search-filter">
            <label className="legal-search-filter-label" htmlFor="filter-department">Department</label>
            <select
              id="filter-department"
              className="legal-search-filter-select"
              value={filterDepartment}
              onChange={handleFilterChange(setFilterDepartment)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.slug} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="legal-search-filter">
            <label className="legal-search-filter-label" htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              className="legal-search-filter-select"
              value={filterCategory}
              onChange={handleFilterChange(setFilterCategory)}
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="legal-search-filter">
            <label className="legal-search-filter-label" htmlFor="filter-year">Year</label>
            <select
              id="filter-year"
              className="legal-search-filter-select"
              value={filterYear}
              onChange={handleFilterChange(setFilterYear)}
            >
              <option value="all">All Years ({minYear}–{yearOptions[yearOptions.length - 1]})</option>
              {yearOptions.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(filterDepartment !== 'all' || filterCategory !== 'all' || filterYear !== 'all' || appliedQuery) && (
          <button type="button" className="legal-search-clear-filters" onClick={clearFilters}>
            Clear filters
          </button>
        )}

        <form onSubmit={handleSearch} className="legal-search-form">
          <div className="legal-search-input-wrap">
            <SearchIcon className="legal-search-input-icon" size={20} />
            <input
              type="text"
              className="legal-search-input"
              placeholder="Search for legal acts, sections, or case laws..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="legal-search-btn-submit">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="legal-search-card results-card">
        <h2 className="legal-search-card-title">Search Results</h2>
        <p className="legal-search-results-summary">
          Showing {startIndex} to {endIndex} of {filteredResults.length} results for &quot;{filterSummary}&quot;.
        </p>
        <div className="legal-search-table-wrap">
          <table className="legal-search-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Category</th>
                <th>Reference</th>
                <th>Date Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="legal-search-empty">
                    No laws found matching your search.
                  </td>
                </tr>
              ) : (
                pageResults.map((row) => (
                  <tr key={row.id}>
                    <td className="legal-search-cell-title">{row.title}</td>
                    <td>
                      <span className="legal-search-badge legal-search-badge-dept">{row.department}</span>
                    </td>
                    <td>
                      <span className="legal-search-badge">{row.category}</span>
                    </td>
                    <td className="legal-search-cell-ref">{row.reference}</td>
                    <td>{row.datePublished}</td>
                    <td>
                      <div className="legal-search-actions">
                        <button
                          type="button"
                          className="legal-search-view-btn"
                          onClick={() => handleViewDetails(row)}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        <button
                          type="button"
                          className="legal-search-download-btn"
                          onClick={() => handleDownload(row)}
                        >
                          <Download size={14} />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredResults.length > 0 && (
          <div className="legal-search-pagination">
            <button
              type="button"
              className="legal-search-page-btn"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="legal-search-page-info">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="legal-search-page-btn"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {previewResult && (
        <div className="legal-search-preview-overlay" onClick={closePreview}>
          <div className="legal-search-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="legal-search-preview-header">
              <h2 className="legal-search-preview-title">{previewResult.title}</h2>
              <button type="button" onClick={closePreview} className="legal-search-preview-close" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="legal-search-preview-meta">
              <span className="legal-search-badge legal-search-badge-dept">{previewResult.department}</span>
              <span className="legal-search-badge">{previewResult.category}</span>
              <span>{previewResult.reference}</span>
              <span>Published: {previewResult.datePublished}</span>
            </div>
            <div className="legal-search-preview-body">
              {previewResult.file ? (
                <iframe
                  src={previewResult.file}
                  className="legal-search-preview-iframe"
                  title={previewResult.title}
                  type="application/pdf"
                />
              ) : (
                <div className="legal-search-preview-no-file">
                  <FileText size={48} />
                  <p>No document preview available for this result.</p>
                </div>
              )}
            </div>
            <div className="legal-search-preview-footer">
              {previewResult.file && (
                <button
                  type="button"
                  className="legal-search-preview-download"
                  onClick={() => handleDownload(previewResult)}
                >
                  <Download size={16} />
                  Download PDF
                </button>
              )}
              <button type="button" className="legal-search-preview-close-btn" onClick={closePreview}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
