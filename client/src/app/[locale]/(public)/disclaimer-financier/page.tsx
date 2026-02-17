"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Building2, ShieldAlert, Info } from "lucide-react";

export default function DisclaimerFinancierPage() {
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Disclaimer Financier</h1>
                            <p className="text-red-100 text-lg max-w-2xl">
                                Informations importantes sur la nature des services AGM INVEST.
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
                                    <h2 className="text-xl font-bold text-red-900">Avertissement Important</h2>
                                    <p className="text-red-800 font-semibold text-lg">
                                        AGM INVEST n'est ni un établissement bancaire, ni un organisme de crédit, mais un intermédiaire financier réglementé.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nature de l'activité */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Building2 className="w-8 h-8 text-ely-blue" />
                                <h2 className="text-2xl font-bold">Nature de l'Activité</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>
                                    AGM INVEST intervient exclusivement en tant qu'<strong>intermédiaire administratif et de mise en relation</strong>.
                                </p>
                                <p>
                                    Nos services consistent en un accompagnement dans vos démarches administratives et la mise en relation avec des partenaires qualifiés.
                                </p>
                            </div>
                        </section>

                        {/* Limitations */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <ShieldAlert className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">Limitations de Garantie</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>AGM INVEST ne garantit pas l'acceptation d'un dossier par des tiers</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>AGM INVEST ne garantit pas l'obtention effective d'un financement</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-amber-600 font-bold mt-1">•</span>
                                            <span>Les délais, montants et décisions finales dépendent des partenaires externes et des organismes concernés</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Informations indicatives */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Info className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">Informations Indicatives</h2>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <p className="text-slate-700">
                                    Toute information communiquée par AGM INVEST est fournie <strong>à titre indicatif</strong> et ne constitue en aucun cas un engagement contractuel de résultat.
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
