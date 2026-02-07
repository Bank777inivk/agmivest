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
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mes Demandes</h1>
                    <p className="text-slate-500">Consultez l'historique et l'avancement de vos dossiers de financement.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-ely-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500 hover:text-ely-blue transition-all">
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
                    className="grid grid-cols-1 gap-4"
                >
                    {filteredRequests.map((req) => {
                        const style = statusStyles[req.status] || statusStyles.pending;
                        return (
                            <motion.div
                                key={req.id}
                                variants={item}
                                onClick={() => router.push(`/dashboard/requests/${req.id}`)}
                                className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl bg-${style.color === 'ely-mint' ? '[#059669]/10' : style.color === 'ely-blue' ? 'ely-blue/10' : style.color + '-50'} text-${style.color === 'ely-mint' ? '[#059669]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-600'} border border-${style.color === 'ely-mint' ? '[#059669]/20' : style.color === 'ely-blue' ? 'ely-blue/20' : style.color + '-100'}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-ely-blue transition-colors">{req.projectType || "Demande de Crédit"}</h3>
                                        <p className="text-sm text-slate-400 font-medium tracking-wide mb-1 uppercase">Réf: {req.id.slice(0, 8)}</p>
                                        <div className="flex items-center gap-2">
                                            <style.icon className={`w-3.5 h-3.5 text-${style.color === 'ely-mint' ? '[#059669]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-500'}`} />
                                            <span className={`text-[11px] font-bold uppercase tracking-wider text-${style.color === 'ely-mint' ? '[#059669]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-500'}`}>
                                                {style.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Montant</p>
                                        <p className="text-xl font-black text-slate-900 leading-none">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm group-hover:bg-ely-blue group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                                        <span>Suivre</span>
                                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-slate-100 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Aucune demande trouvée</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Vous n'avez pas encore effectué de demande de financement. Commencez par simuler votre projet.</p>
                    <button
                        onClick={() => router.push("/dashboard/credit")}
                        className="mt-4 px-8 py-3 bg-ely-blue text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-ely-blue/20 transition-all active:scale-95"
                    >
                        Nouvelle demande
                    </button>
                </div>
            )}
        </div>
    );
}
