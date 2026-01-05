'use client'

import { useState, useEffect } from 'react'
import { portfolioData, PortfolioData } from '@/data/portfolio'
import { logger } from '@/lib/logger'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AdminAuth from '@/components/AdminAuth'
import EditToolbar from '@/components/EditToolbar'
import DynamicTitle from '@/components/DynamicTitle'
import Toast from '@/components/Toast'

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [editData, setEditData] = useState<PortfolioData | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAdmin(true)
      logger.debug('Admin token found')
    }

    const loadData = async () => {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const serverData = await response.json()
          if (!serverData.customSections) {
            serverData.customSections = []
          }
          setData(serverData)
          setEditData(serverData)
          logger.info('Portfolio data loaded from server')
          setIsLoading(false)
          return
        }
      } catch (error) {
        logger.warn('Failed to load server data, using defaults', error)
      }
      
      // Fallback to default data
      const defaultData = { ...portfolioData }
      if (!defaultData.customSections) {
        defaultData.customSections = []
      }
      setData(defaultData)
      setEditData(defaultData)
      logger.info('Using default portfolio data')
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000)
  }

  const handleEditChange = (newData: PortfolioData) => {
    setEditData(newData)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(editData)
      })
      
      if (response.ok) {
        setData(editData)
        setIsEditMode(false)
        showToast('Changes saved! Visible to all visitors.', 'success')
        logger.info('Portfolio data saved successfully')
      } else {
        const error = await response.json()
        showToast(error.message || 'Failed to save changes', 'error')
        logger.error('Failed to save portfolio', error)
      }
    } catch (error) {
      showToast('Error saving changes', 'error')
      logger.error('Error during portfolio save', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData(data)
    setIsEditMode(false)
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
    localStorage.setItem('admin_token', 'authenticated')
    logger.info('Admin login successful')
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setIsEditMode(false)
    localStorage.removeItem('admin_token')
    logger.info('Admin logout')
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-indigo-500 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Portfolio</h2>
          <p className="text-gray-400">Please wait a moment...</p>
        </div>
      </div>
    )
  }

  const displayData = isEditMode ? editData : data

  return (
    <main>
      <DynamicTitle name={displayData?.name ?? 'Portfolio'} />
      <Navbar isAdmin={isAdmin} onAdminLogout={handleAdminLogout} data={displayData} />
      {isEditMode && isAdmin && (
        <EditToolbar onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
      )}
      {!isAdmin && <AdminAuth onLogin={handleAdminLogin} />}
      <Hero
        data={displayData}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <About
        data={displayData}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <Projects data={displayData} isEditMode={isEditMode} onDataChange={handleEditChange} />
      <Skills
        data={displayData}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <Contact data={displayData} />
      <Footer data={displayData} />

      {isAdmin && !isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-40 transition disabled:opacity-50"
          disabled={isLoading}
        >
          ✏️ Edit
        </button>
      )}
      
      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'info' })} 
        />
      )}
    </main>
  )
}
