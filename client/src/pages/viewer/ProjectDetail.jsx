import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiGithub,
  FiExternalLink,
  FiStar,
  FiGitBranch,
  FiCalendar,
  FiTag,
  FiGlobe,
} from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import DemoVideoPlayer from '../../components/common/DemoVideoPlayer';
import { projectService } from '../../services/project.service';

const galleryCardClass =
  'group flex-1 min-w-[220px] sm:min-w-[240px] lg:min-w-[260px] h-36 sm:h-40 lg:h-44 overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-soft transition-shadow duration-300 hover:shadow-glow';

function ProjectDetail() {
  const { id } = useParams();
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loading message="Loading project..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen text-ink">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto neo-panel p-8 text-center">
            <h2 className="text-2xl font-bold text-ink">Unable to load project</h2>
            <p className="text-gray-600 mt-2">Please try again or return to the portfolio.</p>
            <Link to="/" className="btn-secondary mt-6 inline-flex items-center gap-2">
              <FiArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const project = data?.data;

  if (!project) {
    return (
      <div className="min-h-screen text-ink">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto neo-panel p-8 text-center">
            <h2 className="text-2xl font-bold text-ink">Project not found</h2>
            <p className="text-gray-600 mt-2">This project may have been removed.</p>
            <Link to="/" className="btn-secondary mt-6 inline-flex items-center gap-2">
              <FiArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = project.images?.[0];
  const extraImages = project.images?.slice(1) || [];
  const createdAt = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : null;
  const updatedAt = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : null;
  const demoVideos = project.demoVideos?.length
    ? project.demoVideos
    : project.demoVideoUrl
      ? [project.demoVideoUrl]
      : [];
  const imageCount = extraImages.length;
  const videoCount = demoVideos.length;
  const galleryItems = [
    ...demoVideos.map((videoUrl, index) => ({
      id: `video-${index}`,
      type: 'video',
      url: videoUrl,
      orderIndex: index + 1,
      videoIndex: index,
      imageCount,
      videoCount,
    })),
    ...extraImages.map((imageUrl, index) => ({
      id: `image-${index}`,
      type: 'image',
      url: imageUrl,
      alt: `${project.title} ${index + 2}`,
      imageIndex: index,
      imageCount,
      videoCount,
    })),
  ];

  return (
    <div className="min-h-screen text-ink">
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-28 left-6 h-64 w-64 rounded-full bg-accent-200/30 blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700">
            <FiArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-white/70 shadow-soft bg-white">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={project.title}
                    className="w-full h-60 sm:h-72 md:h-96 object-cover cursor-pointer"
                    onClick={() => openLightbox(heroImage, project.title)}
                  />
                ) : (
                  <div className="h-60 sm:h-72 md:h-96 bg-gradient-to-br from-primary-100 via-white to-accent-100 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold">No preview image</span>
                  </div>
                )}
              </div>

              <div className="neo-panel p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {project.featured && (
                    <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                  {project.source === 'github' && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      GitHub Import
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-ink">{project.title}</h1>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {project.description || 'A focused build crafted for performance, clarity, and impact.'}
                </p>

                {project.techStack?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-white border border-line text-sm text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <aside className="space-y-6">
              <div className="neo-panel p-6">
                <h2 className="text-lg font-semibold text-ink mb-4">Project Links</h2>
                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <FiGlobe className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <FiGithub className="h-4 w-4" />
                      View Repository
                    </a>
                  )}
                </div>
              </div>

              <div className="neo-panel p-6">
                <h2 className="text-lg font-semibold text-ink mb-4">Project Stats</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  {project.githubMeta?.stars !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiStar className="h-4 w-4" />
                        Stars
                      </span>
                      <span className="font-semibold text-ink">{project.githubMeta.stars}</span>
                    </div>
                  )}
                  {project.githubMeta?.forks !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiGitBranch className="h-4 w-4" />
                        Forks
                      </span>
                      <span className="font-semibold text-ink">{project.githubMeta.forks}</span>
                    </div>
                  )}
                  {project.githubMeta?.language && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiTag className="h-4 w-4" />
                        Language
                      </span>
                      <span className="font-semibold text-ink">{project.githubMeta.language}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="neo-panel p-6">
                <h2 className="text-lg font-semibold text-ink mb-4">Timeline</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  {createdAt && (
                    <p className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4" />
                      Created: <span className="font-semibold text-ink">{createdAt}</span>
                    </p>
                  )}
                  {updatedAt && (
                    <p className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4" />
                      Updated: <span className="font-semibold text-ink">{updatedAt}</span>
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {galleryItems.length > 0 && (
            <div className="mt-10">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center px-5 py-2 rounded-full glass border border-white/60 shadow-soft text-xs sm:text-sm uppercase tracking-[0.35em] text-ink">
                    Gallery
                  </span>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-soft p-4 sm:p-6">
                  <div className="flex flex-wrap gap-4 sm:gap-5">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className={galleryCardClass}
                      >
                        {item.type === 'video' ? (
                          <div className="h-full">
                            <DemoVideoPlayer
                              videoUrl={item.url}
                              title={`${project.title} demo video ${item.orderIndex}`}
                              heightClass="h-full"
                              showHelper={false}
                            />
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                            onClick={() => openLightbox(item.url, item.alt)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

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

export default ProjectDetail;
