import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: any) {
    const response = await intlMiddleware(request);

    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    const cspHeader = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com https://*.google.com https://*.doubleclick.net https://connect.facebook.net https://apis.google.com",
        "script-src-elem 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com https://*.google.com https://*.doubleclick.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: https://*.google.com https://*.googleadservices.com https://*.googletagmanager.com https://*.google-analytics.com https://*.doubleclick.net https://*.g.doubleclick.net",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://api-adresse.data.gouv.fr https://www.googleadservices.com https://www.google.fr https://*.firebaseio.com https://*.googleapis.com https://*.cloudinary.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://*.g.doubleclick.net https://*.google.com https://tagassistant.google.com",
        "frame-src 'self' https://www.youtube.com https://www.facebook.com https://www.google.com https://maps.google.com https://agm-invest.firebaseapp.com https://*.firebaseapp.com https://tagassistant.google.com"
    ].join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|.*\\..*).*)'
    ]
};
