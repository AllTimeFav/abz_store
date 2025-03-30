import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const response = await fetch(`${process.env.PAYLOAD_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.errors[0].message }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login Failed:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
