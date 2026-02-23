"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, QrCode, MonitorOff, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileRedirectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileRedirectModal({ isOpen, onClose }: MobileRedirectModalProps) {
    const t = useTranslations('Dashboard.KYC.MobileRedirect');
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 cursor-default">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header Image/Icon Section */}
                        <div className="h-48 bg-gradient-to-br from-[#003d82] to-[#1e40af] relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[20px] border-white rounded-full" />
                            </div>

                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="relative z-10 flex items-end gap-2"
                            >
                                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                    <Smartphone className="w-12 h-12 text-ely-mint" />
                                </div>
                                <div className="p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 -rotate-6">
                                    <MonitorOff className="w-6 h-6 text-white/40" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-10 pt-8 text-center space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t('title')}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {t('subtitle')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-ely-blue shrink-0">
                                        <QrCode className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('method1_label')}</p>
                                        <p className="text-sm font-bold text-slate-700">{t('method1_desc')}</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                        <ExternalLink className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">{t('method2_label')}</p>
                                        <p className="text-sm font-bold text-blue-900">{t('method2_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95"
                            >
                                {t('button')}
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
