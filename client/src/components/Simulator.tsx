"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SimulatorProps {
    isMinimal?: boolean;
    embedded?: boolean;
    onValuesChange?: (amount: number, duration: number, rate: number) => void;
    syncAmount?: number;
    syncDuration?: number;
    syncRate?: number;
}

export default function Simulator({ isMinimal = false, embedded = false, onValuesChange, syncAmount, syncDuration, syncRate }: SimulatorProps) {
    const t = useTranslations('Simulator');
    const [amount, setAmount] = useState(200000);
    const [duration, setDuration] = useState(20);
    const [rate, setRate] = useState(2.6);
    const [monthly, setMonthly] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Sync from external props (Form -> Simulator)
    useEffect(() => {
        if (syncAmount !== undefined && !isNaN(syncAmount) && syncAmount !== amount) {
            setAmount(syncAmount);
        }
    }, [syncAmount, amount]);

    useEffect(() => {
        if (syncDuration !== undefined && !isNaN(syncDuration)) {
            const currentDurationInMonths = duration * 12;
            if (Math.abs(syncDuration - currentDurationInMonths) > 0.1) {
                const newDurationInYears = Math.round(syncDuration / 12);
                if (newDurationInYears !== duration) {
                    setDuration(newDurationInYears);
                }
            }
        }
    }, [syncDuration, duration]);

    useEffect(() => {
        if (syncRate !== undefined && !isNaN(syncRate) && Math.abs(syncRate - rate) > 0.001) {
            setRate(syncRate);
        }
    }, [syncRate, rate]);

    useEffect(() => {
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = duration * 12;
        const m = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

        // Add 3% fixed insurance cost spread over the duration
        const totalInsurance = amount * 0.03;
        const monthlyInsurance = totalInsurance / numberOfPayments;

        setMonthly((m + monthlyInsurance) || 0);
    }, [amount, duration, rate]);

    // Internal Handlers for UI Interaction (Manual Sliders)
    // These handlers update state AND notify the parent. 
    // This breaks the loop because updates from props (sync) only update state.
    const handleAmountChange = (val: number) => {
        setAmount(val);
        if (embedded && onValuesChange) {
            onValuesChange(val, duration * 12, rate);
        }
    };

    const handleDurationChange = (val: number) => {
        setDuration(val);
        if (embedded && onValuesChange) {
            onValuesChange(amount, val * 12, rate);
        }
    };

    const handleRateChange = (val: number) => {
        setRate(val);
        if (embedded && onValuesChange) {
            onValuesChange(amount, duration * 12, val);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const num = parseFloat(value);

        if (name === "amount") {
            if (num < 2000) handleAmountChange(2000);
            if (num > 1000000) handleAmountChange(1000000);
        } else if (name === "duration") {
            if (num < 0.5) handleDurationChange(0.5);
            if (num > 30) handleDurationChange(30);
        } else if (name === "rate") {
            if (num < 0.5) handleRateChange(0.5);
            if (num > 15) handleRateChange(15);
        }
    };

    return (
        <div className={`${embedded ? 'bg-gradient-to-br from-white via-gray-50 to-ely-mint/5 p-6 rounded-2xl shadow-xl border-2 border-ely-mint/20 hover:shadow-2xl transition-shadow duration-300' : 'bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 max-w-6xl mx-auto'}`}>
            <div className={`grid grid-cols-1 ${embedded ? 'gap-6' : isMinimal ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} ${embedded ? '' : 'gap-6 lg:gap-12'} items-center`}>

                {/* Sliders Area */}
                <div className={`space-y-${embedded ? '6' : '8 md:space-y-10'}`}>
                    {/* Amount */}
                    <div className={`space-y-${embedded ? '3' : '3 md:space-y-4'}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className={`${embedded ? 'text-sm font-bold text-gray-700 tracking-tight' : 'text-base md:text-lg font-semibold text-ely-blue'}`}>{t('amountLabel')}</label>
                            <div className={cn(
                                "flex items-center gap-1",
                                embedded ? "text-lg font-black text-ely-blue bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg" : "text-xl md:text-2xl font-bold text-ely-blue bg-gray-50 px-4 py-1 rounded-lg"
                            )}>
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                                    onBlur={handleBlur}
                                    className="bg-transparent border-none outline-none text-right w-24 md:w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0"
                                />
                                <span className="ml-1">€</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="2000"
                            max="1000000"
                            step="1000"
                            value={amount}
                            onChange={(e) => handleAmountChange(Number(e.target.value))}
                            className={`w-full ${embedded ? 'h-1.5' : 'h-2'} bg-gray-100 rounded-lg appearance-none cursor-pointer accent-ely-mint hover:accent-ely-mint/80 transition-all focus:outline-none focus:ring-2 focus:ring-ely-mint/20`}
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                            <span>2 000 €</span>
                            <span>1 000 000 €</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className={`space-y-${embedded ? '3' : '3 md:space-y-4'}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className={`${embedded ? 'text-sm font-bold text-gray-700 tracking-tight' : 'text-base md:text-lg font-semibold text-ely-blue'}`}>{t('durationLabel')}</label>
                            <div className={cn(
                                "flex items-center gap-1",
                                embedded ? "text-lg font-black text-ely-blue bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg" : "text-xl md:text-2xl font-bold text-ely-blue bg-gray-50 px-4 py-1 rounded-lg"
                            )}>
                                <input
                                    type="number"
                                    name="duration"
                                    value={duration}
                                    step="0.5"
                                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                                    onBlur={handleBlur}
                                    className="bg-transparent border-none outline-none text-right w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0"
                                />
                                <span className="ml-1 text-sm md:text-base font-bold">{t('durationSuffix')}</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="30"
                            step="0.5"
                            value={duration}
                            onChange={(e) => handleDurationChange(Number(e.target.value))}
                            className={`w-full ${embedded ? 'h-1.5' : 'h-2'} bg-gray-100 rounded-lg appearance-none cursor-pointer accent-ely-mint hover:accent-ely-mint/80 transition-all focus:outline-none focus:ring-2 focus:ring-ely-mint/20`}
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                            <span>6 {t('months')}</span>
                            <span>30 {t('durationSuffix')}</span>
                        </div>
                    </div>

                    {/* Rate - Locked at 2.6% */}
                    <div className={`space-y-${embedded ? '3' : '3 md:space-y-4'}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className={`${embedded ? 'text-sm font-bold text-gray-700 tracking-tight' : 'text-base md:text-lg font-semibold text-ely-blue'}`}>{t('rateLabel')}</label>
                            <div className={cn(
                                "flex items-center gap-1",
                                embedded ? "text-lg font-black text-ely-blue bg-gray-100 shadow-sm border border-gray-200 px-3 py-1.5 rounded-lg" : "text-xl md:text-2xl font-bold text-ely-blue bg-gray-100 px-4 py-1 rounded-lg"
                            )}>
                                <input
                                    type="number"
                                    name="rate"
                                    value={2.6}
                                    readOnly
                                    disabled
                                    className="bg-transparent border-none outline-none text-right w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 cursor-not-allowed opacity-70"
                                />
                                <span className="ml-1">%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium px-1 text-center italic">
                            {t('guaranteedRate')}
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className={`${embedded ? 'bg-gradient-to-br from-ely-blue to-slate-900 shadow-inner border border-white/10' : 'bg-ely-blue'} rounded-xl ${embedded ? 'md:rounded-xl p-5 mt-2' : 'md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12'} text-white text-center ${embedded ? 'space-y-2' : 'space-y-4 md:space-y-6'} relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 ${embedded ? 'w-24 h-24' : 'w-32 h-32'} bg-white/5 rounded-full -mr-10 -mt-10 blur-xl`}></div>
                    <div className={`absolute bottom-0 left-0 ${embedded ? 'w-20 h-20' : 'w-24 h-24'} bg-ely-mint/10 rounded-full -ml-10 -mb-10 blur-xl`}></div>

                    <h3 className={`${embedded ? 'text-sm uppercase tracking-widest text-ely-mint/80 font-bold' : 'text-lg md:text-xl font-medium opacity-80'}`}>{t('monthlyEstimate')}</h3>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`${embedded ? 'text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-black text-white dropshawdow-xl tracking-tighter`}
                    >
                        <span suppressHydrationWarning className="bg-clip-text text-transparent bg-gradient-to-r from-white via-ely-mint to-white">{hasMounted ? Math.round(monthly).toLocaleString() : Math.round(monthly)}</span>
                        <span className={`${embedded ? 'text-xl' : 'text-4xl'} text-ely-mint ml-1`}>€</span>
                        <span className={`${embedded ? 'text-xs font-medium text-gray-400 block mt-1 uppercase tracking-wide' : 'text-lg md:text-xl font-normal text-white ml-2'}`}>{t('perMonth')}</span>
                    </motion.div>

                    <div className="bg-white/10 rounded-lg p-3 my-3 text-left">
                        <div className="flex justify-between items-center text-xs md:text-sm mb-1">
                            <span className="text-gray-300">{t('excludedInsurance')}</span>
                            <span className="font-bold">{Math.round((monthly - (amount * 0.03 / (duration * 12)))).toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm mb-1">
                            <span className="text-ely-mint">{t('borrowerInsurance')}</span>
                            <span className="font-bold text-ely-mint">+{Math.round((amount * 0.03) / (duration * 12)).toLocaleString()} €{t('perMonth')}</span>
                        </div>
                        <div className="border-t border-white/10 my-2"></div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                            <span>{t('totalInsuranceCost')}</span>
                            <span>{Math.round(amount * 0.03).toLocaleString()} €</span>
                        </div>
                    </div>

                    <p className={`${embedded ? 'text-[10px] text-gray-400 font-medium' : 'text-xs md:text-sm opacity-60'} max-w-xs mx-auto leading-relaxed`}>
                        {t('disclaimer')}
                    </p>

                    {!embedded && (
                        <button
                            onClick={() => router.push(`/credit-request?amount=${amount}&duration=${duration * 12}&rate=${rate}`)}
                            className={`w-full bg-ely-mint text-white ${embedded ? 'py-2 text-sm' : 'py-3 md:py-4'} rounded-xl font-bold ${embedded ? 'text-base' : 'text-base md:text-lg'} hover:bg-ely-mint/90 transition-all shadow-lg hover:shadow-ely-mint/20 mt-4 active:scale-95`}
                        >
                            {t('startRequest')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
