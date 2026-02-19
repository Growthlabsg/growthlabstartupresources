import { NextRequest, NextResponse } from 'next/server'
import { optionalAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  return optionalAuth(async (req, context) => {
    try {
      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (context.token) {
        headers['Authorization'] = `Bearer ${context.token}`
      }

      // Fetch platform stats
      const platformStatsResponse = await fetch(
        `${GROWTHLAB_API_URL}/api/stats`,
        { headers }
      )

      // Fetch startup resources stats
      const resourcesStatsResponse = await fetch(
        `${GROWTHLAB_API_URL}/api/startup-resources/stats`,
        { headers }
      )

      const platformStats = platformStatsResponse.ok 
        ? await platformStatsResponse.json() 
        : {}
      
      const resourcesStats = resourcesStatsResponse.ok
        ? await resourcesStatsResponse.json()
        : {}

      return NextResponse.json({
        platform: platformStats,
        resources: resourcesStats,
        user: context.isAuthenticated ? {
          id: context.user?.id,
          stage: context.user?.stage,
          industry: context.user?.industry,
        } : null,
      })
    } catch (error) {
      console.error('Get stats error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

