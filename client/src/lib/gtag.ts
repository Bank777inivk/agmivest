/**
 * Google Ads (gtag.js) tracking utilities
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

// https://developers.google.com/tag-platform/gtagjs/reference#event
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    } else {
        console.warn(`[gtag] Event ${eventName} recorded but gtag not found`, params);
    }
};

/**
 * Enhanced Conversion Tracking
 * Sending hashed user data to Google for better attribution
 */
export const trackConversion = (value: number, currency: string = 'EUR', userData: { email?: string; phone?: string } = {}) => {
    const config: Record<string, any> = {
        value,
        currency,
        send_to: `${GTM_ID}/default`, // adjust if specific conversion label is provided
    };

    // If GTM/gtag is configured for enhanced conversions, it expects user_data
    if (userData.email || userData.phone) {
        config.user_data = {};
        if (userData.email) config.user_data.email = userData.email.toLowerCase().trim();
        if (userData.phone) config.user_data.phone_number = userData.phone.replace(/\s/g, '');
    }

    trackEvent('conversion', config);
};

/**
 * Track Simulation Events
 */
export const trackSimulation = (action: 'start' | 'complete', amount: number, duration: number) => {
    trackEvent(`loan_simulation_${action}`, {
        amount,
        duration_months: duration,
        currency: 'EUR'
    });
};
