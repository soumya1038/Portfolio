'use client'

import { useState } from 'react'
import { PortfolioData, CustomSection } from '@/data/portfolio'

interface SkillsProps {
  data: PortfolioData
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function Skills({ data, isEditMode, onDataChange }: SkillsProps) {
  const [showCustomSectionForm, setShowCustomSectionForm] = useState(false)
  const [newSection, setNewSection] = useState({ title: '', content: '' })

  const handleSkillChange = (index: number, value: string) => {
    if (onDataChange) {
      const newSkills = [...data.skills]
      newSkills[index] = value
      onDataChange({ ...data, skills: newSkills })
    }
  }

  const handleAddSkill = () => {
    if (onDataChange) {
      onDataChange({ ...data, skills: [...data.skills, 'New Skill'] })
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (onDataChange) {
      const newSkills = data.skills.filter((_, i) => i !== index)
      onDataChange({ ...data, skills: newSkills })
    }
  }

  const handleAddCustomSection = () => {
    if (onDataChange && newSection.title.trim() && newSection.content.trim()) {
      const customSection: CustomSection = {
        id: Date.now().toString(),
        title: newSection.title.trim(),
        content: newSection.content.trim()
      }
      onDataChange({
        ...data,
        customSections: [...(data.customSections || []), customSection]
      })
      setNewSection({ title: '', content: '' })
      setShowCustomSectionForm(false)
    }
  }

  const handleRemoveCustomSection = (id: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        customSections: data.customSections?.filter(section => section.id !== id) || []
      })
    }
  }

  return (
    <section id="skills" className="section section-dark">
      <div className="container-custom">
        <div className="mb-16 space-y-4 animate-fade-in-up">
          <h2 className="heading text-white text-center">My Skills</h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I&apos;ve mastered over my development journey
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="group">
              {isEditMode ? (
                <div className="card space-y-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    className="w-full text-sm font-bold text-white bg-gray-700 border-2 border-indigo-500 rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold py-1 px-2 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="card text-center h-full flex items-center justify-center min-h-24">
                  <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {skill}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Skill Button */}
        {isEditMode && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleAddSkill}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </button>
          </div>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <div className="mt-16 space-y-8">
            {data.customSections.map((section, idx) => (
              <div 
                key={section.id} 
                className="card animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                  {isEditMode && (
                    <button
                      onClick={() => handleRemoveCustomSection(section.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="text-gray-400 leading-relaxed space-y-2">
                  {section.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Section Button */}
        {isEditMode && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowCustomSectionForm(true)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Custom Section
            </button>
          </div>
        )}

        {/* New Custom Section Form */}
        {showCustomSectionForm && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="card space-y-4 border-indigo-500">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">New Custom Section</h4>
                <button
                  onClick={() => {
                    setShowCustomSectionForm(false)
                    setNewSection({ title: '', content: '' })
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Section Title"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Section Content"
                value={newSection.content}
                onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomSection}
                  className="btn-primary flex-1"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowCustomSectionForm(false)
                    setNewSection({ title: '', content: '' })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
