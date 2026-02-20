"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, where, limit, orderBy } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion } from "framer-motion";
import {
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    FileCheck,
    History,
    ChevronRight,
    FileText,
    ShieldCheck,
    HelpCircle,
    Landmark,
    Wallet,
    Euro
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import DesktopDashboard from "@/components/dashboard/Home/DesktopDashboard";
import MobileDashboard from "@/components/dashboard/Home/MobileDashboard";

interface LoanRequest {
    // ... (rest of interface remains same)
    id: string;
    userId: string;
    status: "pending" | "processing" | "approved" | "rejected";
    projectType?: string;
    amount?: number;
    duration?: number;
    monthlyPayment?: number;
    rate?: number;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    otherLoans?: number;
    profession?: string;
    situation?: string;
    createdAt?: any;
    requiresPayment?: boolean;
    paymentStatus?: string;
    paymentType?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const t = useTranslations();
    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState("");
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [recentRequests, setRecentRequests] = useState<LoanRequest[]>([]);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [idStatus, setIdStatus] = useState<string | null>(null);
    const [stats, setStats] = useState([
        { id: 'total', label: "Dashboard.Home.stats.total", value: "0", icon: Clock, color: "blue", trend: "0%" },
        { id: 'approved', label: "Dashboard.Home.stats.approved", value: "0", icon: CheckCircle, color: "green", trend: "0%" },
        { id: 'pending', label: "Dashboard.Home.stats.pending", value: "0", icon: AlertCircle, color: "orange", trend: "0" },
        { id: 'projects', label: "Dashboard.Home.stats.projects", value: "0", icon: FileCheck, color: "purple", trend: "0%" },
    ]);

    useEffect(() => {
        let unsubUser: () => void;
        let unsubAccount: () => void;
        let unsubRequests: () => void;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                unsubUser = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setFirstName(docSnap.data().firstName);
                        setIdStatus(docSnap.data().idStatus || null);
                    }
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (User):", error);
                });

                const accountsRef = collection(db, "accounts");
                const qAccount = query(accountsRef, where("userId", "==", currentUser.uid), limit(1));
                unsubAccount = onSnapshot(qAccount, (snapshot) => {
                    if (!snapshot.empty) {
                        const data = snapshot.docs[0].data();

                        // Dynamic Calculation logic similar to accounts page
                        const rawDate = data.startDate || data.createdAt;
                        const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : (rawDate?.toDate ? rawDate.toDate() : new Date());
                        const startDateFormatted = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                        const now = new Date();
                        const isDeferred = startDate > now;

                        const installments = data.installments || {};
                        const duration = data.duration || 12;
                        let countRemaining = 0;

                        if (isDeferred) {
                            countRemaining = duration;
                        } else {
                            for (let i = 0; i < duration; i++) {
                                if (installments[i]?.status !== 'paid') {
                                    countRemaining++;
                                }
                            }
                        }

                        setLoanAccount({
                            id: snapshot.docs[0].id,
                            ...data,
                            remainingMonths: countRemaining,
                            isDeferred,
                            startDateFormatted
                        });
                    }
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (Account):", error);
                });

                const requestsRef = collection(db, "requests");
                const requestsQuery = query(
                    requestsRef,
                    where("userId", "==", currentUser.uid),
                    orderBy("createdAt", "desc")
                );

                unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
                    const allData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as LoanRequest[];

                    setRecentRequests(allData.slice(0, 3));
                    const active = allData.some(r => r.status === "pending" || r.status === "processing" || r.status === "rejected");
                    setHasActiveRequest(active);

                    setStats([
                        { id: 'total', label: "Dashboard.Home.stats.total", value: allData.length.toString(), icon: Clock, color: "blue", trend: "Live" },
                        { id: 'approved', label: "Dashboard.Home.stats.approved", value: allData.filter(r => r.status === "approved").length.toString(), icon: CheckCircle, color: "green", trend: `${Math.round((allData.filter(r => r.status === "approved").length / (allData.length || 1)) * 100)}%` },
                        { id: 'pending', label: "Dashboard.Home.stats.pending", value: allData.filter(r => r.status === "pending" || r.status === "processing").length.toString(), icon: AlertCircle, color: "orange", trend: "0" },
                        { id: 'projects', label: "Dashboard.Home.stats.projects", value: new Set(allData.map(r => r.projectType)).size.toString(), icon: FileCheck, color: "purple", trend: "85%" },
                    ]);

                    setIsLoading(false);
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Firestore Error (Requests):", error);
                    setIsLoading(false);
                });
            } else {
                // CLEANUP IMMEDIATELY ON LOGOUT
                if (unsubUser) unsubUser();
                if (unsubAccount) unsubAccount();
                if (unsubRequests) unsubRequests();

                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubUser) unsubUser();
            if (unsubAccount) unsubAccount();
            if (unsubRequests) unsubRequests();
        };
    }, [router]);

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

    if (isLoading) {
        return <PremiumSpinner />;
    }

    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:block">
                <DesktopDashboard
                    firstName={firstName}
                    loanAccount={loanAccount}
                    recentRequests={recentRequests}
                    stats={stats}
                    hasActiveRequest={hasActiveRequest}
                    idStatus={idStatus}
                />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
                <MobileDashboard
                    firstName={firstName}
                    loanAccount={loanAccount}
                    recentRequests={recentRequests}
                    stats={stats}
                    hasActiveRequest={hasActiveRequest}
                    idStatus={idStatus}
                />
            </div>
        </div>
    );
}
