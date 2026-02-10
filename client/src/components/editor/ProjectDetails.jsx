import { useEffect, useState } from 'react';
import { FiX, FiEdit2, FiGithub, FiExternalLink, FiStar, FiGitBranch, FiCode, FiCalendar, FiTag, FiPlay } from 'react-icons/fi';
import DemoVideoPlayer from '../common/DemoVideoPlayer';

function ProjectDetails({ project, onClose, onEdit }) {
  if (!project) return null;

  const defaultImage = 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=No+Image';
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
  const demoVideos = project.demoVideos?.length
    ? project.demoVideos
    : project.demoVideoUrl
      ? [project.demoVideoUrl]
      : [];

  const openLightbox = (src, alt) => {
    if (!src) return;
    setLightbox({ open: true, src, alt: alt || 'Project image' });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, src: '', alt: '' });
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.open]);

  return (
    <div className="neo-panel overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/60">
        <div>
          <p className="section-kicker">Projects</p>
          <h2 className="text-2xl font-bold text-ink">Project Details</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Main Image */}
        {project.images?.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-white/70 shadow-soft">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-48 sm:h-64 object-cover cursor-pointer"
              onClick={() => openLightbox(project.images[0], project.title)}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
        )}

        {/* Title and Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-ink">{project.title}</h3>
            {project.featured && (
              <span className="px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full">
                Featured
              </span>
            )}
            {project.source === 'github' && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full flex items-center gap-1">
                <FiGithub className="h-4 w-4" />
                Imported from GitHub
              </span>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-gray-600 leading-relaxed mt-3">{project.description}</p>
          )}
        </div>

        {/* Demo Video Preview */}
        {demoVideos.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiPlay className="h-4 w-4" />
              Demo Videos
            </h4>
            <div className={`grid gap-4 ${demoVideos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {demoVideos.map((video, index) => (
                <DemoVideoPlayer
                  key={`${video}-${index}`}
                  videoUrl={video}
                  title={`${project.title} demo video ${index + 1}`}
                  heightClass="h-48 sm:h-60"
                  showHelper={index === 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              <FiGithub className="h-5 w-5" />
              View Repository
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <FiExternalLink className="h-5 w-5" />
              Live Demo
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FiCode className="h-4 w-4" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Stats */}
        {project.source === 'github' && project.githubMeta && (
          <div className="bg-white/70 border border-line rounded-2xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FiGithub className="h-4 w-4" />
              GitHub Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.githubMeta.stars !== undefined && (
                <div className="text-center p-3 bg-white rounded-xl shadow-soft">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <FiStar className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.githubMeta.stars}</div>
                  <div className="text-xs text-gray-500">Stars</div>
                </div>
              )}
              {project.githubMeta.forks !== undefined && (
                <div className="text-center p-3 bg-white rounded-xl shadow-soft">
                  <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                    <FiGitBranch className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.githubMeta.forks}</div>
                  <div className="text-xs text-gray-500">Forks</div>
                </div>
              )}
              {project.githubMeta.watchers !== undefined && (
                <div className="text-center p-3 bg-white rounded-xl shadow-soft">
                  <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                    <FiStar className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.githubMeta.watchers}</div>
                  <div className="text-xs text-gray-500">Watchers</div>
                </div>
              )}
              {project.githubMeta.openIssues !== undefined && (
                <div className="text-center p-3 bg-white rounded-xl shadow-soft">
                  <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                    <FiTag className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{project.githubMeta.openIssues}</div>
                  <div className="text-xs text-gray-500">Open Issues</div>
                </div>
              )}
            </div>

            {/* Additional GitHub Info */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.githubMeta.language && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCode className="h-4 w-4" />
                  <span className="font-medium">Primary Language:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{project.githubMeta.language}</span>
                </div>
              )}
              {project.githubMeta.license && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiTag className="h-4 w-4" />
                  <span className="font-medium">License:</span>
                  <span>{project.githubMeta.license}</span>
                </div>
              )}
              {project.githubMeta.size && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Size:</span>
                  <span>{(project.githubMeta.size / 1024).toFixed(1)} MB</span>
                </div>
              )}
              {project.githubMeta.defaultBranch && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiGitBranch className="h-4 w-4" />
                  <span className="font-medium">Default Branch:</span>
                  <span>{project.githubMeta.defaultBranch}</span>
                </div>
              )}
            </div>

            {/* Topics */}
            {project.githubMeta.topics?.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Topics:</div>
                <div className="flex flex-wrap gap-2">
                  {project.githubMeta.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            {(project.githubMeta.createdAt || project.githubMeta.updatedAt) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                {project.githubMeta.createdAt && (
                  <div className="flex items-center gap-1">
                    <FiCalendar className="h-4 w-4" />
                    <span>Created: {new Date(project.githubMeta.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {project.githubMeta.updatedAt && (
                  <div className="flex items-center gap-1">
                    <FiCalendar className="h-4 w-4" />
                    <span>Updated: {new Date(project.githubMeta.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* All Images */}
        {project.images?.length > 1 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">All Images</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.images.map((img, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${project.title} - ${index + 1}`}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => openLightbox(img, `${project.title} - ${index + 1}`)}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-sm text-gray-500 pt-4 border-t border-line">
          <div className="flex flex-wrap gap-4">
            {project.createdAt && (
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            )}
            {project.updatedAt && (
              <span>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white/90 text-ink px-4 py-2 rounded-full text-sm font-semibold shadow-soft hover:bg-white"
          >
            Close
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-soft"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
