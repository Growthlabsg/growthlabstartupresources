export interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'template' | 'tool' | 'calculator' | 'video' | 'checklist'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  readTime: string
  tags: string[]
  featured?: boolean
  popular?: boolean
  externalUrl?: string
}

export interface Tool {
  id: string
  title: string
  description: string
  icon: string
  link: string
  badge?: 'new'
  features: string[]
  hasEnhanced?: boolean
  enhancedLink?: string
  category: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export interface ProfessionalService {
  id: string
  name: string
  title: string
  company: string
  rating: number
  specializations: string[]
  avatar?: string
  category: string
}

