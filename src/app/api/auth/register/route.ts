import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateVerificationCode } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()

    // Initialize Payload CMS
    const payload = await getPayload({ config })

    const checkUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
    })

    if (checkUser.totalDocs > 0) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // ✅ Create user directly in Payload CMS
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        username,
        verified: false,
        verificationCode,
      },
    })

    payload.email.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `
        <p>Hello,</p>
        <p>Thank you for registering! Please verify your email by using the code below:</p>
        <h2>${verificationCode}</h2>
        <p>If you did not register, please ignore this email.</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      requiresVerification: true,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong during registration',
      },
      { status: 500 },
    )
  }
}
