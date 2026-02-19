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
      const search = searchParams.get('search')
      const featured = searchParams.get('featured')
      const limit = searchParams.get('limit')

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      if (featured) params.append('featured', featured)
      if (limit) params.append('limit', limit)

      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (context.token) {
        headers['Authorization'] = `Bearer ${context.token}`
      }

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/tools?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch tools' },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Get tools error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}
