import { useCartStore } from '@/store/cart'
import { LoginResponse, RegisterResponse, VerificationResponse } from '@/types/user'
import Cookies from 'js-cookie'

const API_URL = '/api/auth'

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (data.token) {
      Cookies.set('token', data.token, { expires: 7 })
      data.success = true
    }

    return data
  },

  register: async (
    email: string,
    password: string,
    username: string,
  ): Promise<RegisterResponse> => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })
    return res.json()
  },

  verifyEmail: async (email: string, code: string): Promise<VerificationResponse> => {
    const res = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    return res.json()
  },

  resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return res.json()
  },

  checkAuth: async (): Promise<{ authenticated: boolean; user?: any }> => {
    const token = Cookies.get('token')
    if (!token) return { authenticated: false }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      if (isExpired) {
        Cookies.remove('token')
        return { authenticated: false }
      }
      const res = await fetch(`${API_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      return { authenticated: data.authenticated, user: data.user }
    } catch {
      return { authenticated: false }
    }
  },

  logout: async () => {
    try {
      const { saveCart } = useCartStore()
      await saveCart()
      Cookies.remove('token')
      window.location.href = '/login'
    } catch (error) {
      console.error('Failed to save cart or logout:', error)
    }
  },
}
