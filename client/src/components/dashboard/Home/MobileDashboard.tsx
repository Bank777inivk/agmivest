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
    CreditCard,
    PlusCircle
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface MobileDashboardProps {
    firstName: string;
    loanAccount: any;
    recentRequests: any[];
    stats: any[];
    hasActiveRequest: boolean;
    idStatus: string | null;
}

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

export default function MobileDashboard({
    firstName,
    loanAccount,
    recentRequests,
    stats,
    hasActiveRequest,
    idStatus
}: MobileDashboardProps) {
    const router = useRouter();
    const t = useTranslations('CreditRequest.Project.labels');

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 pb-20"
        >
            {/* Header Mobile */}
            <header className="flex flex-col gap-1 px-1">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Bonjour, <span className="text-ely-blue">{firstName || "Utilisateur"}</span> 👋
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aperçu de vos activités</p>
            </header>

            {/* Notifications / Alerts Stack */}
            <div className="space-y-4">
                {recentRequests.find(r => r.status === 'rejected') && (
                    <motion.div variants={item} className="bg-red-50 border border-red-100 p-5 rounded-[2rem] flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 text-sm">Financement Refusé</h3>
                            <p className="text-[10px] text-red-700/70 mt-1 leading-relaxed">Contactez le support pour plus de détails.</p>
                        </div>
                    </motion.div>
                )}

                {/* Identity Rejection */}
                {idStatus === 'rejected' && (
                    <motion.div variants={item} className="bg-red-50 border border-red-100 p-5 rounded-[2rem] flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 text-sm">Identité Refusée</h3>
                            <button onClick={() => router.push("/dashboard/support")} className="text-[10px] font-bold text-red-600 mt-2 flex items-center gap-1">
                                Contacter le support <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Partial Identity Rejection */}
                {idStatus === 'partial_rejection' && (
                    <motion.div variants={item} className="bg-orange-50 border border-orange-100 p-5 rounded-[2rem] flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-orange-900 text-sm">Dossier Incomplet</h3>
                            <p className="text-[10px] text-orange-700/70 mt-1 leading-relaxed">Certains documents sont à corriger.</p>
                            <button onClick={() => router.push("/dashboard/profile/verification")} className="text-[10px] font-bold text-orange-600 mt-2 flex items-center gap-1">
                                Voir mes documents <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Pending Payment or Approved Request Alert */}
                {(() => {
                    // Trouver la demande approuvée la plus stable pour l'affichage
                    const approvedReq = recentRequests.find(r => r.status === 'approved');
                    if (!approvedReq) return null;

                    const isVerified = approvedReq.paymentVerificationStatus === 'verified' || approvedReq.paymentVerificationStatus === 'on_review';
                    const needsPayment = approvedReq.requiresPayment && approvedReq.paymentStatus === 'pending';

                    // Cas 1: Crédit accordé mais identité non vérifiée (Priorité)
                    if (!isVerified) {
                        return (
                            <motion.div
                                variants={item}
                                onClick={() => router.push("/dashboard/verification")}
                                className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all"
                            >
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-sm">Crédit Accordé 🚀</h3>
                                    </div>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                                        Félicitations ! Votre financement est validé. Confirmez votre identité pour l'activer.
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full flex items-center gap-2 w-fit">
                                            Vérification requise <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                            </motion.div>
                        );
                    }

                    // Cas 2: Identité vérifiée mais dépôt en attente
                    if (needsPayment && approvedReq.paymentType !== 'none') {
                        return (
                            <motion.div
                                variants={item}
                                onClick={() => router.push("/dashboard/billing")}
                                className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all"
                            >
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                            <Euro className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-sm">Dépôt Requis</h3>
                                    </div>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                                        Identité confirmée. Le dépôt d'authentification est nécessaire pour finaliser votre dossier.
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full flex items-center gap-2 w-fit">
                                            Effectuer le dépôt <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <Euro className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                            </motion.div>
                        );
                    }

                    return null;
                })()}
            </div>


            {/* Quick Actions Grid (Mobile) */}
            <motion.div variants={item} className="grid grid-cols-4 gap-2">
                {[
                    { label: "Docs", icon: FileText, color: "orange", route: "/dashboard/documents" },
                    { label: "Virement", icon: ArrowUpRight, color: "emerald", route: "/dashboard/accounts/transfer" },
                    { label: "Echéancier", icon: Clock, color: "blue", route: "/dashboard/accounts/schedule" },
                    { label: "RIB", icon: Landmark, color: "purple", route: "/dashboard/accounts" },
                ].map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => router.push(action.route)}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center shadow-sm`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{action.label}</span>
                    </button>
                ))}
            </motion.div>

            {/* Stats Horizontal Scroll or Tight Grid */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.id}
                        variants={item}
                        className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Requests List */}
            <motion.div variants={item} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Demandes Récentes</h3>
                    <button onClick={() => router.push("/dashboard/requests")} className="text-[10px] font-bold text-ely-blue">Voir tout</button>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentRequests.length > 0 ? (
                        recentRequests.map((req) => (
                            <div key={req.id} onClick={() => router.push("/dashboard/requests/" + req.id)} className="p-5 flex items-center justify-between active:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">
                                            {req.projectType ? t(req.projectType.toLowerCase()) : "Projet Personnel"}
                                        </p>
                                        <p className="text-[9px] text-gray-400 font-medium">#{req.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}</p>
                                    <div className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1",
                                        req.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-ely-blue/5 text-ely-blue"
                                    )}>
                                        {req.status === 'approved' ? 'Accordé' : 'En étude'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aucune demande</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Help Card */}
            <motion.div variants={item} className="bg-gradient-to-br from-ely-blue to-blue-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-ely-mint" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Une question ?</h3>
                        <p className="text-xs text-white/70 mt-2 leading-relaxed">Nos experts vous répondent sous 24h ouvrées par téléphone ou chat.</p>
                    </div>
                    <button className="w-full py-4 bg-white text-ely-blue rounded-2xl font-bold text-xs">Contacter mon conseiller</button>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-ely-mint/10 rounded-full blur-2xl" />
            </motion.div>

        </motion.div>
    );
}
