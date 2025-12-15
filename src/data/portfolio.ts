export interface PortfolioData {
  name: string
  title: string
  bio: string
  email: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  skills: string[]
  projects: Project[]
  customSections: CustomSection[]
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  link?: string
  image?: string
  sections?: CustomSection[]
}

export const portfolioData: PortfolioData = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  bio: 'Passionate about building beautiful and functional web applications. I specialize in React, Next.js, and modern web technologies.',
  email: 'john@example.com',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  skills: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
  ],
  projects: [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description:
        'A full-stack e-commerce platform with payment integration, product catalog, and user authentication.',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB'],
      link: 'https://example.com',
    },
    {
      id: 2,
      title: 'Task Management App',
      description:
        'A collaborative task management application with real-time updates and team collaboration features.',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      link: 'https://example.com',
    },
    {
      id: 3,
      title: 'AI Chat Assistant',
      description: 'An AI-powered chat assistant built with modern web technologies and machine learning.',
      technologies: ['Next.js', 'OpenAI API', 'React', 'TypeScript'],
      link: 'https://example.com',
    },
    {
      id: 4,
      title: 'Analytics Dashboard',
      description: 'A comprehensive analytics dashboard with real-time data visualization and reporting.',
      technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
      link: 'https://example.com',
    },
  ],
  customSections: [],
}
