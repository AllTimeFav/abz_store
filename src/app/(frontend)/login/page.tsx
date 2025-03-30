'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'

enum MODE {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const [mode, setMode] = useState<MODE>(MODE.LOGIN)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const formTitle =
    mode === MODE.LOGIN
      ? 'Log in'
      : mode === MODE.REGISTER
        ? 'Register'
        : mode === MODE.RESET_PASSWORD
          ? 'Reset Your Password'
          : 'Verify Your Email'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      switch (mode) {
        case MODE.LOGIN: {
          const response = await authService.login(email, password)

          if (response.success) {
            if (response.requiresVerification) {
              setMode(MODE.EMAIL_VERIFICATION)
              setMessage('Please verify your email first')
            } else {
              const userRes = response.user!
              setUser(userRes)
              router.push('/')
              useCartStore.getState().setUserId(userRes.id)
            }
          } else {
            setError(response.message)
          }
          break
        }

        case MODE.REGISTER: {
          const response = await authService.register(email, password, username)
          if (response.success) {
            setMode(MODE.EMAIL_VERIFICATION)
            setMessage('Please check your email for verification code')
          } else {
            setError(response.message)
          }
          break
        }

        case MODE.EMAIL_VERIFICATION: {
          const response = await authService.verifyEmail(email, verificationCode)
          if (response.success) {
            setUser(response.user!)
            setMessage('Email verified successfully!')
            setMode(MODE.LOGIN)
          } else {
            setError(response.message)
          }
          break
        }

        case MODE.RESET_PASSWORD: {
          const response = await authService.resetPassword(email)
          if (response.success) {
            setMessage('Password reset instructions sent to your email')
          } else {
            setError(response.message)
          }
          break
        }
      }
    } catch (err) {
      setError('Something went wrong')
      console.log('error ', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">{formTitle}</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {mode === MODE.REGISTER && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            {mode !== MODE.EMAIL_VERIFICATION && (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            {mode === MODE.EMAIL_VERIFICATION && (
              <div>
                <label htmlFor="verificationCode" className="sr-only">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            )}

            {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {mode === MODE.LOGIN && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode(MODE.RESET_PASSWORD)
                  setError('')
                  setMessage('')
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : formTitle}
            </button>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
        </form>

        <div className="text-center">
          {mode === MODE.LOGIN && (
            <button
              type="button"
              onClick={() => {
                setMode(MODE.REGISTER)
                setError('')
                setMessage('')
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Do not have an account? Register
            </button>
          )}
          {mode === MODE.REGISTER && (
            <button
              type="button"
              onClick={() => {
                setMode(MODE.LOGIN)
                setError('')
                setMessage('')
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Login
            </button>
          )}
          {(mode === MODE.RESET_PASSWORD || mode === MODE.EMAIL_VERIFICATION) && (
            <button
              type="button"
              onClick={() => {
                setMode(MODE.LOGIN)
                setError('')
                setMessage('')
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          )}
        </div>
        <Link href="/">Click to Continue whithout an account!</Link>
      </div>
    </div>
  )
}
