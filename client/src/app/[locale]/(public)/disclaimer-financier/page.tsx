"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, Building2, ShieldAlert, Info } from "lucide-react";

export default function DisclaimerFinancierPage() {
    const t = useTranslations('Legal.Disclaimer');

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[2rem] shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-red-600 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <AlertTriangle className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-red-100 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-8">

                        {/* Avertissement principal */}
                        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                                <div className="space-y-3">
                                    <h2 className="text-xl font-bold text-red-900">{t('warning.title')}</h2>
                                    <p className="text-red-800 font-semibold text-lg">
                                        {t('warning.content')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nature de l'activité */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Building2 className="w-8 h-8 text-ely-blue" />
                                <h2 className="text-2xl font-bold">{t('nature.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>
                                    {t.rich('nature.p1', {
                                        bold: (chunks) => <strong>{chunks}</strong>
                                    })}
                                </p>
                                <p>
                                    {t('nature.p2')}
                                </p>
                            </div>
                        </section>

                        {/* Limitations */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <ShieldAlert className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">{t('limitations.title')}</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>{t('limitations.list.li1')}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>{t('limitations.list.li2')}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>{t('limitations.list.li3')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Informations indicatives */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Info className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">{t('indicative.title')}</h2>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <p className="text-slate-700">
                                    {t.rich('indicative.content', {
                                        bold: (chunks) => <strong>{chunks}</strong>
                                    })}
                                </p>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>{t('Footer.updated')}</p>
                            <p className="mt-2">{t('Footer.copyright')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
