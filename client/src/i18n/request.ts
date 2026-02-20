import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        console.log(`[i18n] invalid locale: ${locale}, falling back to ${routing.defaultLocale}`);
        locale = routing.defaultLocale;
    }

    console.log(`[i18n] loading messages for locale: ${locale}`);
    try {
        const messages = (await import(`../../messages/${locale}.json`)).default;
        console.log(`[i18n] messages loaded for ${locale}`);
        return {
            locale,
            messages
        };
    } catch (error) {
        console.error(`[i18n] error loading messages for ${locale}:`, error);
        return {
            locale,
            messages: {}
        };
    }
});
