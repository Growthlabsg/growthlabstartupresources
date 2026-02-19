/**
 * GrowthLab Platform Integration Service
 * 
 * This service handles all data fetching and synchronization between
 * the Startup Resources section and the main GrowthLab platform.
 */

// Types for Platform Data
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'founder' | 'mentor' | 'investor' | 'admin'
  company?: string
  industry?: string
  stage?: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth'
  joinedAt: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: User
  category: string
  tags: string[]
  likes: number
  replies: number
  views: number
  createdAt: string
  isPinned?: boolean
}

export interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  postsCount: number
  membersCount: number
  color: string
}

export interface NetworkingEvent {
  id: string
  title: string
  description: string
  type: 'virtual' | 'in-person' | 'hybrid'
  category: 'meetup' | 'pitch' | 'workshop' | 'conference' | 'webinar'
  date: string
  time: string
  timezone: string
  duration: string
  location?: string
  virtualLink?: string
  host: User
  speakers?: User[]
  attendees: number
  maxAttendees?: number
  price: number | 'free'
  image?: string
  tags: string[]
  isRegistered?: boolean
}

export interface Mentor {
  id: string
  user: User
  expertise: string[]
  industries: string[]
  bio: string
  experience: string
  availability: 'available' | 'limited' | 'unavailable'
  rating: number
  reviewsCount: number
  sessionsCompleted: number
  hourlyRate: number | 'free'
  languages: string[]
  timezone: string
  linkedIn?: string
  calendlyLink?: string
}

export interface MentorSession {
  id: string
  mentor: Mentor
  mentee: User
  date: string
  time: string
  duration: string
  type: '1-on-1' | 'group'
  topic: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  rating?: number
  feedback?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'template' | 'tool' | 'video' | 'podcast' | 'ebook' | 'course'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  readTime?: string
  downloadCount: number
  rating: number
  tags: string[]
  href: string
  isFeatured?: boolean
  isNew?: boolean
  isPremium?: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  format: 'docx' | 'xlsx' | 'pdf' | 'pptx' | 'figma' | 'notion'
  downloads: number
  rating: number
  preview?: string
  href: string
  isNew?: boolean
  isPremium?: boolean
}

export interface StartupProgram {
  id: string
  name: string
  type: 'accelerator' | 'incubator' | 'bootcamp' | 'fellowship'
  stage: string[]
  duration: string
  investment?: string
  equity?: string
  deadline?: string
  location: string
  description: string
  benefits: string[]
  requirements: string[]
  applicationLink: string
  isOpen: boolean
}

