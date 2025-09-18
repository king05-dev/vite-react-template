import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Use try-catch to handle i18n not being ready
  let i18n: any
  try {
    const translation = useTranslation()
    i18n = translation.i18n
  } catch (error) {
    // Return null if i18n isn't ready
    return null
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-name">{currentLanguage.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="language-overlay" onClick={() => setIsOpen(false)} />
      )}

      <style>{`
        .language-switcher {
          position: relative;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          color: #4a5568;
        }

        .language-button:hover {
          background-color: #f7fafc;
        }

        .language-flag {
          font-size: 1.2rem;
        }

        .language-name {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
          transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
        }

        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          min-width: 150px;
          z-index: 1000;
          margin-top: 4px;
          padding: 4px 0;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: #4a5568;
        }

        .language-option:hover {
          background-color: #f7fafc;
        }

        .language-option.active {
          background-color: #edf2f7;
          color: #667eea;
        }

        .language-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }
      `}</style>
    </div>
  )
}
