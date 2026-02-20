"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, Scale, Mail, FileText } from "lucide-react";

export default function MentionsLegalesPage() {
    const t = useTranslations('Legal.Mentions');

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
                    <div className="bg-ely-blue p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Scale className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* 1. Identification */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Building2 className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section1.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p><strong className="text-slate-900">{t('Section1.name')}</strong> {t('Section1.Values.name')}</p>
                                <p><strong className="text-slate-900">{t('Section1.form')}</strong> {t('Section1.Values.form')}</p>
                                <p><strong className="text-slate-900">{t('Section1.headquarters')}</strong> {t('Section1.Values.headquarters')}</p>
                                <p><strong className="text-slate-900">{t('Section1.siren')}</strong> {t('Section1.Values.siren')}</p>
                                <p><strong className="text-slate-900">{t('Section1.siret')}</strong> {t('Section1.Values.siret')}</p>
                                <p><strong className="text-slate-900">{t('Section1.rcs')}</strong> {t('Section1.Values.rcs')}</p>
                                <p><strong className="text-slate-900">{t('Section1.tva')}</strong> {t('Section1.Values.tva')}</p>
                                <p><strong className="text-slate-900">{t('Section1.ape')}</strong> {t('Section1.Values.ape')}</p>
                                <p><strong className="text-slate-900">{t('Section1.manager')}</strong> {t('Section1.Values.manager')}</p>
                                <p><strong className="text-slate-900">{t('Section1.creation')}</strong> {t('Section1.Values.creation')}</p>
                            </div>
                        </section>

                        {/* 2. Activités */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section2.title')}</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="mb-4">
                                    {t('Section2.p1')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>{t('Section2.list.li1')}</li>
                                    <li>{t('Section2.list.li2')}</li>
                                    <li>{t('Section2.list.li3')}</li>
                                    <li>{t('Section2.list.li4')}</li>
                                    <li>{t('Section2.list.li5')}</li>
                                    <li>{t('Section2.list.li6')}</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Réglementation */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <ShieldCheck className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section3.title')}</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p className="mb-4">
                                    {t('Section3.p1')} <strong>{t('Section3.oriasLink')}</strong> {t('Section3.role')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mb-4">
                                    <li>{t('Section3.list.li1')}</li>
                                    <li>{t('Section3.list.li2')}</li>
                                    <li>{t('Section3.list.li3')}</li>
                                </ul>
                                <p className="mt-4 pt-4 border-t border-blue-200/50">
                                    {t('Section3.p2')}
                                </p>
                            </div>
                        </section>

                        {/* 4. Contact & Hébergement */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Mail className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section4.title')}</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2">{t('Section4.Service.title')}</h3>
                                    <p className="text-slate-600">{t('Section4.Service.text')}</p>
                                    <a href="mailto:contact@agm-negoce.com" className="text-ely-blue font-medium hover:underline block mt-2">contact@agm-negoce.com</a>
                                    <p className="text-slate-600 mt-2">{t('Section4.Service.address')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2">{t('Section4.Hosting.title')}</h3>
                                    <p className="text-slate-600">{t('Section4.Hosting.text')}</p>
                                    <p className="font-medium text-slate-900 mt-1">{t('Section4.Hosting.name')}</p>
                                    <p className="text-slate-600 text-sm whitespace-pre-line">{t('Section4.Hosting.address')}</p>
                                </div>
                            </div>
                        </section>

                        {/* Footer Rights */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>{t('Footer.copyright')}</p>
                            <p className="mt-1">{t('Footer.desc')}</p>
                            <p className="mt-2 italic">{t('Footer.disclaimer')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
