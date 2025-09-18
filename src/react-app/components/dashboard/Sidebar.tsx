import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  // Use a try-catch to handle i18n not being ready
  let t: (key: string) => string
  let ready = false
  
  try {
    const translation = useTranslation()
    t = translation.t
    ready = translation.ready
  } catch (error) {
    // Fallback function if i18n isn't ready
    t = (key: string) => key
    ready = false
  }
  
  // Fallback while i18n is loading
  if (!ready) {
    const fallbackMenuItems = [
      { path: '/dashboard', icon: '📊', label: 'Dashboard', exact: true },
      { path: '/dashboard/users', icon: '👤', label: 'Users' },
      { path: '/dashboard/vessels', icon: '🚢', label: 'Vessels' },
      { path: '/dashboard/crew', icon: '👥', label: 'Crew' },
      { path: '/dashboard/maintenance', icon: '🔧', label: 'Maintenance' },
      { path: '/dashboard/logistics', icon: '📦', label: 'Logistics' },
      { path: '/dashboard/reports', icon: '📈', label: 'Reports' },
      { path: '/dashboard/settings', icon: '⚙️', label: 'Settings' }
    ]
    
    return (
      <>
        {isOpen && (
          <div className="sidebar-overlay" onClick={onToggle} />
        )}
        
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="logo-icon">🌊</span>
              {isOpen && <span className="logo-text">MarineHub</span>}
            </div>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {fallbackMenuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {isOpen && <span className="nav-label">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-version">
              {isOpen && <span>v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>}
            </div>
          </div>
        </aside>
      </>
    )
  }
  
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: t('dashboard'), exact: true },
    { path: '/dashboard/users', icon: '👤', label: t('users') },
    { path: '/dashboard/vessels', icon: '🚢', label: t('vessels') },
    { path: '/dashboard/crew', icon: '👥', label: t('crew') },
    { path: '/dashboard/maintenance', icon: '🔧', label: t('maintenance') },
    { path: '/dashboard/logistics', icon: '📦', label: t('logistics') },
    { path: '/dashboard/reports', icon: '📈', label: t('reports') },
    { path: '/dashboard/settings', icon: '⚙️', label: t('settings') }
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🌊</span>
            {isOpen && <span className="logo-text">MarineHub</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">
            {isOpen && <span>v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>}
          </div>
        </div>
      </aside>
    </>
  )
}
