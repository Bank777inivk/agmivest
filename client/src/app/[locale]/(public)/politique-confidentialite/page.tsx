"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Lock, FileText, UserCheck, Eye, ShieldAlert, Database } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
    const t = useTranslations('Legal.Privacy');

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
                    <div className="bg-slate-900 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Lock className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        <section className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">
                                {t.rich('intro', {
                                    bold: (chunks) => <strong>{chunks}</strong>
                                })}
                            </p>
                        </section>

                        {/* 1. Données Collectées */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Database className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">{t('Section1.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-700 space-y-4">
                                <p>{t('Section1.description')}</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>{t.rich('Section1.list.li1', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('Section1.list.li2', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('Section1.list.li3', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('Section1.list.li4', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('Section1.list.li5', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('Section1.list.li6', { bold: (chunks) => <strong>{chunks}</strong> })}</li>
                                </ul>
                            </div>
                        </section>

                        {/* 2. Finalités du Traitement */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <FileText className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">{t('Section2.title')}</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p>{t('Section2.description')}</p>
                                <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">{t('Section2.Cards.c1.title')}</strong>
                                        {t('Section2.Cards.c1.desc')}
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">{t('Section2.Cards.c2.title')}</strong>
                                        {t('Section2.Cards.c2.desc')}
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">{t('Section2.Cards.c3.title')}</strong>
                                        {t('Section2.Cards.c3.desc')}
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">{t('Section2.Cards.c4.title')}</strong>
                                        {t('Section2.Cards.c4.desc')}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Partage des Données */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <UserCheck className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">{t('Section3.title')}</h2>
                            </div>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    {t('Section3.p1')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>{t('Section3.list.li1')}</li>
                                    <li>{t('Section3.list.li2')}</li>
                                    <li>{t('Section3.list.li3')}</li>
                                </ul>
                                <p className="font-medium text-slate-800">
                                    {t('Section3.p2')}
                                </p>
                            </div>
                        </section>

                        {/* 4. Vos Droits */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <ShieldAlert className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">{t('Section4.title')}</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p className="mb-4">
                                    {t('Section4.p1')}
                                </p>
                                <ul className="grid md:grid-cols-2 gap-2 mb-4">
                                    <li>{t('Section4.list.li1')}</li>
                                    <li>{t('Section4.list.li2')}</li>
                                    <li>{t('Section4.list.li3')}</li>
                                    <li>{t('Section4.list.li4')}</li>
                                    <li>{t('Section4.list.li5')}</li>
                                    <li>{t('Section4.list.li6')}</li>
                                </ul>
                                <p className="pt-4 border-t border-blue-200">
                                    {t('Section4.contact')}<br />
                                    <a href="mailto:contact@agm-negoce.com" className="text-ely-blue font-bold hover:underline">contact@agm-negoce.com</a> {t('Section4.postal')}
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>{t('Footer.updated')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
