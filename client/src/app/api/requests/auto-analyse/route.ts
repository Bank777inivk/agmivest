import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';
import { adminDb } from '@/lib/firebase-admin';

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

        // 1. Fetch Request to check status and get userId
        const requestRef = adminDb.collection('requests').doc(requestId);
        const requestSnap = await requestRef.get();

        if (!requestSnap.exists) {
            console.error(`[AutoAnalyse] Request not found: ${requestId}`);
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const requestData = requestSnap.data();
        console.log(`[AutoAnalyse] Found request document for user: ${requestData?.userId}`);
        const resolvedUserId = userId || requestData?.userId;

        if (!resolvedUserId) {
            return NextResponse.json({ error: 'Could not resolve userId' }, { status: 400 });
        }

        if (requestData?.stepAnalysis === true) {
            return NextResponse.json({ success: true, message: 'Already analyzed' });
        }

        // 2. Mark Request as Analyzed
        await requestRef.update({
            stepAnalysis: true,
            status: 'processing',
            updatedAt: new Date().toISOString()
        });

        // 3. Set User to verification_required
        const userRef = adminDb.collection('users').doc(resolvedUserId);
        await userRef.update({
            idStatus: 'verification_required',
            kycReminderStartedAt: new Date().toISOString(),
            otpVerified: true
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
