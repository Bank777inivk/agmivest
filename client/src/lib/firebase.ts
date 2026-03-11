import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Lazy initialization helpers
let _auth: any;
let _db: any;

export const getFirebaseAuth = () => {
    if (!_auth) {
        _auth = getAuth(app);
    }
    return _auth;
};

export const getFirestore = () => {
    if (!_db) {
        _db = initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        });
    }
    return _db;
};

// Type guard for Firebase errors
const isFirebaseError = (error: unknown): error is { code: string } => {
    return typeof error === 'object' && error !== null && 'code' in error;
};

// Helper to map Firebase Auth error codes to translation keys
const getFirebaseAuthErrorMessage = (error: unknown): string => {
    if (!isFirebaseError(error)) return 'Errors.default';

    const code = error.code;
    const errorMap: Record<string, string> = {
        'auth/invalid-email': 'auth/invalid-email',
        'auth/user-disabled': 'auth/user-disabled',
        'auth/user-not-found': 'auth/user-not-found',
        'auth/wrong-password': 'auth/wrong-password',
        'auth/too-many-requests': 'auth/too-many-requests',
        'auth/email-already-in-use': 'auth/email-already-in-use',
        'auth/weak-password': 'auth/weak-password',
        'auth/invalid-credential': 'auth/wrong-password', // Map new Firebase error to old one for translation
    };
    return errorMap[code] || 'auth/default';
};

export { app, getFirebaseAuthErrorMessage, isFirebaseError };
