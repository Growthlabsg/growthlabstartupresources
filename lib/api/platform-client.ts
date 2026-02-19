/**
 * Enhanced Platform API Client
 * Handles all communication with the main GrowthLab platform
 */

import { PlatformUser } from '@/lib/middleware/auth'

const GROWTHLAB_API_URL = process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.NEXT_PUBLIC_GROWTHLAB_API_KEY || ''

export class PlatformAPIClient {
  private baseURL: string
  private apiKey: string
  private token: string | null = null

  constructor() {
    this.baseURL = GROWTHLAB_API_URL
    this.apiKey = GROWTHLAB_API_KEY
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          this.token = null
          if (typeof window !== 'undefined') {
            localStorage.removeItem('growthlab_token')
          }
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Platform API Error: ${endpoint}`, error)
      throw error
    }
  }

  // User Methods
  async getUserProfile(): Promise<PlatformUser | null> {
    try {
      return await this.request<PlatformUser>('/api/user/profile')
    } catch {
      return null
    }
  }

  async getUserPreferences() {
    return this.request('/api/user/preferences')
  }

  async updateUserPreferences(preferences: Record<string, any>) {
    return this.request('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  // Resources Methods
  async getResources(params?: {
    category?: string
    difficulty?: string
    type?: string
    search?: string
    featured?: boolean
    popular?: boolean
    limit?: number
  }) {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value))
        }
      })
    }
    return this.request(`/api/startup-resources/resources?${query.toString()}`)
  }

  async getResource(id: string) {
    return this.request(`/api/startup-resources/resources/${id}`)
  }

  // Tools Methods
  async getTools(params?: {
    category?: string
    search?: string
    featured?: boolean
    limit?: number
  }) {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value))
        }
      })
    }
    return this.request(`/api/startup-resources/tools?${query.toString()}`)
  }

  async getTool(id: string) {
    return this.request(`/api/startup-resources/tools/${id}`)
  }

  // Bookmarks
  async getBookmarks() {
    return this.request('/api/user/bookmarks?type=startup-resource')
  }

  async addBookmark(resourceId: string, resourceType: string = 'startup-resource') {
    return this.request('/api/user/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ resourceId, resourceType }),
    })
  }

  async removeBookmark(resourceId: string) {
    return this.request(`/api/user/bookmarks?resourceId=${resourceId}`, {
      method: 'DELETE',
    })
  }

  // Progress Tracking
  async getProgress(resourceId?: string) {
    const url = resourceId
      ? `/api/user/progress?resourceId=${resourceId}&type=startup-resource`
      : '/api/user/progress?type=startup-resource'
    return this.request(url)
  }

  async updateProgress(resourceId: string, progress: number, completed: boolean = false) {
    return this.request('/api/user/progress', {
      method: 'POST',
      body: JSON.stringify({
        resourceId,
        resourceType: 'startup-resource',
        progress,
        completed,
      }),
    })
  }

  // Search
  async search(query: string, type: 'all' | 'tools' | 'resources' | 'guides' = 'all') {
    return this.request(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
  }

  // Stats
  async getStats() {
    return this.request('/api/stats')
  }

  // Community Integration
  async getForumCategories() {
    return this.request('/api/community/forums/categories')
  }

  async getEvents(params?: { upcoming?: boolean; limit?: number }) {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value))
        }
      })
    }
    return this.request(`/api/community/events?${query.toString()}`)
  }

  async getMentors(params?: { available?: boolean; limit?: number }) {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value))
        }
      })
    }
    return this.request(`/api/community/mentors?${query.toString()}`)
  }
}

// Export singleton instance
export const platformClient = new PlatformAPIClient()

// Initialize token from localStorage (client-side only)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('growthlab_token')
  if (token) {
    platformClient.setToken(token)
  }
}

