import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  return requireAuth(async (req, context) => {
    try {
      const { searchParams } = new URL(request.url)
      const resourceId = searchParams.get('resourceId')

      const url = resourceId
        ? `${GROWTHLAB_API_URL}/api/user/progress?resourceId=${resourceId}&type=startup-resource`
        : `${GROWTHLAB_API_URL}/api/user/progress?type=startup-resource`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${context.token}`,
          'X-API-Key': GROWTHLAB_API_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch progress' },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error('Get progress error:', error)
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
      const { resourceId, progress, completed } = body

      const response = await fetch(
        `${GROWTHLAB_API_URL}/api/user/progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'X-API-Key': GROWTHLAB_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            resourceType: 'startup-resource',
            progress,
            completed,
          }),
        }
      )

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error('Update progress error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

