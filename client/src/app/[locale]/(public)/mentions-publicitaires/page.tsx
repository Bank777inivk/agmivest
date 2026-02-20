"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { AlertCircle, Info, Building2 } from "lucide-react";

export default function MentionsPublicitairesPage() {
    const t = useTranslations('Legal.Ads');

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
                    <div className="bg-slate-700 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Info className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-8">

                        {/* Avertissement principal */}
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-amber-900">{t('warning.title')}</h2>
                                    <p className="text-amber-800 font-semibold">
                                        {t('warning.content')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nature des services */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Building2 className="w-8 h-8 text-ely-blue" />
                                <h2 className="text-2xl font-bold">{t('nature.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 text-slate-700">
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

                        {/* Acceptation des dossiers */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Info className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">{t('acceptance.title')}</h2>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <p className="text-slate-700">
                                    {t.rich('acceptance.content', {
                                        bold: (chunks) => <strong>{chunks}</strong>
                                    })}
                                </p>
                            </div>
                        </section>

                        {/* Résultats variables */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <AlertCircle className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">{t('results.title')}</h2>
                            </div>
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                <p className="text-slate-700">
                                    {t('results.content')}
                                </p>
                            </div>
                        </section>

                        {/* Conditions complètes */}
                        <section className="bg-gradient-to-br from-ely-blue/5 to-ely-mint/5 rounded-2xl p-8 border border-ely-mint/20">
                            <div className="text-center">
                                <p className="text-slate-700 text-lg mb-4">
                                    {t('links.title')}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link
                                        href="/cgu"
                                        className="inline-block bg-ely-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-ely-blue/90 transition-colors"
                                    >
                                        {t('links.cgu')}
                                    </Link>
                                    <Link
                                        href="/mentions-legales"
                                        className="inline-block bg-ely-mint text-white px-6 py-3 rounded-xl font-bold hover:bg-ely-mint/90 transition-colors"
                                    >
                                        {t('links.mentions')}
                                    </Link>
                                </div>
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
