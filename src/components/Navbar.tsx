'use client'

import { PortfolioData } from '@/data/portfolio'

interface NavbarProps {
  isAdmin: boolean
  onAdminLogout: () => void
  data: PortfolioData
}

export default function Navbar({ isAdmin, onAdminLogout, data }: NavbarProps) {
  return (
    <nav className="fixed w-full top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md border-b border-white border-opacity-10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
            {data.name}
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <a href="#about" className="text-white hover:text-indigo-400 transition">
              About
            </a>
            <a href="#projects" className="text-white hover:text-indigo-400 transition">
              Projects
            </a>
            <a href="#skills" className="text-white hover:text-indigo-400 transition">
              Skills
            </a>
            <a href="#contact" className="text-white hover:text-indigo-400 transition">
              Contact
            </a>
            {isAdmin && (
              <button
                onClick={onAdminLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm md:text-base"
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
