import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('[FirebaseAdmin] Initialized successfully');
    } catch (error) {
        console.error('[FirebaseAdmin] Initialization error:', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
