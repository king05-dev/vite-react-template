import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Users } from './pages/Users'
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt'
import './App.css'

function App() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="vessels" element={<div>Vessels Page (Coming Soon)</div>} />
                      <Route path="crew" element={<div>Crew Management Page (Coming Soon)</div>} />
                      <Route path="maintenance" element={<div>Maintenance Page (Coming Soon)</div>} />
                      <Route path="logistics" element={<div>Logistics Page (Coming Soon)</div>} />
                      <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
                      <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <PWAInstallPrompt />
        </Router>
      </AuthProvider>
    </Suspense>
  )
}

export default App
