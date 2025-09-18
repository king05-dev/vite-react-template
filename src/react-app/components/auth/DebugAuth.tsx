import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

export const DebugAuth: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSupabaseConnection = async () => {
    setLoading(true)
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      
      const debugData = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        currentSession: data.session,
        connectionError: error,
        timestamp: new Date().toISOString()
      }
      
      setDebugInfo(debugData)
      console.log('Supabase Debug Info:', debugData)
    } catch (err) {
      console.error('Debug error:', err)
      setDebugInfo({ error: err })
    }
    setLoading(false)
  }

  const testUserExists = async () => {
    setLoading(true)
    try {
      // Try to get user info (this will show if user exists and is confirmed)
      const { data, error } = await supabase.auth.admin.getUserById('test')
      console.log('User test result:', { data, error })
      
      // Also check if we can query the auth.users table (requires service role)
      const { data: users, error: usersError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', 'jerquinbayudo@gmail.com')
        
      console.log('Users query result:', { users, usersError })
      
    } catch (err) {
      console.error('User test error:', err)
    }
    setLoading(false)
  }

  const resetUserPassword = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        'jerquinbayudo@gmail.com',
        {
          redirectTo: window.location.origin + '/dashboard'
        }
      )
      
      if (error) {
        console.error('Password reset error:', error)
        alert('Password reset error: ' + error.message)
      } else {
        alert('Password reset email sent! Check your inbox.')
      }
    } catch (err) {
      console.error('Password reset error:', err)
    }
    setLoading(false)
  }

  const createTestUser = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'jerquinbayudo@gmail.com',
        password: 'Default123',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })
      
      if (error) {
        console.error('User creation error:', error)
        alert('User creation error: ' + error.message)
      } else {
        console.log('User created:', data)
        alert('User created successfully! Check your email for confirmation.')
      }
    } catch (err) {
      console.error('User creation error:', err)
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      borderRadius: '8px',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4>🔧 Auth Debug Panel</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={checkSupabaseConnection}
          disabled={loading}
          style={{ marginRight: '5px', padding: '5px 10px', fontSize: '11px' }}
        >
          Check Connection
        </button>
        
        <button 
          onClick={testUserExists}
          disabled={loading}
          style={{ marginRight: '5px', padding: '5px 10px', fontSize: '11px' }}
        >
          Test User
        </button>
        
        <button 
          onClick={resetUserPassword}
          disabled={loading}
          style={{ marginRight: '5px', padding: '5px 10px', fontSize: '11px' }}
        >
          Reset Password
        </button>
        
        <button 
          onClick={createTestUser}
          disabled={loading}
          style={{ padding: '5px 10px', fontSize: '11px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Create Test User
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {debugInfo && (
        <pre style={{ 
          fontSize: '10px', 
          background: '#f5f5f5', 
          padding: '5px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  )
}
