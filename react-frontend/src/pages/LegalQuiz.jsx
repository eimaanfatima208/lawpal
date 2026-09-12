import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Shield, Search, ChevronRight, CheckCircle2, XCircle,
  Trophy, BookOpen, RotateCcw, Home, Clock, Filter, Star, ArrowLeft,
  Shuffle, Settings2, Play
} from 'lucide-react'
import {
  QUIZ_CATEGORIES, ALL_QUIZZES, MIXED_POOL_SIZE,
  buildCustomQuiz, QUESTION_COUNT_PRESETS, TOPIC_OPTIONS,
  getAvailableCount, getScopeLabel,
} from '../data/quizData'
import './LegalQuiz.css'

const DIFFICULTY_LABELS = {
  beginner: { label: 'Beginner', className: 'diff-beginner' },
  intermediate: { label: 'Intermediate', className: 'diff-intermediate' },
  advanced: { label: 'Advanced', className: 'diff-advanced' },
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const SCORE_KEY = 'lawpal-quiz-scores'
const DEFAULT_COUNT = 10

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveScore(quizId, score, total) {
  const scores = loadScores()
  const prev = scores[quizId]
  const pct = Math.round((score / total) * 100)
  if (!prev || pct > prev.percentage) {
    scores[quizId] = { score, total, percentage: pct, date: Date.now() }
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores))
  }
  return scores
}

function getScoreMessage(pct) {
  if (pct >= 90) return 'Outstanding! You have expert-level legal awareness.'
  if (pct >= 75) return 'Excellent work! Your legal knowledge is strong.'
  if (pct >= 60) return 'Good effort! Review the topics you missed and try again.'
  if (pct >= 40) return 'Keep learning — legal awareness grows with practice.'
  return 'Don\'t give up! Review the answers and retake the quiz.'
}

function topicValue(type, id) {
  return type === 'mixed' ? 'mixed' : `${type}:${id}`
}

function parseTopicValue(value) {
  if (value === 'mixed') return { scopeType: 'mixed', scopeId: null }
  const [scopeType, ...rest] = value.split(':')
  return { scopeType, scopeId: rest.join(':') }
}

