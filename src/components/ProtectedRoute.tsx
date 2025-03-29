'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authService.checkAuth()
      if (!isAuthenticated) {
        router.push('/login')
      }
    }

    if (!user) {
      checkAuth()
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
