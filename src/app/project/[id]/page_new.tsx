'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { portfolioData, PortfolioData, Project, CustomSection } from '@/data/portfolio'
import { compressImage } from '@/utils/imageCompress'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState(portfolioData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [imageError, setImageError] = useState('')
  const [draggedSection, setDraggedSection] = useState<string | null>(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) setIsAdmin(true)

    const savedData = localStorage.getItem('portfolioData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setData(parsed)
    }
  }, [])

  const project = data.projects.find((p) => p.id === parseInt(params.id))

  useEffect(() => {
    setEditProject(project ? { ...project, sections: project.sections || [] } : null)
    setIsEditMode(false)
  }, [project])

  const startEdit = () => setIsEditMode(true)
  const cancelEdit = () => {
    setIsEditMode(false)
    setEditProject(project ? { ...project } : null)
    setImageError('')
  }

  const saveEdit = () => {
    if (!editProject) return
    const updated = { ...data, projects: data.projects.map((p) => (p.id === editProject.id ? editProject : p)) }
    localStorage.setItem('portfolioData', JSON.stringify(updated))
    setData(updated)
    setIsEditMode(false)
    router.replace(`/project/${editProject.id}`)
  }

  const deleteProject = () => {
    if (!project) return
    if (!confirm('Delete this project? This action cannot be undone.')) return
    const updated = { ...data, projects: data.projects.filter((p) => p.id !== project.id) }
    localStorage.setItem('portfolioData', JSON.stringify(updated))
    setData(updated)
    router.push('/#projects')
  }

  const updateEditField = (field: keyof Project, value: any) => {
    if (!editProject) return
    setEditProject({ ...editProject, [field]: value })
  }

  // Technologies
  const addTech = () => {
    if (!editProject) return
    setEditProject({ ...editProject, technologies: [...editProject.technologies, 'New Tech'] })
  }

  const removeTech = (idx: number) => {
    if (!editProject) return
    const techs = editProject.technologies.filter((_, i) => i !== idx)
    setEditProject({ ...editProject, technologies: techs })
  }

  // Custom Sections
  const addSection = () => {
    if (!editProject) return
    const sections = editProject.sections || []
    setEditProject({
      ...editProject,
      sections: [...sections, { id: Date.now().toString(), title: '', content: '' }],
    })
  }

  const removeSection = (sectionId: string) => {
    if (!editProject) return
    setEditProject({
      ...editProject,
      sections: (editProject.sections || []).filter((s) => s.id !== sectionId),
    })
  }

  const updateSection = (sectionId: string, field: keyof CustomSection, value: string) => {
    if (!editProject) return
    const sections = editProject.sections || []
    setEditProject({
      ...editProject,
      sections: sections.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s)),
    })
  }

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedSection || !editProject) return

    const sections = editProject.sections || []
    const draggedIdx = sections.findIndex((s) => s.id === draggedSection)
    const targetIdx = sections.findIndex((s) => s.id === targetId)

    if (draggedIdx === -1 || targetIdx === -1) return

    const newSections = [...sections]
    ;[newSections[draggedIdx], newSections[targetIdx]] = [newSections[targetIdx], newSections[draggedIdx]]
    
    setEditProject({ ...editProject, sections: newSections })
    setDraggedSection(null)
  }

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('')
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB')
      return
    }

    try {
      const compressedBase64 = await compressImage(file, 1200, 0.8)
      updateEditField('image', compressedBase64)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to compress image')
    }
  }

  const deleteImage = () => {
    updateEditField('image', undefined)
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/#projects" className="text-indigo-400 hover:text-indigo-300 text-lg">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href="/#projects" className="text-white hover:text-gray-200 flex items-center gap-2 mb-2">
              ← Back to Projects
            </Link>
            {isEditMode ? (
              <input
                value={editProject?.title || ''}
                onChange={(e) => updateEditField('title', e.target.value)}
                className="text-4xl md:text-5xl font-bold mb-2 w-full bg-white/10 text-white rounded-lg p-2 border border-white/20"
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
            )}
            <div className="text-sm text-indigo-100">Project ID: {project.id}</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {isAdmin && !isEditMode && (
              <>
                <button onClick={startEdit} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                  Edit
                </button>
                <button onClick={deleteProject} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                  Delete
                </button>
              </>
            )}

            {isEditMode && (
              <>
                <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                  Save
                </button>
                <button onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Image Section */}
        <section className="mb-12">
          {isEditMode ? (
            <div>
              <h2 className="text-3xl font-bold text-indigo-400 mb-4">Project Image</h2>
              <div className="mb-4">
                {editProject?.image ? (
                  <div className="relative">
                    <img src={editProject.image} alt={editProject.title} className="w-full h-96 object-cover rounded-2xl" />
                    <button
                      onClick={deleteImage}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Delete Image
                    </button>
                  </div>
                ) : (
                  <div className="h-96 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <div className="text-8xl text-indigo-400 opacity-20">{'</>'}</div>
                  </div>
                )}
              </div>
              <label className="block mb-2 text-sm text-gray-300">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 rounded bg-gray-800 text-white mb-2" />
              {imageError && <p className="text-red-400 text-sm">{imageError}</p>}
              <p className="text-xs text-gray-400">Max 5MB. Will be compressed automatically.</p>
            </div>
          ) : (
            <div className="h-96 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 rounded-2xl mb-12 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
              {editProject?.image ? (
                <img src={editProject.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl text-indigo-400 opacity-20">{'</>'}</div>
              )}
            </div>
          )}
        </section>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-400 mb-4">Description</h2>
          {isEditMode ? (
            <textarea
              value={editProject?.description || ''}
              onChange={(e) => updateEditField('description', e.target.value)}
              className="w-full text-lg text-gray-900 bg-white rounded-lg p-4"
              rows={6}
            />
          ) : (
            <p className="text-xl text-gray-300 leading-relaxed">{project.description}</p>
          )}
        </section>

        {/* Add Section Button - Under Description */}
        {isEditMode && (
          <div className="mb-12">
            <button onClick={addSection} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
              + Add Custom Section
            </button>
          </div>
        )}

        {/* Custom Sections */}
        {(editProject?.sections && editProject.sections.length > 0) && (
          <section className="mb-12">
            <div className="space-y-6">
              {editProject.sections.map((section, idx) => (
                <div
                  key={section.id}
                  draggable={isEditMode}
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section.id)}
                  className={`${isEditMode ? 'cursor-move bg-gray-800/50' : ''} ${draggedSection === section.id ? 'opacity-50' : ''}`}
                >
                  {isEditMode ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-400 text-sm">≡</span>
                        <input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-900 text-white rounded border border-gray-700 text-xl font-bold"
                          placeholder="Section Title"
                        />
                        <button
                          onClick={() => removeSection(section.id)}
                          className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700"
                        rows={4}
                        placeholder="Section Content"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-indigo-400 mb-3">{section.title}</h3>
                      <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-400 mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {isEditMode
              ? editProject?.technologies.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={tech}
                      onChange={(e) => {
                        if (!editProject) return
                        const copy = [...editProject.technologies]
                        copy[idx] = e.target.value
                        setEditProject({ ...editProject, technologies: copy })
                      }}
                      className="px-4 py-2 rounded-full bg-white text-gray-900 border"
                    />
                    <button onClick={() => removeTech(idx)} className="px-2 py-2 bg-red-600 text-white rounded">
                      ✕
                    </button>
                  </div>
                ))
              : project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-6 py-3 bg-indigo-600/30 text-indigo-300 rounded-full text-lg font-medium border border-indigo-500">
                    {tech}
                  </span>
                ))}
          </div>

          {isEditMode && (
            <div className="mt-4">
              <button onClick={addTech} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                + Add Tech
              </button>
            </div>
          )}
        </section>

        {/* View Project Link */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-400 mb-6">View Project</h2>
          {isEditMode ? (
            <div>
              <label className="block mb-2 text-sm text-gray-300">Project Link</label>
              <input
                value={editProject?.link || ''}
                onChange={(e) => updateEditField('link', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900"
              />
            </div>
          ) : project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-indigo-500/50"
            >
              Open Live Project →
            </a>
          ) : (
            <p className="text-gray-400">No project link provided</p>
          )}
        </section>

        {/* Other Projects */}
        {data.projects.filter((p) => p.id !== project.id).length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-700">
            <h2 className="text-3xl font-bold text-indigo-400 mb-8">Other Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects
                .filter((p) => p.id !== project.id)
                .slice(0, 6)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/project/${p.id}`}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition group"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                      {p.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{p.description}</p>
                    <div className="text-indigo-400 group-hover:text-indigo-300 font-semibold transition">
                      View Project →
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
