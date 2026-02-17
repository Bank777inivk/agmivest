"use client";

import { motion } from "framer-motion";
import { Euro, RefreshCw, AlertTriangle, Clock, FileText } from "lucide-react";

export default function ConditionsRemboursementPage() {
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Conditions de Remboursement</h1>
                            <p className="text-green-100 text-lg max-w-2xl">
                                Modalités de restitution du dépôt sécuritaire fixe AGM INVEST.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* 1. Dépôt sécuritaire */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <Euro className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">1. Dépôt Sécuritaire Fixe</h2>
                            </div>
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 space-y-3">
                                <p className="text-slate-700 leading-relaxed">
                                    Ce dépôt n'est pas des frais.
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    Il doit provenir du même compte bancaire (RIB) que celui fourni lors de votre demande.
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    Il est intégralement restitué en même temps que le virement du crédit.
                                </p>
                            </div>
                        </section>

                        {/* 2. Restitution */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <RefreshCw className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">2. Restitution</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                La restitution du dépôt sécuritaire intervient conformément aux conditions prévues dans le contrat signé entre AGM INVEST et le client.
                            </p>
                        </section>

                        {/* 3. Cas de non-restitution */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-red-600">
                                <AlertTriangle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">3. Cas de Non-Restitution</h2>
                            </div>
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
                                <p className="text-slate-700">
                                    Le dépôt sécuritaire peut ne pas être restitué en cas de :
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                                    <li>Abandon volontaire du dossier par le client</li>
                                    <li>Fausse déclaration</li>
                                    <li>Non-respect des engagements contractuels</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Délais */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <Clock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">4. Délais</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Les délais de restitution sont indiqués dans le contrat et peuvent varier selon la nature du dossier et les partenaires impliqués.
                            </p>
                        </section>

                        {/* 5. Litiges */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-green-600">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">5. Litiges</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <p className="text-slate-700">
                                    En cas de litige, le droit français s'applique.
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
