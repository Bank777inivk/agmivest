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
                    try {
                        const pemHeader = '-----BEGIN PRIVATE KEY-----';
                        const pemFooter = '-----END PRIVATE KEY-----';

                        // Step 1: Normalize all escaped newline variants to actual newlines
                        let normalized = privateKey
                            .split('\\\\n').join('\n')
                            .split('\\n').join('\n')
                            .replace(/\r\n/g, '\n')
                            .replace(/\r/g, '\n');

                        // Step 2: Extract raw base64 (strip headers, footers, and ALL whitespace)
                        const base64Raw = normalized
                            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
                            .replace(/-----END PRIVATE KEY-----/g, '')
                            .replace(/\s+/g, ''); // Remove all whitespace including \n

                        // Step 3: Rebuild PEM with proper 64-char line wrapping
                        const lineLength = 64;
                        const lines: string[] = [];
                        for (let i = 0; i < base64Raw.length; i += lineLength) {
                            lines.push(base64Raw.substring(i, i + lineLength));
                        }
                        privateKey = `${pemHeader}\n${lines.join('\n')}\n${pemFooter}\n`;

                        console.log(`[FirebaseAdmin] PEM key reconstructed. Length: ${privateKey.length}, Lines: ${lines.length + 2}`);
                    } catch (keyErr) {
                        console.error('[FirebaseAdmin] Key normalization failed:', keyErr);
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
