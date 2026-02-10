"use client";

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
    TrendingUp,
    Send,
    Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

interface DesktopAccountsProps {
    loanAccount: any;
    extraTransactions: any[];
    setNewIBAN: (val: string) => void;
    setNewBank: (val: string) => void;
    setNewBIC: (val: string) => void;
    setNewEmail: (val: string) => void;
    setIsEditRIBModalOpen: (val: boolean) => void;
}

export default function DesktopAccounts({
    loanAccount,
    extraTransactions,
    setNewIBAN,
    setNewBank,
    setNewBIC,
    setNewEmail,
    setIsEditRIBModalOpen
}: DesktopAccountsProps) {
    const router = useRouter();

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
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Main Balance Card */}
            <motion.div
                variants={item}
                className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#003d82] to-[#001d3d] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-ely-blue/20 text-white"
            >
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10">
                    <Landmark className="w-24 h-24 md:w-32 md:h-32" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                    <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/60">Solde Total Crédit</span>
                        {loanAccount?.isDeferred && (
                            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                                Période de Différé
                            </span>
                        )}
                        {!loanAccount?.isDeferred && <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-ely-mint" />}
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
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
                            <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">
                                {loanAccount?.isDeferred ? "Première Échéance" : "Prochaine Échéance"}
                            </p>
                            <p className="text-lg font-bold text-ely-mint">{loanAccount?.nextPaymentDate || "-- / -- / --"}</p>
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
                    onClick={() => router.push("/dashboard/accounts/transfer")}
                    className="w-full bg-ely-mint text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-ely-mint/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                >
                    Effectuer un virement
                    <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={() => router.push("/dashboard/accounts/schedule")}
                    className="w-full bg-ely-blue text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                >
                    Consulter l'échéancier
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>

            {/* Combined Bottom Grid: Operations & RIB Side by Side */}
            <motion.div variants={item} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Operations Section */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <History className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="font-extrabold text-gray-900 uppercase tracking-widest text-xs">Dernières Opérations</h3>
                        </div>
                    </div>

                    <div className="flex-1">
                        {loanAccount ? (
                            <div className="divide-y divide-gray-50">
                                {extraTransactions.slice(0, 4).map(tx => (
                                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-2xl",
                                                tx.status === 'approved' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Virement vers {tx.bankName}</p>
                                                <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                    Virement {
                                                        tx.status === 'approved' ? 'débité' :
                                                            tx.status === 'rejected' ? 'refusé' :
                                                                tx.status === 'review' ? 'en examen' :
                                                                    tx.status === 'advanced' ? 'contrôle avancé' : 'en cours'
                                                    } le {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "font-black",
                                                tx.status === 'rejected' ? "text-gray-300 line-through" : "text-red-600"
                                            )}>
                                                -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                            </p>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">
                                                {tx.status === 'approved' ? 'Terminé' :
                                                    tx.status === 'rejected' ? 'Refusé' : 'En attente'}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                            <ArrowDownLeft className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Versement Prêt AGM INVEST</p>
                                            <p className="text-[10px] text-gray-400 font-medium font-mono lowercase tracking-tighter">Virement reçu le {loanAccount.startDateFormatted}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-green-600">
                                            +{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount.totalAmount)}
                                        </p>
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Terminé</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center space-y-4">
                                <Wallet className="w-10 h-10 text-gray-100 mx-auto" />
                                <p className="text-xs text-gray-400 font-medium">Aucun mouvement</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIB Section */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Landmark className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="font-extrabold text-gray-900 uppercase tracking-widest text-xs">Coordonnées (RIB)</h3>
                        </div>
                        <button
                            onClick={() => {
                                setNewIBAN(loanAccount?.iban || "");
                                setNewBank(loanAccount?.bankName || "");
                                setNewBIC(loanAccount?.bic || "");
                                setNewEmail(loanAccount?.ribEmail || loanAccount?.email || "");
                                setIsEditRIBModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-ely-blue/5 text-ely-blue rounded-xl hover:bg-ely-blue hover:text-white transition-all font-black text-[9px] uppercase tracking-widest border border-ely-blue/10 shadow-sm"
                        >
                            <Edit3 className="w-3 h-3" />
                            <span>Modifier</span>
                        </button>
                    </div>

                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banque</span>
                                <span className="font-bold text-gray-900">{loanAccount?.bankName || "AGM INVEST"}</span>
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifiant IBAN</span>
                                <div className="text-right">
                                    <p className="font-mono text-xs font-bold text-gray-900 tracking-tighter">
                                        {loanAccount?.iban || "Non défini"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifiant BIC / SWIFT</span>
                                <span className="font-mono text-xs font-bold text-gray-900 uppercase">{loanAccount?.bic || "AGMINV75XXX"}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email pour les virements</span>
                                <span className="font-bold text-gray-900 text-sm lowercase">{loanAccount?.ribEmail || loanAccount?.email || "non renseigné"}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0 animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                Compte vérifié actif pour les fonds et prélèvements mensuels.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
