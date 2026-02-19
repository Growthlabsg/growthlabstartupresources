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

    const response = await fetch(`${GROWTHLAB_API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'X-API-Key': GROWTHLAB_API_KEY,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${GROWTHLAB_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GROWTHLAB_API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}

