import { useNavigate } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from 'react-icons/fi';
import { getMarkdownPreview } from '../../utils/markdown';

function ProjectCard({ project, featured = false }) {
  const navigate = useNavigate();
  const defaultImage = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=No+Image';
  const mainImage = project.images?.[0] || defaultImage;
  const hasLinks = Boolean(project.githubUrl || project.liveUrl);
  const descriptionPreview =
    getMarkdownPreview(project.description, 180) ||
    'A crafted build with a focus on detail, usability, and performance.';

  return (
    <div
      className={`project-card group relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
        featured ? 'project-card--featured' : ''
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
        <div className="project-card__image-wash absolute inset-0"></div>
        {featured && (
          <span className="project-card__badge absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-ink mb-2">{project.title}</h3>
        
        <p className="project-card__description text-sm mb-4 line-clamp-3">
          {descriptionPreview}
        </p>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="project-tag px-2 py-1 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="project-tag-muted px-2 py-1 text-xs">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* GitHub Stats */}
        {project.source === 'github' && project.githubMeta && (
          <div className="project-stats flex items-center gap-4 text-sm mb-4">
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
              <span className="project-meta-chip text-xs px-2 py-0.5 rounded-full">
                {project.githubMeta.language}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        {hasLinks && (
          <div className="project-card__links flex flex-wrap gap-3 mt-auto pt-4 border-t">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link flex items-center gap-2 text-sm transition-colors"
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
                className="project-card__link flex items-center gap-2 text-sm transition-colors"
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
