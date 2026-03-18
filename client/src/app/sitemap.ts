import { MetadataRoute } from 'next';

const locales = ['fr', 'de', 'en', 'es', 'it', 'pt', 'tr', 'ro', 'nl', 'pl'];
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.agm-negoce.com';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/services',
        '/reviews',
        '/contact',
        '/documents',
        '/register',
        '/login',
        '/verify',
        '/credit-request',
        '/cgu',
        '/mentions-legales',
        '/politique-confidentialite',
        '/cookies',
        '/conditions-remboursement',
        '/confiance-securite',
        '/disclaimer-financier',
        '/mentions-publicitaires',
    ];

    const entries: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
        routes.forEach((route) => {
            entries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    return entries;
}
