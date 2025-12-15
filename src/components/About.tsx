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
    <section id="about" className="section bg-white">
      <div className="container-custom">
        <div className="max-w-3xl">
          <h2 className="heading text-gray-900">About Me</h2>
          {isEditMode ? (
            <textarea
              value={data.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full text-xl text-gray-700 bg-gray-100 border-2 border-indigo-500 rounded-lg p-3 leading-relaxed mb-8"
              rows={4}
            />
          ) : (
            <p className="text-xl text-gray-700 leading-relaxed mb-8">{data.bio}</p>
          )}
        </div>
      </div>
    </section>
  )
}
