import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Landmark,
    Info,
    X,
    CheckCircle2,
    Wallet,
    Clock,
    AlertCircle,
    Search,
    History,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

interface MobileTransferProps {
    amount: string;
    setAmount: (val: string) => void;
    handleTransfer: () => void;
    isProcessing: boolean;
    showSuccess: boolean;
    setShowSuccess: (val: boolean) => void;
    transfers: any[];
    isBlocked: boolean;
    error: string | null;
    loanAccount: any;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
}

export default function MobileTransfer({
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
}: MobileTransferProps) {
    const router = useRouter();

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

    return (
        <div className="w-full space-y-6 pb-24 overflow-x-hidden">
            {/* Header Mobile */}
            <header className="flex items-center gap-4 px-4 sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
                <button
                    onClick={() => router.push('/dashboard/accounts')}
                    className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Virement</h1>
                    <p className="text-xs text-gray-500 font-medium pt-1">Espace sécurisé</p>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-4 bg-white rounded-[2rem] p-8 shadow-xl text-center space-y-6 border border-emerald-100"
                    >
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">Virement réussi !</h2>
                            <p className="text-sm text-gray-500 leading-relaxed px-2">
                                Votre demande est <span className="text-amber-600 font-bold">en cours de contrôle</span>.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider"
                        >
                            Nouveau virement
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 space-y-6"
                    >
                        {/* Main Interaction Card */}
                        <div className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                            {/* Input Amount - Simplified */}
                            <div className="relative z-10 flex flex-col items-center justify-center space-y-2 py-6">
                                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Montant à transférer</label>
                                <div className="flex items-end justify-center gap-1 w-full">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        className="bg-transparent text-center text-5xl font-black text-white w-full outline-none placeholder:text-white/10 p-0 m-0 leading-none min-w-0"
                                        style={{ maxWidth: '200px' }} // Limit width to prevent overflow
                                    />
                                    <span className="text-3xl font-bold text-white/30 mb-1">€</span>
                                </div>
                            </div>

                            {/* Destination - Simplified Row */}
                            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg text-white/60">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm truncate">{loanAccount?.bankName || "Compte"}</p>
                                    <p className="font-mono text-xs text-white/40 truncate">
                                        {loanAccount?.iban ? `•••• ${loanAccount.iban.slice(-4)}` : "•••• ••••"}
                                    </p>
                                </div>
                                <div className="text-[10px] bg-ely-mint/20 text-ely-mint px-2 py-1 rounded-md font-bold border border-ely-mint/20">
                                    Vérifié
                                </div>
                            </div>
                        </div>

                        {/* Security Alert if Blocked */}
                        {isBlocked && (
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-red-800">Virement Suspendu</p>
                                    <p className="text-[11px] text-red-600 leading-relaxed">
                                        Dépôt d'authentification requis. Voir "Facturation".
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium flex items-center gap-3 border border-red-100"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Button */}
                        <button
                            disabled={isProcessing || !amount || parseFloat(amount) <= 0 || isBlocked}
                            onClick={handleTransfer}
                            className="w-full bg-ely-mint text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-ely-mint/20 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isBlocked ? "Bloqué" : "Confirmer"}
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Security Control Card (Mobile) */}
                        <div className="bg-[#0F172A] rounded-3xl p-6 text-white relative overflow-hidden">
                            <h4 className="text-base font-bold mb-3 flex items-center gap-2 text-ely-mint">
                                <Info className="w-4 h-4" />
                                Contrôle de sécurité
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Par mesure de lutte contre la fraude, chaque virement fait l'objet d'une analyse systématique par nos services de conformité.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-wider">Délai estimé</p>
                                    <p className="text-sm font-bold text-white">24h - 48h</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-wider">Protection</p>
                                    <p className="text-sm font-bold text-white">Cryptage AES</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent History Mobile (Cards) */}
                        <div className="pt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Récent</h3>
                            <div className="space-y-3">
                                {transfers.slice(0, 5).map((transfer) => {
                                    const styles = getStatusStyles(transfer.status);
                                    return (
                                        <div key={transfer.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2 rounded-lg", styles.bg)}>
                                                    <styles.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{transfer.amount?.toLocaleString()} €</p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {transfer.createdAt?.seconds ? new Date(transfer.createdAt.seconds * 1000).toLocaleDateString() : "En cours"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn("text-[9px] font-bold px-2 py-1 rounded-md uppercase", styles.bg)}>
                                                {styles.label}
                                            </span>
                                        </div>
                                    );
                                })}
                                {transfers.length === 0 && (
                                    <p className="text-center text-gray-400 text-xs py-4">Aucun virement récent</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
