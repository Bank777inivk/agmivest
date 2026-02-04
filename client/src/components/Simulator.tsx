"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface SimulatorProps {
    isMinimal?: boolean;
}

export default function Simulator({ isMinimal = false }: SimulatorProps) {
    const t = useTranslations('Simulator');
    const [amount, setAmount] = useState(200000);
    const [duration, setDuration] = useState(20);
    const [rate, setRate] = useState(2.95);
    const [monthly, setMonthly] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = duration * 12;
        const m = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        setMonthly(m || 0);
    }, [amount, duration, rate]);

    return (
        <div className={`bg-white ${isMinimal ? 'p-4 sm:p-6 lg:p-8' : 'p-6 sm:p-8 md:p-10 lg:p-12'} rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 max-w-6xl mx-auto`}>
            <div className={`grid grid-cols-1 ${isMinimal ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-6 lg:gap-12 items-center`}>

                {/* Sliders Area */}
                <div className="space-y-8 md:space-y-10">
                    {/* Amount */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-base md:text-lg font-semibold text-ely-blue">{t('amountLabel')}</label>
                            <span className="text-xl md:text-2xl font-bold text-ely-blue bg-gray-50 px-4 py-1 rounded-lg w-fit">
                                <span suppressHydrationWarning>{hasMounted ? amount.toLocaleString() : amount}</span> €
                            </span>
                        </div>
                        <input
                            type="range"
                            min="10000"
                            max="1000000"
                            step="5000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ely-mint"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>10 000 €</span>
                            <span>1 000 000 €</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-base md:text-lg font-semibold text-ely-blue">{t('durationLabel')}</label>
                            <span className="text-xl md:text-2xl font-bold text-ely-blue bg-gray-50 px-4 py-1 rounded-lg w-fit">
                                {duration} {t('durationSuffix')}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            step="1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ely-mint"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>5 {t('durationSuffix')}</span>
                            <span>30 {t('durationSuffix')}</span>
                        </div>
                    </div>

                    {/* Rate */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-base md:text-lg font-semibold text-ely-blue">{t('rateLabel')}</label>
                            <span className="text-xl md:text-2xl font-bold text-ely-blue bg-gray-50 px-4 py-1 rounded-lg w-fit">
                                {rate} %
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.05"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ely-mint"
                        />
                    </div>
                </div>

                {/* Results Area */}
                <div className="bg-ely-blue rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center space-y-4 md:space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>

                    <h3 className="text-lg md:text-xl font-medium opacity-80">{t('monthlyEstimate')}</h3>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-ely-mint"
                    >
                        <span suppressHydrationWarning>{hasMounted ? Math.round(monthly).toLocaleString() : Math.round(monthly)}</span> €
                        <span className="text-lg md:text-xl font-normal text-white ml-2">{t('perMonth')}</span>
                    </motion.div>

                    <p className="text-xs md:text-sm opacity-60 max-w-xs mx-auto">
                        {t('disclaimer')}
                    </p>

                    <button
                        onClick={() => router.push(`/credit-request?amount=${amount}&duration=${duration * 12}&rate=${rate}`)}
                        className="w-full bg-ely-mint text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-ely-mint/90 transition-colors shadow-lg mt-4"
                    >
                        {t('startRequest')}
                    </button>
                </div>
            </div>
        </div>
    );
}
