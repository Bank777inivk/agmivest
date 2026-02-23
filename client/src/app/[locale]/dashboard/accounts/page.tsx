"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Wallet,
    Info,
    Calendar,
    ChevronRight,
    Landmark,
    TrendingUp,
    Send,
    Edit3,
    X,
    CheckCircle2
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc, updateDoc, serverTimestamp, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";

import { useRouter } from "@/i18n/routing";
import DesktopAccounts from "@/components/dashboard/Accounts/DesktopAccounts";
import MobileAccounts from "@/components/dashboard/Accounts/MobileAccounts";

export default function AccountsPage() {
    const t = useTranslations('Dashboard.Accounts');
    const router = useRouter();
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditRIBModalOpen, setIsEditRIBModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [newIBAN, setNewIBAN] = useState("");
    const [newBank, setNewBank] = useState("");
    const [newBIC, setNewBIC] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [extraTransactions, setExtraTransactions] = useState<any[]>([]);

    useEffect(() => {
        let unsubTransfers: () => void;
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
                        const data: any = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };

                        // Dynamic Calculation
                        const rawDate = data.startDate || data.createdAt;
                        const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : (rawDate?.toDate ? rawDate.toDate() : new Date());
                        const duration = data.duration || 12;
                        const installments = data.installments || {};

                        const now = new Date();
                        const isDeferred = startDate > now;

                        let nextDate = null;
                        let countRemaining = 0;

                        if (isDeferred) {
                            // If deferred, the first payment is the start date
                            nextDate = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            countRemaining = duration; // No payments made yet
                        } else {
                            for (let i = 0; i < duration; i++) {
                                const isPaid = installments[i]?.status === 'paid';
                                if (!isPaid) {
                                    countRemaining++;
                                    if (!nextDate) {
                                        const pDate = new Date(startDate);
                                        pDate.setMonth(startDate.getMonth() + (i + 1));
                                        nextDate = pDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    }
                                }
                            }
                        }

                        // Fetch IBAN, BIC and bankName from original request or user profile if missing in account document (Legacy Support)
                        let iban = data.iban;
                        let bic = data.bic;
                        let bankName = data.bankName;

                        if (!iban || !bic || !bankName) {
                            try {
                                // 1. Try User Profile (Current source of truth for the person)
                                const userSnap = await getDoc(doc(db, "users", user.uid));
                                if (userSnap.exists()) {
                                    const userData = userSnap.data();
                                    if (!iban) iban = userData.iban;
                                    if (!bic) bic = userData.bic;
                                    if (!bankName) bankName = userData.bankName;
                                    // Always check email from Firestore users collection
                                    const firestoreEmail = userData.email;
                                    setLoanAccount({
                                        ...data,
                                        iban,
                                        bic,
                                        bankName,
                                        email: firestoreEmail || user.email,
                                        ribEmail: userData.ribEmail || firestoreEmail || user.email,
                                        nextPaymentDate: nextDate || "-- / -- / --",
                                        remainingMonths: countRemaining,
                                        isDeferred,
                                        startDateFormatted: startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                    });
                                }

                                // 2. Fallback to original request if still missing
                                if ((!iban || !bic || !bankName) && data.requestId) {
                                    const requestSnap = await getDoc(doc(db, "requests", data.requestId));
                                    if (requestSnap.exists()) {
                                        const reqData = requestSnap.data();
                                        if (!iban) iban = reqData.iban;
                                        if (!bic) bic = reqData.bic;
                                        if (!bankName) bankName = reqData.bankName;
                                    }
                                }
                            } catch (e) {
                                console.error("Error fetching legacy banking data:", e);
                            }
                        }

                        // Final set if not already done by userSnap block (unlikely but safe)
                        setLoanAccount((prev: any) => {
                            if (prev && prev.email) return prev; // already set with Firestore data
                            return {
                                ...data,
                                iban,
                                bic,
                                bankName,
                                email: user.email,
                                nextPaymentDate: nextDate || "-- / -- / --",
                                remainingMonths: countRemaining,
                                isDeferred,
                                startDateFormatted: startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            };
                        });

                        // Real-time Transfers Listener
                        const qT = query(
                            collection(db, "transfers"),
                            where("userId", "==", user.uid),
                            orderBy("createdAt", "desc"),
                            limit(5)
                        );
                        unsubTransfers = onSnapshot(qT, (snapshot) => {
                            setExtraTransactions(snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            })));
                        });
                    }
                } catch (error) {
                    console.error("Error fetching account:", error);
                }
            }
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
            if (unsubTransfers) unsubTransfers();
        };
    }, []);

    const handleUpdateRIB = async () => {
        if (!auth.currentUser || !newIBAN) return;
        setIsProcessing(true);
        try {
            // Update User Profile
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                iban: newIBAN,
                bankName: newBank,
                bic: newBIC,
                ribEmail: newEmail,
                updatedAt: serverTimestamp()
            });

            // Update Account Document if it exists
            if (loanAccount?.id) {
                await updateDoc(doc(db, "accounts", loanAccount.id), {
                    iban: newIBAN,
                    bankName: newBank, // Consistency
                    bic: newBIC,
                    ribEmail: newEmail,
                    updatedAt: serverTimestamp()
                });
            }

            setLoanAccount((prev: any) => ({
                ...prev,
                iban: newIBAN,
                bankName: newBank,
                bic: newBIC,
                ribEmail: newEmail
            }));
            setIsEditRIBModalOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating RIB:", error);
            alert(t('messages.error'));
        } finally {
            setIsProcessing(false);
        }
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

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-gray-500">{t('subtitle')}</p>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Version Desktop */}
                    <div className="hidden md:block">
                        <DesktopAccounts
                            loanAccount={loanAccount}
                            extraTransactions={extraTransactions}
                            setNewIBAN={setNewIBAN}
                            setNewBank={setNewBank}
                            setNewBIC={setNewBIC}
                            setNewEmail={setNewEmail}
                            setIsEditRIBModalOpen={setIsEditRIBModalOpen}
                        />
                    </div>

                    {/* Version Mobile */}
                    <div className="block md:hidden">
                        <MobileAccounts
                            loanAccount={loanAccount}
                            extraTransactions={extraTransactions}
                            setNewIBAN={setNewIBAN}
                            setNewBank={setNewBank}
                            setNewBIC={setNewBIC}
                            setNewEmail={setNewEmail}
                            setIsEditRIBModalOpen={setIsEditRIBModalOpen}
                        />
                    </div>
                </>
            )}

            {/* Support Alert */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ely-mint/10 blur-[100px] rounded-full" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="hidden md:flex w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center">
                        <Info className="w-8 h-8 text-ely-mint" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">{t('support.title')}</h4>
                        <p className="text-white/60">{t('support.message')}</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-3 bg-white text-gray-900 rounded-2xl font-bold hover:bg-ely-mint hover:text-white transition-all">
                    {t('support.action')}
                </button>
            </div>

            {/* Edit RIB Modal */}
            {isEditRIBModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl"
                    onClick={() => setIsEditRIBModalOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white w-full max-w-lg md:rounded-[3.5rem] rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button — fixed inside the card */}
                        <div className="absolute top-0 right-0 md:p-8 p-6 z-10">
                            <button onClick={() => setIsEditRIBModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Scrollable inner content */}
                        <div className="overflow-y-auto max-h-[90vh] md:p-10 p-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-ely-blue/10 text-ely-blue rounded-3xl">
                                    <Landmark className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">{t('modal.title')}</h3>
                                    <p className="text-gray-500 font-medium">{t('modal.subtitle')}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('modal.bankLabel')}</label>
                                    <input
                                        type="text"
                                        value={newBank}
                                        onChange={(e) => setNewBank(e.target.value)}
                                        placeholder={t('modal.bankPlaceholder')}
                                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('modal.ibanLabel')}</label>
                                    <input
                                        type="text"
                                        value={newIBAN}
                                        onChange={(e) => setNewIBAN(e.target.value.toUpperCase())}
                                        placeholder={t('modal.ibanPlaceholder')}
                                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-mono font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('modal.bicLabel')}</label>
                                        <input
                                            type="text"
                                            value={newBIC}
                                            onChange={(e) => setNewBIC(e.target.value.toUpperCase())}
                                            placeholder={t('modal.bicPlaceholder')}
                                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-mono font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">{t('modal.emailLabel')}</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder={t('modal.emailPlaceholder')}
                                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                                    <Info className="w-5 h-5 text-ely-blue shrink-0 mt-1" />
                                    <p className="text-xs text-ely-blue/70 font-medium leading-relaxed">
                                        {t('modal.info')}
                                    </p>
                                </div>

                                <button
                                    disabled={isProcessing || !newIBAN}
                                    onClick={handleUpdateRIB}
                                    className="w-full bg-gray-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                    ) : t('modal.save')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Global Success Notification */}
            {showSuccess && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10"
                    >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-bold text-sm">{t('messages.success')}</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

