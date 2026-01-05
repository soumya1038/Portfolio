'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { PortfolioData, Project } from '@/data/portfolio'
import { logger } from '@/lib/logger'
import CreateProjectModal from './CreateProjectModal'

interface ProjectsProps {
  data: PortfolioData
  isEditMode?: boolean
  onDataChange?: (data: PortfolioData) => void
}

export default function Projects({ data, isEditMode, onDataChange }: ProjectsProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setIsAdmin(!!token)
  }, [])

  const handleCreate = useCallback(
    async (project: Project) => {
      try {
        setIsLoading(true)
        setError(null)

        const maxId = data.projects.reduce((acc, p) => Math.max(acc, p.id), 0)
        const newId = project.id || maxId + 1
        const newProject = { ...project, id: newId }
        const updated: PortfolioData = { ...data, projects: [newProject, ...data.projects] }
        
        const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        const response = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${password}`
          },
          body: JSON.stringify(updated)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create project')
        }

        if (onDataChange) onDataChange(updated)
        setModalOpen(false)
        logger.info('Project created successfully', { id: newId })
        router.push(`/project/${newId}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create project'
        setError(message)
        logger.error('Error creating project', error)
      } finally {
        setIsLoading(false)
      }
    },
    [data, onDataChange, router]
  )

  const handleDelete = useCallback(
    (projectId: number) => {
      if (!confirm('Are you sure you want to delete this project?')) {
        return
      }

      try {
        const updated: PortfolioData = {
          ...data,
          projects: data.projects.filter((p) => p.id !== projectId),
        }
        if (onDataChange) onDataChange(updated)
        logger.info('Project deleted', { id: projectId })
      } catch (error) {
        logger.error('Error deleting project', error)
      }
    },
    [data, onDataChange]
  )

  return (
    <section id="projects" className="section bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading text-white text-left">Featured Projects</h2>
          {isEditMode && (
            <div>
              <button
                onClick={() => setModalOpen(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + New Project
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-6xl text-indigo-400 opacity-20">{'<' + '>'}</div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed line-clamp-2">
                {project.description}
              </p>
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

      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setError(null)
        }}
        onCreate={handleCreate}
        isLoading={isLoading}
      />
    </section>
  )
}
