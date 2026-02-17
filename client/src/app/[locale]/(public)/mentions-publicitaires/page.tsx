"use client";

import { motion } from "framer-motion";
import { AlertCircle, Info, Building2 } from "lucide-react";

export default function MentionsPublicitairesPage() {
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Mentions Publicitaires</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                Clarifications importantes sur les services proposés par AGM INVEST.
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
                                    <h2 className="text-xl font-bold text-amber-900">Information Importante</h2>
                                    <p className="text-amber-800 font-semibold">
                                        AGM INVEST n'est pas une banque ni un organisme de crédit, mais un intermédiaire financier réglementé.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nature des services */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Building2 className="w-8 h-8 text-ely-blue" />
                                <h2 className="text-2xl font-bold">Nature des Services</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 text-slate-700">
                                <p>
                                    Les services proposés par AGM INVEST relèvent de <strong>l'accompagnement administratif et de la mise en relation</strong>.
                                </p>
                                <p>
                                    Nous intervenons en tant qu'intermédiaire pour faciliter vos démarches et vous mettre en contact avec des partenaires qualifiés.
                                </p>
                            </div>
                        </section>

                        {/* Acceptation des dossiers */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Info className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">Acceptation des Dossiers</h2>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <p className="text-slate-700">
                                    L'acceptation des dossiers dépend de <strong>partenaires externes</strong>. AGM INVEST ne peut garantir l'acceptation systématique de votre demande.
                                </p>
                            </div>
                        </section>

                        {/* Résultats variables */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <AlertCircle className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">Résultats Variables</h2>
                            </div>
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                <p className="text-slate-700">
                                    Les résultats peuvent varier selon la situation du client, les critères des partenaires et les conditions du marché.
                                </p>
                            </div>
                        </section>

                        {/* Conditions complètes */}
                        <section className="bg-gradient-to-br from-ely-blue/5 to-ely-mint/5 rounded-2xl p-8 border border-ely-mint/20">
                            <div className="text-center">
                                <p className="text-slate-700 text-lg mb-4">
                                    Pour consulter l'ensemble de nos conditions et modalités :
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a
                                        href="/cgu"
                                        className="inline-block bg-ely-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-ely-blue/90 transition-colors"
                                    >
                                        Conditions Générales
                                    </a>
                                    <a
                                        href="/mentions-legales"
                                        className="inline-block bg-ely-mint text-white px-6 py-3 rounded-xl font-bold hover:bg-ely-mint/90 transition-colors"
                                    >
                                        Mentions Légales
                                    </a>
                                </div>
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
