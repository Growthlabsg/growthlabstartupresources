import { NextRequest, NextResponse } from 'next/server'
import { createAuthContext } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authContext = await createAuthContext(request)

    if (!authContext.isAuthenticated) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: authContext.user,
      isEmbedded: authContext.isEmbedded,
      platformContext: authContext.platformContext,
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

