'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PortfolioData, Project } from '@/data/portfolio'
import CreateProjectModal from './CreateProjectModal'

interface ProjectsProps {
  data: PortfolioData
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function Projects({ data, onDataChange }: ProjectsProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setIsAdmin(!!token)
  }, [])

  const handleCreate = (project: Project) => {
    // ensure unique id
    const maxId = data.projects.reduce((acc, p) => Math.max(acc, p.id), 0)
    const newId = project.id || maxId + 1
    const newProject = { ...project, id: newId }
    const updated: PortfolioData = { ...data, projects: [newProject, ...data.projects] }
    localStorage.setItem('portfolioData', JSON.stringify(updated))
    if (onDataChange) onDataChange(updated)
    setModalOpen(false)
    // navigate to the new project page
    router.push(`/project/${newId}`)
  }

  return (
    <section id="projects" className="section bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading text-white text-left">Featured Projects</h2>
          {isAdmin && (
            <div>
              <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold text-white">
                + New Project
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl text-indigo-400 opacity-20">{'<' + '>'}</div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-full text-sm font-medium">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 font-semibold transition group-hover:translate-x-1">
                View Full Details →
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  )
}
