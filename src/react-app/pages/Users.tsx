import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { offlineService } from '../lib/offline-service'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  is_active: boolean
  created_at: string
  username?: string
  phone_number?: string
  is_staff?: boolean
  _isTemp?: boolean
}

export const Users: React.FC = () => {
  // Use try-catch to handle i18n not being ready
  let t: (key: string) => string
  try {
    const translation = useTranslation()
    t = translation.t
  } catch (error) {
    // Fallback function if i18n isn't ready
    t = (key: string) => key
  }
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading users from table: users')
      const data = await offlineService.read<User>('users')
      console.log('Users data received:', data)
      
      // Handle both single user and array of users
      if (Array.isArray(data)) {
        setUsers(data)
        console.log(`Loaded ${data.length} users`)
      } else if (data) {
        setUsers([data])
        console.log('Loaded 1 user')
      } else {
        setUsers([])
        console.log('No users found')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users'
      setError(errorMessage)
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#e53e3e'
      case 'marina_staff': return '#dd6b20'
      case 'technician': return '#38a169'
      case 'insurer_adjuster': return '#3182ce'
      case 'boat_owner': return '#805ad5'
      default: return '#718096'
    }
  }

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user)
    // TODO: Implement edit functionality
  }

  const handleDeleteUser = (user: User) => {
    console.log('Delete user:', user)
    // TODO: Implement delete functionality
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div className="header-content">
          <h1>{t('userManagement')}</h1>
          <p>Manage system users, roles, and permissions with offline-first approach</p>
        </div>
        <button className="add-user-btn">
          <span className="btn-icon">👤</span>
          {t('addUser')}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="users-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : (
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No users found</h3>
                <p>No users match your current search criteria.</p>
                {users.length > 0 && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="user-table">
                <div className="table-header">
                  <div className="header-cell">User</div>
                  <div className="header-cell">Role</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Created</div>
                  <div className="header-cell">Actions</div>
                </div>

                <div className="table-body">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="table-row">
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {user._isTemp && <div className="temp-indicator">📱</div>}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                          {user.username && (
                            <div className="user-username">@{user.username}</div>
                          )}
                        </div>
                      </div>

                      <div className="user-role">
                        <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="user-status">
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="user-created">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>

                      <div className="user-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
