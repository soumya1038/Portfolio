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
      const newSkills = [...(data.skills || [])]
      newSkills[index] = value
      onDataChange({ ...data, skills: newSkills })
    }
  }

  const handleAddSkill = () => {
    if (onDataChange) {
      onDataChange({ ...data, skills: [...(data.skills || []), 'New Skill'] })
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (onDataChange) {
      const newSkills = (data.skills || []).filter((_, i) => i !== index)
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
    <section id="skills" className="section bg-white">
      <div className="container-custom">
        <h2 className="heading text-gray-900 text-center mb-16">My Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.skills?.map((skill, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br from-indigo-50 to-pink-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 ${
                isEditMode ? 'hover:scale-105' : 'hover:scale-105'
              }`}
            >
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    className="w-full text-lg font-bold text-gray-900 bg-white border-2 border-indigo-500 rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-900">{skill}</p>
              )}
            </div>
          ))}
        </div>
        {isEditMode && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAddSkill}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              + Add Skill
            </button>
          </div>
        )}



        {/* Add Custom Section Button */}
        {isEditMode && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowCustomSectionForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              + Add Custom Section
            </button>
          </div>
        )}

        {/* New Custom Section Form */}
        {showCustomSectionForm && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-white font-medium">New Custom Section</h4>
                <button
                  onClick={() => {
                    setShowCustomSectionForm(false)
                    setNewSection({ title: '', content: '' })
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Section Title"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Section Content"
                value={newSection.content}
                onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomSection}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowCustomSectionForm(false)
                    setNewSection({ title: '', content: '' })
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <div className="mt-12 space-y-8">
            {data.customSections.map((section) => (
              <div key={section.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  {isEditMode && (
                    <button
                      onClick={() => handleRemoveCustomSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="text-gray-600 leading-relaxed">
                  {section.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
