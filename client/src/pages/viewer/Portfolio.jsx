import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiMail, FiMapPin } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import ProfileSection from '../../components/portfolio/ProfileSection';
import SkillsSection from '../../components/portfolio/SkillsSection';
import AchievementsSection from '../../components/portfolio/AchievementsSection';
import ProjectCard from '../../components/portfolio/ProjectCard';
import { portfolioService } from '../../services/portfolio.service';
import { projectService } from '../../services/project.service';
import { achievementService } from '../../services/achievement.service';

function Portfolio() {
  const [activeTech, setActiveTech] = useState('All');
  const location = useLocation();
  const navOffset = 96;
  // Fetch portfolio data
  const { 
    data: portfolioData, 
    isLoading: portfolioLoading,
    error: portfolioError 
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getPortfolio,
  });

  // Fetch achievements
  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementService.getAchievements,
  });

  // Fetch projects
  const { 
    data: projectsData, 
    isLoading: projectsLoading,
    error: projectsError 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const isLoading = portfolioLoading || projectsLoading || achievementsLoading;
  const error = portfolioError || projectsError || achievementsError;
  const portfolio = portfolioData?.data;
  const projects = projectsData?.data || [];
  const achievements = achievementsData?.data || [];
  const hasAchievements = achievements.length > 0;

  useEffect(() => {
    if (isLoading) return;
    const params = new URLSearchParams(location.search);
    const target = location.hash?.replace('#', '') || params.get('section');
    if (!target) return;

    const element = document.getElementById(target);
    if (!element) return;

    const timer = window.setTimeout(() => {
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });

      if (params.has('section') || location.hash) {
        params.delete('section');
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
        window.history.replaceState({}, '', nextUrl);
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [
    isLoading,
    location.search,
    location.hash,
    navOffset,
    projects.length,
    portfolio?.skills?.length,
    hasAchievements,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">Failed to load portfolio data.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const techFilters = ['All', ...new Set(projects.flatMap((project) => project.techStack || []))];
  const totalFeatured = projects.filter((project) => project.featured).length;
  const filteredProjects =
    activeTech === 'All'
      ? projects
      : projects.filter((project) => project.techStack?.includes(activeTech));
  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);
  const stats = [
    { label: 'Projects', value: projects.length },
    { label: 'Featured', value: totalFeatured },
    { label: 'Skills', value: portfolio?.skills?.length || 0 },
  ];

  return (
    <div className="min-h-screen text-ink">
      <Navbar showAchievements={hasAchievements} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-ink text-white">
        <div className="absolute -top-40 -right-20 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ProfileSection portfolio={portfolio} stats={stats} />
        </div>
      </section>

      {/* Skills Section */}
      {portfolio?.skills?.length > 0 && (
        <section id="skills" className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <p className="section-kicker">Expertise</p>
                <h2 className="section-title mt-2">Skills in Motion</h2>
                <p className="text-gray-600 mt-3 max-w-2xl">
                  A focused blend of frontend polish, backend resilience, and product-minded delivery.
                </p>
              </div>
            </div>
            <SkillsSection skills={portfolio.skills} />
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {hasAchievements && (
        <AchievementsSection achievements={achievements} />
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div id="projects">
          <section className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {techFilters.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setActiveTech(tech)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                      activeTech === tech
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-line hover:border-primary-200'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {filteredProjects.length === 0 && (
            <section className="py-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center neo-panel p-8">
                <h3 className="text-lg font-semibold text-ink">No projects match this filter</h3>
                <p className="text-gray-600 mt-2">Try another tech tag to explore more work.</p>
              </div>
            </section>
          )}
          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <section className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <p className="section-kicker">Showcase</p>
                    <h2 className="section-title mt-2">Featured Builds</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl">
                      A curated set of projects highlighting depth, polish, and measurable impact.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Projects Section */}
          {otherProjects.length > 0 && (
            <section className="py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <p className="section-kicker">Archive</p>
                    <h2 className="section-title mt-2">More Projects</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl">
                      Additional builds that showcase consistency, speed, and adaptability.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* No Projects Message */}
      {projects.length === 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center neo-panel p-10">
            <h2 className="text-2xl font-bold text-ink mb-4">Projects Coming Soon</h2>
            <p className="text-gray-600">Check back later for exciting projects!</p>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-ink text-white" id="contact">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-kicker text-primary-200">Connect</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something Remarkable</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in working together? Reach out and let&apos;s map the next launch.
          </p>
          
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {portfolio?.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
              >
                <FiMail className="h-5 w-5" />
                {portfolio.email}
              </a>
            )}
            {portfolio?.location && (
              <span className="flex items-center gap-2 text-gray-300">
                <FiMapPin className="h-5 w-5" />
                {portfolio.location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8">
            {portfolio?.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiGithub className="h-6 w-6" />
              </a>
            )}
            {portfolio?.socialLinks?.linkedin && (
              <a
                href={portfolio.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
            )}
            {portfolio?.socialLinks?.twitter && (
              <a
                href={portfolio.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
            )}
            {portfolio?.socialLinks?.website && (
              <a
                href={portfolio.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiGlobe className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Portfolio;
