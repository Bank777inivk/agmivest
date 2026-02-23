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
import { db, auth } from "@/lib/firebase";

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

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const notificationsRef = collection(db, "users", user.uid, "notifications");
        const q = query(notificationsRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));

            setNotifications(items);
            setUnreadCount(items.filter(n => !n.read).length);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (notificationId: string) => {
        if (!user) return;
        const navRef = doc(db, "users", user.uid, "notifications", notificationId);
        await updateDoc(navRef, { read: true });
    };

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;
        const batch = writeBatch(db);
        notifications.forEach(n => {
            if (!n.read) {
                const ref = doc(db, "users", user.uid, "notifications", n.id);
                batch.update(ref, { read: true });
            }
        });
        await batch.commit();
    };

    return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}

export const createNotification = async (userId: string, data: Partial<Notification>) => {
    try {
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
