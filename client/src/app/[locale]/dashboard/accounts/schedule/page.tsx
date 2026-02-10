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
    ShieldCheck,
    CreditCard
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc, onSnapshot, QuerySnapshot, FirestoreError } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ScheduleItem {
    month: number;
    paymentDate: string;
    paymentAmount: number;
    interest: number;
    principal: number;
    remainingBalance: number;
    status: 'paid' | 'pending' | 'upcoming' | 'overdue';
}

export default function SchedulePage() {
    const t = useTranslations('Dashboard.Accounts');
    const router = useRouter();
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        let unsubscribeAccount: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user info for PDF (one-time)
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().firstName || "Client");
                }

                // Setup Real-time listener for account
                const q = query(
                    collection(db, "accounts"),
                    where("userId", "==", user.uid),
                    limit(1)
                );

                unsubscribeAccount = onSnapshot(q, (snapshot: QuerySnapshot) => {
                    if (!snapshot.empty) {
                        const data = snapshot.docs[0].data();
                        console.log("Account update received in real-time:", data);
                        setLoanAccount({ id: snapshot.docs[0].id, ...data });
                        generateSchedule(data);
                    }
                    setIsLoading(false);
                }, (error: FirestoreError) => {
                    console.error("Firestore Error:", error);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeAccount) unsubscribeAccount();
        };
    }, []);

    const generateSchedule = (account: any) => {
        if (!account) return;

        const duration = account.duration || 12;
        const amount = account.totalAmount || 0;
        const annualRate = account.rate || 4.95;
        const monthlyRate = annualRate / 100 / 12;
        const loanMonthly = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
        const insuranceMonthly = (amount * 0.03) / duration;
        const monthlyPayment = account.monthlyPayment || (loanMonthly + insuranceMonthly);

        // Use robust date conversion similar to admin side
        const rawDate = account.startDate || account.createdAt;
        const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : (rawDate?.toDate ? rawDate.toDate() : new Date(rawDate || Date.now()));

        const newSchedule: ScheduleItem[] = [];
        let remainingBalance = amount;

        for (let i = 1; i <= duration; i++) {
            const interest = remainingBalance * monthlyRate;
            const principal = monthlyPayment - interest;
            remainingBalance -= principal;

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);

            // Admin defined status for this month (index i-1)
            // account.installments is now an object mapping index string/number to data
            const adminInstallment = account.installments?.[i - 1];

            let status: 'paid' | 'pending' | 'upcoming' | 'overdue';
            if (adminInstallment?.status) {
                status = adminInstallment.status;
            } else {
                const isPast = paymentDate < new Date();
                const isCurrentMonth = paymentDate.getMonth() === new Date().getMonth() && paymentDate.getFullYear() === new Date().getFullYear();

                // Default fallback logic
                if (isPast) {
                    status = 'overdue'; // Mark as overdue if past and no admin status
                } else if (isCurrentMonth) {
                    status = 'pending';
                } else {
                    status = 'upcoming';
                }
            }

            newSchedule.push({
                month: i,
                paymentDate: paymentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                paymentAmount: monthlyPayment,
                interest: interest,
                principal: principal,
                remainingBalance: Math.max(0, remainingBalance),
                status: status
            });
        }
        setSchedule(newSchedule);
    };

    const handleDownloadPDF = () => {
        if (!schedule.length || !loanAccount) return;

        const doc = new jsPDF();
        const primaryColor: [number, number, number] = [0, 61, 130]; // ely-blue

        // Header Style
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("AGM INVEST", 14, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("L'excellence en financement", 14, 32);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text("TABLEAU D'AMORTISSEMENT", 140, 25);

        // Client & Loan Details
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Informations Client :", 14, 55);
        doc.setFont("helvetica", "normal");
        doc.text(`Prénom : ${userName}`, 14, 62);
        doc.text(`ID Compte : ${loanAccount.id.toUpperCase()}`, 14, 67);
        doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 14, 72);

        doc.setFont("helvetica", "bold");
        doc.text("Détails du Crédit :", 120, 55);
        doc.setFont("helvetica", "normal");
        doc.text(`Montant Total : ${formatCurrency(loanAccount.totalAmount)}`, 120, 62);
        doc.text(`Durée : ${schedule.length} mois`, 120, 67);
        doc.text(`Taux annuel : ${loanAccount.rate || loanAccount.annualRate || 0}%`, 120, 72);

        // Divider
        doc.setDrawColor(230, 230, 230);
        doc.line(14, 80, 196, 80);

        // Table
        const tableData = schedule.map(item => [
            item.month,
            item.paymentDate,
            formatCurrency(item.paymentAmount),
            formatCurrency(item.principal),
            formatCurrency(item.interest),
            formatCurrency(item.remainingBalance),
            item.status === 'paid' ? 'Validé' : item.status === 'overdue' ? 'EN RETARD' : item.status === 'pending' ? 'Encours' : 'À venir'
        ]);

        autoTable(doc, {
            startY: 90,
            head: [['N°', 'Échéance', 'Mensualité', 'Principal', 'Intérêts', 'Solde restant', 'Statut']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'center' }
            },
            styles: { fontSize: 8, cellPadding: 3 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { top: 90 }
        });

        // Summary at the end
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        if (finalY < 250) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Résumé du plan :", 14, finalY);
            doc.setFont("helvetica", "normal");
            doc.text(`Total Intérêts : ${formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0))}`, 14, finalY + 7);
            doc.text(`Coût total du crédit : ${formatCurrency(loanAccount.totalAmount + schedule.reduce((acc, item) => acc + item.interest, 0))}`, 14, finalY + 12);
        }

        // Footer for all pages
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} sur ${pageCount}`, 196, 285, { align: 'right' });
            doc.text("Document certifié par AGM INVEST - Sécurité Bancaire AES-256", 14, 285);
            doc.setDrawColor(230, 230, 230);
            doc.line(14, 280, 196, 280);
        }

        doc.save(`Echeancier_AGMINVEST_${userName}_${loanAccount.id.slice(0, 8)}.pdf`);
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
                    <h2 className="text-2xl font-bold text-gray-900">Aucun crédit actif trouvé</h2>
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
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Minimal Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-ely-blue transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Retour aux comptes
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Mon Échéancier <span className="text-ely-blue font-medium text-lg ml-2 opacity-50 tracking-normal">Détails du financement</span>
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
                            className="flex items-center gap-2 px-6 py-3 bg-ely-blue text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95 group"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            <span>Exporter en PDF</span>
                        </button>
                    </div>
                </header>

                {/* Stat Cards - Elegant Edition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Mensualité moyenne</p>
                        </div>
                        <p className="text-3xl font-bold tracking-tight text-white mb-1">
                            {schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount) : "--"}
                        </p>
                        {schedule.length > 0 && loanAccount && (
                            <p className="text-[10px] text-white/50 font-medium">
                                Dont {formatCurrency((loanAccount.totalAmount * 0.03) / schedule.length)} d'assurance (3%)
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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total des intérêts</p>
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
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Durée du prêt</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold tracking-tight text-white">
                                {schedule.length}
                            </p>
                            <span className="text-sm font-semibold text-white/60">mois</span>
                        </div>
                    </motion.div>
                </div>

                {/* Schedule Table - Balanced Edition */}
                <div className="bg-white border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">N°</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Date de paiement</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Montant</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Amortissement</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Solde restant</th>
                                    <th className="py-5 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">État</th>
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
                                                    {row.status === 'paid' ? 'Payé' : row.status === 'overdue' ? 'EN RETARD' : row.status === 'pending' ? 'En cours' : 'À venir'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Clean Pagination */}
                    {totalPages > 1 && (
                        <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                                Page <span className="text-slate-900 font-bold">{currentPage}</span> sur {totalPages}
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
                        Document certifié par AGM INVEST • Sécurité Bancaire
                    </p>
                </div>
            </div>
        </div>
    );
}