export interface Notification {
  id: string
  type: 'event' | 'forum' | 'mentor' | 'resource' | 'system'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export interface PlatformStats {
  totalFounders: number
  totalMentors: number
  totalInvestors: number
  activeEvents: number
  resourcesCount: number
  templatesCount: number
  successStories: number
  fundingRaised: string
}

// API Configuration
const PLATFORM_API_URL = process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'http://localhost:3001'
const PLATFORM_API_KEY = process.env.NEXT_PUBLIC_GROWTHLAB_API_KEY || ''

class PlatformService {
  private baseURL: string
  private apiKey: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheDuration = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.baseURL = PLATFORM_API_URL
    this.apiKey = PLATFORM_API_KEY
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error(`Platform API Error: ${endpoint}`, error)
      // Return mock data for development/demo
      return this.getMockData(endpoint) as T
    }
  }

  // Forum Methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return this.request('/api/community/forums/categories')
  }

  async getForumPosts(params?: { category?: string; limit?: number; featured?: boolean }): Promise<ForumPost[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/community/forums/posts?${query}`)
  }

  async createForumPost(post: Partial<ForumPost>): Promise<ForumPost> {
    return this.request('/api/community/forums/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    })
  }

  // Events Methods
  async getEvents(params?: { type?: string; category?: string; upcoming?: boolean; limit?: number }): Promise<NetworkingEvent[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/community/events?${query}`)
  }

  async registerForEvent(eventId: string): Promise<{ success: boolean }> {
    return this.request(`/api/community/events/${eventId}/register`, {
      method: 'POST',
    })
  }

  // Mentor Methods
  async getMentors(params?: { expertise?: string; industry?: string; available?: boolean; limit?: number }): Promise<Mentor[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/community/mentors?${query}`)
  }

  async getMentorById(mentorId: string): Promise<Mentor> {
    return this.request(`/api/community/mentors/${mentorId}`)
  }

  async bookMentorSession(mentorId: string, session: Partial<MentorSession>): Promise<MentorSession> {
    return this.request(`/api/community/mentors/${mentorId}/book`, {
      method: 'POST',
      body: JSON.stringify(session),
    })
  }

  // Resources Methods
  async getResources(params?: { type?: string; category?: string; featured?: boolean; limit?: number }): Promise<Resource[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/resources?${query}`)
  }

  async getTemplates(params?: { category?: string; format?: string; limit?: number }): Promise<Template[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/resources/templates?${query}`)
  }

  // Programs Methods
  async getPrograms(params?: { type?: string; stage?: string; open?: boolean }): Promise<StartupProgram[]> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/api/programs?${query}`)
  }

  // User Methods
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      return await this.request('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      return null
    }
  }

  async getNotifications(token: string): Promise<Notification[]> {
    return this.request('/api/user/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  // Platform Stats
  async getPlatformStats(): Promise<PlatformStats> {
    return this.request('/api/stats')
  }

  // Mock Data for Development
  private getMockData(endpoint: string): any {
    if (endpoint.includes('/forums/categories')) {
      return this.mockForumCategories
    }
    if (endpoint.includes('/forums/posts')) {
      return this.mockForumPosts
    }
    if (endpoint.includes('/events')) {
      return this.mockEvents
    }
    if (endpoint.includes('/mentors')) {
      return this.mockMentors
    }
    if (endpoint.includes('/stats')) {
      return this.mockStats
    }
    return []
  }

  private mockForumCategories: ForumCategory[] = [
    { id: '1', name: 'Fundraising & Investment', description: 'Discuss funding strategies, pitch decks, and investor relations', icon: 'DollarSign', postsCount: 1250, membersCount: 3400, color: 'green' },
    { id: '2', name: 'Product Development', description: 'Share insights on building and scaling products', icon: 'Code', postsCount: 980, membersCount: 2800, color: 'blue' },
    { id: '3', name: 'Marketing & Growth', description: 'Growth hacking, marketing strategies, and customer acquisition', icon: 'TrendingUp', postsCount: 1100, membersCount: 3100, color: 'purple' },
    { id: '4', name: 'Legal & Compliance', description: 'Legal advice, contracts, and regulatory compliance', icon: 'Shield', postsCount: 450, membersCount: 1800, color: 'orange' },
    { id: '5', name: 'Hiring & Team Building', description: 'Recruitment, culture, and team management', icon: 'Users', postsCount: 720, membersCount: 2200, color: 'pink' },
    { id: '6', name: 'General Discussion', description: 'Open discussions about startup life', icon: 'MessageCircle', postsCount: 2100, membersCount: 5000, color: 'gray' },
  ]

  private mockForumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'How we raised $2M seed round in 3 weeks',
      content: 'Sharing our experience and key learnings...',
      author: { id: '1', name: 'Sarah Chen', email: 'sarah@startup.com', role: 'founder', company: 'TechFlow', joinedAt: '2023-01-15' },
      category: 'Fundraising & Investment',
      tags: ['fundraising', 'seed', 'pitch'],
      likes: 245,
      replies: 67,
      views: 3400,
      createdAt: '2024-01-20T10:00:00Z',
      isPinned: true,
    },
    {
      id: '2',
      title: 'Best practices for remote team culture',
      content: 'Building a strong culture with a distributed team...',
      author: { id: '2', name: 'Mike Johnson', email: 'mike@remote.co', role: 'founder', company: 'RemoteFirst', joinedAt: '2022-06-10' },
      category: 'Hiring & Team Building',
      tags: ['remote', 'culture', 'team'],
      likes: 189,
      replies: 45,
      views: 2100,
      createdAt: '2024-01-19T14:30:00Z',
    },
    {
      id: '3',
      title: 'Our journey from 0 to 10K users',
      content: 'The growth strategies that worked for us...',
      author: { id: '3', name: 'Lisa Park', email: 'lisa@growth.io', role: 'founder', company: 'GrowthLabs', joinedAt: '2023-03-20' },
      category: 'Marketing & Growth',
      tags: ['growth', 'users', 'marketing'],
      likes: 312,
      replies: 89,
      views: 4500,
      createdAt: '2024-01-18T09:15:00Z',
    },
  ]

  private mockEvents: NetworkingEvent[] = [
    {
      id: '1',
      title: 'Startup Pitch Night - January Edition',
      description: 'Present your startup to a panel of investors and get valuable feedback.',
      type: 'hybrid',
      category: 'pitch',
      date: '2024-02-15',
      time: '18:00',
      timezone: 'EST',
      duration: '3 hours',
      location: 'GrowthLab HQ, San Francisco',
      virtualLink: 'https://zoom.us/j/123456789',
      host: { id: '1', name: 'GrowthLab Team', email: 'events@growthlab.com', role: 'admin', joinedAt: '2020-01-01' },
      attendees: 156,
      maxAttendees: 200,
      price: 'free',
      tags: ['pitch', 'investors', 'networking'],
    },
    {
      id: '2',
      title: 'Product-Market Fit Workshop',
      description: 'Learn frameworks and strategies to achieve product-market fit.',
      type: 'virtual',
      category: 'workshop',
      date: '2024-02-20',
      time: '14:00',
      timezone: 'PST',
      duration: '2 hours',
      virtualLink: 'https://zoom.us/j/987654321',
      host: { id: '2', name: 'Alex Rivera', email: 'alex@pmf.co', role: 'mentor', joinedAt: '2021-05-15' },
      attendees: 89,
      maxAttendees: 100,
      price: 'free',
      tags: ['product', 'pmf', 'strategy'],
    },
    {
      id: '3',
      title: 'Founder Networking Mixer',
      description: 'Connect with fellow founders over drinks and appetizers.',
      type: 'in-person',
      category: 'meetup',
      date: '2024-02-25',
      time: '19:00',
      timezone: 'EST',
      duration: '2 hours',
      location: 'The Startup Hub, NYC',
      host: { id: '3', name: 'NYC Founders Club', email: 'nyc@founders.club', role: 'admin', joinedAt: '2019-08-20' },
      attendees: 78,
      maxAttendees: 100,
      price: 25,
      tags: ['networking', 'founders', 'social'],
    },
  ]

  private mockMentors: Mentor[] = [
    {
      id: '1',
      user: { id: '1', name: 'David Kim', email: 'david@mentor.com', role: 'mentor', avatar: '', joinedAt: '2020-03-15' },
      expertise: ['Fundraising', 'Pitch Decks', 'Investor Relations'],
      industries: ['SaaS', 'FinTech', 'Enterprise'],
      bio: 'Former VC partner with 15+ years of experience. Helped 50+ startups raise over $500M.',
      experience: '15+ years',
      availability: 'available',
      rating: 4.9,
      reviewsCount: 127,
      sessionsCompleted: 342,
      hourlyRate: 150,
      languages: ['English', 'Korean'],
      timezone: 'PST',
      linkedIn: 'https://linkedin.com/in/davidkim',
      calendlyLink: 'https://calendly.com/davidkim',
    },
    {
      id: '2',
      user: { id: '2', name: 'Emily Zhang', email: 'emily@mentor.com', role: 'mentor', avatar: '', joinedAt: '2021-01-10' },
      expertise: ['Product Strategy', 'UX Design', 'Growth'],
      industries: ['Consumer', 'E-commerce', 'Mobile'],
      bio: 'Ex-Google PM, built products used by millions. Passionate about helping founders build great products.',
      experience: '12 years',
      availability: 'available',
      rating: 4.8,
      reviewsCount: 89,
      sessionsCompleted: 215,
      hourlyRate: 'free',
      languages: ['English', 'Mandarin'],
      timezone: 'EST',
      linkedIn: 'https://linkedin.com/in/emilyzhang',
      calendlyLink: 'https://calendly.com/emilyzhang',
    },
    {
      id: '3',
      user: { id: '3', name: 'Marcus Johnson', email: 'marcus@mentor.com', role: 'mentor', avatar: '', joinedAt: '2019-11-20' },
      expertise: ['Sales', 'B2B Strategy', 'Team Building'],
      industries: ['Enterprise', 'SaaS', 'Healthcare'],
      bio: 'Serial entrepreneur with 3 successful exits. Now helping the next generation of founders.',
      experience: '20+ years',
      availability: 'limited',
      rating: 4.9,
      reviewsCount: 156,
      sessionsCompleted: 428,
      hourlyRate: 200,
      languages: ['English'],
      timezone: 'CST',
      linkedIn: 'https://linkedin.com/in/marcusjohnson',
      calendlyLink: 'https://calendly.com/marcusjohnson',
    },
  ]

  private mockStats: PlatformStats = {
    totalFounders: 12500,
    totalMentors: 450,
    totalInvestors: 280,
    activeEvents: 24,
    resourcesCount: 500,
    templatesCount: 192,
    successStories: 85,
    fundingRaised: '$150M+',
  }
}

// Export singleton instance
export const platformService = new PlatformService()

// React hooks for data fetching
export function usePlatformData<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetcher()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Import React for hooks
import * as React from 'react'

