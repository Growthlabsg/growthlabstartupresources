import { NextRequest, NextResponse } from 'next/server'
import { optionalAuth } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  return optionalAuth(async (req, context) => {
    try {
      const { searchParams } = new URL(request.url)
      const q = searchParams.get('q')
      const type = searchParams.get('type') || 'all' // all, tools, resources, guides
      const limit = searchParams.get('limit') || '20'

      if (!q) {
        return NextResponse.json(
          { error: 'Search query required' },
          { status: 400 }
        )
      }

      const headers: HeadersInit = {
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      }

      if (context.token) {
        headers['Authorization'] = `Bearer ${context.token}`
      }

      // Search across multiple endpoints
      const searchPromises: Promise<any>[] = []

      if (type === 'all' || type === 'tools') {
        searchPromises.push(
          fetch(
            `${GROWTHLAB_API_URL}/api/startup-resources/tools?search=${encodeURIComponent(q)}&limit=${limit}`,
            { headers }
          ).then(r => r.ok ? r.json() : { tools: [] })
        )
      }

      if (type === 'all' || type === 'resources') {
        searchPromises.push(
          fetch(
            `${GROWTHLAB_API_URL}/api/startup-resources/resources?search=${encodeURIComponent(q)}&limit=${limit}`,
            { headers }
          ).then(r => r.ok ? r.json() : { resources: [] })
        )
      }

      if (type === 'all' || type === 'guides') {
        searchPromises.push(
          fetch(
            `${GROWTHLAB_API_URL}/api/startup-resources/guides?search=${encodeURIComponent(q)}&limit=${limit}`,
            { headers }
          ).then(r => r.ok ? r.json() : { guides: [] })
        )
      }

      const results = await Promise.all(searchPromises)

      const combined = {
        query: q,
        type,
        results: {
          tools: results[0]?.tools || results[0] || [],
          resources: results[1]?.resources || results[1] || [],
          guides: results[2]?.guides || results[2] || [],
        },
        total: (results[0]?.tools?.length || 0) + 
               (results[1]?.resources?.length || 0) + 
               (results[2]?.guides?.length || 0),
      }

      return NextResponse.json(combined)
    } catch (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

