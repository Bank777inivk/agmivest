"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Landmark,
    Info,
    X,
    CheckCircle2,
    Wallet,
    CreditCard,
    Clock,
    AlertCircle,
    Search,
    History,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved':
                return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Validé", icon: CheckCircle2 };
            case 'rejected':
                return { bg: "bg-red-50 text-red-600 border-red-100", label: "Refusé", icon: X };
            case 'review':
                return { bg: "bg-blue-50 text-blue-600 border-blue-100", label: "En examen", icon: Search };
            case 'advanced':
                return { bg: "bg-purple-50 text-purple-600 border-purple-100", label: "Contrôle avancé", icon: ShieldCheck };
            default:
                return { bg: "bg-amber-50 text-amber-600 border-amber-100", label: "En attente", icon: Clock };
        }
    };

    const ShieldCheck = (props: any) => <AlertCircle {...props} />; // Placeholder as ShieldCheck is not imported and I might have missed it in lucide-react list

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all group"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-ely-blue transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Virement Bancaire</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Espace de transfert sécurisé AGMINVEST.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left side: Transfer Form */}
                <div className="lg:col-span-7 space-y-10">
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/5 border-2 border-emerald-500/20 text-center space-y-6 relative overflow-hidden"
                            >
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">Virement émis avec succès</h2>
                                    <p className="text-gray-500 font-medium px-8 leading-relaxed">
                                        Votre demande est maintenant <span className="text-amber-600 font-bold uppercase tracking-widest text-xs px-2 py-1 bg-amber-50 rounded-lg ml-1">En attente de contrôle</span> par un conseiller.
                                    </p>
                                </div>
                                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                                    >
                                        Nouveau virement
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard/accounts")}
                                        className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                                    >
                                        Mes comptes
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden transition-all"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <Send className="w-32 h-32 text-white" />
                                </div>

                                <div className="relative z-10 space-y-10">
                                    {/* Amount Input */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Montant à transférer</label>
                                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 group focus-within:border-ely-mint/30 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-white/10 rounded-2xl shadow-sm text-ely-mint shrink-0">
                                                    <Wallet className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="bg-transparent text-5xl font-black text-white w-full outline-none placeholder:text-white/10"
                                                    />
                                                    <span className="text-4xl font-black text-white/20">€</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Destination Account Card */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Compte de destination</label>
                                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-white/10 relative group transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="p-4 bg-white/10 rounded-2xl text-white/40">
                                                        <Landmark className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{loanAccount?.bankName || "Compte de référence"}</p>
                                                        <p className="font-mono text-sm text-white/40 mt-1">
                                                            {loanAccount?.iban?.slice(0, 4)} •••• •••• •••• •••• {loanAccount?.iban?.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 bg-ely-mint/20 text-ely-mint text-[10px] font-black rounded-full uppercase tracking-widest border border-ely-mint/20">Compte Vérifié</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Note / Blocked Alert */}
                                    {isBlocked ? (
                                        <div className="bg-red-500/20 p-6 rounded-3xl border border-red-500/30 flex items-start gap-4">
                                            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-red-100 font-bold mb-1 italic">Virement Suspendu</p>
                                                <p className="text-xs text-red-100/70 font-medium leading-relaxed">
                                                    Pour sécuriser vos transactions, le versement de votre <span className="text-white font-bold underline">Dépôt d'Authentification</span> est requis avant tout virement sortant.
                                                    Veuillez régulariser votre situation dans l'onglet "Facturation".
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20 flex items-start gap-4">
                                            <Info className="w-5 h-5 text-amber-300 shrink-0 mt-1" />
                                            <p className="text-xs text-amber-100/60 font-medium leading-relaxed">
                                                Les fonds seront transférés sur votre compte bancaire enregistré. Le délai habituel de réception est de 24h à 48h ouvrées par mesure de contrôle.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between font-bold text-gray-900 border-t border-gray-100 pt-4 mt-6">
                                        <span>Total à débiter</span>
                                        <span className="text-xl text-ely-blue">{amount ? parseFloat(amount).toLocaleString() : "0"} €</span>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100 mb-4"
                                            >
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Button */}
                                    <button
                                        disabled={isProcessing || !amount || parseFloat(amount) <= 0 || isBlocked}
                                        onClick={handleTransfer}
                                        className="w-full bg-ely-mint text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-ely-mint/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-4"
                                    >
                                        {isProcessing ? (
                                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {isBlocked ? "Finalisation Requise" : "Confirmer le virement"}
                                                <Send className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right side: Security & History Summary */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ely-mint/10 blur-3xl rounded-full" />
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-3">
                            <Info className="w-5 h-5 text-ely-mint" />
                            Contrôle de sécurité
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            Par mesure de lutte contre la fraude, chaque virement fait l'objet d'une analyse systématique par nos services de conformité.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase mb-1">Délai estimé</p>
                                <p className="text-sm font-bold">24h - 48h</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase mb-1">Protection</p>
                                <p className="text-sm font-bold">Cryptage AES</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg">
                            <History className="w-6 h-6 text-ely-blue" />
                            Aperçu Historique
                        </h4>
                        <div className="space-y-6">
                            {transfers.slice(0, 3).map((transfer) => {
                                const styles = getStatusStyles(transfer.status);
                                return (
                                    <div key={transfer.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-3 rounded-xl border", styles.bg)}>
                                                <styles.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{transfer.amount?.toLocaleString()} €</p>
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : "En cours..."}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles.bg, styles.bg !== "bg-gray-50" && "text-opacity-80")}>
                                            {styles.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {transfers.length === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <Search className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-sm">Aucun virement récent</p>
                                </div>
                            )}
                        </div>
                        {transfers.length > 3 && (
                            <button className="w-full mt-6 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all text-[11px] uppercase tracking-widest">
                                Voir tout l'historique
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Transaction History Table */}
            {transfers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">Historique complet</h3>
                            <p className="text-gray-500 font-medium italic">Suivez l'état de vos transferts en temps réel.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">
                                    <th className="pb-6 px-4">Date</th>
                                    <th className="pb-6 px-4">Destinataire</th>
                                    <th className="pb-6 px-4">IBAN</th>
                                    <th className="pb-6 px-4">Montant</th>
                                    <th className="pb-6 px-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transfer) => {
                                    const styles = getStatusStyles(transfer.status);
                                    return (
                                        <tr key={transfer.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/50">
                                            <td className="py-6 px-4">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : "Juste à l'instant"}
                                                </p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-bold text-gray-900 text-sm">{transfer.bankName}</p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-mono text-[11px] text-gray-400">
                                                    {transfer.iban?.slice(0, 4)} •••• {transfer.iban?.slice(-4)}
                                                </p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <p className="font-black text-gray-900 text-sm">{transfer.amount?.toLocaleString()} €</p>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest", styles.bg)}>
                                                    <styles.icon className="w-3 h-3" />
                                                    {styles.label}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {transfers.length > itemsPerPage && (
                        <div className="mt-10 flex items-center justify-between border-t border-gray-50 pt-8">
                            <p className="text-xs text-gray-400 font-medium">
                                Affichage de <span className="text-gray-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, transfers.length)}</span> sur <span className="text-gray-900 font-bold">{transfers.length}</span> transferts
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage * itemsPerPage >= transfers.length}
                                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
