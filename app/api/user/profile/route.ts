import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return requireAuth(async (req, context) => {
    try {
      // Return user from auth context (already fetched from platform)
      return NextResponse.json({
        user: context.user,
        isEmbedded: context.isEmbedded,
        platformContext: context.platformContext,
      })
    } catch (error) {
      console.error('Get user profile error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

