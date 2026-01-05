'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger'

interface AdminAuthProps {
  onLogin: () => void
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  // Get password from environment variable or use default
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  // Prevent brute force attacks
  const MAX_ATTEMPTS = 5
  const isLocked = attempts >= MAX_ATTEMPTS

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLocked) {
      setError('Too many failed attempts. Please try again later.')
      return
    }

    // Validate password is not empty
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    // Validate password matches
    if (password === ADMIN_PASSWORD) {
      onLogin()
      setShowAuth(false)
      setPassword('')
      setError('')
      setAttempts(0)
      logger.info('Admin login successful')
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`)
      setPassword('')
      logger.warn('Failed admin login attempt', { attempts: newAttempts })
    }
  }

  const handleClose = () => {
    setShowAuth(false)
    setPassword('')
    setError('')
  }

  return (
    <>
      {!showAuth && !isLocked && (
        <button
          onClick={() => setShowAuth(true)}
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 py-2 rounded text-xs transition z-40"
          title="Admin login"
        >
          🔐
        </button>
      )}

      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
            
            {error && (
              <div className={`mb-4 p-3 rounded text-sm ${isLocked ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  disabled={isLocked}
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50"
                  disabled={isLocked}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLocked || !password}
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              💡 Set NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
            </p>
          </div>
        </div>
      )}

      {isLocked && (
        <button
          onClick={() => {
            setAttempts(0)
            setError('')
            setShowAuth(true)
          }}
          className="fixed bottom-4 right-4 bg-red-800 hover:bg-red-700 text-white px-3 py-2 rounded text-xs transition z-40"
          title="Account locked. Click to retry."
        >
          🔒 Locked
        </button>
      )}
    </>
  )
}
