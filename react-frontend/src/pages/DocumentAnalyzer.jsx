import { useState } from 'react'
import { FileSearch, Upload, Download, FileText, Loader2 } from 'lucide-react'
import './DocumentAnalyzer.css'

const API_URL = import.meta.env.VITE_CHAT_API_URL || '/api'

function DocumentAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState('explanation')
  const [showResults, setShowResults] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidFile = (file) =>
    file && (file.type === 'application/pdf' || file.type.startsWith('image/'))

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isValidFile(file)) {
      setError('Please upload a PDF, JPG, or PNG file.')
      return
    }
    setSelectedFile(file)
    setShowResults(false)
    setAnalysis(null)
    setError('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (!isValidFile(file)) {
      setError('Please upload a PDF, JPG, or PNG file.')
      return
    }
    setSelectedFile(file)
    setShowResults(false)
    setAnalysis(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!selectedFile || loading) return

    setLoading(true)
    setError('')
    setShowResults(false)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch(`${API_URL}/analyze-document`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis({
        documentLanguage: data.document_language === 'ur' ? 'ur' : 'en',
        explanation: data.explanation || '',
        translation: data.translation || data.urdu || '',
        sections: (Array.isArray(data.sections) ? data.sections : [])
          .map((s) => ({
            title: String(s?.title || '').trim(),
            content: String(s?.content || '').trim(),
          }))
          .filter((s) => s.title && s.content),
        glossary: (Array.isArray(data.glossary) ? data.glossary : [])
          .map((g) => ({
            term: String(g?.term || '').trim(),
            definition: String(g?.definition || '').trim(),
          }))
          .filter((g) => g.term && g.definition),
      })
      setShowResults(true)
      setActiveTab('explanation')
    } catch (err) {
      setError(err.message || 'Failed to analyze document. Please try again.')
      setAnalysis(null)
      setShowResults(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!analysis) return
    const isUrduDoc = analysis.documentLanguage === 'ur'
    const secondaryLabel = isUrduDoc ? 'English Translation' : 'Urdu Translation'
    const content = [
      'Document Analysis Summary',
      `Document language: ${isUrduDoc ? 'Urdu' : 'English'}`,
      '',
      '=== Explanation ===',
      analysis.explanation,
      '',
      `=== ${secondaryLabel} ===`,
      analysis.translation,
      '',
      '=== Sections ===',
      ...analysis.sections.map((s) => `- ${s.title}: ${s.content}`),
      '',
      '=== Glossary ===',
      ...analysis.glossary.map((g) => `- ${g.term}: ${g.definition}`),
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document-analysis-summary.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isUrduDoc = analysis?.documentLanguage === 'ur'
  const secondaryTabLabel = isUrduDoc ? 'English' : 'Urdu'
  const explanationRtl = isUrduDoc
  const translationRtl = !isUrduDoc
  const sectionsRtl = isUrduDoc
  const glossaryRtl = isUrduDoc

  return (
    <div className="document-analyzer-container">
      <div className="analyzer-header">
        <h1 className="analyzer-title">Smart Document Analyzer</h1>
      </div>

      <div className="analyzer-content">
        <div className="upload-panel">
          <div className="panel-header">
            <h2 className="panel-title">Upload Legal Document</h2>
            <p className="panel-subtitle">Supported formats: PDF, JPG, PNG (max 5MB)</p>
          </div>

          <div
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="upload-icon" size={48} />
            <p className="upload-text">Drag & drop your document here, or click to browse</p>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button type="button" className="browse-btn">
              Browse Files
            </button>
          </div>

          {selectedFile && (
            <div className="selected-file">
              <FileText size={20} />
              <span className="file-name">{selectedFile.name}</span>
            </div>
          )}

          {error && <p className="analyzer-error">{error}</p>}

          <button
            type="button"
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
          >
            {loading ? <Loader2 size={20} className="spin" /> : <FileSearch size={20} />}
            {loading ? 'Analyzing…' : 'Analyze Document'}
          </button>
        </div>

        <div className="results-panel">
          <div className="panel-header">
            <h2 className="panel-title">Analysis Results</h2>
            <p className="panel-subtitle">AI-powered insights from OCR + Gemini.</p>
          </div>

          {loading && (
            <div className="empty-results">
              <Loader2 size={48} className="empty-icon spin" />
              <p>Reading document and generating analysis…</p>
            </div>
          )}

          {!loading && showResults && analysis ? (
            <>
              <div className="tabs-container">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'explanation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('explanation')}
                >
                  Explanation
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'translation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('translation')}
                >
                  {secondaryTabLabel}
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sections')}
                >
                  Sections
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'glossary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('glossary')}
                >
                  Glossary
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'explanation' && (
                  <div
                    className="content-box"
                    dir={explanationRtl ? 'rtl' : 'ltr'}
                    style={explanationRtl ? { textAlign: 'right' } : undefined}
                  >
                    <p style={{ whiteSpace: 'pre-wrap' }}>{analysis.explanation}</p>
                  </div>
                )}

                {activeTab === 'translation' && (
                  <div
                    className="content-box"
                    dir={translationRtl ? 'rtl' : 'ltr'}
                    style={translationRtl ? { textAlign: 'right' } : undefined}
                  >
                    <p style={{ whiteSpace: 'pre-wrap' }}>{analysis.translation}</p>
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div
                    className="content-box"
                    dir={sectionsRtl ? 'rtl' : 'ltr'}
                    style={sectionsRtl ? { textAlign: 'right' } : undefined}
                  >
                    {analysis.sections.length === 0 ? (
                      <p>No document sections found.</p>
                    ) : (
                      analysis.sections.map((section, index) => (
                        <div key={index} className="section-item">
                          <h3 className="section-title">{section.title}</h3>
                          <p className="section-content">{section.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'glossary' && (
                  <div
                    className="content-box"
                    dir={glossaryRtl ? 'rtl' : 'ltr'}
                    style={glossaryRtl ? { textAlign: 'right' } : undefined}
                  >
                    {analysis.glossary.length === 0 ? (
                      <p>No glossary terms found.</p>
                    ) : (
                      analysis.glossary.map((item, index) => (
                        <div key={index} className="glossary-item">
                          <h3 className="glossary-term">{item.term}</h3>
                          <p className="glossary-definition">{item.definition}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button type="button" className="download-btn" onClick={handleDownload}>
                <Download size={18} />
                Download Summary
              </button>
            </>
          ) : (
            !loading && (
              <div className="empty-results">
                <FileSearch size={64} className="empty-icon" />
                <p>Upload a document and click Analyze to see results</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentAnalyzer
