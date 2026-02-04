"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="h-10 w-10 border-4 border-ely-blue/30 border-t-ely-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-ely-blue">Tableau de bord</h1>
                        <p className="text-gray-500 mt-1">Bienvenue, {user?.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all text-sm w-fit"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Demandes actives", value: "0", icon: Clock, color: "blue" },
                        { label: "Prêts accordés", value: "0", icon: CheckCircle, color: "green" },
                        { label: "En attente", value: "0", icon: AlertCircle, color: "orange" },
                        { label: "Profil complet", value: "85%", icon: UserIcon, color: "purple" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 w-fit mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-ely-blue mb-6">Vos dernières demandes</h2>
                            <div className="text-center py-12">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-500">Vous n'avez pas encore de demande en cours.</p>
                                <button
                                    onClick={() => router.push("/credit-request")}
                                    className="mt-6 px-8 py-3 bg-ely-mint text-white rounded-2xl font-bold hover:bg-ely-mint/90 transition-all"
                                >
                                    Faire une demande
                                </button>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="bg-ely-blue text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ely-mint/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h3 className="text-lg font-bold mb-4 relative z-10">Besoin d'aide ?</h3>
                            <p className="text-blue-100 text-sm mb-6 relative z-10">
                                Nos conseillers sont à votre disposition pour vous accompagner dans vos projets.
                            </p>
                            <button className="w-full py-3 bg-white text-ely-blue rounded-xl font-bold text-sm hover:bg-blue-50 transition-all relative z-10">
                                Contacter un conseiller
                            </button>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
