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
            alert("Erreur lors de la mise à jour du RIB.");
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
                <h1 className="text-2xl font-bold text-gray-900">Mon solde crédit AGM</h1>
                <p className="text-gray-500">Gérez vos crédits actifs et suivez vos remboursements.</p>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Balance Card */}
                    <motion.div
                        variants={item}
                        className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#003d82] to-[#001d3d] p-8 rounded-[2.5rem] shadow-2xl shadow-ely-blue/20 text-white"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Landmark className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Solde Total Crédit</span>
                                {loanAccount?.isDeferred && (
                                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                                        Période de Différé
                                    </span>
                                )}
                                {!loanAccount?.isDeferred && <CreditCard className="w-6 h-6 text-ely-mint" />}
                            </div>

                            <div>
                                <h2 className="text-5xl font-black tracking-tight">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.remainingAmount || 0)}
                                </h2>
                                <p className="text-white/40 mt-2 font-medium">Capital restant dû</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Montant Initial</p>
                                    <p className="text-lg font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount?.totalAmount || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">
                                        {loanAccount?.isDeferred ? "Première Échéance" : "Prochaine Échéance"}
                                    </p>
                                    <p className="text-lg font-bold text-ely-mint">{loanAccount?.nextPaymentDate || "-- / -- / --"}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Actions */}
                    <motion.div variants={item} className="space-y-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ely-mint/10 text-ely-mint rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taux (TAEG)</p>
                                    <p className="text-xl font-black text-gray-900">{loanAccount?.rate || "0.00"}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-ely-blue/10 text-ely-blue rounded-xl">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Durée Restante</p>
                                    <p className="text-xl font-black text-gray-900">{loanAccount?.remainingMonths || 0} mois</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/dashboard/accounts/transfer")}
                            className="w-full bg-ely-mint text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-ely-mint/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                        >
                            Effectuer un virement
                            <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => router.push("/dashboard/accounts/schedule")}
                            className="w-full bg-ely-blue text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group"
                        >
                            Consulter l'échéancier
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Combined Bottom Grid: Operations & RIB Side by Side */}
                    <motion.div variants={item} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Operations Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <History className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="font-extrabold text-gray-900 uppercase tracking-widest text-xs">Dernières Opérations</h3>
                                </div>
                            </div>

                            <div className="flex-1">
                                {loanAccount ? (
                                    <div className="divide-y divide-gray-50">
                                        {extraTransactions.slice(0, 4).map(tx => (
                                            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-2xl",
                                                        tx.status === 'approved' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                                    )}>
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">Virement vers {tx.bankName}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                            Virement {
                                                                tx.status === 'approved' ? 'débité' :
                                                                    tx.status === 'rejected' ? 'refusé' :
                                                                        tx.status === 'review' ? 'en examen' :
                                                                            tx.status === 'advanced' ? 'contrôle avancé' : 'en cours'
                                                            } le {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '...'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "font-black",
                                                        tx.status === 'rejected' ? "text-gray-300 line-through" : "text-red-600"
                                                    )}>
                                                        -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                                    </p>
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">
                                                        {tx.status === 'approved' ? 'Terminé' :
                                                            tx.status === 'rejected' ? 'Refusé' : 'En attente'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                                    <ArrowDownLeft className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">Versement Prêt AGM INVEST</p>
                                                    <p className="text-[10px] text-gray-400 font-medium font-mono lowercase tracking-tighter">Virement reçu le {loanAccount.startDateFormatted}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-green-600">
                                                    +{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loanAccount.totalAmount)}
                                                </p>
                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Terminé</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 text-center space-y-4">
                                        <Wallet className="w-10 h-10 text-gray-100 mx-auto" />
                                        <p className="text-xs text-gray-400 font-medium">Aucun mouvement</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIB Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Landmark className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="font-extrabold text-gray-900 uppercase tracking-widest text-xs">Coordonnées (RIB)</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setNewIBAN(loanAccount?.iban || "");
                                        setNewBank(loanAccount?.bankName || "");
                                        setNewBIC(loanAccount?.bic || "");
                                        setNewEmail(loanAccount?.ribEmail || loanAccount?.email || "");
                                        setIsEditRIBModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-ely-blue/5 text-ely-blue rounded-xl hover:bg-ely-blue hover:text-white transition-all font-black text-[9px] uppercase tracking-widest border border-ely-blue/10 shadow-sm"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Modifier</span>
                                </button>
                            </div>

                            <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banque</span>
                                        <span className="font-bold text-gray-900">{loanAccount?.bankName || "AGM INVEST"}</span>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifiant IBAN</span>
                                        <div className="text-right">
                                            <p className="font-mono text-xs font-bold text-gray-900 tracking-tighter">
                                                {loanAccount?.iban || "Non défini"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifiant BIC / SWIFT</span>
                                        <span className="font-mono text-xs font-bold text-gray-900 uppercase">{loanAccount?.bic || "AGMINV75XXX"}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email pour les virements</span>
                                        <span className="font-bold text-gray-900 text-sm lowercase">{loanAccount?.ribEmail || loanAccount?.email || "non renseigné"}</span>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0 animate-pulse" />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                        Compte vérifié actif pour les fonds et prélèvements mensuels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Support Alert */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ely-mint/10 blur-[100px] rounded-full" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="hidden md:flex w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center">
                        <Info className="w-8 h-8 text-ely-mint" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">Besoin d'aide sur vos comptes ?</h4>
                        <p className="text-white/60">Nos conseillers sont disponibles pour répondre à vos questions sur vos remboursements.</p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-3 bg-white text-gray-900 rounded-2xl font-bold hover:bg-ely-mint hover:text-white transition-all">
                    Contacter un conseiller
                </button>
            </div>

            {/* Edit RIB Modal */}
            {isEditRIBModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl relative"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setIsEditRIBModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-ely-blue/10 text-ely-blue rounded-3xl">
                                    <Landmark className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">Coordonnées Bancaires</h3>
                                    <p className="text-gray-500 font-medium">Mettez à jour votre RIB de référence.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nom de la banque</label>
                                    <input
                                        type="text"
                                        value={newBank}
                                        onChange={(e) => setNewBank(e.target.value)}
                                        placeholder="EX: CIC, BNP PARIBAS..."
                                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Identifiant IBAN</label>
                                    <input
                                        type="text"
                                        value={newIBAN}
                                        onChange={(e) => setNewIBAN(e.target.value.toUpperCase())}
                                        placeholder="FR76 ..."
                                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-mono font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Identifiant BIC / SWIFT</label>
                                        <input
                                            type="text"
                                            value={newBIC}
                                            onChange={(e) => setNewBIC(e.target.value.toUpperCase())}
                                            placeholder="AGMINV75XXX"
                                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-mono font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email pour les virements</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-bold text-gray-900 outline-none focus:border-ely-blue transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                                    <Info className="w-5 h-5 text-ely-blue shrink-0 mt-1" />
                                    <p className="text-xs text-ely-blue/70 font-medium leading-relaxed">
                                        Ces informations seront utilisées pour vos prochains versements et prélèvements automatiques.
                                    </p>
                                </div>

                                <button
                                    disabled={isProcessing || !newIBAN}
                                    onClick={handleUpdateRIB}
                                    className="w-full bg-gray-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                    ) : "Enregistrer les modifications"}
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
                        <p className="font-bold text-sm">Opération effectuée avec succès</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

