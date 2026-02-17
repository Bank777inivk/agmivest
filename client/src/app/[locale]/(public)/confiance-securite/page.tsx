"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, Users, FileCheck, Headphones } from "lucide-react";

export default function ConfianceSecuritePage() {
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Confiance & Sécurité</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                Chez AGM INVEST, la sécurité des dossiers clients est une priorité absolue.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-8">

                        {/* Introduction */}
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Nous mettons en œuvre des processus rigoureux et transparents pour garantir la sécurité et la confidentialité de vos informations.
                            </p>
                        </div>

                        {/* Nos Engagements */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-ely-blue mb-8">Nos Engagements Sécurité</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Vérification administrative */}
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-ely-blue/10 p-3 rounded-xl">
                                            <CheckCircle2 className="w-6 h-6 text-ely-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">Vérification Administrative</h3>
                                            <p className="text-sm text-slate-600">
                                                Chaque dossier est vérifié minutieusement par notre équipe administrative.
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
                                            <h3 className="font-bold text-slate-900 mb-2">Validation Multi-Étapes</h3>
                                            <p className="text-sm text-slate-600">
                                                Processus de vérification en plusieurs étapes pour garantir la conformité.
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
                                            <h3 className="font-bold text-slate-900 mb-2">Encadrement Contractuel Clair</h3>
                                            <p className="text-sm text-slate-600">
                                                Tous nos services sont encadrés par des contrats transparents et détaillés.
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
                                            <h3 className="font-bold text-slate-900 mb-2">Traçabilité des Paiements</h3>
                                            <p className="text-sm text-slate-600">
                                                Tous les paiements sont tracés et sécurisés via des systèmes certifiés.
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
                                            <h3 className="font-bold text-slate-900 mb-2">Protection des Données</h3>
                                            <p className="text-sm text-slate-600">
                                                Conformité RGPD et chiffrement de toutes vos données personnelles.
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
                                            <h3 className="font-bold text-slate-900 mb-2">Support Client Dédié</h3>
                                            <p className="text-sm text-slate-600">
                                                Une équipe à votre écoute pour répondre à toutes vos questions.
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
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Traitement Individuel</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Chaque dossier est traité de manière individuelle par notre équipe. Nous prenons le temps d'analyser votre situation spécifique pour vous proposer un accompagnement personnalisé.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Engagement transparence */}
                        <section className="bg-white rounded-2xl p-8 border-2 border-ely-mint shadow-lg">
                            <div className="text-center">
                                <Shield className="w-16 h-16 text-ely-mint mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Notre Engagement</h3>
                                <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                                    AGM INVEST s'engage à la <strong className="text-ely-blue">transparence</strong> dans ses processus et ses communications. Votre confiance est notre priorité.
                                </p>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>Dernière mise à jour : Février 2026</p>
                            <p className="mt-2">© 2026 AGM INVEST - Tous droits réservés</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
