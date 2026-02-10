"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, limit, doc, getDoc, onSnapshot, QuerySnapshot, FirestoreError } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AlertCircle } from "lucide-react";

import MobileSchedule from "@/components/dashboard/Schedule/MobileSchedule";
import DesktopSchedule from "@/components/dashboard/Schedule/DesktopSchedule";

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
    const itemsPerPage = 8; // Reduced for better mobile view, but maybe keep 12 for desktop? Let's use 10 as a middle ground or keep 12

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

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
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

    const commonProps = {
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
        <>
            <div className="md:hidden">
                <MobileSchedule {...commonProps} />
            </div>
            <div className="hidden md:block">
                <DesktopSchedule {...commonProps} />
            </div>
        </>
    );
}
