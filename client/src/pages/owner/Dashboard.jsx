import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiUser, FiFolder, FiLogOut, FiPlus, FiMenu, FiX, FiEye, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiStar, FiGitBranch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ProfileEditor from '../../components/editor/ProfileEditor';
import AchievementsEditor from '../../components/editor/AchievementsEditor';
import ProjectEditor from '../../components/editor/ProjectEditor';
import ProjectDetails from '../../components/editor/ProjectDetails';
import { portfolioService } from '../../services/portfolio.service';
import { projectService } from '../../services/project.service';
import { achievementService } from '../../services/achievement.service';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  // Fetch portfolio data
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getPortfolio,
  });

  // Fetch achievements
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementService.getAchievements,
  });

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteProject = (projectId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingProject(null);
    setViewingProject(null);
    setIsAddingProject(false);
    setIsSidebarOpen(false);
  };

  const isLoading = portfolioLoading || projectsLoading || achievementsLoading;
  const portfolio = portfolioData?.data;
  const projects = projectsData?.data || [];
  const achievements = achievementsData?.data || [];
  const featuredCount = projects.filter((project) => project.featured).length;
  const githubCount = projects.filter((project) => project.source === 'github').length;
  const achievementCount = achievements.length;
  const ownerName = portfolio?.name || 'Owner';
  const dashboardStats = [
    { label: 'Projects', value: projects.length },
    { label: 'Featured', value: featuredCount },
    { label: 'GitHub Imports', value: githubCount },
    { label: 'Skills', value: portfolio?.skills?.length || 0 },
    { label: 'Achievements', value: achievementCount },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="mx-4 mt-4">
          <div className="max-w-7xl mx-auto glass rounded-2xl">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white/60"
                    aria-label="Toggle menu"
                  >
                    {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                  </button>
                  <div>
                    <p className="section-kicker text-primary-600">Owner Console</p>
                    <h1 className="text-xl sm:text-2xl font-bold text-ink">Welcome back, {ownerName}</h1>
                    <p className="text-sm text-gray-500 hidden sm:block">Keep your portfolio fresh and launch-ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <FiExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">View Portfolio</span>
                    <span className="sm:hidden">View</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar - Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:relative top-0 left-0 h-full lg:h-auto w-64 lg:w-64 flex-shrink-0
              transform transition-transform duration-300 ease-in-out z-40 lg:z-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              pt-20 lg:pt-0
            `}
          >
            <nav className="glass rounded-2xl p-4 space-y-2 h-full lg:h-auto">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-white/70'
                }`}
              >
                <FiUser className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => handleTabChange('projects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-white/70'
                }`}
              >
                <FiFolder className="h-5 w-5" />
                Projects
                <span className="ml-auto bg-white/70 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('achievements')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'achievements'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-white/70'
                }`}
              >
                <FiStar className="h-5 w-5" />
                Achievements
                <span className="ml-auto bg-white/70 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {achievementCount}
                </span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="neo-panel p-4">
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <ProfileEditor portfolio={portfolio} />
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <AchievementsEditor achievements={achievements} />
            )}

            {/* Projects Tab - List View */}
            {activeTab === 'projects' && !editingProject && !isAddingProject && !viewingProject && (
              <div className="neo-panel p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                  <button
                    onClick={() => setIsAddingProject(true)}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <FiPlus className="h-5 w-5" />
                    Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-primary-200 rounded-2xl bg-white/70">
                    <FiFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first project</p>
                    <button
                      onClick={() => setIsAddingProject(true)}
                      className="btn-primary"
                    >
                      Add Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        onClick={() => setViewingProject(project)}
                        className="border border-white/70 bg-white/80 rounded-2xl p-4 hover:border-primary-200 hover:-translate-y-0.5 hover:shadow-glow transition-all cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                              {project.featured && (
                                <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded-full whitespace-nowrap">
                                  Featured
                                </span>
                              )}
                              {project.source === 'github' && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                                  <FiGithub className="h-3 w-3" />
                                  GitHub
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                              {project.description || 'No description'}
                            </p>
                            {project.techStack?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {project.techStack.slice(0, 4).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.techStack.length > 4 && (
                                  <span className="text-xs text-gray-400">
                                    +{project.techStack.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                            {/* GitHub Stats */}
                            {project.source === 'github' && project.githubMeta && (
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                {project.githubMeta.stars > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FiStar className="h-3 w-3" />
                                    {project.githubMeta.stars}
                                  </span>
                                )}
                                {project.githubMeta.forks > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FiGitBranch className="h-3 w-3" />
                                    {project.githubMeta.forks}
                                  </span>
                                )}
                                {project.githubMeta.language && (
                                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                    {project.githubMeta.language}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingProject(project);
                              }}
                              className="p-2 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProject(project);
                              }}
                              className="p-2 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(project._id, e)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Project Details View */}
            {activeTab === 'projects' && viewingProject && (
              <ProjectDetails
                project={viewingProject}
                onClose={() => setViewingProject(null)}
                onEdit={() => {
                  setEditingProject(viewingProject);
                  setViewingProject(null);
                }}
              />
            )}

            {/* Project Editor */}
            {activeTab === 'projects' && (editingProject || isAddingProject) && (
              <ProjectEditor
                project={editingProject}
                onClose={() => {
                  setEditingProject(null);
                  setIsAddingProject(false);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
