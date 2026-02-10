"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, Scale, Mail, FileText } from "lucide-react";

export default function MentionsLegalesPage() {
    const t = useTranslations('Legal');

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
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Mentions Légales</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                Informations juridiques et réglementaires concernant AGM INVEST et l'utilisation de nos services.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        {/* 1. Identification */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Building2 className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">Identification de la Société</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-slate-700">
                                <p><strong className="text-slate-900">Dénomination sociale :</strong> AGM INVEST</p>
                                <p><strong className="text-slate-900">Forme juridique :</strong> SARL au capital de 7 622 €</p>
                                <p><strong className="text-slate-900">Siège social :</strong> MELPARK – 40 rue Jean Monnet, 68200 Mulhouse – France</p>
                                <p><strong className="text-slate-900">SIREN :</strong> 389 858 630</p>
                                <p><strong className="text-slate-900">SIRET :</strong> 389 858 630 00046</p>
                                <p><strong className="text-slate-900">RCS :</strong> 389 858 630 R.C.S. Mulhouse</p>
                                <p><strong className="text-slate-900">TVA Intracommunautaire :</strong> FR51 389858630</p>
                                <p><strong className="text-slate-900">Code APE / NAF :</strong> 64.92Z – Autre distribution de crédit</p>
                                <p><strong className="text-slate-900">Dirigeant :</strong> Alain Meyer</p>
                                <p><strong className="text-slate-900">Date de création :</strong> 16 janvier 1993</p>
                            </div>
                        </section>

                        {/* 2. Activités */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">Activités & Expertise</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="mb-4">
                                    AGM INVEST est une société française spécialisée dans le conseil financier, le courtage en financements et l’accompagnement stratégique des particuliers et des professionnels. Forte de plus de 50 ans d’expérience cumulée dans les services financiers, AGM INVEST met son expertise au service de projets patrimoniaux, immobiliers et financiers, en toute indépendance.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Conseil financier et stratégique</li>
                                    <li>Courtage en financements</li>
                                    <li>Intermédiation en opérations de banque et services de paiement</li>
                                    <li>Accompagnement en négociation et structuration financière</li>
                                    <li>Conseil et commercialisation de projets immobiliers</li>
                                    <li>Analyse et optimisation de solutions de financement</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Réglementation */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <ShieldCheck className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">Conformité & Réglementation</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p className="mb-4">
                                    AGM INVEST a été immatriculée à l’ORIAS sous le numéro <strong>14001635</strong> en qualité de :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mb-4">
                                    <li>Mandataire d’Intermédiaire en Opérations Bancaires et Services de Paiement</li>
                                    <li>Courtier en Opérations Bancaires et Services de Paiement</li>
                                    <li>Courtier en Assurance</li>
                                </ul>
                                <p className="text-sm text-slate-500 italic">
                                    (Statuts radiés depuis le 21/04/2023 – informations publiques à titre historique)
                                </p>
                                <p className="mt-4 pt-4 border-t border-blue-200/50">
                                    L'activité d'Intermédiaire en Opérations de Banque et en Services de Paiement (IOBSP) est régie par le Code Monétaire et Financier. AGM INVEST est soumise au contrôle de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 Place de Budapest CS 92459, 75436 Paris Cedex 09.
                                </p>
                            </div>
                        </section>

                        {/* 4. Contact & Hébergement */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-ely-blue">
                                <Mail className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">Contact & Hébergement</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2">Service Client</h3>
                                    <p className="text-slate-600">Pour toute question ou réclamation :</p>
                                    <a href="mailto:contact@agm-invest.fr" className="text-ely-blue font-medium hover:underline block mt-2">contact@agm-invest.fr</a>
                                    <p className="text-slate-600 mt-2">40 rue Jean Monnet, 68200 Mulhouse</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2">Hébergement Web</h3>
                                    <p className="text-slate-600">Ce site est hébergé par :</p>
                                    <p className="font-medium text-slate-900 mt-1">Vercel Inc.</p>
                                    <p className="text-slate-600 text-sm">340 S Lemon Ave #4133<br />Walnut, CA 91789<br />USA</p>
                                </div>
                            </div>
                        </section>

                        {/* Footer Rights */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>© 1993 – 2026 AGM INVEST – Tous droits réservés</p>
                            <p className="mt-1">Société de conseil financier – Interventions sans maniement de fonds</p>
                            <p className="mt-2 italic">Les informations présentes sur ce site ne constituent pas une offre contractuelle.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
