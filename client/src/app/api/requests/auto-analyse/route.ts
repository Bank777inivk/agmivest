import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/**
 * API Route for automatic credit request analysis
 * Triggered by the client 1 minute after submission
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { requestId, userId, firstName, email, language } = body;

        if (!requestId) {
            return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
        }

        // 1. Fetch Request to check status and get userId
        const docUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests/${requestId}?key=${FIREBASE_API_KEY}`;
        const checkRes = await fetch(docUrl);
        if (!checkRes.ok) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const requestDoc = await checkRes.json();
        const resolvedUserId = userId || requestDoc.fields?.userId?.stringValue;

        if (!resolvedUserId) {
            return NextResponse.json({ error: 'Could not resolve userId' }, { status: 400 });
        }

        if (requestDoc.fields?.stepAnalysis?.booleanValue === true) {
            return NextResponse.json({ success: true, message: 'Already analyzed' });
        }

        // 2. Mark Request as Analyzed
        const patchRequestUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests/${requestId}?updateMask.fieldPaths=stepAnalysis&updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt&key=${FIREBASE_API_KEY}`;
        await fetch(patchRequestUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    stepAnalysis: { booleanValue: true },
                    status: { stringValue: 'processing' },
                    updatedAt: { timestampValue: new Date().toISOString() }
                }
            })
        });

        // 3. Set User to verification_required
        const patchUserUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${resolvedUserId}?updateMask.fieldPaths=idStatus&updateMask.fieldPaths=kycReminderStartedAt&key=${FIREBASE_API_KEY}`;
        await fetch(patchUserUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    idStatus: { stringValue: 'verification_required' },
                    kycReminderStartedAt: { timestampValue: new Date().toISOString() }
                }
            })
        });

        // 4. Send Email to Client
        try {
            const emailContent = kycRequiredTemplate({ firstName: firstName || 'Client' }, language || 'fr');
            await sendEmail({
                to: email,
                subject: emailContent.subject,
                html: emailContent.html
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
