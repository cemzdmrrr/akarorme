import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferredLocale = detectLocale(acceptLanguage);

  // Redirect to locale-prefixed path
  const locale = preferredLocale;
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(newUrl);
}

function detectLocale(acceptLanguage: string): string {
  for (const part of acceptLanguage.split(',')) {
    const lang = part.split(';')[0].trim().toLowerCase();
    // Exact match
    if (isValidLocale(lang)) return lang;
    // Prefix match (e.g. "en-US" → "en")
    const prefix = lang.split('-')[0];
    if (isValidLocale(prefix)) return prefix;
  }
  return defaultLocale;
}

export const config = {
  matcher: ['/((?!_next|api|admin|portal|favicon|.*\\..*).*)'],
};
