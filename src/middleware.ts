import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // If trying to access auth page while logged in, redirect to home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If trying to access protected route without token, redirect to login
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Add your protected routes here
export const config = {
  matcher: ['/login', '/account/:path*', '/checkout/:path*'],
}
