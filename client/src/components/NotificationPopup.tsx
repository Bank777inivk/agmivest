"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { getRandomNotification } from "@/data/notificationData";

export default function NotificationPopup() {
    const [notification, setNotification] = useState<{ name: string; region: string } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showNotification = () => {
            const data = getRandomNotification();
            setNotification(data);
            setIsVisible(true);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Show first notification after 3 seconds
        const initialTimeout = setTimeout(showNotification, 3000);

        // Show subsequent notifications every 15-30 seconds
        const interval = setInterval(() => {
            const randomDelay = Math.random() * 15000 + 15000; // 15-30 seconds
            setTimeout(showNotification, randomDelay);
        }, 30000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: 100 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm"
                >
                    <div className="relative bg-gradient-to-br from-ely-blue to-ely-mint rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg border border-white/20">
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>

                        {/* Content */}
                        <div className="relative p-4 pr-12">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-1">
                                        Nouvelle demande !
                                    </p>
                                    <p className="text-white/90 text-xs leading-relaxed">
                                        <span className="font-semibold">{notification.name}</span> de{" "}
                                        <span className="font-semibold">{notification.region}</span> vient de soumettre une demande
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center group"
                            aria-label="Fermer"
                        >
                            <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Progress bar */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-white/40"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
