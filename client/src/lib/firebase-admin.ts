import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountVar) {
            // Remove potential wrapping single quotes often added by users in .env files
            const cleanJson = serviceAccountVar.trim().replace(/^'|'$/g, '');
            const serviceAccount = JSON.parse(cleanJson);

            if (serviceAccount && serviceAccount.project_id) {
                // Fix for special characters in private key (especially newlines on Vercel)
                if (serviceAccount.private_key) {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('[FirebaseAdmin] Initialized successfully');
            } else {
                console.warn('[FirebaseAdmin] Service account key is missing project_id or is malformed');
            }
        } else {
            console.warn('[FirebaseAdmin] FIREBASE_SERVICE_ACCOUNT_KEY is not defined');
        }
    } catch (error) {
        console.error('[FirebaseAdmin] Initialization error:', error);
    }
}

// Safely export database and auth handles
// These will throw if used when NOT initialized, but won't crash the build during import
export const getAdminDb = () => {
    if (!admin.apps.length) {
        console.error('[FirebaseAdmin] Attempted to access Firestore without initialization');
        return null;
    }
    return admin.firestore();
};

export const getAdminAuth = () => {
    if (!admin.apps.length) {
        console.error('[FirebaseAdmin] Attempted to access Auth without initialization');
        return null;
    }
    return admin.auth();
};

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
