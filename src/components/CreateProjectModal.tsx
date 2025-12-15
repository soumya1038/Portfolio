"use client"

import { useState } from 'react'
import { Project } from '@/data/portfolio'
import { fetchGitHubRepo } from '@/utils/imageCompress'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (project: Project) => void
}

export default function CreateProjectModal({ isOpen, onClose, onCreate }: Props) {
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
    } catch (err) {
      setRepoError(err instanceof Error ? err.message : 'Failed to import repository')
    } finally {
      setIsLoadingRepo(false)
    }
  }

  const handleCreate = () => {
    const techs = technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newProject: Project = {
      id: Date.now(),
      title: title || 'New Project',
      description: description || '',
      technologies: techs,
      link: link || undefined,
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
            />
            <button
              onClick={handleImportFromGitHub}
              disabled={isLoadingRepo || !repoUrl.trim()}
              className="px-4 py-2 bg-indigo-600 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoadingRepo ? 'Loading...' : 'Import'}
            </button>
          </div>
          {repoError && <p className="text-red-400 text-sm">{repoError}</p>}
        </div>

        <label className="block mb-2 text-sm text-gray-300">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded bg-gray-800 text-white mb-4" />

        <label className="block mb-2 text-sm text-gray-300">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-3 rounded bg-gray-800 text-white mb-4" />

        <label className="block mb-2 text-sm text-gray-300">Link (optional)</label>
        <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 rounded bg-gray-800 text-white mb-4" />

        <label className="block mb-2 text-sm text-gray-300">Technologies (comma-separated)</label>
        <input value={technologies} onChange={(e) => setTechnologies(e.target.value)} className="w-full p-3 rounded bg-gray-800 text-white mb-6" />

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 rounded">Create</button>
        </div>
      </div>
    </div>
  )
}
