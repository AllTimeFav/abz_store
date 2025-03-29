import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    const payload = await getPayload({ config: await config })

    // Find user with email and verification code
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
        verificationCode: { equals: code },
      },
    })

    if (users.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification code',
        },
        { status: 400 },
      )
    }

    const user = users.docs[0]

    // Update user to verified
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        verified: true,
        verificationCode: null, // Clear the code after verification
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        verified: true,
      },
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong during verification',
      },
      { status: 500 },
    )
  }
}
