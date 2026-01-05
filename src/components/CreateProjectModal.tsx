"use client"

import { useState } from 'react'
import { Project } from '@/data/portfolio'
import { fetchGitHubRepo } from '@/utils/imageCompress'
import { logger } from '@/lib/logger'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (project: Project) => void
  isLoading?: boolean
}

export default function CreateProjectModal({ isOpen, onClose, onCreate, isLoading = false }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoadingRepo, setIsLoadingRepo] = useState(false)
  const [repoError, setRepoError] = useState('')

  if (!isOpen) return null

  const handleImportFromGitHub = async () => {
    if (!repoUrl.trim()) return
    setIsLoadingRepo(true)
    setRepoError('')

    try {
      const repo = await fetchGitHubRepo(repoUrl)
      setTitle(repo.title)
      setDescription(repo.description)
      setLink(repo.link)
      setTechnologies(repo.technologies.join(', '))
      setRepoUrl('')
      logger.info('GitHub repository imported successfully', { repo: repoUrl })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import repository'
      setRepoError(message)
      logger.error('Failed to import GitHub repository', err)
    } finally {
      setIsLoadingRepo(false)
    }
  }

  const handleCreate = () => {
    const techs = technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (!title.trim()) {
      setRepoError('Project title is required')
      return
    }

    const newProject: Project = {
      id: Math.floor(Math.random() * 1000000),
      title: title.trim(),
      description: description.trim(),
      technologies: techs,
      link: link.trim() || undefined,
      sections: [],
    }

    onCreate(newProject)
    // reset
    setTitle('')
    setDescription('')
    setLink('')
    setTechnologies('')
    setRepoUrl('')
    setRepoError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Create New Project</h3>

        {/* GitHub Import Section */}
        <div className="mb-6 p-4 border border-indigo-500/30 rounded-lg bg-indigo-600/10">
          <h4 className="font-semibold mb-3 text-indigo-300">Or Import from GitHub</h4>
          <div className="flex gap-2 mb-2">
            <input
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value)
                setRepoError('')
              }}
              placeholder="https://github.com/username/repo"
              className="flex-1 p-3 rounded bg-gray-800 text-white"
              disabled={isLoadingRepo || isLoading}
            />
            <button
              onClick={handleImportFromGitHub}
              disabled={isLoadingRepo || !repoUrl.trim() || isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoadingRepo ? 'Loading...' : 'Import'}
            </button>
          </div>
          {repoError && <p className="text-red-400 text-sm">{repoError}</p>}
        </div>

        <label className="block mb-2 text-sm text-gray-300">Title *</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 border border-gray-700 focus:border-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          placeholder="Project title"
        />

        <label className="block mb-2 text-sm text-gray-300">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows={4} 
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 border border-gray-700 focus:border-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          placeholder="Project description"
        />

        <label className="block mb-2 text-sm text-gray-300">Link (optional)</label>
        <input 
          value={link} 
          onChange={(e) => setLink(e.target.value)} 
          className="w-full p-3 rounded bg-gray-800 text-white mb-4 border border-gray-700 focus:border-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          placeholder="https://example.com"
          type="url"
        />

        <label className="block mb-2 text-sm text-gray-300">Technologies (comma-separated)</label>
        <input 
          value={technologies} 
          onChange={(e) => setTechnologies(e.target.value)} 
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 border border-gray-700 focus:border-indigo-500 focus:outline-none transition"
          disabled={isLoading}
          placeholder="React, TypeScript, Tailwind CSS"
        />

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate} 
            disabled={isLoading || !title.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
