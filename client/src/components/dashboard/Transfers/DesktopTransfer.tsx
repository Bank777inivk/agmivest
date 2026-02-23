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

interface DesktopTransferProps {
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

export default function DesktopTransfer({
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
}: DesktopTransferProps) {
    const router = useRouter();
    const t = useTranslations('Dashboard.Transfers');
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
        <div className="max-w-5xl mx-auto space-y-12 pb-20 w-full">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard/accounts')}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all group"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-ely-blue transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('title')}</h1>
                        <p className="text-base text-gray-500 font-medium tracking-tight">{t('subtitle')}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left side: Transfer Form */}
                <div className="lg:col-span-7 space-y-10">
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/5 border-2 border-emerald-500/20 text-center space-y-6 relative overflow-hidden"
                            >
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{t('success.title')}</h2>
                                    <p className="text-gray-500 font-medium px-8 leading-relaxed">
                                        {t.rich('success.message', {
                                            status: (chunks) => <span className="text-amber-600 font-bold uppercase tracking-widest text-xs px-2 py-1 bg-amber-50 rounded-lg ml-1">{t('success.pending')}</span>
                                        })}
                                    </p>
                                </div>
                                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                                    >
                                        {t('success.newTransfer')}
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard/accounts")}
                                        className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                                    >
                                        {t('success.myAccounts')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden transition-all"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <Send className="w-32 h-32 text-white" />
                                </div>

                                <div className="relative z-10 space-y-10">
                                    {/* Amount Input */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{t('form.amountLabel')}</label>
                                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 group focus-within:border-ely-mint/30 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-white/10 rounded-2xl shadow-sm text-ely-mint shrink-0">
                                                    <Wallet className="w-8 h-8" />
                                                </div>
                                                <div className="w-full flex-1 flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="bg-transparent text-5xl font-black text-white w-full outline-none placeholder:text-white/10"
                                                    />
                                                    <span className="text-4xl font-black text-white/20">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).formatToParts(0).find(p => p.type === 'currency')?.value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Destination Account Card */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{t('form.destinationLabel')}</label>
                                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-white/10 relative group transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="p-4 bg-white/10 rounded-2xl text-white/40">
                                                        <Landmark className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{loanAccount?.bankName || t('form.referenceAccount')}</p>
                                                        <p className="font-mono text-sm text-white/40 mt-1">
                                                            {loanAccount?.iban?.slice(0, 4)} •••• •••• •••• •••• {loanAccount?.iban?.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 bg-ely-mint/20 text-ely-mint text-[10px] font-black rounded-full uppercase tracking-widest border border-ely-mint/20">{t('form.verifiedAccount')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Note / Blocked Alert */}
                                    {isBlocked ? (
                                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 flex items-start gap-6 shadow-xl relative overflow-hidden group">
                                            <div className="p-4 bg-white/10 rounded-2xl shrink-0">
                                                <ShieldCheck className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-sm text-white font-black mb-1 uppercase tracking-widest">
                                                    {blockingReason === 'verification' ? t('blocking.verification.title') : t('blocking.deposit.title')}
                                                </p>
                                                <p className="text-xs text-white/70 font-medium leading-relaxed">
                                                    {blockingReason === 'verification'
                                                        ? t('blocking.verification.long')
                                                        : t('blocking.deposit.long')
                                                    }
                                                </p>
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                                        </div>
                                    ) : (
                                        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20 flex items-start gap-4">
                                            <Info className="w-5 h-5 text-amber-300 shrink-0 mt-1" />
                                            <p className="text-xs text-amber-100/60 font-medium leading-relaxed">
                                                {t('form.delayNote')}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between font-bold text-white border-t border-white/10 pt-4 mt-6">
                                        <span className="opacity-40 uppercase text-[10px] tracking-widest">{t('form.total')}</span>
                                        <span className="text-2xl font-black">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount ? parseFloat(amount) : 0)}</span>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-red-500/20 text-white p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-500/20 mb-4"
                                            >
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Button */}
                                    <button
                                        disabled={isProcessing || !amount || parseFloat(amount) <= 0 || isBlocked}
                                        onClick={handleTransfer}
                                        className="w-full bg-ely-mint text-white p-8 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-ely-mint/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-4 group"
                                    >
                                        {isProcessing ? (
                                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {isBlocked
                                                    ? (blockingReason === 'verification' ? t('form.required.verification') : t('form.required.finalization'))
                                                    : t('form.confirm')
                                                }
                                                <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right side: Security & History Summary */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ely-mint/10 blur-3xl rounded-full" />
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-3">
                            <Info className="w-5 h-5 text-ely-mint" />
                            {t('security.title')}
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            {t('security.message')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase mb-1">{t('security.estimatedDelay')}</p>
                                <p className="text-sm font-bold">{t('security.delay')}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase mb-1">{t('security.protection')}</p>
                                <p className="text-sm font-bold">{t('security.aes')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg">
                            <History className="w-6 h-6 text-ely-blue" />
                            {t('history.title')}
                        </h4>
                        <div className="space-y-6">
                            {transfers.slice(0, 3).map((transfer) => {
                                const styles = getStatusStyles(transfer.status);
                                return (
                                    <div key={transfer.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-3 rounded-xl border", styles.bg)}>
                                                <styles.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(transfer.amount || 0)}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : t('history.table.justNow')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles.bg, styles.bg !== "bg-gray-50" && "text-opacity-80")}>
                                            {styles.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {transfers.length === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <Search className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-sm">{t('history.none')}</p>
                                </div>
                            )}
                        </div>
                        {transfers.length > 3 && (
                            <button className="w-full mt-6 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all text-[11px] uppercase tracking-widest">
                                {t('history.viewAll')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Transaction History Table */}
            {transfers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">{t('history.full')}</h3>
                            <p className="text-gray-500 font-medium italic">{t('history.subtitle')}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">
                                    <th className="pb-6 px-4">{t('history.table.date')}</th>
                                    <th className="pb-6 px-4">{t('history.table.recipient')}</th>
                                    <th className="pb-6 px-4">{t('history.table.iban')}</th>
                                    <th className="pb-6 px-4">{t('history.table.amount')}</th>
                                    <th className="pb-6 px-4">{t('history.table.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transfer) => {
                                    const styles = getStatusStyles(transfer.status);
                                    return (
                                        <tr key={transfer.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/50">
                                            <td className="py-6 px-4">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : t('history.table.justNow')}
                                                </p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-bold text-gray-900 text-sm">{transfer.bankName}</p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-mono text-[11px] text-gray-400">
                                                    {transfer.iban?.slice(0, 4)} •••• {transfer.iban?.slice(-4)}
                                                </p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-black text-gray-900 text-sm">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(transfer.amount || 0)}</p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest", styles.bg)}>
                                                    <styles.icon className="w-3 h-3" />
                                                    {styles.label}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {transfers.length > itemsPerPage && (
                        <div className="mt-10 flex items-center justify-between border-t border-gray-50 pt-8">
                            <p className="text-xs text-gray-400 font-medium">
                                {t('history.pagination.display', {
                                    start: (currentPage - 1) * itemsPerPage + 1,
                                    end: Math.min(currentPage * itemsPerPage, transfers.length),
                                    total: transfers.length
                                })}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage * itemsPerPage >= transfers.length}
                                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
