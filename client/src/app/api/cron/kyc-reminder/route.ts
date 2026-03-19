import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';
import { kycReminderTemplate } from '@/emails/templates/kyc-reminder';

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
        console.log('[KYCReminderCron] Starting daily job (Auto-Analyse + Reminders)...');

        // --- PART 1: AUTO-ANALYSE NEW REQUESTS ---
        const requestsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_API_KEY}`;
        const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

        const analysisQuery = {
            structuredQuery: {
                from: [{ collectionId: 'requests' }],
                where: {
                    compositeFilter: {
                        op: 'AND',
                        filters: [
                            {
                                fieldFilter: {
                                    field: { fieldPath: 'stepAnalysis' },
                                    op: 'EQUAL',
                                    value: { booleanValue: false }
                                }
                            },
                            {
                                fieldFilter: {
                                    field: { fieldPath: 'status' },
                                    op: 'EQUAL',
                                    value: { stringValue: 'pending' }
                                }
                            }
                        ]
                    }
                }
            }
        };

        const analysisRes = await fetch(requestsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analysisQuery)
        });

        if (analysisRes.ok) {
            const results: any[] = await analysisRes.json();
            const unanalyzedRequests = (results || []).filter(r => r.document);
            console.log(`[KYCReminderCron] Found ${unanalyzedRequests.length} unanalyzed requests to process.`);

            for (const res of unanalyzedRequests) {
                const docName = res.document.name; // e.g. projects/.../requests/ID
                const reqId = docName.split('/').pop();
                const fields = res.document.fields || {};
                const userId = fields.userId?.stringValue;
                const email = fields.email?.stringValue;
                const firstName = fields.firstName?.stringValue || 'Client';

                // 1. Mark as Analyzed and update status
                const patchUrl = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=stepAnalysis&updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt&key=${FIREBASE_API_KEY}`;
                await fetch(patchUrl, {
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

                // 2. Set User to verification_required
                if (userId) {
                    const userPatchUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=idStatus&updateMask.fieldPaths=kycReminderStartedAt&key=${FIREBASE_API_KEY}`;
                    await fetch(userPatchUrl, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fields: {
                                idStatus: { stringValue: 'verification_required' },
                                kycReminderStartedAt: { timestampValue: new Date().toISOString() }
                            }
                        })
                    });

                    // 3. Send initial KYC Required email
                    try {
                        const userDocUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?key=${FIREBASE_API_KEY}`;
                        const userFetch = await fetch(userDocUrl);
                        const userD = await userFetch.json();
                        const locale = userD.fields?.language?.stringValue || 'fr';

                        const emailContent = kycRequiredTemplate({ firstName }, locale);
                        await sendEmail({
                            to: email || userD.fields?.email?.stringValue,
                            subject: emailContent.subject,
                            html: emailContent.html
                        });
                        console.log(`[KYCReminderCron] ✅ Auto-Analyzed and emailed ${email}`);
                    } catch (e) {
                        console.error(`[KYCReminderCron] Email failed for ${reqId}`, e);
                    }
                }
            }
        }

        // --- PART 2: KYC REMINDERS (Existing Logic) ---
        // ... (remaining code remains the same but within this block)
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
                const emailContent = kycReminderTemplate({ firstName }, locale);
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
