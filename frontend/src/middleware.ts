import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies (set by zustand persist)
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

  // Only redirect authenticated users away from auth pages
  // Protected routes are handled client-side to avoid localStorage/cookie mismatch
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
  ],
};
