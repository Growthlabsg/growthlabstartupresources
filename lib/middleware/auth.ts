/**
 * Authentication Middleware for GrowthLab Platform Integration
 * Handles user authentication and context from the main platform
 */

import { NextRequest, NextResponse } from 'next/server'

export interface PlatformUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'founder' | 'mentor' | 'investor' | 'admin' | 'team_member'
  company?: string
  industry?: string
  stage?: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'scale'
  subscription?: 'free' | 'pro' | 'enterprise'
  permissions?: string[]
  metadata?: Record<string, any>
}

export interface AuthContext {
  user: PlatformUser | null
  token: string | null
  isAuthenticated: boolean
  isEmbedded: boolean
  platformContext?: {
    containerId?: string
    theme?: 'light' | 'dark'
    locale?: string
  }
}

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || process.env.NEXT_PUBLIC_GROWTHLAB_API_KEY || ''

/**
 * Extract authentication token from request
 */
export function extractAuthToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const cookieToken = request.cookies.get('growthlab_token')?.value
  if (cookieToken) {
    return cookieToken
  }

  // Check query parameter (for iframe embedding)
  const queryToken = request.nextUrl.searchParams.get('token')
  if (queryToken) {
    return queryToken
  }

  // Check iframe parent context (for embedded mode)
  const iframeToken = request.headers.get('x-iframe-token')
  if (iframeToken) {
    return iframeToken
  }

  return null
}

/**
 * Verify token with main platform
 */
export async function verifyPlatformToken(token: string): Promise<PlatformUser | null> {
  try {
    const response = await fetch(`${GROWTHLAB_API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Get user profile from main platform
 */
export async function getPlatformUser(token: string): Promise<PlatformUser | null> {
  try {
    const response = await fetch(`${GROWTHLAB_API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

/**
 * Create authentication context from request
 */
export async function createAuthContext(request: NextRequest): Promise<AuthContext> {
  const token = extractAuthToken(request)
  const isEmbedded = request.headers.get('x-embedded') === 'true' || 
                     request.nextUrl.searchParams.get('embedded') === 'true'

  if (!token) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isEmbedded,
    }
  }

  const user = await getPlatformUser(token)

  return {
    user,
    token,
    isAuthenticated: !!user,
    isEmbedded,
    platformContext: {
      containerId: request.headers.get('x-container-id') || undefined,
      theme: (request.headers.get('x-theme') as 'light' | 'dark') || 'light',
      locale: request.headers.get('x-locale') || 'en',
    },
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authContext = await createAuthContext(request)

    if (!authContext.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(request, authContext)
  }
}

/**
 * Middleware to optionally use authentication
 */
export function optionalAuth(handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authContext = await createAuthContext(request)
    return handler(request, authContext)
  }
}

