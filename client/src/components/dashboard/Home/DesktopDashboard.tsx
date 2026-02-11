"use client";

import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    FileCheck,
    History,
    ChevronRight,
    FileText,
    HelpCircle,
    Landmark,
    Wallet,
    Euro,
    ArrowUpRight,
    ShieldCheck,
    CreditCard
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

interface DesktopDashboardProps {
    firstName: string;
    loanAccount: any;
    recentRequests: any[];
    stats: any[];
    hasActiveRequest: boolean;
    idStatus: string | null;
}

export default function DesktopDashboard({
    firstName,
    loanAccount,
    recentRequests,
    stats,
    hasActiveRequest,
    idStatus
}: DesktopDashboardProps) {
    const router = useRouter();
    const t = useTranslations('CreditRequest.Project.labels');

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
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">
                    Bonjour, <span className="text-ely-blue">{firstName || "Utilisateur"}</span> 👋
                </h1>
                <p className="text-gray-500">Voici un aperçu de vos activités de financement.</p>
            </header>

            {/* Active Loan Success Alert */}
            {recentRequests.find(r => r.status === 'rejected') && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-600/10 to-orange-600/10 border-2 border-red-500/30 rounded-3xl p-6 flex items-start gap-4 mb-8"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-700 mb-1">Je vous informe que :</h3>
                        <p className="text-sm text-red-600/80 leading-relaxed mb-3">
                            Votre demande de financement a été refusée par nos services après étude de votre dossier. Pour plus de détails ou pour échanger avec un conseiller, veuillez contacter notre support.
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

            {/* Active Loan Success Alert */}
            {loanAccount?.status === 'active' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group mb-8 border border-white/10 ${loanAccount.isDeferred ? "bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-900/20" : "bg-gradient-to-br from-[#064e3b] to-[#059669] shadow-emerald-900/20"}`}
                >
                    <div className="absolute top-0 right-0 p-6 md:p-10 opacity-10 group-hover:scale-110 transition-transform">
                        {loanAccount.isDeferred ? (
                            <Clock className="w-24 h-24 md:w-32 md:h-32 text-white" />
                        ) : (
                            <CheckCircle className="w-24 h-24 md:w-32 md:h-32 text-white" />
                        )}
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                                {loanAccount.isDeferred ? (
                                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight mb-1">
                                    {loanAccount.isDeferred ? "Période de Différé Active" : "Félicitations ! Votre crédit est activé."}
                                </h2>
                                <p className="text-white/80 text-sm font-medium">
                                    {loanAccount.isDeferred
                                        ? `Le remboursement de votre prêt débutera le ${loanAccount.startDateFormatted}.`
                                        : "Les fonds ont été débloqués. Vous pouvez dès maintenant consulter votre échéancier."
                                    }
                                </p>
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

            {/* Pending Payment Alert */}
            {(() => {
                const pendingPaymentReq = recentRequests.find(r => r.requiresPayment && r.paymentStatus === 'pending');
                if (!pendingPaymentReq || pendingPaymentReq.paymentType === 'none') return null;
                return (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-amber-600/10 to-yellow-600/10 border-2 border-amber-500/30 rounded-3xl p-6 flex items-start gap-4 mb-8"
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Euro className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-amber-700 mb-1">Action Requise</h3>
                            <p className="text-sm text-amber-800/80 leading-relaxed mb-3">
                                Votre demande a été approuvée ! Pour finaliser l'activation de votre crédit, un dépôt d'authentification est nécessaire.
                            </p>
                            <button
                                onClick={() => router.push("/dashboard/billing")}
                                className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                <Euro className="w-4 h-4" />
                                Effectuer le dépôt
                            </button>
                        </div>
                    </motion.div>
                );
            })()}

            {/* ID Status Alerts */}
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

            {idStatus === 'partial_rejection' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-600/10 to-yellow-600/10 border-2 border-orange-500/30 rounded-3xl p-6 flex items-start gap-4 mb-8"
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
                    {/* Main Balance Card */}
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
                                                : "Action requise"
                                            }
                                        </span>
                                        <span>{loanAccount ? `${loanAccount.remainingMonths} mois restants` : ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {stats.map((stat: any) => (
                            <motion.div
                                key={stat.id}
                                variants={item}
                                className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
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
                        ))}
                    </motion.div>

                    {/* Recent Requests Section */}
                    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <History className="w-32 h-32" />
                        </div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Demandes récentes</h2>
                                <p className="text-sm text-gray-500 mt-1">Suivez l'état de vos dossiers</p>
                            </div>
                            <button onClick={() => router.push("/dashboard/requests")} className="text-sm font-bold text-ely-blue hover:underline">Voir tout</button>
                        </div>
                        {recentRequests.length > 0 ? (
                            <div className="space-y-4 relative z-10">
                                {recentRequests.map((request, index) => (
                                    <div key={request.id} onClick={() => router.push(`/dashboard/requests/${request.id}`)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-ely-blue/10 text-ely-blue"><FileText className="w-5 h-5" /></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">
                                                        {request.projectType ? t(request.projectType.toLowerCase()) : "Projet"}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">#{request.id.slice(0, 8)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(request.amount || 0)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-ely-blue/5 text-ely-blue'}`}>
                                                {request.status === 'approved' ? 'Accordé' : 'En étude'}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500 text-sm">Aucune demande.</p>
                            </div>
                        )}
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <HelpCircle className="w-10 h-10 text-ely-mint mb-6" />
                            <h3 className="text-xl font-bold mb-3">Une question ?</h3>
                            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">Nos experts vous accompagnent sous 24h.</p>
                            <button className="w-full py-4 bg-white text-ely-blue rounded-2xl font-bold text-sm">Contacter un conseiller</button>
                        </div>
                    </section>
                    <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Actions Rapides</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Mes Documents", icon: FileText, color: "orange", route: "/dashboard/documents" },
                                { label: "Virement", icon: ArrowUpRight, color: "emerald", route: "/dashboard/accounts/transfer" },
                                { label: "Echéancier", icon: Clock, color: "blue", route: "/dashboard/accounts/schedule" },
                                { label: "Télécharger RIB", icon: Landmark, color: "purple", route: "/dashboard/accounts" },
                            ].map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => router.push(action.route)}
                                    className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-50 hover:border-ely-blue/20 hover:bg-ely-blue/5 transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 group-hover:text-ely-blue transition-colors text-center">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="p-6 bg-ely-mint/5 border border-ely-mint/20 rounded-[2rem] flex gap-4">
                        <ShieldCheck className="w-6 h-6 text-ely-mint shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold">Sécurité</h4>
                            <p className="text-[10px] text-gray-500">Données chiffrées AES-256.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
