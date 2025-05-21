import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const protectedRoutes = ['/dashboard', '/settings', '/chat', '/tests'];
const authRoutes = ['/login', '/register', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Create a response to modify
  const response = NextResponse.next();
  
  // Create supabase middleware client
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Refresh the session if available
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if we're at the login page coming from a redirect
  if (pathname === '/login' && searchParams.has('redirect')) {
    const redirectPath = searchParams.get('redirect') || '/dashboard';
    
    // If we have a session, redirect to the intended destination
    if (session) {
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Otherwise, allow the login page to show
    return response;
  }

  // For protected routes, redirect to login if no session
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For auth routes, redirect to dashboard if already authenticated
  if (authRoutes.some(route => pathname === route) && session) {
    // Special case for reset-password - don't redirect if coming with recovery token
    if (pathname === '/reset-password' && 
        (request.nextUrl.hash || 
         searchParams.get('token') || 
         searchParams.get('type') === 'recovery')) {
      return response;
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
