import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/', '/(fr|en|es|it|pt|nl|de|pl|ro|sv)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
