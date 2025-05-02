import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './auth';

export function middleware(request: NextRequest) {
  // No authentication check - all routes are accessible
  return isAuthenticated() ? NextResponse.next() : NextResponse.redirect('/login');
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};