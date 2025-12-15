'use client'

import { Project } from '@/data/portfolio'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-pink-600 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-indigo-400 mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{project.description}</p>
          </section>

          {/* Technologies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-indigo-400 mb-3">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-indigo-600/30 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Link */}
          {project.link && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-indigo-400 mb-3">View Project</h2>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
              >
                Open Live Project →
              </a>
            </section>
          )}
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
