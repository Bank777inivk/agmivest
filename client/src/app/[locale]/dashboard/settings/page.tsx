"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    Settings,
    Bell,
    Lock,
    Eye,
    Languages,
    ChevronRight,
    Mail,
    Smartphone,
    Globe,
    ShieldCheck,
    Check,
    ArrowRight,
    Shield
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
    const t = useTranslations('Dashboard.settings');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: true
    });

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            }
        });
        return () => unsubscribe();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    } as const;

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    } as const;

    const switchLanguage = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    return (
        <div className="min-h-screen pb-20 relative bg-[#F8FAFC]">
            {/* Arrière-plan épuré */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-12 relative z-10 px-4 md:px-6">
                {/* Header Minimaliste */}
                <header className="space-y-3 pt-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400">
                        <Settings className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Configuration</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Paramètres
                    </h1>
                    <p className="text-slate-500 font-medium text-sm max-w-lg">
                        Gérez vos préférences de compte, les notifications et la sécurité.
                    </p>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Langues */}
                    <motion.section
                        variants={item}
                        className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm shadow-blue-900/5 space-y-6 group hover:border-ely-blue/20 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-ely-blue border border-blue-100">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Langue</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-xl z-10">
                                    {[
                                        { id: 'fr', flag: '🇫🇷' },
                                        { id: 'en', flag: '🇬🇧' },
                                        { id: 'de', flag: '🇩🇪' },
                                        { id: 'it', flag: '🇮🇹' },
                                        { id: 'es', flag: '🇪🇸' },
                                        { id: 'pt', flag: '🇵🇹' }
                                    ].find(l => l.id === locale)?.flag || '🌐'}
                                </div>
                                <select
                                    value={locale}
                                    onChange={(e) => switchLanguage(e.target.value)}
                                    className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer hover:bg-white"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                    <option value="de">Deutsch</option>
                                    <option value="it">Italiano</option>
                                    <option value="es">Español</option>
                                    <option value="pt">Português</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 rotate-90 pointer-events-none" />
                            </div>
                        </div>
                    </motion.section>

                    {/* Statut Système */}
                    <motion.section
                        variants={item}
                        className="bg-ely-blue p-8 rounded-3xl shadow-xl shadow-blue-900/20 flex flex-col justify-center gap-4 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-120 transition-transform duration-500">
                            <Globe className="w-24 h-24 text-white" />
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-100/60 uppercase tracking-[0.2em]">Système en ligne</span>
                        </div>
                        <p className="text-sm text-white font-medium relative z-10 leading-relaxed">
                            Votre application est à jour. <br />
                            <span className="text-blue-100/80 text-xs font-bold uppercase tracking-widest">v3.4.0 stable</span>
                        </p>
                    </motion.section>

                    {/* Notifications */}
                    <motion.section
                        variants={item}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 md:col-span-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Notifications</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'email', icon: Mail, label: 'Email', desc: 'Alertes dossiers' },
                                { id: 'push', icon: Smartphone, label: 'Push', desc: 'Mobile direct' },
                                { id: 'marketing', icon: Globe, label: 'Offres', desc: 'Partenaires' }
                            ].map((notif) => (
                                <div
                                    key={notif.id}
                                    className="p-5 rounded-2xl bg-slate-50/50 border border-slate-50 flex flex-col gap-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 bg-white rounded-xl text-slate-400">
                                            <notif.icon className="w-4 h-4" />
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [notif.id]: !notifications[notif.id as keyof typeof notifications] })}
                                            className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ${notifications[notif.id as keyof typeof notifications] ? 'bg-ely-blue' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications[notif.id as keyof typeof notifications] ? 'left-6.5' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{notif.label}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{notif.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Sécurité */}
                    <motion.section
                        variants={item}
                        className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-8 md:col-span-2 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Sécurité du Compte</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
                            <div className="lg:col-span-7 space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email de connexion</label>
                                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300">
                                    <p className="font-bold text-sm truncate">{userEmail}</p>
                                    <Check className="w-4 h-4 text-blue-400" />
                                </div>
                            </div>
                            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button className="px-6 py-4 bg-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5">
                                    Password
                                </button>
                                <button className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40">
                                    2FA Active
                                </button>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>

                <footer className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Chiffrement AES-256</span>
                    </div>
                    <span>Dernière mise à jour : Février 2026</span>
                </footer>
            </div>
        </div>
    );
}
