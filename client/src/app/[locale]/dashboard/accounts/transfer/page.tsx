"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import MobileTransfer from "@/components/dashboard/Transfers/MobileTransfer";
import DesktopTransfer from "@/components/dashboard/Transfers/DesktopTransfer";
// Force refresh

export default function TransferPage() {
    const t = useTranslations('Dashboard.Accounts');
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
    const [isBlocked, setIsBlocked] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubTransfers: () => void;
        let unsubRequests: () => void;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Try User Profile first for IBAN
                    const userSnap = await getDoc(doc(db, "users", user.uid));
                    let userData = userSnap.exists() ? userSnap.data() : {};

                    // Fetch Loan Account Data (where remainingAmount is stored)
                    const accountsQuery = query(collection(db, "accounts"), where("userId", "==", user.uid));
                    const accountsSnap = await getDocs(accountsQuery);

                    if (!accountsSnap.empty) {
                        const accountData = accountsSnap.docs[0].data();
                        // Merge user data with account data (account data takes precedence for financial info)
                        setLoanAccount({ ...userData, ...accountData });
                    } else {
                        setLoanAccount(userData);
                    }

                    // Listen to transfers
                    const qTransfers = query(
                        collection(db, "transfers"),
                        where("userId", "==", user.uid),
                        orderBy("createdAt", "desc")
                    );

                    unsubTransfers = onSnapshot(qTransfers, (snapshot) => {
                        setTransfers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    });

                    // Listen to loan requests
                    const qRequests = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid)
                    );

                    unsubRequests = onSnapshot(qRequests, (snapshot) => {
                        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setRequests(reqs);

                        // Check if any request requires payment and is still pending
                        const hasPendingDeposit = reqs.some((r: any) =>
                            r.requiresPayment && r.paymentStatus === 'pending' && r.paymentType !== 'none'
                        );
                        setIsBlocked(hasPendingDeposit);
                    });

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
        };
    }, []);

    const handleTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0 || !auth.currentUser || !loanAccount || isBlocked) return;

        // Check if balance is sufficient
        const transferAmount = parseFloat(amount);
        const availableBalance = loanAccount.remainingAmount || 0;

        if (transferAmount > availableBalance) {
            setError(`Solde insuffisant. Vous disposez de ${availableBalance.toFixed(2)}€ et tentez de transférer ${transferAmount.toFixed(2)}€.`);
            return;
        }

        setIsProcessing(true);

        try {
            const transferData = {
                userId: auth.currentUser.uid,
                userName: loanAccount.firstName + " " + loanAccount.lastName,
                userEmail: auth.currentUser.email,
                amount: transferAmount,
                bankName: loanAccount.bankName,
                iban: loanAccount.iban,
                bic: loanAccount.bic,
                status: "pending",
                createdAt: serverTimestamp(),
                type: "outbound"
            };

            await addDoc(collection(db, "transfers"), transferData);
            setShowSuccess(true);
            setAmount("");
        } catch (error) {
            console.error("Transfer error:", error);
            alert("Une erreur est survenue lors du virement. Vérifiez vos permissions.");
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
