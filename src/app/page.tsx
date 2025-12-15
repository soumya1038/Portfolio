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

export default function Home() {
  const [data, setData] = useState(portfolioData)
  const [editData, setEditData] = useState(portfolioData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAdmin(true)
    }

    const savedData = localStorage.getItem('portfolioData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      // Ensure customSections exists for backward compatibility
      if (!parsed.customSections) {
        parsed.customSections = []
      }
      setData(parsed)
      setEditData(parsed)
    }
  }, [])

  const handleEditChange = (newData: PortfolioData) => {
    setEditData(newData)
  }

  const handleSave = () => {
    setData(editData)
    localStorage.setItem('portfolioData', JSON.stringify(editData))
    setIsEditMode(false)
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
      <Navbar isAdmin={isAdmin} onAdminLogout={handleAdminLogout} />
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
      <Contact data={data} />
      <Footer data={data} />

      {isAdmin && !isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-40 transition"
        >
          ✏️ Edit
        </button>
      )}
    </main>
  )
}
