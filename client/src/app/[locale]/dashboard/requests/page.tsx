"use client";


import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    FileText,
    Search,
    Filter,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";

const statusStyles: any = {
    pending: { label: "En attente", color: "amber", icon: Clock },
    approved: { label: "Accordé", color: "ely-mint", icon: CheckCircle2 },
    rejected: { label: "Refusé", color: "red", icon: AlertCircle },
    processing: { label: "En cours", color: "ely-blue", icon: TrendingUp },
};

export default function RequestsPage() {
    const t = useTranslations('Dashboard.Requests');
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let unsubRequests: () => void;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(
                    collection(db, "requests"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );

                unsubRequests = onSnapshot(q, (querySnapshot) => {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRequests(docs);
                    setIsLoading(false);
                }, (error) => {
                    if (error.code === 'permission-denied' && !auth.currentUser) return;
                    console.error("Error fetching requests:", error);
                    setIsLoading(false);
                });
            } else {
                // CLEANUP IMMEDIATELY ON LOGOUT
                if (unsubRequests) unsubRequests();
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubRequests) unsubRequests();
        };
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    const filteredRequests = requests.filter(req =>
        req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-8 min-h-screen pb-20">
            {/* Mobile/Desktop Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mes Demandes</h1>
                    <p className="text-slate-500 font-medium">Consultez l'historique et l'avancement de vos dossiers.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-ely-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-72 pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/40 transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <button className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-500 hover:text-ely-blue hover:border-ely-blue/20 transition-all active:scale-95">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {isLoading ? (
                <PremiumSpinner />
            ) : filteredRequests.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-5"
                >
                    {filteredRequests.map((req) => {
                        const style = statusStyles[req.status] || statusStyles.pending;
                        return (
                            <motion.div
                                key={req.id}
                                variants={item}
                                onClick={() => router.push(`/dashboard/requests/${req.id}`)}
                                className="group bg-white p-5 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative overflow-hidden"
                            >
                                {/* Premium accent line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-ely-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-5">
                                    <div className={`p-4 md:p-5 rounded-2xl bg-gradient-to-br transition-all duration-300 ${style.color === 'ely-mint' ? 'from-emerald-50 to-emerald-100/50 text-emerald-600' :
                                        style.color === 'ely-blue' ? 'from-blue-50 to-blue-100/50 text-ely-blue' :
                                            style.color === 'amber' ? 'from-amber-50 to-amber-100/50 text-amber-600' :
                                                'from-red-50 to-red-100/50 text-red-600'
                                        }`}>
                                        <FileText className="w-6 h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 group-hover:text-ely-blue transition-colors text-base md:text-xl tracking-tight leading-tight">
                                            {req.projectType || "Demande de Crédit"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                                                ID: {req.id.slice(0, 8)}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <style.icon className={`w-3.5 h-3.5 ${style.color === 'ely-mint' ? 'text-emerald-500' :
                                                    style.color === 'ely-blue' ? 'text-ely-blue' :
                                                        style.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                                                    }`} />
                                                <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${style.color === 'ely-mint' ? 'text-emerald-500' :
                                                    style.color === 'ely-blue' ? 'text-ely-blue' :
                                                        style.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                                                    }`}>
                                                    {style.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-8 border-t border-slate-50 md:border-t-0 pt-5 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Montant demandé</p>
                                        <p className="text-xl md:text-3xl font-black text-slate-900 leading-none tracking-tighter">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:shadow-blue-900/30 transition-all duration-300 active:scale-95 group/btn">
                                        <span>Suivre</span>
                                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-sm border border-slate-100 text-center space-y-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <FileText className="w-12 h-12 text-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Aucune demande trouvée</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">Vous n'avez pas encore effectué de demande de financement. Commencez par simuler votre projet.</p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard/credit")}
                        className="mt-6 px-10 py-5 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Nouvelle demande
                    </button>
                </div>
            )}
        </div>
    );
}
