'use client'

import { useState } from 'react'
import { PortfolioData, CustomSection } from '@/data/portfolio'

interface EditPanelProps {
  data: PortfolioData
  onUpdate: (data: PortfolioData) => void
  onClose: () => void
}

export default function EditPanel({ data, onUpdate, onClose }: EditPanelProps) {
  const [formData, setFormData] = useState(data)
  const [showCustomSectionForm, setShowCustomSectionForm] = useState(false)
  const [newSection, setNewSection] = useState({ title: '', content: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof PortfolioData] as Record<string, unknown>),
          [child]: value,
        },
      } as PortfolioData)
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills]
    newSkills[index] = value
    setFormData({ ...formData, skills: newSkills })
  }

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, 'New Skill'],
    })
  }

  const handleAddCustomSection = () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      const customSection: CustomSection = {
        id: Date.now().toString(),
        title: newSection.title.trim(),
        content: newSection.content.trim()
      }
      setFormData({
        ...formData,
        customSections: [...(formData.customSections || []), customSection]
      })
      setNewSection({ title: '', content: '' })
      setShowCustomSectionForm(false)
    }
  }

  const handleRemoveCustomSection = (id: string) => {
    setFormData({
      ...formData,
      customSections: formData.customSections?.filter(section => section.id !== id) || []
    })
  }

  const handleSave = () => {
    onUpdate(formData)
    alert('Portfolio updated! Changes saved locally.')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="bg-white max-w-2xl mx-auto rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Edit Portfolio</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="social.github"
                    value={formData.social.github || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="social.linkedin"
                    value={formData.social.linkedin || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="social.twitter"
                    value={formData.social.twitter || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
              <div className="space-y-3">
                {formData.skills.map((skill, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                ))}
                <button
                  onClick={handleAddSkill}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-2"
                >
                  + Add Skill
                </button>
              </div>
            </div>

            {/* Custom Sections */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Sections</h3>
              
              {/* Existing Custom Sections */}
              {formData.customSections && formData.customSections.length > 0 && (
                <div className="space-y-4 mb-4">
                  {formData.customSections.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{section.title}</h4>
                        <button
                          onClick={() => handleRemoveCustomSection(section.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{section.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Section Button */}
              <button
                onClick={() => setShowCustomSectionForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium mb-4"
              >
                + Add Custom Section
              </button>

              {/* New Custom Section Form */}
              {showCustomSectionForm && (
                <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">New Custom Section</h4>
                    <button
                      onClick={() => {
                        setShowCustomSectionForm(false)
                        setNewSection({ title: '', content: '' })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Section Content"
                      value={newSection.content}
                      onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCustomSection}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Save Section
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomSectionForm(false)
                        setNewSection({ title: '', content: '' })
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
