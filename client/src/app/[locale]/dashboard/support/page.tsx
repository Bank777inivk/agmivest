"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChatSupport from "@/components/dashboard/ChatSupport";
import {
    MessageSquare,
    Phone,
    Mail,
    BookOpen,
    ChevronRight,
    LifeBuoy,
    ShieldCheck,
    ArrowRight,
    Search,
    Clock
} from "lucide-react";

export default function SupportPage() {
    const contactMethods = [
        {
            icon: MessageSquare,
            title: "Chat en direct",
            value: "Conseiller en ligne",
            desc: "Réponse immédiate",
            color: "text-blue-400",
            bg: "bg-slate-800/50"
        },
        {
            icon: Phone,
            title: "Ligne Téléphonique",
            value: "+33 1 89 20 40 00",
            desc: "9h - 18h (Lun-Ven)",
            color: "text-blue-400",
            bg: "bg-slate-800/50"
        },
        {
            icon: Mail,
            title: "Assistance Email",
            value: "contact@elyssio.com",
            desc: "Sous 24 heures",
            color: "text-blue-400",
            bg: "bg-slate-800/50"
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    } as const;

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    } as const;

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "Comment se passe la vérification d'identité ?",
            a: "La vérification s'effectue entièrement en ligne. Il vous suffit de télécharger une pièce d'identité valide et de réaliser un selfie vidéo rapide pour confirmer votre identité en quelques secondes."
        },
        {
            q: "Quels sont les délais d'accord de prêt ?",
            a: "Une fois votre dossier complet, vous recevez une réponse de principe immédiate. L'analyse finale et le déblocage des fonds interviennent généralement sous 24 à 48 heures ouvrées."
        },
        {
            q: "Puis-je modifier ma demande après soumission ?",
            a: "Tant que votre demande est en statut 'En attente', vous pouvez contacter notre support pour apporter des modifications. Une fois validée, les modifications ne sont plus possibles."
        },
        {
            q: "Comment télécharger mon contrat signé ?",
            a: "Votre contrat est disponible dans la section 'Mes Documents' de votre tableau de bord dès que la signature électronique est confirmée."
        },
        {
            q: "Quels sont les critères d'éligibilité ?",
            a: "Vous devez être majeur, résider dans un pays éligible et justifier de revenus stables. Chaque projet est étudié de manière personnalisée par nos experts."
        },
        {
            q: "Comment sécuriser mon compte ?",
            a: "Nous recommandons d'activer l'authentification à deux facteurs (2FA) dans vos paramètres et d'utiliser un mot de passe unique et complexe."
        }
    ];

    return (
        <div className="min-h-screen pb-20 bg-[#F8FAFC]">
            {/* Header épuré */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12 pt-12">
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 shadow-sm">
                        <LifeBuoy className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Aide & Support</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Centre d'assistance
                            </h1>
                            <p className="text-slate-500 font-medium max-w-lg">
                                Nous sommes là pour répondre à vos questions et vous accompagner.
                            </p>
                        </div>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-ely-blue transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher une solution..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue transition-all font-medium text-slate-900 shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* Cartes de Contact - Style Premium Deep Blue */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {contactMethods.map((method) => (
                        <motion.div
                            key={method.title}
                            variants={item}
                            className="bg-gradient-to-br from-[#002B70] to-[#011B45] p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-[#003B8F]"
                        >
                            {/* Subtile Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all" />

                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 group-hover:border-blue-400/40 transition-colors">
                                <method.icon className="w-7 h-7" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <h3 className="font-bold text-white uppercase tracking-tight text-sm opacity-80">{method.title}</h3>
                                <p className="text-white font-black text-lg truncate group-hover:text-blue-400 transition-colors">{method.value}</p>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    {method.desc}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (method.title === "Chat en direct") {
                                        window.dispatchEvent(new CustomEvent('open-chat'));
                                    } else if (method.title === "Ligne Téléphonique") {
                                        window.location.href = `tel:${method.value.replace(/\s/g, '')}`;
                                    } else if (method.title === "Assistance Email") {
                                        window.location.href = `mailto:${method.value}`;
                                    }
                                }}
                                className="w-full py-3.5 bg-white text-[#002B70] rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-blue-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                            >
                                Contacter
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ Moderne & Structurée avec Accordéon */}
                <motion.section
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Questions Fréquentes</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="group"
                            >
                                <button
                                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                                    onMouseEnter={() => setExpandedIndex(i)}
                                    className="w-full flex items-center justify-between py-6 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-xl transition-all cursor-pointer text-left"
                                >
                                    <span className={`font-bold transition-colors text-sm ${expandedIndex === i ? 'text-ely-blue' : 'text-slate-700 group-hover:text-ely-blue'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedIndex === i ? 'bg-ely-blue text-white rotate-90' : 'bg-slate-50 text-slate-300 group-hover:bg-ely-blue/10 group-hover:text-ely-blue'}`}>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: expandedIndex === i ? "auto" : 0,
                                        opacity: expandedIndex === i ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 text-slate-500 text-xs font-medium leading-relaxed">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 text-center text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-ely-blue transition-colors border-t border-slate-50 pt-8 mt-4">
                        Afficher toutes les questions
                    </button>
                </motion.section>

                {/* Footer Assurance */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-slate-200">
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Support Certifié Sécurisé</p>
                            <span className="text-[10px] uppercase tracking-widest font-bold">Protocoles de chiffrement actifs</span>
                        </div>
                    </div>
                </div>
            </div>
            <ChatSupport />
        </div>
    );
}
