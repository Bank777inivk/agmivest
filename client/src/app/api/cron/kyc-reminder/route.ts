import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';

const CRON_SECRET = process.env.CRON_SECRET;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/**
 * Vercel Cron Job — Runs every day at 9:00 AM UTC
 * Sends KYC identity verification reminder emails to users who still need to submit documents
 * Stops automatically when idStatus is set to 'verified' or 'submitted'
 */
export async function GET(req: Request) {
    // 1. Verify request comes from Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
        console.error('[KYCReminderCron] Unauthorized access attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[KYCReminderCron] Starting daily KYC reminder job...');

        // 2. Query Firestore via REST API — users with idStatus = 'verification_required'
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_API_KEY}`;

        const queryBody = {
            structuredQuery: {
                from: [{ collectionId: 'users' }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: 'idStatus' },
                        op: 'EQUAL',
                        value: { stringValue: 'verification_required' }
                    }
                },
                select: {
                    fields: [
                        { fieldPath: 'email' },
                        { fieldPath: 'firstName' },
                        { fieldPath: 'language' },
                        { fieldPath: 'idStatus' }
                    ]
                }
            }
        };

        const firestoreRes = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryBody)
        });

        if (!firestoreRes.ok) {
            const errText = await firestoreRes.text();
            console.error('[KYCReminderCron] Firestore query failed:', errText);
            return NextResponse.json({ error: 'Firestore query failed', detail: errText }, { status: 500 });
        }

        const results: any[] = await firestoreRes.json();
        const pendingUsers = results.filter(r => r.document);

        console.log(`[KYCReminderCron] Found ${pendingUsers.length} users needing KYC`);

        let successCount = 0;

        for (const result of pendingUsers) {
            const fields = result.document?.fields || {};
            const email: string = fields.email?.stringValue || '';
            const firstName: string = fields.firstName?.stringValue || 'Client';
            const locale: string = fields.language?.stringValue || 'fr';
            const idStatus: string = fields.idStatus?.stringValue || '';

            // Skip users who have already verified or submitted
            if (idStatus === 'verified' || idStatus === 'submitted') continue;

            if (!email) continue;

            try {
                const emailContent = kycRequiredTemplate({ firstName }, locale);
                await sendEmail({
                    to: email,
                    subject: emailContent.subject,
                    html: emailContent.html
                });
                successCount++;
                console.log(`[KYCReminderCron] ✅ Reminder sent to ${email} (${locale})`);
            } catch (emailErr: any) {
                console.error(`[KYCReminderCron] ❌ Failed to send to ${email}:`, emailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            processed: pendingUsers.length,
            sent: successCount,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[KYCReminderCron] Unexpected error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
