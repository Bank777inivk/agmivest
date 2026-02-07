"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
    ShieldCheck
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface ScheduleItem {
    month: number;
    paymentDate: string;
    paymentAmount: number;
    interest: number;
    principal: number;
    remainingBalance: number;
    status: 'paid' | 'pending' | 'upcoming';
}

export default function SchedulePage() {
    const t = useTranslations('Dashboard.Accounts');
    const router = useRouter();
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

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
                        const data = querySnapshot.docs[0].data();
                        setLoanAccount({ id: querySnapshot.docs[0].id, ...data });
                        generateSchedule(data);
                    }
                } catch (error) {
                    console.error("Error fetching account:", error);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const generateSchedule = (account: any) => {
        const amount = account.totalAmount || 0;
        const rate = account.rate || account.annualRate || 0;
        const duration = account.duration || account.originalDuration || 12;
        const startDate = new Date(account.startDate?.seconds * 1000 || Date.now());

        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = account.monthlyPayment || (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));

        const newSchedule: ScheduleItem[] = [];
        let remainingBalance = amount;

        for (let i = 1; i <= duration; i++) {
            const interest = remainingBalance * monthlyRate;
            const principal = monthlyPayment - interest;
            remainingBalance -= principal;

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);

            const isPast = paymentDate < new Date();
            const isCurrentMonth = paymentDate.getMonth() === new Date().getMonth() && paymentDate.getFullYear() === new Date().getFullYear();

            newSchedule.push({
                month: i,
                paymentDate: paymentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                paymentAmount: monthlyPayment,
                interest: interest,
                principal: principal,
                remainingBalance: Math.max(0, remainingBalance),
                status: isPast ? 'paid' : (isCurrentMonth ? 'pending' : 'upcoming')
            });
        }
        setSchedule(newSchedule);
    };

    const totalPages = Math.ceil(schedule.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSchedule = schedule.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    };

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
                    <h2 className="text-2xl font-black text-gray-900">Aucun crédit actif trouvé</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">Vous n'avez pas encore d'échéancier disponible pour consultation.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    Retourner au tableau de bord
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ely-blue to-slate-950 p-4 md:p-8 rounded-[3.5rem] border border-white/10 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ely-mint/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 py-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-3 text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                            Retour aux comptes
                        </button>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                                Échéancier <span className="text-ely-mint">Midnight</span>
                            </h1>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-[11px] italic">
                                Suivi haute définition de votre plan de financement
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl">
                            <Printer className="w-6 h-6" />
                        </button>
                        <button className="flex items-center gap-4 px-10 py-5 bg-ely-mint text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/40 group active:scale-95">
                            <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                            <span>Exporter PDF</span>
                        </button>
                    </div>
                </header>

                {/* Resume Cards - Glass Edition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-4 bg-white/10 text-white rounded-2xl">
                                <Calendar className="w-7 h-7" />
                            </div>
                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Mensualité</p>
                        </div>
                        <p className="text-5xl font-black text-white tracking-tighter">
                            {schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount).split(',')[0] : "--"}
                            <span className="text-2xl font-bold opacity-30">,{schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount).split(',')[1] : "00"}</span>
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-ely-mint/10 blur-3xl rounded-full" />
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-4 bg-ely-mint/20 text-ely-mint rounded-2xl">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Total Intérêts</p>
                        </div>
                        <p className="text-5xl font-black text-ely-mint tracking-tighter drop-shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                            {formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0)).split(',')[0]}
                            <span className="text-2xl font-bold opacity-30">,{formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0)).split(',')[1]}</span>
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl">
                                <FileText className="w-7 h-7" />
                            </div>
                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Dossier</p>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <p className="text-5xl font-black text-white tracking-tighter">
                                {schedule.length}
                            </p>
                            <span className="text-sm font-black text-white/20 uppercase tracking-widest">Mois</span>
                        </div>
                    </div>
                </div>

                {/* Schedule Table - Midnight Glass */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Index</th>
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Date</th>
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Mensualité</th>
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Amortissement</th>
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Solde restant</th>
                                    <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {paginatedSchedule.map((row) => (
                                    <tr key={row.month} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-8 px-10 font-black text-white/20 group-hover:text-white/40 text-sm">#{String(row.month).padStart(2, '0')}</td>
                                        <td className="py-8 px-10 font-bold text-white/60 text-sm italic">{row.paymentDate}</td>
                                        <td className="py-8 px-10 font-black text-white text-right text-lg">{formatCurrency(row.paymentAmount)}</td>
                                        <td className="py-8 px-10 font-bold text-white/30 text-right text-sm">{formatCurrency(row.principal)}</td>
                                        <td className="py-8 px-10 font-black text-ely-mint text-right text-lg">{formatCurrency(row.remainingBalance)}</td>
                                        <td className="py-8 px-10 text-center">
                                            <div className={`px-5 py-2 rounded-2xl inline-flex items-center gap-3 border shadow-lg ${row.status === 'paid' ? 'bg-ely-mint/10 text-ely-mint border-ely-mint/20 shadow-ely-mint/10' :
                                                row.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5' :
                                                    'bg-white/5 text-white/30 border-white/10'
                                                }`}>
                                                {row.status === 'paid' ? <CheckCircle2 className="w-4 h-4" /> :
                                                    row.status === 'pending' ? <Clock className="w-4 h-4 animate-pulse" /> :
                                                        <Activity className="w-4 h-4 opacity-30" />}
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                    {row.status === 'paid' ? 'Validé' : row.status === 'pending' ? 'Encours' : 'Prévu'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* VIP Dark Pagination */}
                    {totalPages > 1 && (
                        <div className="p-10 bg-black/20 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex flex-col gap-1 items-center md:items-start">
                                <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                                    Chronologie de financement
                                </p>
                                <p className="text-xs font-bold text-white/60 uppercase">
                                    Page <span className="text-white font-black">{currentPage}</span> / {totalPages}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
                                        .map((page, index, array) => (
                                            <React.Fragment key={page}>
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="text-white/20 font-black mx-1">...</span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all border ${currentPage === page
                                                        ? 'bg-white text-ely-blue border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:border-white/20'
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
                                    className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-3 pt-6 pb-12">
                    <ShieldCheck className="w-5 h-5 text-ely-mint" />
                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">
                        Données sécurisées par AGMINVEST • Chiffrement Bancaire AES-256
                    </p>
                </div>
            </div>
        </div>
    );
}
