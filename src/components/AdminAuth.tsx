'use client'

import { useState } from 'react'

interface AdminAuthProps {
  onLogin: () => void
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Default password - CHANGE THIS!
  const ADMIN_PASSWORD = 'admin123'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onLogin()
      setShowAuth(false)
      setPassword('')
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <>
      {!showAuth && (
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAuth(false)
                    setPassword('')
                    setError('')
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              ⚠️ Change the default password in the code!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
