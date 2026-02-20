"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Cookie, Settings, CheckCircle, Smartphone, Server } from "lucide-react";

export default function CookiesPage() {
    const t = useTranslations('Legal.Cookies');

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
                    <div className="bg-amber-600 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Cookie className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-amber-100 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        <section className="space-y-4">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {t('intro')}
                            </p>
                        </section>

                        {/* 1. Types de cookies */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Server className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">{t('Section1.title')}</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-ely-blue">
                                        <CheckCircle className="w-6 h-6" />
                                        <h3 className="font-bold">{t('Section1.Essential.title')}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {t('Section1.Essential.desc')}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-ely-mint">
                                        <Settings className="w-6 h-6" />
                                        <h3 className="font-bold">{t('Section1.Functional.title')}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {t('Section1.Functional.desc')}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-amber-500">
                                        <Smartphone className="w-6 h-6" />
                                        <h3 className="font-bold">{t('Section1.Analytics.title')}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {t('Section1.Analytics.desc')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Gestion */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Settings className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">{t('Section2.title')}</h2>
                            </div>
                            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-slate-700">
                                <p className="mb-4">
                                    {t('Section2.intro')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    <li><strong>{t('Section2.Chrome')}</strong> {t('Section2.ChromePath')}</li>
                                    <li><strong>{t('Section2.Firefox')}</strong> {t('Section2.FirefoxPath')}</li>
                                    <li><strong>{t('Section2.Safari')}</strong> {t('Section2.SafariPath')}</li>
                                    <li><strong>{t('Section2.Edge')}</strong> {t('Section2.EdgePath')}</li>
                                </ul>
                                <p className="mt-4 text-xs text-slate-500">
                                    {t('Section2.note')}
                                </p>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>{t('Footer.copyright')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
