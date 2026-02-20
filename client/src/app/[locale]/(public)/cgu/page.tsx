"use client";

import { motion } from "framer-motion";
import { FileText, Shield, AlertCircle, CheckCircle2, Users, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function CGUPage() {
    const t = useTranslations('Legal.CGU');

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
                            <FileText className="w-40 h-40" />
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

                        {/* 1. Objet */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section1.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section1.content')}
                            </p>
                        </section>

                        {/* 2. Accès au service */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section2.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>{t('Section2.p1')}</p>
                                <p>{t('Section2.p2')}</p>
                            </div>
                        </section>

                        {/* 3. Nature des services */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Users className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section3.title')}</h2>
                            </div>
                            <div className="space-y-4 text-slate-600">
                                <p>{t('Section3.intro')}</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>{t('Section3.list.li1')}</li>
                                    <li>{t('Section3.list.li2')}</li>
                                    <li>{t('Section3.list.li3')}</li>
                                </ul>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                                    <p className="font-semibold text-amber-900">
                                        {t('Section3.warning')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Processus de vérification */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <CheckCircle2 className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section4.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section4.content')}
                            </p>
                        </section>

                        {/* 5. Paiements */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Shield className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section5.title')}</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>{t('Section5.p1')}</p>
                                <p className="font-medium">{t('Section5.p2')}</p>
                            </div>
                        </section>

                        {/* 6. Responsabilité */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <AlertCircle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section6.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section6.content')}
                            </p>
                        </section>

                        {/* 7. Données personnelles */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section7.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section7.content')}{" "}
                                <Link href="/politique-confidentialite" className="text-ely-mint font-semibold hover:underline">
                                    {t('Section7.link')}
                                </Link>.
                            </p>
                        </section>

                        {/* 8. Résiliation */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <AlertCircle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section8.title')}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('Section8.content')}
                            </p>
                        </section>

                        {/* 9. Droit applicable */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">{t('Section9.title')}</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p>{t('Section9.p1')}</p>
                                <p className="mt-2">{t('Section9.p2')}</p>
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
