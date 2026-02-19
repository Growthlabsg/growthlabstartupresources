import { NextRequest, NextResponse } from 'next/server'
import { optionalAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return optionalAuth(async (req, context) => {
    try {
      const { id } = params

      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (context.token) {
        headers['Authorization'] = `Bearer ${context.token}`
      }

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/resources/${id}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      // Add user-specific data if authenticated
      if (context.isAuthenticated && context.user) {
        data.userContext = {
          bookmarked: false,
          viewed: false,
          completed: false,
        }
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error('Get resource error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

