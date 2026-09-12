import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { User, LogOut } from 'lucide-react'
import './AccountMenu.css'

export default function AccountMenu({ initials, onProfile, onLogout, triggerClassName = '' }) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({})
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target)
      const clickedMenu = dropdownRef.current?.contains(event.target)
      if (!clickedTrigger && !clickedMenu) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const openMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuStyle({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - 160),
        minWidth: 160,
      })
    }
    setOpen(true)
  }

  const handleTriggerClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (open) {
      setOpen(false)
    } else {
      openMenu()
    }
  }

  const handleProfile = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpen(false)
    onProfile()
  }

  const handleLogout = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpen(false)
    onLogout()
  }

  return (
    <>
      <div className="account-menu">
        <button
          ref={triggerRef}
          type="button"
          className={`account-menu-trigger ${triggerClassName}`.trim()}
          onClick={handleTriggerClick}
          aria-expanded={open}
          aria-haspopup="true"
          title="Account"
        >
          <span className="account-menu-initials">{initials}</span>
        </button>
      </div>
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="account-menu-dropdown account-menu-dropdown-portal"
          style={menuStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="account-menu-item" onClick={handleProfile}>
            <User size={16} className="account-menu-item-icon" />
            Profile
          </button>
          <button type="button" className="account-menu-item account-menu-item-logout" onClick={handleLogout}>
            <LogOut size={16} className="account-menu-item-icon" />
            Log out
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
