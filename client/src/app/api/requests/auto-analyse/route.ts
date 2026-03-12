import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';

/**
 * Firebase Firestore REST API helper (uses API key, no service account needed)
 */
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agm-invest';
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

async function firestoreGet(path: string) {
    const res = await fetch(`${FIRESTORE_BASE}/${path}?key=${FIREBASE_API_KEY}`);
    if (!res.ok) throw new Error(`Firestore GET failed: ${res.status} ${await res.text()}`);
    return res.json();
}

async function firestorePatch(path: string, fields: Record<string, any>) {
    // Convert plain JS values to Firestore field format
    const converted: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
        if (typeof v === 'boolean') converted[k] = { booleanValue: v };
        else if (typeof v === 'string') converted[k] = { stringValue: v };
        else if (typeof v === 'number') converted[k] = { integerValue: v };
        else converted[k] = { stringValue: String(v) };
    }
    const fieldMask = Object.keys(fields).join(',');
    const res = await fetch(
        `${FIRESTORE_BASE}/${path}?updateMask.fieldPaths=${Object.keys(fields).join('&updateMask.fieldPaths=')}&key=${FIREBASE_API_KEY}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
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
    console.log("[AutoAnalyse] API Triggered");

    try {
        const body = await req.json();
        const { requestId, userId, firstName, email, language } = body;

        if (!requestId) {
            return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
        }

        // 1. Fetch Request document
        let requestDoc: any;
        try {
            requestDoc = await firestoreGet(`requests/${requestId}`);
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
        await firestorePatch(`requests/${requestId}`, {
            stepAnalysis: true,
            status: 'processing',
            updatedAt: new Date().toISOString(),
        });

        // 3. Set User to verification_required
        await firestorePatch(`users/${resolvedUserId}`, {
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
