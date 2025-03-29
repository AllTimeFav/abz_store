import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Verify token using Payload's `/me` endpoint
    const response = await fetch(`${process.env.PAYLOAD_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const user = await response.json()
    if (!user.user) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true, user })
  } catch (error) {
    console.error('Auth Check Failed:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
