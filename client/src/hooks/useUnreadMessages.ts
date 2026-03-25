"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirestore, getFirebaseAuth } from "@/lib/firebase";

export function useUnreadMessages() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const auth = getFirebaseAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const chatRef = doc(db, "chats", user.uid);

        const unsub = onSnapshot(chatRef, (snap) => {
            if (snap.exists()) {
                setUnreadCount(snap.data()?.unreadClient || 0);
            } else {
                setUnreadCount(0);
            }
        }, () => setUnreadCount(0));

        return () => unsub();
    }, []);

    return unreadCount;
}
