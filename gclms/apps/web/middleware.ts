import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files and internal Next.js assets — skip middleware
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Public authentication routes
  const publicRoutes = ['/login', '/forgot-password', '/forbidden'];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith('/reset-password'));

  // Session detection from cookies
  const roleCookie = request.cookies.get('gclms_dev_role')?.value;
  const tokenCookie = request.cookies.get('gclms_access_token')?.value;
  const hasSession = Boolean(roleCookie || tokenCookie);

  // If user is on public login page but already has a session, redirect to role dashboard
  if (pathname === '/login' && hasSession && roleCookie) {
    const dashboardMap: Record<string, string> = {
      FOUNDER: '/founder/dashboard',
      PRINCIPAL: '/principal/dashboard',
      TEACHER: '/teacher/dashboard',
      STUDENT: '/student/dashboard',
    };
    const targetDashboard = dashboardMap[roleCookie.toUpperCase()] || '/student/dashboard';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // Protected role routes
  const protectedPrefixes = ['/founder', '/principal', '/teacher', '/student'];
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
