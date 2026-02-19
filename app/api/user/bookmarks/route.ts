import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  return requireAuth(async (req, context) => {
    try {
      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/user/bookmarks?type=startup-resource`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'X-API-Key': GROWTHLAB_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch bookmarks' },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Get bookmarks error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request: NextRequest) {
  return requireAuth(async (req, context) => {
    try {
      const body = await request.json()
      const { resourceId, resourceType } = body

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/user/bookmarks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'X-API-Key': GROWTHLAB_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            resourceType: resourceType || 'startup-resource',
          }),
        }
      )

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error('Create bookmark error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

export async function DELETE(request: NextRequest) {
  return requireAuth(async (req, context) => {
    try {
      const { searchParams } = new URL(request.url)
      const resourceId = searchParams.get('resourceId')

      if (!resourceId) {
        return NextResponse.json(
          { error: 'Resource ID required' },
          { status: 400 }
        )
      }

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/user/bookmarks/${resourceId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'X-API-Key': GROWTHLAB_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      return NextResponse.json(
        { success: true },
        { status: response.status }
      )
    } catch (error) {
      console.error('Delete bookmark error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

