'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



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
    <section id="projects" className="section section-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-5 -translate-y-1/2"></div>
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="mb-16 space-y-4">
          <h2 className="heading text-white text-left animate-fade-in-up">Featured Projects</h2>
          <p className="text-xl text-gray-400 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            A selection of projects I&apos;ve built. Each one solved real problems and taught me something new.
          </p>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 flex items-start gap-3 animate-fade-in-up">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {data.projects.map((project, idx) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group card relative h-full hover:border-cyan-400/50 animate-fade-in-up"
              style={{ animationDelay: `${(idx % 2) * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative mb-6 h-48 bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 border border-indigo-500/20 rounded-lg overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600/20 to-cyan-600/20">
                    <div className="text-6xl opacity-30">{'<' + '>'}</div>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="space-y-4 flex-grow flex flex-col">
                {/* Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-base leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.slice(0, 4).map((tech, tidx) => (
                    <span key={tidx} className="badge text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="badge text-xs">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Footer - Links & CTA */}
                <div className="pt-4 border-t border-gray-700 flex items-center justify-between group">
                  <span className="text-cyan-400 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                    View Details →
                  </span>
                  {isEditMode && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(project.id)
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {data.projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No projects yet. Let&apos;s add your first one!</p>
            {isEditMode && (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
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
