import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const stats = [
    { title: 'Active Vessels', value: '12', icon: '🚢', color: 'blue' },
    { title: 'Crew Members', value: '48', icon: '👥', color: 'green' },
    { title: 'Pending Maintenance', value: '7', icon: '🔧', color: 'orange' },
    { title: 'Active Routes', value: '5', icon: '🗺️', color: 'purple' }
  ]

  const recentActivities = [
    { id: 1, type: 'vessel', message: 'MV Ocean Explorer departed from Port A', time: '2 hours ago', icon: '🚢' },
    { id: 2, type: 'maintenance', message: 'Engine maintenance completed on MV Sea Hawk', time: '4 hours ago', icon: '🔧' },
    { id: 3, type: 'crew', message: 'New crew member John Smith assigned to MV Blue Wave', time: '6 hours ago', icon: '👥' },
    { id: 4, type: 'alert', message: 'Weather alert: Storm approaching Route 7', time: '8 hours ago', icon: '⚠️' }
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <h1>Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Captain'}! 👋</h1>
        <p>Here's what's happening with your marine operations today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-message">{activity.message}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="action-btn primary">
              <span className="action-icon">➕</span>
              Add New Vessel
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">👥</span>
              Manage Crew
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">📋</span>
              Schedule Maintenance
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">📊</span>
              Generate Report
            </button>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Weather Conditions</h3>
          </div>
          <div className="weather-widget">
            <div className="weather-current">
              <div className="weather-icon">☀️</div>
              <div className="weather-info">
                <div className="weather-temp">24°C</div>
                <div className="weather-desc">Clear Skies</div>
              </div>
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <span className="detail-label">Wind:</span>
                <span className="detail-value">15 km/h NE</span>
              </div>
              <div className="weather-detail">
                <span className="detail-label">Visibility:</span>
                <span className="detail-value">10 km</span>
              </div>
              <div className="weather-detail">
                <span className="detail-label">Wave Height:</span>
                <span className="detail-value">1.2 m</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>System Status</h3>
          </div>
          <div className="system-status">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>GPS Tracking</span>
              <span className="status-badge online">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Communication</span>
              <span className="status-badge online">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span>Weather Service</span>
              <span className="status-badge warning">Limited</span>
            </div>
            <div className="status-item">
              <div className="status-indicator offline"></div>
              <span>Backup Systems</span>
              <span className="status-badge offline">Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
