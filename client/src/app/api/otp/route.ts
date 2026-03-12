import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

/**
 * OTP System using HTTP-only cookies + HMAC signing
 * - No Firebase Admin needed
 * - Works locally and in production/serverless
 * - Secure: HTTP-only cookie, HMAC prevents tampering
 */

const OTP_SECRET = process.env.CRON_SECRET || 'agm-otp-secure-secret-2024';
const OTP_COOKIE_NAME = 'agm_otp_token';

function signToken(payload: object): string {
    const data = JSON.stringify(payload);
    const hmac = createHmac('sha256', OTP_SECRET).update(data).digest('hex');
    return Buffer.from(data).toString('base64') + '.' + hmac;
}

function verifyToken(token: string): object | null {
    try {
        const [dataB64, hmac] = token.split('.');
        if (!dataB64 || !hmac) return null;
        const data = Buffer.from(dataB64, 'base64').toString('utf-8');
        const expectedHmac = createHmac('sha256', OTP_SECRET).update(data).digest('hex');
        if (hmac !== expectedHmac) {
            console.warn('[OTP] HMAC mismatch – possible tampering');
            return null;
        }
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, email, code, otpCode } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const emailKey = email.toLowerCase().trim();

        // ---- STORE action ----
        if (action === 'store') {
            const generatedCode = otpCode || String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

            const payload = { email: emailKey, code: generatedCode, exp: expiresAt };
            const token = signToken(payload);

            console.log(`[OTP] Stored OTP for ${emailKey} (expires in 15 min)`);

            const res = NextResponse.json({ success: true, code: generatedCode });
            res.cookies.set(OTP_COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60, // 15 minutes in seconds
                path: '/',
            });
            return res;
        }

        // ---- VERIFY action ----
        if (action === 'verify') {
            if (!code) {
                return NextResponse.json({ error: 'Code is required' }, { status: 400 });
            }

            const token = req.cookies.get(OTP_COOKIE_NAME)?.value;
            if (!token) {
                console.warn(`[OTP] No token cookie found for verification`);
                return NextResponse.json({ valid: false, reason: 'not_found' });
            }

            const payload = verifyToken(token) as any;
            if (!payload) {
                return NextResponse.json({ valid: false, reason: 'invalid_token' });
            }

            // Check email matches
            if (payload.email !== emailKey) {
                console.warn(`[OTP] Email mismatch: ${payload.email} vs ${emailKey}`);
                return NextResponse.json({ valid: false, reason: 'email_mismatch' });
            }

            // Check expiry
            if (payload.exp < Date.now()) {
                console.warn(`[OTP] Token expired for ${emailKey}`);
                const res = NextResponse.json({ valid: false, reason: 'expired' });
                res.cookies.delete(OTP_COOKIE_NAME);
                return res;
            }

            // Check code
            if (String(payload.code) === String(code)) {
                console.log(`[OTP] OTP verified successfully for ${emailKey}`);
                const res = NextResponse.json({ valid: true });
                res.cookies.delete(OTP_COOKIE_NAME); // Delete after successful use
                return res;
            }

            console.warn(`[OTP] Invalid code for ${emailKey}. Expected: ${payload.code}, Got: ${code}`);
            return NextResponse.json({ valid: false, reason: 'invalid_code' });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

    } catch (error: any) {
        console.error('[OTP API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
