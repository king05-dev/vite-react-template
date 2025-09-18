import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../pages/Users'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  const { t } = useTranslation()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#e53e3e'
      case 'manager': return '#dd6b20'
      case 'operator': return '#38a169'
      case 'viewer': return '#3182ce'
      default: return '#718096'
    }
  }


  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No users found</h3>
        <p>No users match your current filters. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="user-list">
      <div className="user-table">
        <div className="table-header">
          <div className="header-cell">User</div>
          <div className="header-cell">Role</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Created</div>
          <div className="header-cell">Last Login</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || user.email} />
                  ) : (
                    <div className="avatar-placeholder">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  {user._isTemp && <div className="temp-indicator">📱</div>}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name || 'No name'}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              <div className="user-role">
                <span 
                  className="role-badge"
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {user.role}
                </span>
              </div>

              <div className="user-status">
                <span 
                  className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="user-created">
                {formatDate(user.created_at)}
              </div>

              <div className="user-login">
                Never
              </div>

              <div className="user-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEdit(user)}
                  title={t('edit')}
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDelete(user)}
                  title={t('delete')}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
