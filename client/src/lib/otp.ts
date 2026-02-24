import { db } from './firebase';
import { doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';

/**
 * Génère un code à 6 chiffres aléatoire
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Stocke un code OTP dans Firestore pour un utilisateur donné
 * Expire après 15 minutes
 */
export async function storeOTP(email: string, code: string): Promise<void> {
    const otpRef = doc(db, 'otps', email.toLowerCase());
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await setDoc(otpRef, {
        code,
        expiresAt: Timestamp.fromDate(expiresAt),
        createdAt: Timestamp.now()
    });
}

/**
 * Vérifie si un code OTP est valide pour un email donné
 */
export async function verifyOTP(email: string, code: string): Promise<boolean> {
    const otpRef = doc(db, 'otps', email.toLowerCase());
    const otpDoc = await getDoc(otpRef);

    if (!otpDoc.exists()) return false;

    const data = otpDoc.data();
    const expiresAt = data.expiresAt.toDate();

    // Vérifier si le code est expiré
    if (expiresAt < new Date()) {
        await deleteDoc(otpRef);
        return false;
    }

    // Vérifier si le code correspond
    if (data.code === code) {
        await deleteDoc(otpRef); // Supprimer après réussite
        return true;
    }

    return false;
}
