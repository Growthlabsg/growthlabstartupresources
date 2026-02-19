import { NextRequest, NextResponse } from 'next/server'
import { optionalAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  return optionalAuth(async (req, context) => {
    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const difficulty = searchParams.get('difficulty')
      const type = searchParams.get('type')
      const search = searchParams.get('search')
      const featured = searchParams.get('featured')
      const popular = searchParams.get('popular')
      const limit = searchParams.get('limit')

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (difficulty) params.append('difficulty', difficulty)
      if (type) params.append('type', type)
      if (search) params.append('search', search)
      if (featured) params.append('featured', featured)
      if (popular) params.append('popular', popular)
      if (limit) params.append('limit', limit)

      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (context.token) {
        headers['Authorization'] = `Bearer ${context.token}`
      }

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/resources?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch resources' },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      // Add user context if authenticated
      if (context.isAuthenticated && context.user) {
        // Could enhance with user-specific data
        data.userContext = {
          stage: context.user.stage,
          industry: context.user.industry,
        }
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request: NextRequest) {
  return optionalAuth(async (req, context) => {
    try {
      if (!context.isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = await request.json()

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/resources`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'X-API-Key': GROWTHLAB_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error('Create resource error:', error)
      return NextResponse.json(
        { error: 'Failed to create resource' },
        { status: 500 }
      )
    }
  })(request)
}

