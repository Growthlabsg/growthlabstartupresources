import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Configuration endpoint for embedded mode
 * Provides settings for iframe integration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const containerId = searchParams.get('containerId')

    return NextResponse.json({
      version: '1.0.0',
      embedded: true,
      containerId: containerId || null,
      features: {
        authentication: true,
        userContext: true,
        navigation: true,
        messaging: true,
        theming: true,
      },
      endpoints: {
        auth: '/api/auth/verify',
        user: '/api/user/profile',
        resources: '/api/resources',
        tools: '/api/tools',
        search: '/api/search',
      },
      messaging: {
        supportedTypes: [
          'REQUEST_TOKEN',
          'TOKEN_RESPONSE',
          'AUTH_UPDATE',
          'NAVIGATION',
          'RESOURCE_VIEW',
          'TOOL_USAGE',
        ],
      },
    })
  } catch (error) {
    console.error('Embed config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

