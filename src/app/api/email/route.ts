import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use SMTP instead
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
})

export async function sednVerificationCode(email: string, verificationCode: string) {
  try {
    const mailOptions = {
      from: 'ABZ STORE',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <p>Hello,</p>
        <p>Thank you for registering! Please verify your email by using the code below:</p>
        <h2>${verificationCode}</h2>
        <p>If you did not register, please ignore this email.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Verification email sent to:', email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
