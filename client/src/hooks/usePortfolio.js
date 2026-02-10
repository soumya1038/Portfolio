import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../services/portfolio.service';
import { projectService } from '../services/project.service';

/**
 * Hook for portfolio data and operations
 */
export function usePortfolio() {
  const queryClient = useQueryClient();

  // Query for portfolio data
  const portfolioQuery = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getPortfolio,
  });

  // Mutation for updating portfolio
  const updatePortfolioMutation = useMutation({
    mutationFn: portfolioService.updatePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  return {
    portfolio: portfolioQuery.data?.data,
    isLoading: portfolioQuery.isLoading,
    error: portfolioQuery.error,
    refetch: portfolioQuery.refetch,
    updatePortfolio: updatePortfolioMutation.mutate,
    isUpdating: updatePortfolioMutation.isPending,
  };
}

/**
 * Hook for projects data and operations
 */
export function useProjects(options = {}) {
  const queryClient = useQueryClient();
  const { featured = false } = options;

  // Query for projects
  const projectsQuery = useQuery({
    queryKey: ['projects', { featured }],
    queryFn: () => projectService.getProjects(featured),
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: projectsQuery.data?.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}
