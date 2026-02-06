"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Download,
    Printer,
    FileText,
    TrendingUp,
    AlertCircle
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
        // Simplified amortization calculation for demo/MVP
        // In production, this should ideally come from the backend or verified formula
        const amount = account.totalAmount || 0;
        const rate = account.rate || 0;
        const duration = account.originalDuration || account.remainingMonths || 12; // fallback
        const startDate = new Date(account.startDate?.seconds * 1000 || Date.now());

        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));

        const newSchedule: ScheduleItem[] = [];
        let remainingBalance = amount;

        for (let i = 1; i <= duration; i++) {
            const interest = remainingBalance * monthlyRate;
            const principal = monthlyPayment - interest;
            remainingBalance -= principal;

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i);

            // Mock status logic based on current date
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

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!loanAccount) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-900">Aucun crédit actif trouvé</h2>
                <p className="text-gray-500">Vous n'avez pas encore d'échéancier disponible.</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-ely-blue transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux comptes
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Tableau d'Amortissement</h1>
                    <p className="text-gray-500">Détail de vos échéances et du coût de votre crédit.</p>
                </div>

                <div className="flex gap-2">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-ely-blue hover:border-ely-blue transition-all shadow-sm">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 bg-ely-mint text-white rounded-xl font-bold hover:bg-ely-mint/90 transition-all shadow-lg shadow-ely-mint/20">
                        <Download className="w-5 h-5" />
                        <span className="hidden sm:inline">Télécharger PDF</span>
                    </button>
                </div>
            </header>

            {/* Resume Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={item} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-ely-blue rounded-xl">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mensualité estimée</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {schedule.length > 0 ? formatCurrency(schedule[0].paymentAmount) : "--"}
                    </p>
                </motion.div>

                <motion.div variants={item} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-ely-mint rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coût total intérêts</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {formatCurrency(schedule.reduce((acc, item) => acc + item.interest, 0))}
                    </p>
                </motion.div>

                <motion.div variants={item} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre d'échéances</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {schedule.length} <span className="text-lg font-bold text-gray-400">mensualités</span>
                    </p>
                </motion.div>
            </motion.div>

            {/* Schedule Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] shadow-lg shadow-gray-100 overflow-hidden border border-gray-100"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400">N°</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Mensualité</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Intérêts</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Capital</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Solde Dû</th>
                                <th className="py-5 px-6 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {schedule.map((row) => (
                                <tr key={row.month} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 px-6 font-bold text-gray-900">#{row.month}</td>
                                    <td className="py-5 px-6 font-medium text-gray-600">{row.paymentDate}</td>
                                    <td className="py-5 px-6 font-bold text-ely-blue text-right">{formatCurrency(row.paymentAmount)}</td>
                                    <td className="py-5 px-6 font-medium text-gray-500 text-right">{formatCurrency(row.interest)}</td>
                                    <td className="py-5 px-6 font-medium text-gray-500 text-right">{formatCurrency(row.principal)}</td>
                                    <td className="py-5 px-6 font-bold text-gray-900 text-right">{formatCurrency(row.remainingBalance)}</td>
                                    <td className="py-5 px-6 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.status === 'paid' ? 'bg-green-100 text-green-600' :
                                                row.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-gray-100 text-gray-400'
                                            }`}>
                                            {row.status === 'paid' ? 'Payé' :
                                                row.status === 'pending' ? 'En cours' : 'À venir'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
