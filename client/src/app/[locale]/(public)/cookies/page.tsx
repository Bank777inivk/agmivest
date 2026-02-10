"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Cookie, Settings, CheckCircle, Smartphone, Server } from "lucide-react";

export default function CookiesPage() {
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
                    <div className="bg-amber-600 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Cookie className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Gestion des Cookies</h1>
                            <p className="text-amber-100 text-lg max-w-2xl">
                                Comprendre comment et pourquoi nous utilisons des cookies pour améliorer votre expérience sur AGM INVEST.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">

                        <section className="space-y-4">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite de notre site. Il permet à AGM INVEST de mémoriser vos actions et préférences sur une période donnée.
                            </p>
                        </section>

                        {/* 1. Types de cookies */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Server className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">1. Les Cookies que nous utilisons</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-ely-blue">
                                        <CheckCircle className="w-6 h-6" />
                                        <h3 className="font-bold">Cookies Essentiels</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Indispensables au bon fonctionnement du site. Ils vous permettent de naviguer, d'accéder à votre espace sécurisé et d'assurer la sécurité des transactions. Ils ne peuvent pas être désactivés.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-ely-mint">
                                        <Settings className="w-6 h-6" />
                                        <h3 className="font-bold">Cookies Fonctionnels</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Permettent de mémoriser vos choix (langue, nom d'utilisateur) pour vous offrir une expérience personnalisée et plus fluide.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 text-amber-500">
                                        <Smartphone className="w-6 h-6" />
                                        <h3 className="font-bold">Cookies Analytiques</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Nous aident à comprendre comment les visiteurs interagissent avec le site (pages visitées, temps passé) afin d'améliorer nos services. Données anonymisées.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Gestion */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-800">
                                <Settings className="w-8 h-8 text-amber-600" />
                                <h2 className="text-2xl font-bold">2. Gérer vos préférences</h2>
                            </div>
                            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-slate-700">
                                <p className="mb-4">
                                    Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur web.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    <li><strong>Google Chrome :</strong> Paramètres {'>'} Confidentialité et sécurité {'>'} Cookies</li>
                                    <li><strong>Firefox :</strong> Options {'>'} Vie privée et sécurité {'>'} Cookies</li>
                                    <li><strong>Safari :</strong> Préférences {'>'} Confidentialité</li>
                                    <li><strong>Edge :</strong> Paramètres {'>'} Cookies et autorisations de site</li>
                                </ul>
                                <p className="mt-4 text-xs text-slate-500">
                                    Note : Le refus des cookies essentiels peut empêcher l'accès à certaines fonctionnalités critiques comme la connexion à votre compte client.
                                </p>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                            <p>© AGM INVEST - Politique de Cookies</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
