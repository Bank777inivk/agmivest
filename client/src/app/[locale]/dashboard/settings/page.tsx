"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Lock, Eye, Languages, Palette } from "lucide-react";

export default function SettingsPage() {
    const sections = [
        { icon: Bell, title: "Notifications", desc: "Gérez vos alertes par email et push." },
        { icon: Lock, title: "Sécurité", desc: "Changer votre mot de passe et double authentification." },
        { icon: Eye, title: "Confidentialité", desc: "Gérez la visibilité de vos données." },
        { icon: Languages, title: "Langue", desc: "Choisissez votre langue d'affichage." },
        { icon: Palette, title: "Apparence", desc: "Personnalisez le thème de votre dashboard." },
    ];

    return (
        <div className="space-y-8 max-w-4xl">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-500">Personnalisez votre expérience et gérez la sécurité de votre compte.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-ely-blue/10 group-hover:text-ely-blue rounded-xl transition-all">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{section.title}</h3>
                                <p className="text-sm text-gray-500">{section.desc}</p>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-ely-blue transition-colors">
                            Configurer
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 text-amber-800 text-sm italic">
                Note: Certaines options de configuration sont en cours de déploiement et seront disponibles prochainement.
            </div>
        </div>
    );
}
