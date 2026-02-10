import { useNavigate } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from 'react-icons/fi';

function ProjectCard({ project, featured = false }) {
  const navigate = useNavigate();
  const defaultImage = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=No+Image';
  const mainImage = project.images?.[0] || defaultImage;
  const hasLinks = Boolean(project.githubUrl || project.liveUrl);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${
        featured ? 'ring-2 ring-primary-400/60' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/projects/${project._id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/projects/${project._id}`);
        }
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={mainImage}
          alt={project.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70"></div>
        {featured && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-accent-400 text-ink text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-ink mb-2">{project.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description || 'A crafted build with a focus on detail, usability, and performance.'}
        </p>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 text-gray-400 text-xs">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* GitHub Stats */}
        {project.source === 'github' && project.githubMeta && (
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {project.githubMeta.stars > 0 && (
              <span className="flex items-center gap-1">
                <FiStar className="h-4 w-4" />
                {project.githubMeta.stars}
              </span>
            )}
            {project.githubMeta.forks > 0 && (
              <span className="flex items-center gap-1">
                <FiGitBranch className="h-4 w-4" />
                {project.githubMeta.forks}
              </span>
            )}
            {project.githubMeta.language && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {project.githubMeta.language}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        {hasLinks && (
          <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="h-4 w-4" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
