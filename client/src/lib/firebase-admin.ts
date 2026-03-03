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
                let privateKey = serviceAccount.private_key;
                if (privateKey) {
                    // 1. Convert literal triple or double escaped newlines back to actual newlines
                    // 2. Remove any carriage returns (\r)
                    // 3. Trim all whitespace
                    privateKey = privateKey.replace(/\\\\\\n/g, '\n').replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r/g, '').trim();

                    // 4. Remove potential wrapping quotes if they exist
                    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                        privateKey = privateKey.slice(1, -1);
                    }

                    // Diagnostic logging (safe)
                    console.log(`[FirebaseAdmin] Normalizing private key. Length: ${privateKey.length}`);
                    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
                        console.error('[FirebaseAdmin] Private key DOES NOT start with BEGIN header (found: ' + privateKey.substring(0, 15) + '...)');
                    }
                    if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
                        console.error('[FirebaseAdmin] Private key DOES NOT end with END header (found: ...' + privateKey.substring(privateKey.length - 15) + ')');
                    }

                    serviceAccount.private_key = privateKey;
                }

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('[FirebaseAdmin] Initialized successfully with project:', serviceAccount.project_id);
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
