import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Download,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Activity,
    CreditCard,
    FileText,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

interface ScheduleItem {
    month: number;
    paymentDate: string;
    paymentAmount: number;
    interest: number;
    principal: number;
    remainingBalance: number;
    status: 'paid' | 'pending' | 'upcoming' | 'overdue';
}

interface MobileScheduleProps {
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

export default function MobileSchedule({
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
}: MobileScheduleProps) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!loanAccount) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Aucun crédit actif</h2>
                    <p className="text-sm text-gray-500">Aucun échéancier disponible.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/accounts')}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm"
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24 space-y-6">
            {/* Mobile Header */}
            <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4 px-4 -mx-4 border-b border-slate-100/50">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push('/dashboard/accounts')}
                        className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm active:scale-95 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="text-lg font-black text-slate-900">Mon Échéancier</h1>
                    <button
                        onClick={handleDownloadPDF}
                        className="p-2 bg-ely-blue text-white rounded-lg shadow-md shadow-ely-blue/20 active:scale-95 transition-all"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                {/* Stats Cards - Mobile Stack */}
                <div className="space-y-3">
                    {/* Mensualité */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl shadow-sm relative overflow-hidden group bg-gradient-to-br from-ely-blue to-blue-800 text-white border border-white/10"
                    >
                        <div className="absolute top-0 right-0 p-4 text-white/5">
                            <CreditCard className="w-12 h-12" />
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/10 text-white rounded-lg backdrop-blur-md">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Mensualité moyenne</p>
                        </div>
                        <p className="text-2xl font-bold tracking-tight text-white mb-1">
                            {schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount) : "--"}
                        </p>
                        {schedule.length > 0 && loanAccount && (
                            <p className="text-[10px] text-white/50 font-medium">
                                Dont {formatCurrency((loanAccount.totalAmount * 0.03) / schedule.length)} d'assurance (3%)
                            </p>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Intérêts */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 text-ely-mint/5">
                                <TrendingUp className="w-10 h-10" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Intérêts</p>
                            <p className="text-lg font-bold text-emerald-600 tracking-tight">
                                {formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0))}
                            </p>
                        </motion.div>

                        {/* Durée */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-2xl shadow-sm relative overflow-hidden bg-gradient-to-br from-ely-blue to-blue-800 text-white border border-white/10"
                        >
                            <div className="absolute top-0 right-0 p-2 text-white/5">
                                <FileText className="w-10 h-10" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/10 text-white rounded-lg backdrop-blur-md">
                                    <FileText className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Durée</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-lg font-bold tracking-tight text-white">
                                    {schedule.length}
                                </p>
                                <span className="text-xs font-semibold text-white/60">mois</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* List of Installments */}
            <div className="space-y-3 px-1">
                {paginatedSchedule.map((row) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={row.month}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-3xl -mr-2 -mt-2" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black text-slate-300">#{String(row.month).padStart(2, '0')}</span>
                                <div className={cn(
                                    "px-2.5 py-1 rounded-full flex items-center gap-1.5 border text-[10px] font-bold uppercase tracking-wide",
                                    row.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        row.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-100' :
                                            row.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                    {row.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> :
                                        row.status === 'overdue' ? <AlertCircle className="w-3 h-3" /> :
                                            row.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                null}
                                    <span>
                                        {row.status === 'paid' ? 'Payé' : row.status === 'overdue' ? 'Retard' : row.status === 'pending' ? 'En cours' : 'À venir'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                                        <p className="text-sm font-bold text-slate-900">{row.paymentDate}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Montant</p>
                                    <p className="text-sm font-black text-slate-900">{formatCurrency(row.paymentAmount)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] text-slate-400 mb-0.5">Solde restant</p>
                                    <p className="text-xs font-bold text-emerald-600">{formatCurrency(row.remainingBalance)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 mb-0.5">Intérêts</p>
                                    <p className="text-xs font-bold text-slate-600">{formatCurrency(row.interest)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 px-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>

                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        Page {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            )}
        </div>
    );
}
