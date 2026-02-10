"use client";

import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Phone, Mail, BookOpen, ExternalLink } from "lucide-react";

export default function SupportPage() {
    const contactMethods = [
        { icon: MessageSquare, title: "Chat en direct", value: "Disponible 24/7", color: "text-ely-mint bg-ely-mint/10" },
        { icon: Phone, title: "Téléphone", value: "+33 1 23 45 67 89", color: "text-ely-blue bg-ely-blue/10" },
        { icon: Mail, title: "Email", value: "support@agm-invest.com", color: "text-purple-600 bg-purple-50" },
    ];

    return (
        <div className="space-y-8 max-w-5xl">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Centre d'Aide & Support</h1>
                <p className="text-gray-500">Nous sommes là pour vous accompagner dans vos projets.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, i) => (
                    <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-4 hover:shadow-xl transition-all"
                    >
                        <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                            <method.icon className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-gray-900">{method.title}</h3>
                        <p className="font-medium text-gray-500">{method.value}</p>
                    </motion.div>
                ))}
            </div>

            <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-ely-blue" />
                    <h2 className="text-xl font-bold text-gray-900">Questions Fréquentes (FAQ)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                        "Comment se passe la vérification d'identité ?",
                        "Quels sont les délais d'accord de prêt ?",
                        "Puis-je modifier ma demande après soumission ?",
                        "Comment télécharger mon contrat signé ?",
                    ].map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer group">
                            <span className="font-medium text-gray-700 group-hover:text-ely-blue">{q}</span>
                            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-ely-blue" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
