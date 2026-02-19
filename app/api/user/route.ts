import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || 'http://localhost:3001'
const GROWTHLAB_API_KEY = process.env.GROWTHLAB_API_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${GROWTHLAB_API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'X-API-Key': GROWTHLAB_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

