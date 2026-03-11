import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    writeBatch,
    Timestamp,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, getFirebaseAuth } from "@/lib/firebase";

export interface Notification {
    id: string;
    title: string;
    message: string;
    params?: Record<string, any>;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: Timestamp;
    link?: string;
    icon?: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const _auth = getFirebaseAuth();
        const _db = getFirestore();

        const unsubscribeAuth = onAuthStateChanged(_auth, (user) => {
            if (!user) {
                setNotifications([]);
                setUnreadCount(0);
                setLoading(false);
                return;
            }

            const notificationsRef = collection(_db, "users", user.uid, "notifications");
            const q = query(notificationsRef, orderBy("timestamp", "desc"));

            const unsubscribeSnap = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Notification));

                setNotifications(items);
                setUnreadCount(items.filter(n => !n.read).length);
                setLoading(false);
            }, (error) => {
                console.error("[useNotifications] Snapshot Error:", error);
                setLoading(false);
            });

            return () => unsubscribeSnap();
        });

        return () => unsubscribeAuth();
    }, []);

    const markAsRead = async (notificationId: string) => {
        const _auth = getFirebaseAuth();
        const user = _auth.currentUser;
        if (!user) return;
        const _db = getFirestore();
        const navRef = doc(_db, "users", user.uid, "notifications", notificationId);
        await updateDoc(navRef, { read: true });
    };

    const markAllAsRead = async () => {
        const _auth = getFirebaseAuth();
        const user = _auth.currentUser;
        if (!user || notifications.length === 0) return;
        const _db = getFirestore();
        const batch = writeBatch(_db);
        notifications.forEach(n => {
            if (!n.read) {
                const ref = doc(_db, "users", user.uid, "notifications", n.id);
                batch.update(ref, { read: true });
            }
        });
        await batch.commit();
    };

    return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}

export const createNotification = async (userId: string, data: Partial<Notification>) => {
    try {
        const db = getFirestore();
        const notificationsRef = collection(db, "users", userId, "notifications");
        await addDoc(notificationsRef, {
            title: data.title || "Notification",
            message: data.message || "",
            params: data.params || {},
            type: data.type || "info",
            read: false,
            timestamp: serverTimestamp(),
            link: data.link || null,
            icon: data.icon || null
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
