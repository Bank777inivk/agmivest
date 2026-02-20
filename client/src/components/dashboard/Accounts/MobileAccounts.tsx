"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Wallet,
    Calendar,
    ChevronRight,
    Landmark,
    TrendingUp,
    Send,
    Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface MobileAccountsProps {
    loanAccount: any;
    extraTransactions: any[];
    setNewIBAN: (val: string) => void;
    setNewBank: (val: string) => void;
    setNewBIC: (val: string) => void;
    setNewEmail: (val: string) => void;
    setIsEditRIBModalOpen: (val: boolean) => void;
}

export default function MobileAccounts({
    loanAccount,
    extraTransactions,
    setNewIBAN,
    setNewBank,
    setNewBIC,
    setNewEmail,
    setIsEditRIBModalOpen
}: MobileAccountsProps) {
    const router = useRouter();
    const t = useTranslations('Dashboard.Accounts');

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
            className="space-y-6 pb-20"
        >
            {/* Main Balance Card - Mobile Optimized (Matches Design) */}
            <motion.div
                variants={item}
                className="relative overflow-hidden bg-gradient-to-br from-[#003d82] to-[#001d3d] p-8 rounded-[2.5rem] shadow-2xl shadow-ely-blue/20 text-white"
            >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Landmark className="w-24 h-24" />
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">{t('card.totalBalance')}</span>
                        <div className="flex items-center gap-2">
                            {loanAccount?.isDeferred && (
                                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[8px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                                    {t('card.deferredPeriod')}
                                </span>
                            )}
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-ely-mint" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black tracking-tight">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.remainingAmount || 0)}
                        </h2>
                        <p className="text-white/40 text-[10px] mt-1 font-bold uppercase tracking-widest">{t('card.capitalRemaining')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-[8px] uppercase font-black tracking-widest text-white/40 mb-1">{t('card.initialAmount')}</p>
                            <p className="text-sm font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.totalAmount || 0)}</p>
                        </div>
                        <div>
                            <p className="text-[8px] uppercase font-black tracking-widest text-white/40 mb-1">
                                {loanAccount?.isDeferred ? t('card.firstInstallment') : t('card.nextInstallment')}
                            </p>
                            <p className="text-sm font-bold text-ely-mint">{loanAccount?.nextPaymentDate || "-- / -- / --"}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
                <motion.div variants={item} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-ely-mint/10 text-ely-mint rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('stats.rate')}</p>
                        <p className="text-xl font-black text-gray-900">{loanAccount?.rate || "0.00"}%</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-ely-blue/10 text-ely-blue rounded-2xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('stats.remainingDuration')}</p>
                        <p className="text-xl font-black text-gray-900">{loanAccount?.remainingMonths || 0} {t('stats.months')}</p>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={item} className="space-y-3">
                <button
                    onClick={() => router.push("/dashboard/accounts/transfer")}
                    className="w-full bg-ely-mint text-white p-5 rounded-2xl font-bold flex items-center justify-between group shadow-lg shadow-ely-mint/20"
                >
                    {t('actions.transfer')}
                    <Send className="w-5 h-5" />
                </button>

                <button
                    onClick={() => router.push("/dashboard/accounts/schedule")}
                    className="w-full bg-ely-blue text-white p-5 rounded-2xl font-bold flex items-center justify-between group shadow-lg shadow-ely-blue/20"
                >
                    {t('actions.schedule')}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Operations Section */}
            <motion.div variants={item} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <History className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">{t('operations.title')}</h3>
                </div>

                <div className="divide-y divide-gray-50">
                    {extraTransactions.length > 0 ? (
                        extraTransactions.slice(0, 4).map(tx => (
                            <div key={tx.id} className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2.5 rounded-xl",
                                        tx.status === 'approved' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-xs">{t('operations.transferTo', { bank: tx.bankName })}</p>
                                        <p className="text-[9px] text-gray-400 font-medium">
                                            {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Date...'}
                                        </p>
                                    </div>
                                </div>
                                <p className={cn(
                                    "font-black text-sm",
                                    tx.status === 'rejected' ? "text-gray-300 line-through" : "text-red-600"
                                )}>
                                    -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <Wallet className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('operations.empty')}</p>
                        </div>
                    )}

                    {/* Initial Loan Disbursement */}
                    {loanAccount && (
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                                    <ArrowDownLeft className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">{t('operations.loanDisbursement')}</p>
                                    <p className="text-[9px] text-gray-400 font-medium">{t('operations.receivedOn', { date: loanAccount.startDateFormatted })}</p>
                                </div>
                            </div>
                            <p className="font-black text-green-600 text-sm">
                                +{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount.totalAmount)}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* RIB Section */}
            <motion.div variants={item} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Landmark className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">{t('rib.title')}</h3>
                    </div>
                    <button
                        onClick={() => {
                            setNewIBAN(loanAccount?.iban || "");
                            setNewBank(loanAccount?.bankName || "");
                            setNewBIC(loanAccount?.bic || "");
                            setNewEmail(loanAccount?.ribEmail || loanAccount?.email || "");
                            setIsEditRIBModalOpen(true);
                        }}
                        className="p-2 bg-ely-blue/5 text-ely-blue rounded-lg border border-ely-blue/10"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">{t('rib.bank')}</span>
                        <span className="text-xs font-bold text-gray-900 text-right">{loanAccount?.bankName || "AGM INVEST"}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0 mt-1">{t('rib.iban')}</span>
                        <span className="text-[10px] font-mono font-bold text-gray-900 tracking-tighter text-right break-all">
                            {loanAccount?.iban || t('rib.undefined')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">{t('rib.bic')}</span>
                        <span className="text-xs font-mono font-bold text-gray-900 uppercase text-right">{loanAccount?.bic || "---"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-2 border-t border-gray-50">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest shrink-0">{t('rib.email')}</span>
                        <span className="text-[10px] font-bold text-gray-900 lowercase text-right truncate">
                            {loanAccount?.ribEmail || loanAccount?.email || t('rib.notProvided')}
                        </span>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0 animate-pulse" />
                        <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                            {t('rib.verifiedFooter')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
