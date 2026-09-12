import { useState, useEffect, useCallback, useRef } from 'react'
import { Paperclip, Send, ChevronDown, Search, X } from 'lucide-react'
import './Chat.css'

// Use env when app is served from another origin (e.g. XAMPP); otherwise same-origin /api
const CHAT_API = import.meta.env.VITE_CHAT_API_URL || '/api'
const POLL_INTERVAL_MS = 2000

// Never show email as name; use full name or role fallback
function displayName(name, roleFallback = 'User') {
  if (!name || String(name).includes('@')) return roleFallback
  return name
}

function Chat({ initialChat = null, onChatClosed }) {
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const lastLoadedChatIdRef = useRef(null)

  // Scroll to bottom function
  const scrollToBottom = useCallback((smooth = true) => {
    const el = messagesContainerRef.current
    if (el) {
      if (smooth) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      } else {
        el.scrollTop = el.scrollHeight
      }
    }
    setAutoScroll(true)
    setShowScrollButton(false)
  }, [])

  // Check if user is near bottom of scroll
  const checkScrollPosition = useCallback(() => {
    const el = messagesContainerRef.current
    if (!el) return
    
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
    setShowScrollButton(!isNearBottom)
    setAutoScroll(isNearBottom)
  }, [])

  // Auto-scroll when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (messages.length > 0 && autoScroll) {
      setTimeout(() => {
        scrollToBottom(true)
      }, 100)
    } else if (messages.length > 0) {
      // Check scroll position when messages load
      setTimeout(() => {
        checkScrollPosition()
      }, 100)
    }
  }, [messages, autoScroll, scrollToBottom, checkScrollPosition])

  // Scroll to bottom when chat is selected
  useEffect(() => {
    if (!selectedChat) return

    setTimeout(() => {
      scrollToBottom(false)
    }, 100)

    // scroll the active chat list item into view in the sidebar
    const activeItem = document.querySelector('.chat-list-item.active')
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedChat, scrollToBottom])

  // Listen to scroll events
  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return

    el.addEventListener('scroll', checkScrollPosition)
    return () => el.removeEventListener('scroll', checkScrollPosition)
  }, [checkScrollPosition])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) return
    try {
      setUser(JSON.parse(userData))
    } catch (_) {
      setError('Invalid user session')
    }
  }, [])

  const fetchChatHistory = useCallback(async (userId) => {
    try {
      const res = await fetch(`${CHAT_API}/getChatHistory/${userId}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats)
      }
    } catch (err) {
      setError('Could not load chats')
    }
  }, [])

  const fetchMessages = useCallback(async (userId, otherUserId, silent = false) => {
    if (!otherUserId) return
    if (!silent) setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${CHAT_API}/getMessages/${userId}?otherUserId=${otherUserId}`)
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success && Array.isArray(data.messages)) {
        setMessages(data.messages)
      } else {
        setMessages([])
        if (!silent) setError(data?.message || 'Could not load messages. Make sure the chat server is running (npm start).')
      }
    } catch (err) {
      setMessages([])
      if (!silent) setError('Could not load messages. Make sure the chat server is running (npm start).')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return

    const loadAndPoll = () => {
      fetchChatHistory(user.id)
      if (selectedChat?.other_user_id) {
        fetchMessages(user.id, selectedChat.other_user_id, true)
      }
    }

    loadAndPoll()
    const interval = setInterval(loadAndPoll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [user?.id, selectedChat?.other_user_id, fetchChatHistory, fetchMessages])

  useEffect(() => {
    if (initialChat && user) {
      const existing = chats.find(c => c.other_user_id === initialChat.id)
      if (existing) {
        // Only update selectedChat when switching to a different chat, not on every poll (avoids loading blink)
        setSelectedChat((prev) =>
          prev?.other_user_id === existing.other_user_id ? prev : existing
        )
      } else {
        setSelectedChat((prev) =>
          prev?.other_user_id === initialChat.id ? prev : {
            other_user_id: initialChat.id,
            other_user_name: displayName(initialChat.full_name || initialChat.name, initialChat.role || 'lawyer'),
            other_user_role: initialChat.role || 'lawyer'
          }
        )
      }
    }
  }, [initialChat, user, chats])

  useEffect(() => {
    if (!selectedChat) {
      setMessages([])
      lastLoadedChatIdRef.current = null
      return
    }
    if (user?.id) {
      const isNewConversation = lastLoadedChatIdRef.current !== selectedChat.other_user_id
      lastLoadedChatIdRef.current = selectedChat.other_user_id
      // Only show loading when switching to a different chat, not on reference-only changes (e.g. from poll)
      fetchMessages(user.id, selectedChat.other_user_id, !isNewConversation)
    }
  }, [selectedChat, user?.id, fetchMessages])

  const lawyerCannotStart = user?.role === 'lawyer' && messages.length === 0

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text || !user || !selectedChat || lawyerCannotStart) return

    try {
      const res = await fetch(`${CHAT_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedChat.other_user_id,
          senderRole: user.role,
          message: text
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessageText('')
        fetchMessages(user.id, selectedChat.other_user_id, true)
        fetchChatHistory(user.id)
        // Auto-scroll after sending message
        setTimeout(() => scrollToBottom(true), 200)
      } else {
        setError(data.message || 'Failed to send')
      }
    } catch (err) {
      setError('Failed to send message')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user || !selectedChat || lawyerCannotStart) return

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('senderId', user.id)
      formData.append('receiverId', selectedChat.other_user_id)
      formData.append('senderRole', user.role)

      const res = await fetch(`${CHAT_API}/uploadDocument`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        fetchMessages(user.id, selectedChat.other_user_id, true)
        fetchChatHistory(user.id)
        // Auto-scroll after uploading document
        setTimeout(() => scrollToBottom(true), 200)
      } else {
        setError(data.message || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-welcome">
          <p>Please log in to use chat.</p>
        </div>
      </div>
    )
  }

  const filteredChats = chats.filter(chat => 
    chat.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getUnreadCount = (chat) => {
    // This would come from your API - placeholder for now
    return chat.unread_count || 0
  }

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        {/* Left Column - Messages List */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-sidebar-title">
              Messages
              <ChevronDown size={16} className="chat-dropdown-icon" />
            </h2>
          </div>
          
          <div className="chat-search-container">
            <Search size={18} className="chat-search-icon" />
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="chat-list">
            {filteredChats.length === 0 && (
              <div className="chat-empty">No conversations found.</div>
            )}
            {filteredChats.map((c) => {
              const unreadCount = getUnreadCount(c)
              return (
                <button
                  key={c.other_user_id}
                  type="button"
                  className={`chat-list-item ${selectedChat?.other_user_id === c.other_user_id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(c)}
                >
                  <div className="chat-list-avatar">
                    {(c.other_user_name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-list-info">
                    <div className="chat-list-name-row">
                      <span className="chat-list-name">{c.other_user_name || 'Unknown'}</span>
                      {unreadCount > 0 && (
                        <span className="chat-unread-badge">{unreadCount}</span>
                      )}
                    </div>
                    <span className="chat-list-role">{c.other_user_role}</span>
                    <span className="chat-list-preview">
                      {c.document_name || c.last_message || 'No messages'}
                    </span>
                  </div>
                  <span className="chat-list-time">{formatTime(c.last_message_at)}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Middle Column - Chat Window */}
        <section className="chat-main">
          {!selectedChat ? (
            <div className="chat-welcome">
              <p>Select a conversation or start a new chat from Book Appointment.</p>
            </div>
          ) : (
            <>
              <header className="chat-header">
                <div className="chat-header-left">
                  <h3>{displayName(selectedChat.other_user_name, selectedChat.other_user_role)}</h3>
                  <span className="chat-header-role">({selectedChat.other_user_role})</span>
                </div>
              </header>

              {error && <div className="chat-error">{error}</div>}

              <div ref={messagesContainerRef} className="chat-messages chat-messages-container">
                {loading ? (
                  <div className="chat-loading-msg">Loading...</div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isOwn = m.sender_id === user.id
                      return (
                        <div
                          key={m.chat_id}
                          className={`chat-message ${isOwn ? 'own' : 'other'}`}
                        >
                          {!isOwn && (
                            <div className="chat-msg-avatar">
                              {(displayName(m.sender_name, m.sender_role) || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="chat-msg-content">
                            {!isOwn && (
                              <div className="chat-msg-header">
                                <span className="chat-msg-sender">{displayName(m.sender_name, m.sender_role)}</span>
                                <span className="chat-msg-time">{formatTime(m.timestamp)}</span>
                              </div>
                            )}
                            {m.message && <p className="chat-msg-text">{m.message}</p>}
                            {m.document_url && (
                              <a
                                href={m.document_url.startsWith('/') ? m.document_url : `/${m.document_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-doc-link"
                              >
                                <Paperclip size={14} />
                                <span>{m.document_name || 'Document'}</span>
                              </a>
                            )}
                            {isOwn && (
                              <span className="chat-msg-time-own">{formatTime(m.timestamp)}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {isTyping && (
                      <div className="chat-typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span>Abel is typing...</span>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showScrollButton && (
                <button
                  type="button"
                  className="chat-scroll-down-btn"
                  onClick={() => scrollToBottom(true)}
                  title="Scroll to bottom"
                >
                  <ChevronDown size={20} />
                </button>
              )}

              <div className="chat-input-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="chat-file-input"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="chat-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={lawyerCannotStart || uploading}
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  className="chat-text-input"
                  placeholder="Type a Message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={lawyerCannotStart}
                />
                <button
                  type="button"
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || lawyerCannotStart}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Chat
