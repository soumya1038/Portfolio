'use client'

import { PortfolioData } from '@/data/portfolio'
import { useState, useEffect } from 'react'

interface NavbarProps {
  isAdmin: boolean
  onAdminLogout: () => void
  data: PortfolioData | null
}

export default function Navbar({ isAdmin, onAdminLogout, data }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Detect active section
      const sections = ['hero', 'about', 'projects', 'skills', 'contact']
      let currentSection = ''

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            currentSection = section
          }
        }
      }

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-700' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#hero"
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            {data?.name || 'Portfolio'}
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative font-medium transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
                )}
              </a>
            ))}
          </div>

          {/* Admin Actions */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={onAdminLogout}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/20"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
