import React from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Download,
    Printer,
    FileText,
    TrendingUp,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    Activity,
    ShieldCheck,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface ScheduleItem {
    month: number;
    paymentDate: string;
    paymentAmount: number;
    interest: number;
    principal: number;
    remainingBalance: number;
    status: 'paid' | 'pending' | 'upcoming' | 'overdue';
}

interface DesktopScheduleProps {
    schedule: ScheduleItem[];
    isLoading: boolean;
    loanAccount: any;
    formatCurrency: (val: number) => string;
    handleDownloadPDF: () => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
    totalPages: number;
    paginatedSchedule: ScheduleItem[];
}

export default function DesktopSchedule({
    schedule,
    isLoading,
    loanAccount,
    formatCurrency,
    handleDownloadPDF,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedSchedule
}: DesktopScheduleProps) {
    const router = useRouter();
    const t = useTranslations('Dashboard.Schedule');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-12 w-12 border-4 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!loanAccount) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">{t('noActiveLoan.title')}</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">{t('noActiveLoan.message')}</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/accounts')}
                    className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    {t('noActiveLoan.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Minimal Header */}
                <header className="flex items-center justify-between gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => router.push('/dashboard/accounts')}
                            className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-ely-blue transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('back')}
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {t('title')} <span className="inline-block text-ely-blue font-medium text-lg ml-2 opacity-50 tracking-normal">{t('subtitle')}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-ely-blue text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95 group"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            <span>{t('exportPDF')}</span>
                        </button>
                    </div>
                </header>

                {/* Stat Cards - Elegant Edition */}
                <div className="grid grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl shadow-sm relative overflow-hidden group bg-gradient-to-br from-ely-blue to-blue-800 text-white border border-white/10"
                    >
                        <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:scale-110 transition-transform duration-500">
                            <CreditCard className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/10 text-white rounded-xl backdrop-blur-md">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('stats.monthlyPayment')}</p>
                        </div>
                        <p className="text-3xl font-bold tracking-tight text-white mb-1">
                            {schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount) : "--"}
                        </p>
                        {schedule.length > 0 && loanAccount && (
                            <p className="text-[10px] text-white/50 font-medium">
                                {t('stats.insurance', { amount: formatCurrency((loanAccount.totalAmount * 0.03) / schedule.length) })}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 text-ely-mint/5 group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('stats.totalInterest')}</p>
                        </div>
                        <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                            {formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0))}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-3xl shadow-sm relative overflow-hidden group bg-gradient-to-br from-ely-blue to-blue-800 text-white border border-white/10"
                    >
                        <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:scale-110 transition-transform duration-500">
                            <FileText className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/10 text-white rounded-xl backdrop-blur-md">
                                <FileText className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('stats.loanDuration')}</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold tracking-tight text-white">
                                {schedule.length}
                            </p>
                            <span className="text-sm font-semibold text-white/60">{t('stats.months')}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">{t('table.number')}</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">{t('table.date')}</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('table.amount')}</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('table.principal')}</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('table.balance')}</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">{t('table.status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedSchedule.map((row) => (
                                    <tr key={row.month} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="py-5 px-8 font-medium text-slate-400 text-sm">#{String(row.month).padStart(2, '0')}</td>
                                        <td className="py-5 px-8 font-semibold text-slate-600 text-sm">{row.paymentDate}</td>
                                        <td className="py-5 px-8 font-bold text-slate-900 text-right text-sm">{formatCurrency(row.paymentAmount)}</td>
                                        <td className="py-5 px-8 font-medium text-slate-400 text-right text-sm">{formatCurrency(row.principal)}</td>
                                        <td className="py-5 px-8 font-bold text-emerald-600 text-right text-sm">{formatCurrency(row.remainingBalance)}</td>
                                        <td className="py-5 px-8 text-center">
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full inline-flex items-center gap-2 border text-[11px] font-bold uppercase tracking-wide",
                                                row.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    row.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                                                        row.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                            )}>
                                                {row.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                    row.status === 'overdue' ? <AlertCircle className="w-3.5 h-3.5 animate-pulse" /> :
                                                        row.status === 'pending' ? <Clock className="w-3.5 h-3.5 animate-pulse" /> :
                                                            <Activity className="w-3.5 h-3.5 opacity-40" />}
                                                <span>
                                                    {row.status === 'paid' ? t('status.paid') : row.status === 'overdue' ? t('status.overdue') : row.status === 'pending' ? t('status.pending') : t('status.upcoming')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between gap-6 rounded-b-[2rem]">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                            {t('pagination.page', { current: currentPage, total: totalPages })}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-ely-blue hover:border-ely-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="text-slate-300 font-bold px-1">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-xl font-bold text-xs transition-all border ${currentPage === page
                                                    ? 'bg-ely-blue text-white border-ely-blue shadow-md shadow-blue-500/20'
                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-ely-blue hover:border-ely-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Minimalist Footer Badge */}
            <div className="flex items-center justify-center gap-3 pt-4 pb-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                <ShieldCheck className="w-4 h-4 text-ely-blue" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                    {t('footer.certified')}
                </p>
            </div>
        </div>
    );
}
