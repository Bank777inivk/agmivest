import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { paymentReminderTemplate } from '@/emails/templates/payment-reminder';

const CRON_SECRET = process.env.CRON_SECRET;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || 'agm-invest-email-2024';

/**
 * Vercel Cron Job — Runs every day at 9:00 AM UTC
 * Sends payment reminder emails to users with pending verification
 * Stops automatically when admin sets paymentStatus = 'paid'
 */
export async function GET(req: Request) {
    // 1. Verify the request comes from Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
        console.error('[PaymentReminderCron] Unauthorized access attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[PaymentReminderCron] Starting daily payment reminder job...');

        // 2. Query Firestore via REST API — find requests with 'on_review' status and unpaid payment
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_API_KEY}`;

        const queryBody = {
            structuredQuery: {
                from: [{ collectionId: 'requests' }],
                where: {
                    compositeFilter: {
                        op: 'AND',
                        filters: [
                            {
                                fieldFilter: {
                                    field: { fieldPath: 'paymentVerificationStatus' },
                                    op: 'EQUAL',
                                    value: { stringValue: 'on_review' }
                                }
                            },
                            {
                                fieldFilter: {
                                    field: { fieldPath: 'status' },
                                    op: 'EQUAL',
                                    value: { stringValue: 'approved' }
                                }
                            }
                        ]
                    }
                },
                select: {
                    fields: [
                        { fieldPath: 'userId' },
                        { fieldPath: 'paymentStatus' }
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
            console.error('[PaymentReminderCron] Firestore query failed:', errText);
            return NextResponse.json({ error: 'Firestore query failed', detail: errText }, { status: 500 });
        }

        const results: any[] = await firestoreRes.json();
        const pendingRequests = results.filter(r => r.document);

        console.log(`[PaymentReminderCron] Found ${pendingRequests.length} pending requests`);

        let successCount = 0;
        let skipCount = 0;

        for (const result of pendingRequests) {
            const fields = result.document?.fields || {};
            const userId: string | null = fields.userId?.stringValue || null;
            const paymentStatus: string | null = fields.paymentStatus?.stringValue || null;

            // Skip if admin already confirmed payment
            if (paymentStatus === 'paid' || paymentStatus === 'confirmed') {
                skipCount++;
                continue;
            }

            if (!userId) continue;

            // 3. Fetch user data to get email, firstName, and locale
            const userDocUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?key=${FIREBASE_API_KEY}`;
            const userRes = await fetch(userDocUrl);

            if (!userRes.ok) {
                console.warn(`[PaymentReminderCron] Could not fetch user ${userId}`);
                continue;
            }

            const userDoc = await userRes.json();
            const userFields = userDoc.fields || {};
            const email: string = userFields.email?.stringValue || '';
            const firstName: string = userFields.firstName?.stringValue || userFields.displayName?.stringValue || 'Client';
            const locale: string = userFields.preferredLanguage?.stringValue || userFields.locale?.stringValue || 'fr';

            if (!email) {
                console.warn(`[PaymentReminderCron] No email for user ${userId}`);
                continue;
            }

            // 4. Send reminder email
            try {
                const emailContent = paymentReminderTemplate({ firstName, amount: '286.00 €' }, locale);
                await sendEmail({
                    to: email,
                    subject: emailContent.subject,
                    html: emailContent.html
                });
                successCount++;
                console.log(`[PaymentReminderCron] ✅ Reminder sent to ${email} (${locale})`);
            } catch (emailErr: any) {
                console.error(`[PaymentReminderCron] ❌ Failed to send to ${email}:`, emailErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            processed: pendingRequests.length,
            sent: successCount,
            skipped: skipCount,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[PaymentReminderCron] Unexpected error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
