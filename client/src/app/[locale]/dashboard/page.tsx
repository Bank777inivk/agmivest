"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, where, limit, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion } from "framer-motion";
import {
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    FileCheck,
    History,
    ChevronRight,
    FileText,
    ShieldCheck,
    HelpCircle,
    Landmark,
    Wallet
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";

interface LoanRequest {
    id: string;
    userId: string;
    status: "pending" | "processing" | "approved" | "rejected";
    projectType?: string;
    amount?: number;
    duration?: number;
    monthlyPayment?: number;
    rate?: number;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    otherLoans?: number;
    profession?: string;
    situation?: string;
    createdAt?: any;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState("");
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [recentRequests, setRecentRequests] = useState<LoanRequest[]>([]);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [idStatus, setIdStatus] = useState<string | null>(null);
    const [stats, setStats] = useState([
        { id: 'total', label: "Total Demandes", value: "0", icon: Clock, color: "blue", trend: "0%" },
        { id: 'approved', label: "Prêts accordés", value: "0", icon: CheckCircle, color: "green", trend: "0%" },
        { id: 'pending', label: "En attente", value: "0", icon: AlertCircle, color: "orange", trend: "0" },
        { id: 'projects', label: "Projets", value: "0", icon: FileCheck, color: "purple", trend: "0%" },
    ]);

    useEffect(() => {
        let unsubUser: () => void;
        let unsubAccount: () => void;
        let unsubRequests: () => void;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                unsubUser = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setFirstName(docSnap.data().firstName);
                        setIdStatus(docSnap.data().idStatus || null);
                    }
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (User):", error);
                });

                const accountsRef = collection(db, "accounts");
                const qAccount = query(accountsRef, where("userId", "==", currentUser.uid), limit(1));
                unsubAccount = onSnapshot(qAccount, (snapshot) => {
                    if (!snapshot.empty) {
                        setLoanAccount({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                    }
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (Account):", error);
                });

                const requestsRef = collection(db, "requests");
                const requestsQuery = query(
                    requestsRef,
                    where("userId", "==", currentUser.uid),
                    orderBy("createdAt", "desc")
                );

                unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
                    const allData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as LoanRequest[];

                    setRecentRequests(allData.slice(0, 3));
                    const active = allData.some(r => r.status === "pending" || r.status === "processing");
                    setHasActiveRequest(active);

                    setStats([
                        { id: 'total', label: "Total Demandes", value: allData.length.toString(), icon: Clock, color: "blue", trend: "Live" },
                        { id: 'approved', label: "Prêts accordés", value: allData.filter(r => r.status === "approved").length.toString(), icon: CheckCircle, color: "green", trend: `${Math.round((allData.filter(r => r.status === "approved").length / (allData.length || 1)) * 100)}%` },
                        { id: 'pending', label: "En attente", value: allData.filter(r => r.status === "pending" || r.status === "processing").length.toString(), icon: AlertCircle, color: "orange", trend: "0" },
                        { id: 'projects', label: "Projets", value: new Set(allData.map(r => r.projectType)).size.toString(), icon: FileCheck, color: "purple", trend: "85%" },
                    ]);

                    setIsLoading(false);
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (Requests):", error);
                    setIsLoading(false);
                });
            } else {
                // CLEANUP IMMEDIATELY ON LOGOUT
                if (unsubUser) unsubUser();
                if (unsubAccount) unsubAccount();
                if (unsubRequests) unsubRequests();

                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubUser) unsubUser();
            if (unsubAccount) unsubAccount();
            if (unsubRequests) unsubRequests();
        };
    }, [router]);

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

    if (isLoading) {
        return <PremiumSpinner />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">
                    Bonjour, <span className="text-ely-blue">{firstName || "Utilisateur"}</span> 👋
                </h1>
                <p className="text-gray-500">Voici un aperçu de vos activités de financement.</p>
            </header>


            {/* Active Loan Success Alert */}
            {loanAccount?.status === 'active' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#064e3b] to-[#059669] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group mb-8 border border-white/10"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight mb-1">Félicitations ! Votre crédit est activé.</h2>
                                <p className="text-white/80 text-sm font-medium">Les fonds ont été débloqués. Vous pouvez dès maintenant consulter votre échéancier.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/accounts")}
                            className="px-8 py-4 bg-white text-emerald-800 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl shadow-black/5 whitespace-nowrap"
                        >
                            Accéder à mon compte
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Rejected Identity Alert */}
            {idStatus === 'rejected' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-600/10 to-orange-600/10 border-2 border-red-500/30 rounded-3xl p-6 flex items-start gap-4"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-700 mb-1">Identité Refusée</h3>
                        <p className="text-sm text-red-600/80 leading-relaxed mb-3">
                            Votre demande de vérification d'identité a été refusée. Pour connaître les raisons et soumettre à nouveau vos documents, veuillez contacter notre service client.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/support")}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                        >
                            <HelpCircle className="w-4 h-4" />
                            Contacter le Support
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Partial Rejection Alert - Documents à compléter */}
            {idStatus === 'partial_rejection' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-600/10 to-yellow-600/10 border-2 border-orange-500/30 rounded-3xl p-6 flex items-start gap-4"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-orange-700 mb-1">Documents à compléter</h3>
                        <p className="text-sm text-orange-800/80 leading-relaxed mb-3">
                            Certains documents de votre dossier nécessitent une correction ou n'ont pas été validés. Veuillez consulter votre espace de vérification pour les mettre à jour.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/profile/verification")}
                            className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Voir mes documents
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => router.push("/dashboard/accounts")}
                        className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] shadow-2xl transition-all duration-500 group cursor-pointer border bg-gradient-to-br from-ely-blue to-blue-800 text-white shadow-ely-blue/30 border-white/10"
                    >
                        <div className="absolute top-0 right-0 p-10 transition-all duration-500 opacity-10 group-hover:scale-110 group-hover:opacity-20 text-white">
                            <Landmark className="w-40 h-40" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all bg-white/10 backdrop-blur-md border-white/10">
                                        <Wallet className="w-5 h-5 text-ely-mint" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                                        {loanAccount ? "Compte Crédit Actif" : "Mon Compte Crédit"}
                                    </span>
                                </div>
                                <ArrowUpRight className="w-6 h-6 transition-all text-white/40 group-hover:text-ely-mint group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div>
                                    <p className="text-sm mb-2 font-medium text-white/40">
                                        {loanAccount ? "Capital restant dû" : "Solde prévisionnel"}
                                    </p>
                                    <h2 className="text-5xl font-black tracking-tighter">
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR',
                                            maximumFractionDigits: 0
                                        }).format(loanAccount?.remainingAmount || 0)}
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="h-2 rounded-full overflow-hidden bg-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: loanAccount
                                                    ? `${((loanAccount.totalAmount - loanAccount.remainingAmount) / loanAccount.totalAmount) * 100}%`
                                                    : "0%"
                                            }}
                                            className="h-full shadow-[0_0_15px_rgba(5,150,105,0.4)] bg-ely-mint"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <span>
                                            {loanAccount
                                                ? `Remboursé : ${Math.round(((loanAccount.totalAmount - loanAccount.remainingAmount) / loanAccount.totalAmount) * 100)}%`
                                                : "Action requise : finaliser demande"
                                            }
                                        </span>
                                        <span>{loanAccount ? `${loanAccount.remainingMonths} mois restants` : "0 mois"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-ely-mint/5 rounded-full blur-[80px]" />
                    </motion.div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
                {stats.map((stat) => {
                    const colorClasses: Record<string, string> = {
                        blue: "bg-blue-50 text-blue-600",
                        green: "bg-green-50 text-green-600",
                        orange: "bg-orange-50 text-orange-600",
                        purple: "bg-purple-50 text-purple-600",
                    };
                    const colorClass = colorClasses[stat.color] || "bg-gray-50 text-gray-600";

                    return (
                        <motion.div
                            key={stat.id}
                            variants={item}
                            className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <History className="w-32 h-32" />
                        </div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Demandes récentes</h2>
                                <p className="text-sm text-gray-500 mt-1">Suivez l'état de vos dossiers en temps réel</p>
                            </div>
                            <button onClick={() => router.push("/dashboard/requests")} className="text-sm font-bold text-ely-blue hover:underline">Voir tout</button>
                        </div>

                        {recentRequests.length > 0 ? (
                            <div className="space-y-4 relative z-10">
                                {recentRequests.map((request, index) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${request.status === 'approved' ? 'from-ely-mint/20 to-ely-mint/5 text-ely-mint' : 'from-ely-blue/10 to-ely-blue/5 text-ely-blue'}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{request.projectType || "Projet Personnel"}</span>
                                                    <span className="h-4 w-px bg-gray-200" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">#{request.id.slice(0, 8)}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="text-xs font-bold text-gray-500">
                                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.amount || 0)}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span className="text-xs text-gray-400">
                                                        {request.createdAt?.toDate ? new Date(request.createdAt.toDate()).toLocaleDateString('fr-FR') : "Date inconnue"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${request.status === 'approved'
                                                ? 'bg-ely-mint/10 text-ely-mint border-ely-mint/20'
                                                : request.status === 'rejected'
                                                    ? 'bg-red-50 text-red-500 border-red-100'
                                                    : 'bg-ely-blue/5 text-ely-blue border-ely-blue/10'
                                                }`}>
                                                {request.status === 'approved' ? 'Accordé' : request.status === 'rejected' ? 'Refusé' : 'En étude'}
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-ely-blue group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 relative z-10">
                                <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 group-hover:rotate-0 transition-transform">
                                    <CreditCard className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune demande trouvée</h3>
                                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                                    Vous n'avez pas encore soumis de demande de financement. Projetez-vous dès maintenant !
                                </p>
                                {hasActiveRequest ? (
                                    <div className="mt-8 p-6 bg-ely-blue/5 border border-ely-blue/20 rounded-2xl flex items-center gap-4 max-w-md mx-auto">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <Clock className="w-6 h-6 text-ely-blue" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-gray-900">Demande en cours</h4>
                                            <p className="text-sm text-gray-500">Vous avez déjà un dossier en cours d'étude. Notre équipe revient vers vous sous 24h.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push("/dashboard/credit")}
                                        className="mt-8 px-10 py-4 bg-ely-blue text-white rounded-2xl font-bold shadow-xl shadow-ely-blue/20 hover:bg-ely-blue/90 transition-all flex items-center gap-3 mx-auto"
                                    >
                                        Commencer un dossier
                                        <ArrowUpRight className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2.5rem] shadow-xl shadow-ely-blue/20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-ely-mint/20 rounded-full -mr-24 -mt-24 blur-3xl transition-all group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <HelpCircle className="w-6 h-6 text-ely-mint" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Une question ?</h3>
                            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
                                Nos experts AGM INVEST étudient votre dossier sous 24h et vous rappellent pour affiner votre projet.
                            </p>
                            <button className="w-full py-4 bg-white text-ely-blue rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group/btn">
                                Contacter mon conseiller
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </button>
                        </div>
                    </section>

                    <div className="p-6 bg-ely-mint/5 border border-ely-mint/20 rounded-[2rem]">
                        <div className="flex gap-4">
                            <div className="p-3 bg-white rounded-2xl text-ely-mint h-fit shadow-sm">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Documents Sécurisés</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Vos données sont protégées par un chiffrement AES-256 de niveau bancaire.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
}
