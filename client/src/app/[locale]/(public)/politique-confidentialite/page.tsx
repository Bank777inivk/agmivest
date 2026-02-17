"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Lock, FileText, UserCheck, Eye, ShieldAlert, Database } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
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
                    <div className="bg-slate-900 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Lock className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Politique de Confidentialité</h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                Engagement de AGM INVEST sur la protection de vos données personnelles et le respect de votre vie privée (RGPD).
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        <section className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">
                                Chez <strong>AGM INVEST</strong>, nous accordons une importance capitale à la confidentialité et à la sécurité de vos informations. Cette politique détaille comment nous collectons, utilisons et protégeons vos données dans le cadre de nos activités de conseil financier et de courtage.
                            </p>
                        </section>

                        {/* 1. Données Collectées */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Database className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">1. Données Collectées</h2>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-700 space-y-4">
                                <p>Pour traiter vos demandes de financement et vous fournir nos services, nous sommes amenés à collecter les informations suivantes :</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Identité :</strong> Nom, prénom, date de naissance, nationalité, documents d'identité.</li>
                                    <li><strong>Coordonnées :</strong> Adresse postale, email, numéro de téléphone.</li>
                                    <li><strong>Situation Familiale :</strong> Statut marital, nombre d'enfants à charge.</li>
                                    <li><strong>Situation Professionnelle :</strong> Employeur, type de contrat, ancienneté, revenus.</li>
                                    <li><strong>Situation Financière :</strong> Relevés bancaires, avis d'imposition, emprunts en cours, patrimoine.</li>
                                    <li><strong>Données de Connexion :</strong> Adresse IP, logs de connexion (pour la sécurité).</li>
                                </ul>
                            </div>
                        </section>

                        {/* 2. Finalités du Traitement */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <FileText className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">2. Finalités du Traitement</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p>Vos données sont traitées pour des finalités déterminées, explicites et légitimes :</p>
                                <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">Étude de solvabilité</strong>
                                        Analyse de votre capacité de remboursement pour l'octroi de crédits.
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">Gestion de dossier</strong>
                                        Suivi administratif, constitution des contrats et gestion de la relation client.
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">Obligations Légales</strong>
                                        Lutte contre le blanchiment d'argent et le financement du terrorisme (LCB-FT).
                                    </li>
                                    <li className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <strong className="block text-slate-900 mb-1">Sécurité</strong>
                                        Protection contre la fraude et sécurisation de vos accès en ligne.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Partage des Données */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <UserCheck className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">3. Partage et Destinataires</h2>
                            </div>
                            <div className="text-slate-600 space-y-4">
                                <p>
                                    Vos données sont strictement confidentielles. Elles ne sont transmises qu'aux destinataires habilités lorsque cela est nécessaire :
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Nos partenaires bancaires et assureurs (pour l'étude et la validation de votre financement).</li>
                                    <li>Les organismes publics et régulateurs (sur réquisition légale).</li>
                                    <li>Nos prestataires techniques sécurisés (hébergement, signature électronique).</li>
                                </ul>
                                <p className="font-medium text-slate-800">
                                    AGM INVEST ne vendra jamais vos données personnelles à des tiers à des fins commerciales.
                                </p>
                            </div>
                        </section>

                        {/* 4. Vos Droits */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <ShieldAlert className="w-8 h-8 text-ely-mint" />
                                <h2 className="text-2xl font-bold">4. Vos Droits (Informatique et Libertés)</h2>
                            </div>
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-slate-700">
                                <p className="mb-4">
                                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                                </p>
                                <ul className="grid md:grid-cols-2 gap-2 mb-4">
                                    <li>• Droit d'accès à vos données</li>
                                    <li>• Droit de rectification</li>
                                    <li>• Droit à l'effacement ("droit à l'oubli")</li>
                                    <li>• Droit à la limitation du traitement</li>
                                    <li>• Droit à la portabilité des données</li>
                                    <li>• Droit d'opposition</li>
                                </ul>
                                <p className="pt-4 border-t border-blue-200">
                                    Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) :<br />
                                    <a href="mailto:contact@agm-negoce.com" className="text-ely-blue font-bold hover:underline">contact@agm-negoce.com</a> ou par courrier postal au siège social.
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>Dernière mise à jour : Février 2026</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
