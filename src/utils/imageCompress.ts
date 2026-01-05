/**
 * Compress an image file to base64
 * @param file Image file
 * @param maxWidth Maximum width in pixels
 * @param quality JPEG quality (0-1)
 * @returns Promise<string> Base64 encoded compressed image
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Fetch GitHub repository details with rate limit handling
 * @param repoUrl GitHub repository URL (e.g., https://github.com/username/repo)
 * @returns Promise with repo details
 */
export async function fetchGitHubRepo(repoUrl: string) {
  try {
    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) throw new Error('Invalid GitHub URL format. Use: https://github.com/username/repo')

    const [, owner, repo] = match
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    })
    
    // Handle rate limiting
    if (response.status === 403) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      throw new Error('GitHub API rate limit exceeded. Please try again later or use a GitHub token.')
    }
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found. Check the URL and try again.')
      }
      throw new Error(`Failed to fetch repository: ${response.statusText}`)
    }

    const data = await response.json()

    // Validate response structure
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Invalid repository data received')
    }

    // Collect technologies from primary language and topics
    const techs: string[] = []
    if (data.language) techs.push(data.language)
    if (Array.isArray(data.topics) && data.topics.length > 0) {
      techs.push(...data.topics.slice(0, 5)) // Limit to 5 topics
    }

    return {
      title: data.name || repo,
      description: data.description || `Repository by ${owner}`,
      link: data.html_url || repoUrl,
      technologies: techs.length > 0 ? techs : ['Repository'],
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import repository'
    throw new Error(message)
  }
}
