"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Euro, RefreshCw, AlertTriangle, Clock, FileText } from "lucide-react";

export default function ConditionsRemboursementPage() {
    const t = useTranslations('Legal.Refund');

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
                    <div className="bg-green-600 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Euro className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-green-100 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* 1. Dépôt sécuritaire */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <Euro className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section1.title')}</h2>
                            </div>
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 space-y-3">
                                <p className="text-slate-700 leading-relaxed">
                                    {t('Section1.p1')}
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    {t('Section1.p2')}
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    {t('Section1.p3')}
                                </p>
                            </div>
                        </section>

                        {/* 2. Restitution */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <RefreshCw className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section2.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section2.content')}
                            </p>
                        </section>

                        {/* 3. Cas de non-restitution */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-red-600">
                                <AlertTriangle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section3.title')}</h2>
                            </div>
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
                                <p className="text-slate-700">
                                    {t('Section3.intro')}
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                    <li>{t('Section3.list.li1')}</li>
                                    <li>{t('Section3.list.li2')}</li>
                                    <li>{t('Section3.list.li3')}</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Délais */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <Clock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section4.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section4.content')}
                            </p>
                        </section>

                        {/* 5. Litiges */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section5.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <p className="text-slate-700">
                                    {t('Section5.content')}
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
