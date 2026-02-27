import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Landmark,
    Info,
    X,
    CheckCircle2,
    Wallet,
    Clock,
    AlertCircle,
    Search,
    History,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

interface MobileTransferProps {
    amount: string;
    setAmount: (val: string) => void;
    handleTransfer: () => void;
    isProcessing: boolean;
    showSuccess: boolean;
    setShowSuccess: (val: boolean) => void;
    transfers: any[];
    isBlocked: boolean;
    blockingReason: "verification" | "deposit" | null;
    error: string | null;
    loanAccount: any;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
}

export default function MobileTransfer({
    amount,
    setAmount,
    handleTransfer,
    isProcessing,
    showSuccess,
    setShowSuccess,
    transfers,
    isBlocked,
    blockingReason,
    error,
    loanAccount,
    currentPage,
    setCurrentPage,
    itemsPerPage
}: MobileTransferProps) {
    const router = useRouter();
    const t = useTranslations('Dashboard.Transfers');
    const tAccounts = useTranslations('Dashboard.Accounts');
    const locale = useLocale();

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved':
                return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: t('status.approved'), icon: CheckCircle2 };
            case 'rejected':
                return { bg: "bg-red-50 text-red-600 border-red-100", label: t('status.rejected'), icon: X };
            case 'review':
                return { bg: "bg-blue-50 text-blue-600 border-blue-100", label: t('status.review'), icon: Search };
            case 'advanced':
                return { bg: "bg-purple-50 text-purple-600 border-purple-100", label: t('status.advanced'), icon: ShieldCheck };
            default:
                return { bg: "bg-amber-50 text-amber-600 border-amber-100", label: t('status.pending'), icon: Clock };
        }
    };

    return (
        <div className="w-full space-y-6 pb-24 overflow-x-hidden">
            {/* Header Mobile */}
            <header className="flex items-center gap-4 px-4 sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
                <button
                    onClick={() => router.push('/dashboard/accounts')}
                    className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">{t('title')}</h1>
                    <p className="text-xs text-gray-500 font-medium pt-1">{t('subtitle')}</p>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-4 bg-white rounded-[2rem] p-8 shadow-xl text-center space-y-6 border border-emerald-100"
                    >
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">{t('success.title')}</h2>
                            <p className="text-sm text-gray-500 leading-relaxed px-2">
                                {t.rich('success.message', {
                                    status: (chunks) => <span className="text-amber-600 font-bold">{t('success.pending')}</span>
                                })}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider"
                        >
                            {t('success.newTransfer')}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 space-y-6"
                    >
                        {/* Main Interaction Card */}
                        <div className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                            {/* Input Amount - Simplified */}
                            <div className="relative z-10 flex flex-col items-center justify-center space-y-2 py-4">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-ely-mint flex items-center gap-2">
                                        <Wallet className="w-3 h-3" />
                                        {tAccounts('card.totalBalance')} : {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(loanAccount?.remainingAmount || 0)}
                                    </p>
                                </div>
                                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">{t('form.amountLabel')}</label>
                                <div className="flex items-end justify-center gap-1 w-full">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        className="bg-transparent text-center text-5xl font-black text-white w-full outline-none placeholder:text-white/10 p-0 m-0 leading-none min-w-0"
                                        style={{ maxWidth: '200px' }}
                                    />
                                    <span className="text-3xl font-bold text-white/30 mb-1">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).formatToParts(0).find(p => p.type === 'currency')?.value}</span>
                                </div>
                            </div>

                            {/* Destination - Simplified Row */}
                            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg text-white/60">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm truncate">{loanAccount?.bankName || t('form.referenceAccount')}</p>
                                    <p className="font-mono text-[10px] text-white/40 truncate">
                                        {loanAccount?.iban ? `${loanAccount.iban.slice(0, 4)} •••• ${loanAccount.iban.slice(-4)}` : "•••• ••••"}
                                    </p>
                                </div>
                                <div className="text-[9px] bg-ely-mint/20 text-ely-mint px-2.5 py-1 rounded-md font-black border border-ely-mint/20 uppercase tracking-tighter">
                                    {t('form.verifiedAccount')}
                                </div>
                            </div>
                        </div>

                        {/* Security Alert if Blocked */}
                        {isBlocked && (
                            <div className="bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 flex gap-4 shadow-xl relative overflow-hidden group">
                                <div className="p-3 bg-white/5 rounded-xl shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-ely-mint" />
                                </div>
                                <div className="relative z-10 space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">
                                        {blockingReason === 'verification' ? t('blocking.verification.title') : t('blocking.deposit.title')}
                                    </p>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                        {blockingReason === 'verification'
                                            ? t('blocking.verification.short')
                                            : t('blocking.deposit.short')
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[11px] font-bold flex items-center gap-3 border border-red-500/20"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Button */}
                        <button
                            disabled={isProcessing || !amount || parseFloat(amount) <= 0 || isBlocked}
                            onClick={handleTransfer}
                            className="w-full bg-ely-mint text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-ely-mint/20 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isBlocked ? t('form.blocked') : t('form.confirm')}
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Security Control Card (Mobile) */}
                        <div className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2rem] p-7 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-24 h-24" />
                            </div>

                            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Info className="w-4 h-4 text-ely-mint" />
                                </div>
                                {t('security.title')}
                            </h4>
                            <p className="text-[11px] text-white/50 leading-relaxed mb-6 font-medium relative z-10">
                                {t('security.message')}
                            </p>
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] font-black text-white/30 uppercase mb-1 tracking-wider">{t('security.estimatedDelay')}</p>
                                    <p className="text-sm font-bold text-white">{t('security.delay')}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] font-black text-white/30 uppercase mb-1 tracking-wider">{t('security.protection')}</p>
                                    <p className="text-sm font-bold text-white">{t('security.aes')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent History Mobile (CARDS RICHES) */}
                        <div className="pt-4 pb-10">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('history.full')}</h3>
                                <div className="p-2 bg-ely-blue/5 rounded-lg">
                                    <History className="w-4 h-4 text-ely-blue" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {transfers.length > 0 ? (
                                    transfers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transfer) => {
                                        const styles = getStatusStyles(transfer.status);
                                        return (
                                            <div key={transfer.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 active:scale-[0.98] transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("p-2.5 rounded-xl border", styles.bg)}>
                                                            <styles.icon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-sm">
                                                                {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(transfer.amount || 0)}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                                {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : t('history.table.justNow')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border", styles.bg)}>
                                                        {styles.label}
                                                    </span>
                                                </div>

                                                <div className="h-px bg-gray-50 mx-2" />

                                                <div className="grid grid-cols-2 gap-4 px-2">
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">{t('history.table.recipient')}</p>
                                                        <p className="text-[11px] font-bold text-gray-600 truncate">{transfer.bankName || t('form.referenceAccount')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">{t('history.table.iban')}</p>
                                                        <p className="text-[11px] font-mono text-gray-400">
                                                            {transfer.iban?.slice(0, 4)} •••• {transfer.iban?.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-20 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                            <Search className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('history.none')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Pagination */}
                            {transfers.length > itemsPerPage && (
                                <div className="mt-8 flex items-center justify-between px-2 bg-white/50 p-4 rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 active:scale-90 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t('history.pagination.page')}</p>
                                        <p className="text-sm font-black text-gray-900">{currentPage} / {Math.ceil(transfers.length / itemsPerPage)}</p>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage * itemsPerPage >= transfers.length}
                                        className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 active:scale-90 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
