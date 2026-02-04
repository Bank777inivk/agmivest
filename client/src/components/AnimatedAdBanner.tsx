"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AnimatedAdBanner() {
    const t = useTranslations('AdBanner');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);

    const messages = [
        { text: t('msg1'), emoji: "👋" },
        { text: t('msg2'), emoji: "⚡" },
        { text: t('msg3'), emoji: "⭐" },
        { text: t('msg4'), emoji: "💰" },
        { text: t('msg5'), emoji: "🤝" }
    ];

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-6 md:p-8">
            {/* Character Container */}
            <div className="relative flex flex-col items-center justify-center gap-6">

                {/* Animated Character */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [-2, 2, -2, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    className="relative"
                >
                    {/* Character Avatar Circle */}
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-ely-mint to-teal-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                        <span className="text-6xl md:text-7xl" translate="no" suppressHydrationWarning>
                            {hasMounted ? messages[currentIndex].emoji : messages[0].emoji}
                        </span>
                    </div>

                    {/* Message Indicator */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center"
                    >
                        <MessageCircle className="w-4 h-4 text-white" />
                    </motion.div>
                </motion.div>

                {/* Speech Bubble with Text */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full min-h-[140px] flex items-center justify-center">
                    {/* Speech Bubble Arrow */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <p
                            className="text-ely-blue font-bold text-lg md:text-xl text-center leading-relaxed"
                            translate="no"
                        >
                            <span
                                key={currentIndex}
                                suppressHydrationWarning
                            >
                                {hasMounted ? messages[currentIndex].text : messages[0].text}
                            </span>
                        </p>

                        {/* Typing Animation Dots */}
                        <div className="flex gap-1 justify-center mt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                    className="w-2 h-2 bg-ely-mint rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 mt-4">
                    {messages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-ely-mint w-6" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
