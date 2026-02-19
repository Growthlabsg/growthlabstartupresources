const GROWTHLAB_API_URL = process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.NEXT_PUBLIC_GROWTHLAB_API_KEY || process.env.GROWTHLAB_API_KEY || ''

export class GrowthLabAPI {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = GROWTHLAB_API_URL
    this.apiKey = GROWTHLAB_API_KEY
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getResources(params?: {
    category?: string
    difficulty?: string
    type?: string
    search?: string
    featured?: boolean
    popular?: boolean
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    return this.request(`/api/startup-resources/resources?${queryParams.toString()}`)
  }

  async getTools(params?: { id?: string; category?: string }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const endpoint = params?.id
      ? `/api/startup-resources/tools/${params.id}`
      : `/api/startup-resources/tools?${queryParams.toString()}`
    return this.request(endpoint)
  }

  async getUserProfile(token: string) {
    return this.request('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async verifyAuth(token: string) {
    return this.request('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

export const apiClient = new GrowthLabAPI()

