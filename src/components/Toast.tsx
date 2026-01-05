'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  type?: 'success' | 'error' | 'info' | 'warning'
}

export default function Toast({ message, onClose, type = 'info' }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  }

  return (
    <div className={`fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in`}>
      <span className="text-lg font-bold">{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}