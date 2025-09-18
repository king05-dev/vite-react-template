import React, { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    console.log('PWA Install Prompt component mounted')
    
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired', e)
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed')
      return
    }

    // For testing - show prompt after 3 seconds if no beforeinstallprompt event
    const testTimer = setTimeout(() => {
      if (!deferredPrompt) {
        console.log('No beforeinstallprompt event detected, showing test prompt')
        setShowInstallPrompt(true)
      }
    }, 3000)

    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(testTimer)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: Show manual installation instructions
      alert(`To install MarineHub:
      
Desktop:
• Chrome: Click the install icon (⊕) in the address bar
• Edge: Menu → Apps → "Install this site as an app"

Mobile:
• Chrome: Menu → "Add to Home screen"
• Safari: Share → "Add to Home Screen"`)
      setShowInstallPrompt(false)
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="pwa-install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <h3>Install MarineHub</h3>
          <p>Install this app on your device for a better experience</p>
        </div>
        <div className="install-prompt-actions">
          <button onClick={handleInstallClick} className="install-btn">
            Install
          </button>
          <button onClick={handleDismiss} className="dismiss-btn">
            ×
          </button>
        </div>
      </div>

      <style>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .install-prompt-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }

        .install-prompt-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .install-prompt-text {
          flex: 1;
        }

        .install-prompt-text h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
        }

        .install-prompt-text p {
          margin: 0;
          font-size: 14px;
          color: #718096;
        }

        .install-prompt-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .install-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .install-btn:hover {
          background: #5a67d8;
        }

        .dismiss-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .dismiss-btn:hover {
          color: #718096;
        }

        @media (max-width: 768px) {
          .pwa-install-prompt {
            left: 10px;
            right: 10px;
            bottom: 10px;
          }
        }
      `}</style>
    </div>
  )
}
