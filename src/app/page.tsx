'use client'

import { useState, useEffect } from 'react'
import { portfolioData, PortfolioData } from '@/data/portfolio'
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
  const [data, setData] = useState(portfolioData)
  const [editData, setEditData] = useState(portfolioData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAdmin(true)
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
          return
        }
      } catch (error) {
        console.log('Server data not available')
      }
      
      // Fallback to default data
      if (!portfolioData.customSections) {
        portfolioData.customSections = []
      }
      setData(portfolioData)
      setEditData(portfolioData)
    }
    
    loadData()
  }, [])

  const handleEditChange = (newData: PortfolioData) => {
    setEditData(newData)
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      
      if (response.ok) {
        setData(editData)
        setIsEditMode(false)
        setToast('Changes saved! Visible to all visitors.')
      } else {
        setToast('Failed to save changes')
      }
    } catch (error) {
      setToast('Error saving changes')
    }
  }

  const handleCancel = () => {
    setEditData(data)
    setIsEditMode(false)
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
    localStorage.setItem('admin_token', 'authenticated')
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setIsEditMode(false)
    localStorage.removeItem('admin_token')
  }

  return (
    <main>
      <DynamicTitle name={(isEditMode ? editData : data).name} />
      <Navbar isAdmin={isAdmin} onAdminLogout={handleAdminLogout} data={isEditMode ? editData : data} />
      {isEditMode && isAdmin && (
        <EditToolbar onSave={handleSave} onCancel={handleCancel} />
      )}
      {!isAdmin && <AdminAuth onLogin={handleAdminLogin} />}
      <Hero
        data={isEditMode ? editData : data}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <About
        data={isEditMode ? editData : data}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <Projects data={isEditMode ? editData : data} isEditMode={isEditMode} onDataChange={handleEditChange} />
      <Skills
        data={isEditMode ? editData : data}
        isEditMode={isEditMode}
        onDataChange={handleEditChange}
      />
      <Contact data={isEditMode ? editData : data} />
      <Footer data={isEditMode ? editData : data} />

      {isAdmin && !isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-40 transition"
        >
          ✏️ Edit
        </button>
      )}
      
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </main>
  )
}
