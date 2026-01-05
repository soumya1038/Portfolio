'use client'

import { PortfolioData } from '@/data/portfolio'
import { sanitizeString } from '@/lib/validation'

interface HeroProps {
  data: PortfolioData | null
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function Hero({ data, isEditMode, onDataChange }: HeroProps) {
  if (!data) return null

  const handleChange = (field: string, value: string) => {
    if (onDataChange) {
      const sanitized = sanitizeString(value, field === 'name' ? 100 : 500)
      onDataChange({ ...data, [field]: sanitized })
    }
  }

  return (
    <section id="hero" className="section section-dark relative overflow-hidden pt-32 md:pt-40">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6 animate-fade-in-up">
            {isEditMode ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full text-5xl md:text-6xl font-bold text-white bg-gray-800 border-2 border-indigo-500 rounded-lg p-3"
                    placeholder="Your name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-2xl md:text-3xl text-cyan-300 bg-gray-800 border-2 border-indigo-500 rounded-lg p-3 font-semibold"
                    placeholder="Your professional title"
                    maxLength={200}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Bio</label>
                  <textarea
                    value={data.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full text-lg text-gray-300 bg-gray-800 border-2 border-indigo-500 rounded-lg p-3 leading-relaxed"
                    rows={4}
                    placeholder="Tell your story"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">{data.bio.length}/500</p>
                </div>
              </>
            ) : (
              <>
                {/* Greeting */}
                <div className="space-y-2">
                  <p className="text-cyan-400 font-semibold text-lg">👋 Hey there, I&apos;m</p>
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                      {data.name}
                    </span>
                  </h1>
                </div>

                {/* Title / Role */}
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-semibold text-cyan-300">
                    {data.title}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                </div>

                {/* Bio / Value Prop */}
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  {data.bio}
                </p>

                {/* Tech Stack Badges */}
                {data.skills && data.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {data.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="badge">
                        {skill}
                      </span>
                    ))}
                    {data.skills.length > 5 && (
                      <span className="badge">
                        +{data.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <a 
                href="#projects" 
                className="btn-primary text-center text-lg px-8 py-3 group"
              >
                <span className="flex items-center justify-center gap-2">
                  View My Work
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a 
                href="#contact" 
                className="btn-secondary text-center text-lg px-8 py-3 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Get In Touch
                  <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Social Proof / Status */}
            <div className="pt-4 flex items-center gap-4 text-sm text-gray-400 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Open to opportunities</span>
              </div>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative hidden lg:block animate-fade-in-down">
            <div className="relative w-full aspect-square">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl opacity-0 blur-2xl group-hover:opacity-100 transition-opacity"></div>
              
              {/* Main card */}
              <div className="relative w-full h-full bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 border border-indigo-500/20 rounded-2xl backdrop-blur-lg p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 opacity-20 blur-2xl"></div>
                  <h3 className="text-xl font-bold text-indigo-300">Ready to collaborate?</h3>
                  <p className="text-gray-400">Let&apos;s build something amazing together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
