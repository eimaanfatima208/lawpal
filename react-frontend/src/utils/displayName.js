/**
 * Role label for display (e.g. lawyer -> Legal Professional).
 */
export function getRoleLabel(role) {
  if (role === 'lawyer') return 'Legal Professional'
  if (role === 'client') return 'Client'
  if (role === 'admin') return 'Administrator'
  return role || 'User'
}

/**
 * Derive a friendly display name from an email (e.g. eimaan.fatima45@gmail.com -> Eimaan Fatima45).
 */
function nameFromEmail(email) {
  if (!email || typeof email !== 'string') return ''
  const local = email.trim().split('@')[0].trim()
  if (!local) return ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length === 0) return ''
  const formatted = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ')
  return formatted
}

/**
 * Display name for a user: use full_name from database if it's a real name (non-empty, no @).
 * Supports both full_name and fullName (camelCase) from API.
 * If missing, derive a name from email. Last fallback: role label (e.g. Legal Professional).
 */
export function getDisplayName(user) {
  if (!user) return 'User'
  const raw = (user.full_name ?? user.fullName ?? '')
  const name = typeof raw === 'string' ? raw.trim() : ''
  if (name && !name.includes('@')) return name
  const fromEmail = nameFromEmail(user.email)
  if (fromEmail) return fromEmail
  return getRoleLabel(user.role)
}

/**
 * Initials from a name string.
 * - Email: use local part (e.g. john.doe@x.com -> JD, eimaan@x.com -> EI).
 * - Multiple words: first letter of first + first letter of last (Eimaan Fatima -> EF).
 * - Single word containing 'f': first letter + F (eimaanfatima -> EF).
 * - Else: first two characters.
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?'
  const s = name.trim()
  if (!s) return '?'

  // Email: use local part only
  if (s.includes('@')) {
    const local = s.split('@')[0].trim()
    if (!local) return '?'
    const parts = local.split(/[._-]/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return local.substring(0, 2).toUpperCase()
  }

  // Multiple words: first letter of first word + first letter of last word
  const words = s.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  // Single word: if it contains 'f', use first letter + F (e.g. eimaanfatima -> EF)
  if (s.length >= 2 && s.toLowerCase().includes('f')) {
    return (s[0] + 'F').toUpperCase()
  }

  return s.substring(0, 2).toUpperCase()
}
