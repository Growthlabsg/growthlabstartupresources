import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Health check endpoint
 * Used by main platform to verify service availability
 */
export async function GET(request: NextRequest) {
  try {
    const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
    
    // Check connection to main platform
    let platformConnected = false
    try {
      const response = await fetch(`${GROWTHLAB_API_URL}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      })
      platformConnected = response.ok
    } catch {
      platformConnected = false
    }

    return NextResponse.json({
      status: 'healthy',
      service: 'startup-resources',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      platform: {
        connected: platformConnected,
        url: GROWTHLAB_API_URL,
      },
      endpoints: {
        auth: '/api/auth/verify',
        user: '/api/user/profile',
        resources: '/api/resources',
        tools: '/api/tools',
        search: '/api/search',
        stats: '/api/stats',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

