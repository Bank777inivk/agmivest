"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getFirebaseAuth, getFirestore } from "@/lib/firebase";
import { doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, addDoc, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { createNotification } from "@/hooks/useNotifications";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import MobileTransfer from "@/components/dashboard/Transfers/MobileTransfer";
import DesktopTransfer from "@/components/dashboard/Transfers/DesktopTransfer";
// Force refresh

export default function TransferPage() {
    const t = useTranslations('Dashboard.Accounts');
    const locale = useLocale();
    const tTransfers = useTranslations('Dashboard.Transfers');
    const router = useRouter();
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [transfers, setTransfers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [requests, setRequests] = useState<any[]>([]);
    const [blockingReason, setBlockingReason] = useState<"verification" | "deposit" | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface LoanRequest {
        id: string;
        status: string;
        paymentVerificationStatus?: string;
        requiresPayment?: boolean;
        paymentStatus?: string;
        paymentType?: string;
    }

    useEffect(() => {
        let unsubTransfers: () => void;
        let unsubRequests: () => void;
        let unsubUser: () => void;

        const _auth = getFirebaseAuth();
        const _db = getFirestore();

        const unsubscribe = onAuthStateChanged(_auth, async (user) => {
            if (user) {
                try {
                    const db = getFirestore();
                    const userRef = doc(db, "users", user.uid);

                    // 1. Listen to User Profile for real-time KYC/idStatus
                    unsubUser = onSnapshot(userRef, async (userSnap) => {
                        const userData = userSnap.exists() ? userSnap.data() : {};
                        const isVerifiedGlobal = userData.idStatus === 'verified' || userData.kycStatus === 'verified';

                        // 2. Fetch Loan Account Data (One-time or could be snapshot too, but let's focus on logic)
                        const accountsQuery = query(collection(db, "accounts"), where("userId", "==", user.uid), limit(1));
                        const accountsSnap = await getDocs(accountsQuery);
                        let accountData = accountsSnap.empty ? {} : accountsSnap.docs[0].data();

                        // Cascade for RIB info
                        let iban = accountData.iban || userData.iban;
                        let bic = accountData.bic || userData.bic;
                        let bankName = accountData.bankName || userData.bankName;

                        if (!iban || !bic || !bankName) {
                            const requestsQuery = query(
                                collection(db, "requests"),
                                where("userId", "==", user.uid),
                                orderBy("createdAt", "desc"),
                                limit(1)
                            );
                            const reqSnapshot = await getDocs(requestsQuery);
                            if (!reqSnapshot.empty) {
                                const reqData = reqSnapshot.docs[0].data();
                                if (!iban) iban = reqData.iban;
                                if (!bic) bic = reqData.bic;
                                if (!bankName) bankName = reqData.bankName;
                            }
                        }

                        const finalLoanAccount = {
                            ...userData,
                            ...accountData,
                            iban,
                            bic,
                            bankName,
                            verified: isVerifiedGlobal // Unifié ici
                        };
                        setLoanAccount(finalLoanAccount);

                        // 3. Listen to transfers
                        if (!unsubTransfers) {
                            const qTransfers = query(
                                collection(db, "transfers"),
                                where("userId", "==", user.uid),
                                orderBy("createdAt", "desc")
                            );
                            unsubTransfers = onSnapshot(qTransfers, (snapshot) => {
                                setTransfers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                            });
                        }

                        // 4. Listen to loan requests for blocking logic
                        if (!unsubRequests) {
                            const qRequests = query(
                                collection(db, "requests"),
                                where("userId", "==", user.uid)
                            );
                            unsubRequests = onSnapshot(qRequests, (snapshot) => {
                                const reqs = snapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() })) as LoanRequest[];
                                setRequests(reqs);

                                // Logic uses current snap state
                                const approvedReq = reqs.find(r => r.status === 'approved');

                                if (approvedReq) {
                                    const isRequestVerified = approvedReq.paymentVerificationStatus === 'verified' || approvedReq.paymentVerificationStatus === 'on_review';
                                    const isVerified = isVerifiedGlobal || isRequestVerified;
                                    const needsDeposit = approvedReq.requiresPayment && approvedReq.paymentStatus === 'pending' && approvedReq.paymentType !== 'none';

                                    if (!isVerified) {
                                        setBlockingReason('verification');
                                        setIsBlocked(true);
                                    } else if (needsDeposit) {
                                        setBlockingReason('deposit');
                                        setIsBlocked(true);
                                    } else {
                                        setBlockingReason(null);
                                        setIsBlocked(false);
                                    }
                                } else {
                                    setBlockingReason(null);
                                    setIsBlocked(false);
                                }
                            });
                        }
                    });

                    // Add unsubUser to cleanup (need to handle it carefully in a closure or state)
                    // For now, let's just make sure it's created. We'll add it to the final cleanup too.

                } catch (error) {
                    console.error("Error fetching data for transfer page:", error);
                }
            }
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
            if (unsubTransfers) unsubTransfers();
            if (unsubRequests) unsubRequests();
            if (unsubUser) unsubUser();
        };
    }, []);

    const handleTransfer = async () => {
        const _auth = getFirebaseAuth();
        if (!amount || parseFloat(amount) <= 0 || !_auth.currentUser || !loanAccount || isBlocked) return;

        // Check if balance is sufficient
        const transferAmount = parseFloat(amount);
        const availableBalance = loanAccount.remainingAmount || 0;

        if (transferAmount > availableBalance) {
            setError(tTransfers('errors.insufficientBalance', {
                balance: availableBalance.toFixed(2),
                amount: transferAmount.toFixed(2)
            }));
            return;
        }

        setIsProcessing(true);

        try {
            const _db = getFirestore();
            const transferData = {
                userId: _auth.currentUser.uid,
                userName: loanAccount.firstName + " " + loanAccount.lastName,
                userEmail: _auth.currentUser.email,
                amount: transferAmount,
                bankName: loanAccount.bankName,
                iban: loanAccount.iban,
                bic: loanAccount.bic,
                status: "pending",
                createdAt: serverTimestamp(),
                type: "outbound",
                language: locale
            };

            await addDoc(collection(_db, "transfers"), transferData);

            // Send Transfer Initiated Email
            try {
                await fetch("/api/email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: _auth.currentUser.email,
                        template: "transfer-initiated",
                        language: locale,
                        apiKey: process.env.NEXT_PUBLIC_EMAIL_API_KEY || "agm-invest-email-2024",
                        data: {
                            firstName: loanAccount.firstName,
                            amount: transferAmount,
                            beneficiaryName: loanAccount.bankName
                        }
                    })
                });
            } catch (emailErr) {
                console.error("Failed to send transfer initiated email:", emailErr);
            }

            // Create Notification
            await createNotification(_auth.currentUser.uid, {
                title: 'transferInitiated.title',
                message: 'transferInitiated.message',
                params: { amount: transferAmount.toLocaleString() },
                type: 'info'
            });

            setShowSuccess(true);
            setAmount("");
        } catch (error) {
            console.error("Transfer error:", error);
            alert(tTransfers('messages.genericError'));
        } finally {
            setIsProcessing(false);
        }
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const commonProps = {
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
    };

    return (
        <>
            <div className="md:hidden">
                <MobileTransfer {...commonProps} />
            </div>
            <div className="hidden md:block">
                <DesktopTransfer {...commonProps} />
            </div>
        </>
    );
}
