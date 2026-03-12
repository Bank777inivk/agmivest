import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';

/**
 * Superadmin Firebase REST API helper
 * Generates an OAuth2 token manually from the Service Account Key to bypass all Firestore Security Rules.
 * This completely avoids the buggy `firebase-admin` SDK which fails locally with PEM errors.
 */
async function getAdminAccessToken(): Promise<string> {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountStr) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not found');

    const serviceAccount = JSON.parse(serviceAccountStr.trim().replace(/^'|'$/g, ''));

    // Normalize private key robustly
    let privateKey = serviceAccount.private_key
        .split('\\\\n').join('\n')
        .split('\\n').join('\n')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

    // Manually create JWT for Google OAuth2
    const header = { alg: 'RS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // 1 hour
    const payload = {
        iss: serviceAccount.client_email,
        sub: serviceAccount.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        iat,
        exp,
        scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform'
    };

    const crypto = await import('crypto');
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);

    // Quick fix for trailing/leading garbage in the PEM key (strips wrappers and rebuilds)
    const base64Raw = privateKey.replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s+/g, '');
    const cleanLines = [];
    for (let i = 0; i < base64Raw.length; i += 64) cleanLines.push(base64Raw.substring(i, i + 64));
    const cleanPrivateKey = `-----BEGIN PRIVATE KEY-----\n${cleanLines.join('\n')}\n-----END PRIVATE KEY-----\n`;

    const signature = sign.sign(cleanPrivateKey, 'base64url');
    const jwt = `${signatureInput}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to get OAuth token: ${await response.text()}`);
    }

    const data = await response.json();
    return data.access_token;
}

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agm-invest';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

async function firestoreGetAdmin(path: string) {
    const token = await getAdminAccessToken();
    const res = await fetch(`${FIRESTORE_BASE}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Firestore GET failed: ${res.status} ${await res.text()}`);
    return res.json();
}

async function firestorePatchAdmin(path: string, fields: Record<string, any>) {
    const token = await getAdminAccessToken();
    const converted: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
        if (typeof v === 'boolean') converted[k] = { booleanValue: v };
        else if (typeof v === 'string') converted[k] = { stringValue: v };
        else if (typeof v === 'number') converted[k] = { integerValue: v };
        else converted[k] = { stringValue: String(v) };
    }

    const res = await fetch(
        `${FIRESTORE_BASE}/${path}?updateMask.fieldPaths=${Object.keys(fields).join('&updateMask.fieldPaths=')}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ fields: converted }),
        }
    );
    if (!res.ok) throw new Error(`Firestore PATCH failed: ${res.status} ${await res.text()}`);
    return res.json();
}

function getStringField(doc: any, field: string): string | undefined {
    return doc?.fields?.[field]?.stringValue;
}
function getBoolField(doc: any, field: string): boolean | undefined {
    return doc?.fields?.[field]?.booleanValue;
}

/**
 * API Route for automatic credit request analysis
 * Triggered by the client 1 minute after submission
 */
export async function POST(req: Request) {
    console.log("[AutoAnalyse] API Triggered via Admin REST API");

    try {
        const body = await req.json();
        const { requestId, userId, firstName, email, language } = body;

        if (!requestId) {
            return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
        }

        // 1. Fetch Request document
        let requestDoc: any;
        try {
            requestDoc = await firestoreGetAdmin(`requests/${requestId}`);
        } catch (err: any) {
            console.error(`[AutoAnalyse] Failed to fetch request: ${err.message}`);
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const resolvedUserId = userId || getStringField(requestDoc, 'userId');
        if (!resolvedUserId) {
            return NextResponse.json({ error: 'Could not resolve userId' }, { status: 400 });
        }

        console.log(`[AutoAnalyse] Found request for user: ${resolvedUserId}`);

        // Skip if already analyzed
        if (getBoolField(requestDoc, 'stepAnalysis') === true) {
            return NextResponse.json({ success: true, message: 'Already analyzed' });
        }

        // 2. Mark Request as Analyzed
        await firestorePatchAdmin(`requests/${requestId}`, {
            stepAnalysis: true,
            status: 'processing',
            updatedAt: new Date().toISOString(),
        });

        // 3. Set User to verification_required
        await firestorePatchAdmin(`users/${resolvedUserId}`, {
            idStatus: 'verification_required',
            kycReminderStartedAt: new Date().toISOString(),
            otpVerified: true,
        });

        // 4. Send Email to Client
        try {
            const emailContent = kycRequiredTemplate({ firstName: firstName || 'Client' }, language || 'fr');
            await sendEmail({
                to: email,
                subject: emailContent.subject,
                html: emailContent.html,
            });
            console.log(`[AutoAnalyse] ✅ Email sent to ${email}`);
        } catch (emailErr) {
            console.error('[AutoAnalyse] Email failed:', emailErr);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[AutoAnalyse] Critical error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
