"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, MailWarning } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CreditSuccessPage() {
    const t = useTranslations('CreditSuccess');
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ely-mint/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ely-blue/5 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-white p-8 sm:p-12 text-center"
            >
                {/* Logo */}
                <div className="mb-10 flex justify-center">
                    <Image
                        src="/logo-official.png"
                        alt="AGM INVEST"
                        width={180}
                        height={80}
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-ely-mint/10 text-ely-mint rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                {/* Content */}
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto leading-relaxed">
                    {t('message')}
                </p>
                <div className="relative mb-10 max-w-md mx-auto group">
                    {/* Border Beam Effect */}
                    <div className="absolute -inset-[2px] rounded-[1.3rem] overflow-hidden">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,#ef4444_320deg,#f59e0b_360deg)] opacity-100"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-5 bg-white rounded-2xl flex items-center gap-4 overflow-hidden shadow-sm"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent pointer-events-none" />

                        <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MailWarning className="w-12 h-12 text-amber-600 rotate-12" />
                        </div>

                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-amber-100/50 text-amber-600 shrink-0 relative z-10">
                            <MailWarning className="w-5 h-5" />
                        </div>

                        <div className="text-left relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-amber-600 text-[10px] uppercase font-black tracking-widest bg-amber-100/50 px-2 py-0.5 rounded-md border border-amber-200/50">Attention</span>
                            </div>
                            <p className="text-amber-900 text-[13px] font-bold leading-snug">
                                {t('spamWarning')}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Features / Next steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                        <div className="bg-ely-mint/20 p-2 rounded-lg text-ely-mint">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{t('Step1.title')}</h3>
                            <p className="text-xs text-gray-500">{t('Step1.desc')}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                        <div className="bg-ely-blue/10 p-2 rounded-lg text-ely-blue">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{t('Step2.title')}</h3>
                            <p className="text-xs text-gray-500">{t('Step2.desc')}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full max-w-sm bg-ely-blue text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ely-blue/90 transition-all shadow-xl shadow-ely-blue/20 flex items-center justify-center gap-2 group"
                    >
                        {t('cta')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Support hint */}
            <p className="mt-8 text-sm text-gray-400 font-medium">
                {t('footer')}
            </p>
        </main>
    );
}
