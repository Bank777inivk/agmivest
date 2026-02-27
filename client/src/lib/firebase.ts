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
const auth = getAuth(app);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

// Type guard for Firebase errors
const isFirebaseError = (error: unknown): error is { code: string } => {
    return typeof error === 'object' && error !== null && 'code' in error;
};

// Helper to map Firebase Auth error codes to translation keys
const getFirebaseAuthErrorMessage = (error: unknown): string => {
    if (!isFirebaseError(error)) return 'Errors.default';

    const code = error.code;
    const errorMap: Record<string, string> = {
        'auth/invalid-email': 'Errors.auth/invalid-email',
        'auth/user-disabled': 'Errors.auth/user-disabled',
        'auth/user-not-found': 'Errors.auth/user-not-found',
        'auth/wrong-password': 'Errors.auth/wrong-password',
        'auth/too-many-requests': 'Errors.auth/too-many-requests',
        'auth/email-already-in-use': 'Errors.auth/email-already-in-use',
        'auth/weak-password': 'Errors.auth/weak-password',
        'auth/invalid-credential': 'Errors.auth/wrong-password', // Map new Firebase error to old one for translation
    };
    return errorMap[code] || 'Errors.default';
};

export { app, auth, db, getFirebaseAuthErrorMessage, isFirebaseError };
