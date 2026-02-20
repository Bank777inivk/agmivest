"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, Users, FileCheck, Headphones } from "lucide-react";

export default function ConfianceSecuritePage() {
    const t = useTranslations('Legal.Trust');

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
                    <div className="bg-gradient-to-r from-ely-blue to-ely-mint p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-8">

                        {/* Introduction */}
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('intro')}
                            </p>
                        </div>

                        {/* Nos Engagements */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-ely-blue mb-8">{t('engagements.title')}</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Vérification administrative */}
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-ely-blue/10 p-3 rounded-xl">
                                            <CheckCircle2 className="w-6 h-6 text-ely-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.admin.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.admin.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Procédure en plusieurs étapes */}
                                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-ely-mint/10 p-3 rounded-xl">
                                            <FileCheck className="w-6 h-6 text-ely-mint" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.multi.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.multi.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Encadrement contractuel */}
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-600/10 p-3 rounded-xl">
                                            <FileCheck className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.contract.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.contract.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Traçabilité */}
                                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-amber-600/10 p-3 rounded-xl">
                                            <CheckCircle2 className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.trace.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.trace.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Protection données */}
                                <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-slate-600/10 p-3 rounded-xl">
                                            <Lock className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.data.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.data.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Support dédié */}
                                <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-pink-600/10 p-3 rounded-xl">
                                            <Headphones className="w-6 h-6 text-pink-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{t('engagements.support.title')}</h3>
                                            <p className="text-sm text-slate-600">
                                                {t('engagements.support.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Traitement individuel */}
                        <section className="bg-gradient-to-br from-ely-blue/5 to-ely-mint/5 rounded-2xl p-8 border border-ely-mint/20">
                            <div className="flex items-start gap-4">
                                <Users className="w-10 h-10 text-ely-blue flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{t('individual.title')}</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        {t('individual.content')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Engagement transparence */}
                        <section className="bg-white rounded-2xl p-8 border-2 border-ely-mint shadow-lg">
                            <div className="text-center">
                                <Shield className="w-16 h-16 text-ely-mint mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('promise.title')}</h3>
                                <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                                    {t.rich('promise.content', {
                                        bold: (chunks) => <strong className="text-ely-blue">{chunks}</strong>
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
