import { ApiError } from '../middleware/error.middleware.js';

/**
 * Parse GitHub URL to extract owner and repo
 * Supports formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 * - owner/repo
 */
export const parseGitHubUrl = (url) => {
  if (!url) return null;

  // Remove .git suffix if present
  url = url.replace(/\.git$/, '');

  // Try to match different formats
  const patterns = [
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/,
    /^github\.com\/([^\/]+)\/([^\/]+)\/?$/,
    /^([^\/]+)\/([^\/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
};

/**
 * Make authenticated GitHub API request
 */
const githubFetch = async (url) => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  return fetch(url, { headers });
};

/**
 * Fetch repository details from GitHub API
 */
export const fetchRepoDetails = async (githubUrl) => {
  const parsed = parseGitHubUrl(githubUrl);

  if (!parsed) {
    throw new ApiError(400, 'Invalid GitHub URL format');
  }

  const { owner, repo } = parsed;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await githubFetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(400, 'Repository not found. Make sure it exists and is public.');
      }
      if (response.status === 403) {
        throw new ApiError(400, 'GitHub API rate limit exceeded. Try again later.');
      }
      if (response.status === 401) {
        throw new ApiError(400, 'GitHub authentication failed. Please check your GitHub token in the server .env file.');
      }
      throw new ApiError(400, 'Failed to fetch repository details from GitHub.');
    }

    const data = await response.json();

    // Fetch languages
    let languages = [];
    try {
      const langResponse = await githubFetch(`${apiUrl}/languages`);
      if (langResponse.ok) {
        const langData = await langResponse.json();
        languages = Object.keys(langData);
      }
    } catch {
      // Ignore language fetch errors
    }

    // Fetch contributors count
    let contributorsCount = 0;
    try {
      const contribResponse = await githubFetch(`${apiUrl}/contributors?per_page=1`);
      if (contribResponse.ok) {
        // Get count from Link header
        const linkHeader = contribResponse.headers.get('Link');
        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            contributorsCount = parseInt(match[1], 10);
          }
        } else {
          const contributors = await contribResponse.json();
          contributorsCount = contributors.length;
        }
      }
    } catch {
      // Ignore contributor fetch errors
    }

    // Fetch README
    let readmeContent = '';
    try {
      const readmeResponse = await githubFetch(`${apiUrl}/readme`);
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        // Decode base64 content
        if (readmeData.content) {
          readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
          // Truncate if too long
          if (readmeContent.length > 500) {
            readmeContent = readmeContent.substring(0, 500) + '...';
          }
        }
      }
    } catch {
      // Ignore README fetch errors
    }

    // Fetch recent commits count
    let commitsCount = 0;
    try {
      const commitsResponse = await githubFetch(`${apiUrl}/commits?per_page=1`);
      if (commitsResponse.ok) {
        const linkHeader = commitsResponse.headers.get('Link');
        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            commitsCount = parseInt(match[1], 10);
          }
        }
      }
    } catch {
      // Ignore commits fetch errors
    }

    // Build tech stack from languages and topics
    const techStack = [...new Set([
      ...languages,
      ...(data.topics || []).map(t => t.charAt(0).toUpperCase() + t.slice(1))
    ])];

    return {
      title: data.name,
      description: data.description || '',
      techStack: techStack.length > 0 ? techStack : (data.language ? [data.language] : []),
      githubUrl: data.html_url,
      liveUrl: data.homepage || '',
      source: 'github',
      githubMeta: {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        openIssues: data.open_issues_count || 0,
        language: data.language || '',
        topics: data.topics || [],
        license: data.license?.name || '',
        size: data.size || 0,
        defaultBranch: data.default_branch || 'main',
        isPrivate: data.private || false,
        isArchived: data.archived || false,
        isFork: data.fork || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        pushedAt: data.pushed_at,
        contributorsCount,
        commitsCount,
        // Owner info
        owner: {
          login: data.owner?.login || '',
          avatarUrl: data.owner?.avatar_url || '',
          type: data.owner?.type || 'User',
        },
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to fetch from GitHub: ${error.message}`);
  }
};

/**
 * Fetch user's repositories
 */
export const fetchUserRepos = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sort = 'updated', per_page = 10 } = req.query;

    if (!username) {
      throw new ApiError(400, 'GitHub username is required');
    }

    const response = await githubFetch(
      `https://api.github.com/users/${username}/repos?sort=${sort}&per_page=${per_page}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(400, 'User not found.');
      }
      throw new ApiError(400, 'Failed to fetch repositories.');
    }

    const repos = await response.json();

    const simplifiedRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));

    res.json({
      success: true,
      data: simplifiedRepos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Import GitHub repo as a project
 */
export const importGitHubRepo = async (req, res, next) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      throw new ApiError(400, 'GitHub URL is required');
    }

    const repoDetails = await fetchRepoDetails(githubUrl);

    res.json({
      success: true,
      message: 'Repository details fetched successfully',
      data: repoDetails,
    });
  } catch (error) {
    next(error);
  }
};
