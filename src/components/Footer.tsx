'use client'

import { PortfolioData } from '@/data/portfolio'

interface FooterProps {
  data: PortfolioData
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800/50 border-t border-gray-700 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {data?.name}
            </h3>
            <p className="text-gray-400 text-sm">Building beautiful digital experiences</p>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Made with <span className="text-red-500">❤️</span> using Next.js & Tailwind CSS
            </p>
          </div>

          {/* Copy */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} {data?.name}. All rights reserved.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-500 text-xs">
            Designed & developed by {data?.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
