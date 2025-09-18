import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useAuth } from '../../contexts/AuthContext'
import { LanguageSwitcher } from '../common/LanguageSwitcher'

interface HeaderProps {
  user: User | null
  onToggleSidebar: () => void
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
  }

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
      return
    }

    // Always show install button for PWA
    setShowInstallButton(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User ${outcome} the install prompt`)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } else {
      // Show manual installation instructions
      const instructions = `Install MarineHub as an app:

Desktop:
• Chrome: Look for install icon (⊕) in address bar
• Edge: Menu → Apps → "Install this site as an app"
• Firefox: Menu → "Install this site as an app"

Mobile:
• Chrome: Menu → "Add to Home screen"
• Safari: Share → "Add to Home Screen"
• Edge: Menu → "Apps" → "Install this site"`

      alert(instructions)
    }
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1>Marine Hub Manager</h1>
        <div className="notification-badge">3</div>
      </div>
      
      <div className="header-right">
        {showInstallButton && (
          <button 
            onClick={handleInstallClick}
            className="install-app-btn"
            title="Install MarineHub as an app"
          >
            📱 Install App
          </button>
        )}
        
        <LanguageSwitcher />
        
        <div className="user-menu">
          <button 
            className="user-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              <span>{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
            </div>
            <span className="user-name">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-info">
                  <div className="user-full-name">
                    {user?.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item">
                    <span className="item-icon">👤</span>
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">
                    <span className="item-icon">⚙️</span>
                    Settings
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">
                    <span className="item-icon">❓</span>
                    Help
                  </button>
                </li>
                <div className="dropdown-divider"></div>
                <li>
                  <button className="dropdown-item sign-out" onClick={handleSignOut}>
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdown */}
      {dropdownOpen && (
        <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
      )}
    </header>
  )
}
