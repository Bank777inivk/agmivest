"use client";

import { motion } from "framer-motion";
import { FileText, Shield, AlertCircle, CheckCircle2, Users, Lock } from "lucide-react";

export default function CGUPage() {
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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                Conditions d'utilisation des services proposés par AGM INVEST via sa plateforme en ligne.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* 1. Objet */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">1. Objet</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Les présentes Conditions Générales d'Utilisation (CGU) définissent les conditions d'accès et d'utilisation des services proposés par AGM INVEST via sa plateforme en ligne.
                            </p>
                        </section>

                        {/* 2. Accès au service */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">2. Accès au Service</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>L'accès à la plateforme est réservé aux utilisateurs disposant d'un compte validé.</p>
                                <p>AGM INVEST se réserve le droit de refuser ou suspendre un compte en cas de non-respect des présentes conditions.</p>
                            </div>
                        </section>

                        {/* 3. Nature des services */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Users className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">3. Nature des Services</h2>
                            </div>
                            <div className="space-y-4 text-slate-600">
                                <p>AGM INVEST propose :</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Un accompagnement administratif</li>
                                    <li>Une assistance liée à l'acquisition de véhicules</li>
                                    <li>Un service de gestion de dossiers clients</li>
                                </ul>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                                    <p className="font-semibold text-amber-900">
                                        ⚠️ AGM INVEST n'est pas un organisme bancaire, ni un établissement de crédit, mais un intermédiaire financier réglementé.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Processus de vérification */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <CheckCircle2 className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">4. Processus de Vérification</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                L'accès complet aux services nécessite une procédure de vérification en plusieurs étapes définies par AGM INVEST.
                            </p>
                        </section>

                        {/* 5. Paiements */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Shield className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">5. Paiements</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p>Certains services peuvent nécessiter le versement de dépôts de sécurité.</p>
                                <p className="font-medium">Ces montants sont communiqués clairement au client avant toute validation.</p>
                            </div>
                        </section>

                        {/* 6. Responsabilité */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <AlertCircle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">6. Responsabilité</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                AGM INVEST agit en tant qu'intermédiaire administratif et ne garantit pas l'acceptation d'un dossier par des tiers (administrations, partenaires, prestataires).
                            </p>
                        </section>

                        {/* 7. Données personnelles */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">7. Données Personnelles</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Les données sont traitées conformément à la réglementation en vigueur. Consultez notre{" "}
                                <a href="/politique-confidentialite" className="text-ely-mint font-semibold hover:underline">
                                    Politique de Confidentialité
                                </a>.
                            </p>
                        </section>

                        {/* 8. Résiliation */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <AlertCircle className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">8. Résiliation</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                AGM INVEST se réserve le droit de suspendre un compte en cas de fraude, fausse déclaration ou utilisation abusive du service.
                            </p>
                        </section>

                        {/* 9. Droit applicable */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">9. Droit Applicable</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p>Les présentes CGU sont soumises au droit français.</p>
                                <p className="mt-2">Tout litige relève de la compétence des tribunaux français.</p>
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
