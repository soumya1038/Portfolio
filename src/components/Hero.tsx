'use client'

import { PortfolioData } from '@/data/portfolio'

interface HeroProps {
  data: PortfolioData
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function Hero({ data, isEditMode, onDataChange }: HeroProps) {
  const handleChange = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  return (
    <section className="section bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-40 pb-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {isEditMode ? (
              <>
                <div className="mb-6">
                  <label className="text-gray-400 text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full text-5xl md:text-6xl font-bold text-white bg-gray-800 border-2 border-indigo-500 rounded-lg p-3 mb-2"
                  />
                </div>
                <div className="mb-6">
                  <label className="text-gray-400 text-sm mb-2 block">Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-2xl md:text-3xl text-indigo-300 bg-gray-800 border-2 border-indigo-500 rounded-lg p-3 font-semibold"
                  />
                </div>
                <div className="mb-8">
                  <label className="text-gray-400 text-sm mb-2 block">Bio</label>
                  <textarea
                    value={data.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full text-lg text-gray-300 bg-gray-800 border-2 border-indigo-500 rounded-lg p-3 leading-relaxed max-w-lg"
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Hey, I&apos;m{' '}
                  <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
                    {data.name}
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl text-indigo-300 mb-6 font-semibold">{data.title}</h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">{data.bio}</p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#projects" className="btn-primary inline-block text-center">
                View My Work
              </a>
              <a href="#contact" className="btn-secondary inline-block text-center">
                Get In Touch
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 md:h-full bg-gradient-to-br from-indigo-600 to-pink-600 rounded-2xl opacity-20 blur-3xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full opacity-30 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
