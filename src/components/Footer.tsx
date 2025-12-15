'use client'

import { PortfolioData } from '@/data/portfolio'

interface FooterProps {
  data: PortfolioData
}

export default function Footer({ data }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent mb-6 md:mb-0">
            {data.name}
          </div>
          <div className="text-gray-400 text-sm">
            &copy; 2024 {data.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
