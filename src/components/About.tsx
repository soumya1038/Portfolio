'use client'

import { PortfolioData } from '@/data/portfolio'

interface AboutProps {
  data: PortfolioData
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function About({ data, isEditMode, onDataChange }: AboutProps) {
  const handleChange = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value })
    }
  }

  return (
    <section id="about" className="section section-dark">
      <div className="container-custom">
        <div className="max-w-3xl space-y-6 animate-fade-in-up">
          <h2 className="heading text-white">About Me</h2>
          {isEditMode ? (
            <textarea
              value={data.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full text-lg text-gray-300 bg-gray-800 border-2 border-indigo-500 rounded-lg p-4 leading-relaxed"
              rows={4}
              placeholder="Tell your story..."
            />
          ) : (
            <p className="text-lg text-gray-300 leading-relaxed">{data.bio}</p>
          )}
        </div>
      </div>
    </section>
  )
}
