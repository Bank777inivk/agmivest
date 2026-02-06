"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PremiumSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-ely-blue/20 rounded-full blur-2xl"
                />
                <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-gray-100">
                    <div className="w-12 h-12 relative">
                        <Image
                            src="/logo-official.png"
                            alt="Loading"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-transparent border-t-ely-mint rounded-full"
                />
            </div>
            <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-gray-900 tracking-widest uppercase">Chargement</p>
                <div className="flex gap-1 mt-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-ely-mint rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
