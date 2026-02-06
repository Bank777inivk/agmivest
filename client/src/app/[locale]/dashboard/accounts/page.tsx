"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Wallet,
    Info,
    Calendar,
    ChevronRight,
    Landmark,
    TrendingUp
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { useRouter } from "@/i18n/routing";

export default function AccountsPage() {
    const t = useTranslations('Dashboard.Accounts');
    const router = useRouter();
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "accounts"),
                        where("userId", "==", user.uid),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        setLoanAccount({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                    }
                } catch (error) {
                    console.error("Error fetching account:", error);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Mon solde crédit AGM</h1>
                <p className="text-gray-500">Gérez vos crédits actifs et suivez vos remboursements.</p>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Balance Card */}
                    <motion.div
                        variants={item}
                        className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#003d82] to-[#001d3d] p-8 rounded-[2.5rem] shadow-2xl shadow-ely-blue/20 text-white"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Landmark className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Solde Total Crédit</span>
                                <CreditCard className="w-6 h-6 text-ely-mint" />
                            </div>

                            <div>
                                <h2 className="text-5xl font-black tracking-tight">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.remainingAmount || 0)}
                                </h2>
                                <p className="text-white/40 mt-2 font-medium">Capital restant dû</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Montant Initial</p>
                                    <p className="text-lg font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.totalAmount || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Prochaine Échéance</p>
                                    <p className="text-lg font-bold">{loanAccount?.nextPaymentDate || "-- / -- / --"}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Actions */}
                    <motion.div variants={item} className="space-y-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ely-mint/10 text-ely-mint rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taux (TAEG)</p>
                                    <p className="text-xl font-black text-gray-900">{loanAccount?.rate || "0.00"}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ely-blue/10 text-ely-blue rounded-xl">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Durée Restante</p>
                                    <p className="text-xl font-black text-gray-900">{loanAccount?.remainingMonths || 0} mois</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/dashboard/accounts/schedule")}
                            className="w-full bg-ely-blue text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                        >
                            Consulter l'échéancier
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Transaction History Mock */}
                    <motion.div variants={item} className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <History className="w-5 h-5 text-gray-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Dernières Opérations</h3>
                            </div>
                        </div>

                        {loanAccount ? (
                            <div className="divide-y divide-gray-50">
                                {/* Sample transaction if account exists */}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Wallet className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Aucun mouvement</h3>
                                <p className="text-gray-400 max-w-sm mx-auto font-medium">Votre compte crédit sera actif dès la validation et le versement de votre prêt.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Support Alert */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ely-mint/10 blur-[100px] rounded-full" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="hidden md:flex w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center">
                        <Info className="w-8 h-8 text-ely-mint" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">Besoin d'aide sur vos comptes ?</h4>
                        <p className="text-white/60">Nos conseillers sont disponibles pour répondre à vos questions sur vos remboursements.</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-3 bg-white text-gray-900 rounded-2xl font-bold hover:bg-ely-mint hover:text-white transition-all">
                    Contacter un conseiller
                </button>
            </div>
        </div>
    );
}

