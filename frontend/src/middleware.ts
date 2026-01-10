import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/messages'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies (set by client-side)
  // Note: For better security, implement server-side token validation
  const token = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  
  if (token) {
    try {
      const parsed = JSON.parse(token);
      isAuthenticated = parsed.state?.isAuthenticated || false;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect to login if accessing protected route without auth
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/login',
    '/register',
  ],
};
