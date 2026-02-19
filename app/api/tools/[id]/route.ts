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
      const token = context.token

      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/tools/${id}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Tool not found' },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      // Add user-specific data if authenticated
      if (context.isAuthenticated && context.user) {
        // Could add user progress, bookmarks, etc.
        data.userContext = {
          bookmarked: false, // TODO: Check from user data
          progress: null, // TODO: Get from user data
        }
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error('Get tool error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