function LegalQuiz() {
  const [view, setView] = useState('catalog')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [activeConfig, setActiveConfig] = useState(null)
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [scores, setScores] = useState(loadScores)

  const [questionCount, setQuestionCount] = useState(DEFAULT_COUNT)
  const [customCount, setCustomCount] = useState('')
  const [topicValue_, setTopicValue_] = useState('mixed')

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  const { scopeType, scopeId } = parseTopicValue(topicValue_)
  const availableInTopic = useMemo(() => getAvailableCount(scopeType, scopeId), [scopeType, scopeId])
  const effectiveCount = useMemo(() => {
    const n = customCount ? parseInt(customCount, 10) : questionCount
    if (!n || Number.isNaN(n)) return DEFAULT_COUNT
    return Math.min(Math.max(1, n), availableInTopic)
  }, [questionCount, customCount, availableInTopic])

  const filteredQuizzes = useMemo(() => {
    const term = search.trim().toLowerCase()
    return ALL_QUIZZES.filter((quiz) => {
      if (difficultyFilter !== 'all' && quiz.difficulty !== difficultyFilter) return false
      if (categoryFilter !== 'all') {
        const cat = QUIZ_CATEGORIES.find((c) => c.id === categoryFilter)
        if (!cat?.quizzes.some((q) => q.id === quiz.id)) return false
      }
      if (!term) return true
      return (
        quiz.title.toLowerCase().includes(term) ||
        quiz.description.toLowerCase().includes(term)
      )
    })
  }, [search, difficultyFilter, categoryFilter])

  const currentQuestion = activeQuiz?.questions[qIndex]
  const totalQ = activeQuiz?.questions.length || 0
  const correctCount = userAnswers.filter((a) => a.correct).length
  const progress = totalQ ? ((qIndex + (answered ? 1 : 0)) / totalQ) * 100 : 0

  useEffect(() => {
    if (view !== 'quiz' || !startTime) return
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [view, startTime])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const launchQuiz = useCallback((config) => {
    const quiz = buildCustomQuiz(config)
    if (!quiz) return
    setActiveQuiz(quiz)
    setActiveConfig(config)
    setQIndex(0)
    setSelected(null)
    setAnswered(false)
    setUserAnswers([])
    setStartTime(Date.now())
    setElapsed(0)
    setView('quiz')
  }, [])

  const startConfiguredQuiz = useCallback(() => {
    launchQuiz({ count: effectiveCount, scopeType, scopeId })
  }, [launchQuiz, effectiveCount, scopeType, scopeId])

  const startQuickMixed = useCallback((count) => {
    setQuestionCount(count)
    setCustomCount('')
    setTopicValue_('mixed')
    launchQuiz({ count, scopeType: 'mixed', scopeId: null })
  }, [launchQuiz])

  const configureTopic = useCallback((type, id, count) => {
    setTopicValue_(topicValue(type, id))
    if (count) setQuestionCount(count)
    setCustomCount('')
    document.getElementById('quiz-setup')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSubmit = () => {
    if (selected === null || answered) return
    const isCorrect = selected === currentQuestion.correctAnswer
    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selected, correct: isCorrect, correctAnswer: currentQuestion.correctAnswer },
    ])
    setAnswered(true)
  }

  const handleNext = () => {
    if (qIndex < totalQ - 1) {
      setQIndex((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      const finalCorrect = userAnswers.filter((a) => a.correct).length
      const scoreKey = activeConfig?.scopeKey || activeQuiz.id
      saveScore(scoreKey, finalCorrect, totalQ)
      setScores(loadScores())
      setView('results')
    }
  }

  const resetToCatalog = () => {
    setView('catalog')
    setActiveQuiz(null)
    setActiveConfig(null)
    setQIndex(0)
    setSelected(null)
    setAnswered(false)
    setUserAnswers([])
    setStartTime(null)
    setElapsed(0)
  }

  const retryQuiz = () => {
    if (activeConfig) launchQuiz(activeConfig)
  }

  const completedQuizzes = Object.keys(scores).length
  const avgScore = completedQuizzes
    ? Math.round(Object.values(scores).reduce((s, v) => s + v.percentage, 0) / completedQuizzes)
    : 0

  const topicGroups = useMemo(() => {
    const groups = {}
    TOPIC_OPTIONS.forEach((opt) => {
      if (!groups[opt.group]) groups[opt.group] = []
      groups[opt.group].push(opt)
    })
    return groups
  }, [])

  /* ── Results ── */
  if (view === 'results' && activeQuiz) {
    const pct = Math.round((correctCount / totalQ) * 100)
    const wrong = userAnswers.filter((a) => !a.correct)

    return (
      <div className="quiz-page">
        <div className="quiz-results-card">
          <div className={`results-badge ${pct >= 75 ? 'great' : pct >= 50 ? 'good' : 'retry'}`}>
            <Trophy size={48} />
          </div>
          <h2 className="results-title">Quiz Complete!</h2>
          <p className="results-quiz-name">{activeQuiz.title}</p>
          <div className="results-score-ring">
            <span className="results-pct">{pct}%</span>
            <span className="results-fraction">{correctCount} / {totalQ} correct</span>
          </div>
          <p className="results-message">{getScoreMessage(pct)}</p>
          <div className="results-meta">
            <span><Clock size={14} /> {formatTime(elapsed)}</span>
            <span><BookOpen size={14} /> {totalQ} questions</span>
          </div>
          {wrong.length > 0 && (
            <div className="results-review">
              <h3>Review Incorrect Answers ({wrong.length})</h3>
              <div className="review-list">
                {wrong.map((ans) => {
                  const q = activeQuiz.questions.find((item) => item.id === ans.questionId)
                  if (!q) return null
                  return (
                    <div key={ans.questionId} className="review-item">
                      <p className="review-q">{q.text}</p>
                      <p className="review-wrong">
                        <XCircle size={14} /> Your answer: {OPTION_LETTERS[ans.selected]}) {q.options[ans.selected]}
                      </p>
                      <p className="review-correct">
                        <CheckCircle2 size={14} /> Correct: {OPTION_LETTERS[ans.correctAnswer]}) {q.options[ans.correctAnswer]}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="results-actions">
            <button type="button" className="quiz-btn secondary" onClick={resetToCatalog}>
              <Home size={16} /> Back to Quizzes
            </button>
            <button type="button" className="quiz-btn primary" onClick={retryQuiz}>
              <RotateCcw size={16} /> New Questions
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Active Quiz ── */
  if (view === 'quiz' && activeQuiz && currentQuestion) {
    const isCorrect = answered && selected === currentQuestion.correctAnswer

    return (
      <div className="quiz-page">
        <div className="quiz-active">
          <div className="quiz-active-header">
            <button type="button" className="quiz-back-btn" onClick={resetToCatalog}>
              <ArrowLeft size={18} /> Exit
            </button>
            <div className="quiz-active-info">
              <h2>{activeQuiz.title}</h2>
              <span className={`diff-badge ${DIFFICULTY_LABELS[activeQuiz.difficulty]?.className}`}>
                {DIFFICULTY_LABELS[activeQuiz.difficulty]?.label}
              </span>
            </div>
            <div className="quiz-timer"><Clock size={16} /> {formatTime(elapsed)}</div>
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="quiz-progress-label">
            Question {qIndex + 1} of {totalQ}
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="quiz-question-card">
            {currentQuestion.sourceCategory && (
              <span className="quiz-topic-tag">{currentQuestion.sourceCategory}</span>
            )}
            <p className="quiz-question-text">{currentQuestion.text}</p>
            <div className="quiz-options">
              {currentQuestion.options.map((opt, idx) => {
                let cls = 'quiz-option'
                if (!answered && selected === idx) cls += ' selected'
                if (answered && idx === currentQuestion.correctAnswer) cls += ' correct'
                if (answered && selected === idx && idx !== currentQuestion.correctAnswer) cls += ' wrong'
                return (
                  <button key={idx} type="button" className={cls} disabled={answered} onClick={() => setSelected(idx)}>
                    <span className="option-letter">{OPTION_LETTERS[idx]}</span>
                    <span className="option-text">{opt}</span>
                    {answered && idx === currentQuestion.correctAnswer && <CheckCircle2 size={18} className="option-icon" />}
                    {answered && selected === idx && idx !== currentQuestion.correctAnswer && <XCircle size={18} className="option-icon" />}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`feedback-banner ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? (
                  <><CheckCircle2 size={20} /> Correct! Well done.</>
                ) : (
                  <><XCircle size={20} /> Incorrect. The right answer is {OPTION_LETTERS[currentQuestion.correctAnswer]}.</>
                )}
              </div>
            )}
            <div className="quiz-actions">
              {!answered ? (
                <button type="button" className="quiz-btn primary" disabled={selected === null} onClick={handleSubmit}>
                  Submit Answer
                </button>
              ) : (
                <button type="button" className="quiz-btn primary" onClick={handleNext}>
                  {qIndex < totalQ - 1 ? <>Next Question <ChevronRight size={16} /></> : <>See Results <Trophy size={16} /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Catalog ── */
  return (
    <div className="quiz-page">
      <div className="quiz-hero">
        <div className="quiz-hero-content">
          <div className="quiz-hero-icon"><Shield size={36} /></div>
          <div>
            <h1 className="quiz-hero-title">Legal Awareness Quiz Center</h1>
            <p className="quiz-hero-subtitle">
              Test your legal knowledge with customizable quizzes across multiple topics.
            </p>
          </div>
        </div>
        <div className="quiz-hero-stats">
          <div className="hero-stat"><span className="hero-stat-num">{MIXED_POOL_SIZE}</span><span className="hero-stat-label">Questions</span></div>
          <div className="hero-stat"><span className="hero-stat-num">{QUIZ_CATEGORIES.length}</span><span className="hero-stat-label">Categories</span></div>
          <div className="hero-stat"><span className="hero-stat-num">{completedQuizzes}</span><span className="hero-stat-label">Completed</span></div>
          {completedQuizzes > 0 && (
            <div className="hero-stat"><span className="hero-stat-num">{avgScore}%</span><span className="hero-stat-label">Avg Score</span></div>
          )}
        </div>
      </div>

      <section id="quiz-setup" className="quiz-setup">
        <div className="quiz-setup-header">
          <Settings2 size={24} />
          <div>
            <h2>Customize Your Quiz</h2>
          </div>
        </div>

        <div className="quiz-setup-grid">
          <div className="setup-block">
            <label className="setup-label">How many questions?</label>
            <div className="count-presets">
              {QUESTION_COUNT_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`count-preset-btn ${questionCount === n && !customCount ? 'active' : ''}`}
                  onClick={() => { setQuestionCount(n); setCustomCount('') }}
                  disabled={n > availableInTopic}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="custom-count-row">
              <input
                type="number"
                min={1}
                max={availableInTopic}
                placeholder="Custom count"
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                className="custom-count-input"
              />
              <span className="setup-hint">Max {availableInTopic} available for this topic</span>
            </div>
          </div>

          <div className="setup-block">
            <label className="setup-label" htmlFor="topic-select">Choose topic</label>
            <select
              id="topic-select"
              className="topic-select"
              value={topicValue_}
              onChange={(e) => setTopicValue_(e.target.value)}
            >
              {Object.entries(topicGroups).map(([group, opts]) => (
                <optgroup key={group} label={group}>
                  {opts.map((opt) => (
                    <option key={topicValue(opt.type, opt.id)} value={topicValue(opt.type, opt.id)}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="setup-topic-summary">
              {getScopeLabel(scopeType, scopeId)} · {availableInTopic} questions in pool
            </p>
          </div>
        </div>

        <div className="setup-actions">
          <button type="button" className="quiz-btn primary setup-start-btn" onClick={startConfiguredQuiz}>
            <Play size={18} /> Start {effectiveCount}-Question Quiz
          </button>
          <div className="quick-start-row">
            <span>Quick start:</span>
            <button type="button" className="quick-start-btn" onClick={() => startQuickMixed(10)}>10 Mixed</button>
            <button type="button" className="quick-start-btn" onClick={() => startQuickMixed(20)}>20 Mixed</button>
            <button type="button" className="quick-start-btn" onClick={() => startQuickMixed(50)}>50 Mixed</button>
          </div>
        </div>
      </section>

      <div className="quiz-filters">
        <div className="quiz-search">
          <Search size={18} />
          <input type="text" placeholder="Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          <Filter size={16} />
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {QUIZ_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </div>
      </div>

      {categoryFilter === 'all' ? (
        QUIZ_CATEGORIES.map((cat) => {
          const catQuizzes = cat.quizzes.filter((q) => filteredQuizzes.some((fq) => fq.id === q.id))
          if (catQuizzes.length === 0) return null
          return (
            <section key={cat.id} className="quiz-category">
              <div className="category-header" style={{ borderColor: cat.color }}>
                <span className="category-icon">{cat.icon}</span>
                <div>
                  <h2 className="category-title">{cat.title}</h2>
                  <p className="category-desc">{cat.description}</p>
                  <button type="button" className="category-play-btn" onClick={() => configureTopic('category', cat.id, 10)}>
                    Quiz this category (10 questions)
                  </button>
                </div>
              </div>
              <div className="quiz-grid">
                {catQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    score={scores[quiz.id] || scores[`quiz:${quiz.id}`]}
                    color={cat.color}
                    onConfigure={() => configureTopic('quiz', quiz.id, 10)}
                  />
                ))}
              </div>
            </section>
          )
        })
      ) : (
        <div className="quiz-grid standalone">
          {filteredQuizzes.map((quiz) => {
            const cat = QUIZ_CATEGORIES.find((c) => c.quizzes.some((q) => q.id === quiz.id))
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                score={scores[quiz.id] || scores[`quiz:${quiz.id}`]}
                color={cat?.color || '#D97706'}
                onConfigure={() => configureTopic('quiz', quiz.id, 10)}
              />
            )
          })}
        </div>
      )}

      {filteredQuizzes.length === 0 && (
        <div className="quiz-empty">
          <BookOpen size={48} />
          <p>No quizzes match your search. Try different filters.</p>
        </div>
      )}
    </div>
  )
}

function QuizCard({ quiz, score, onConfigure, color }) {
  const diff = DIFFICULTY_LABELS[quiz.difficulty]
  return (
    <div className="quiz-card quiz-card-static" style={{ '--card-accent': color }}>
      <div className="quiz-card-top">
        <span className={`diff-badge ${diff?.className}`}>{diff?.label}</span>
        {score && (
          <span className="quiz-card-score"><Star size={12} /> {score.percentage}%</span>
        )}
      </div>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">{quiz.description}</p>
      <div className="quiz-card-meta">
        <span>{quiz.questions.length} in bank</span>
      </div>
      <button type="button" className="quiz-card-cta-btn" onClick={onConfigure}>
        Select &amp; Customize <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default LegalQuiz
