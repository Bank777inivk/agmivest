"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    FileText,
    ChevronLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Calendar,
    ArrowRight,
    Target,
    Activity,
    UserCheck,
    CreditCard,
    Lock
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";

const statusConfig: any = {
    pending: { label: "En attente", color: "amber", icon: Clock },
    approved: { label: "Accordé", color: "ely-mint", icon: CheckCircle2 },
    rejected: { label: "Refusé", color: "red", icon: AlertCircle },
    processing: { label: "En cours", color: "ely-blue", icon: Activity },
};

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const tProject = useTranslations('CreditRequest.Project.labels');
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubRequest: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && params.id) {
                const docRef = doc(db, "requests", params.id as string);

                unsubRequest = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists() && docSnap.data().userId === user.uid) {
                        setRequest({ id: docSnap.id, ...docSnap.data() });
                    } else if (!docSnap.exists()) {
                        router.push("/dashboard/requests");
                    }
                    setIsLoading(false);
                }, (error) => {
                    // Ignore permission errors if we're in the middle of logging out
                    if (error.code === 'permission-denied' && !auth.currentUser) {
                        return;
                    }
                    console.error("Error fetching request:", error);
                    setIsLoading(false);
                });
            } else {
                // CLEANUP IMMEDIATELY ON LOGOUT
                if (unsubRequest) {
                    unsubRequest();
                    unsubRequest = null;
                }
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubRequest) unsubRequest();
        };
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!request) return null;

    const style = statusConfig[request.status] || statusConfig.pending;

    // Timeline steps logic
    const steps = [
        {
            id: 1,
            title: "Dossier reçu",
            desc: "Votre demande a été enregistrée avec succès.",
            date: request.createdAt?.toDate().toLocaleDateString('fr-FR'),
            completed: true,
            active: false
        },
        {
            id: 2,
            title: "Analyse technique",
            desc: "Nos experts vérifient la faisabilité de votre projet.",
            completed: request.stepAnalysis === true || request.status === "approved" || request.status === "rejected",
            active: !request.stepAnalysis && request.status !== "rejected" && request.status !== "approved"
        },
        {
            id: 3,
            title: "Vérification documentaire",
            desc: "Examen détaillé des pièces justificatives transmises.",
            completed: request.stepVerification === true || request.status === "approved" || request.status === "rejected",
            active: request.stepAnalysis && !request.stepVerification && request.status !== "rejected" && request.status !== "approved"
        },
        {
            id: 4,
            title: request.status === "rejected" ? "Décision finale : Refus" : "Décision finale : Accord",
            desc:
                // 1. Rétablissement de l'affichage du Statut "Refusé"
                // À la demande de l'utilisateur, le statut "Refusé" est de nouveau pleinement visible pour le client :
                // - Verrouillage (Lock Screen) : Une demande refusée bloque désormais l'accès au formulaire de demande et affiche le message de refus.
                // - Tableau de bord : Les dossiers refusés apparaissent dans la section "Ma demande en cours" avec leur statut explicite.
                // - Détails : La timeline affiche de nouveau "Décision finale : Refus".
                //
                // 2. Soumission calibrée (Statut Initial)
                // Le comportement de soumission reste optimisé :
                // - Statut Initial : Toute nouvelle demande démarre au statut `pending` (En attente).
                // - Analyse Admin : Le score automatique est stocké dans `scoringStatus`, permettant à l'admin de voir le résultat du scoring sans impacter la visibilité immédiate du client (qui voit son dossier comme étant "En cours d'étude").
                request.status === "approved"
                    ? "Félicitations, votre financement a été validé."
                    : request.status === "rejected"
                        ? "Malheureusement, nous ne pouvons donner suite."
                        : "En attente de la commission finale.",
            completed: ["approved", "rejected"].includes(request.status),
            active: request.stepVerification && request.status !== "approved" && request.status !== "rejected"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 relative overflow-hidden">
            {/* Celebration Banner for Approved Requests */}
            {request.status === "approved" && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-600 to-[#047857] p-1 rounded-[2.5rem] shadow-xl shadow-emerald-900/20 relative z-10"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-[2.4rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black mb-1 leading-tight uppercase tracking-tight">Félicitations ! Votre crédit est activé.</h2>
                                <p className="text-white/90 font-medium">Les fonds ont été débloqués. Vous pouvez dès maintenant consulter votre échéancier.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/accounts")}
                            className="whitespace-nowrap w-full md:w-auto px-10 py-5 bg-white text-emerald-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95 shrink-0"
                        >
                            Accéder à mon compte
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Header / Back */}
            <div className="flex justify-between items-center relative z-10 p-2">
                <button
                    onClick={() => router.push("/dashboard/requests")}
                    className="flex items-center gap-2 text-slate-400 hover:text-ely-blue transition-all font-black text-xs uppercase tracking-widest group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Retour
                </button>
            </div>

            {/* Mobile Decorative Orbs */}
            <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-ely-blue/10 rounded-full blur-[120px] pointer-events-none md:hidden" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        {/* Status specific background accent */}
                        <div className={`absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 ${style.color === 'ely-mint' ? 'bg-emerald-500' :
                            style.color === 'ely-blue' ? 'bg-ely-blue' :
                                style.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                            } opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-700`} />

                        <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                            <div className="space-y-6 flex-1 text-center md:text-left">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 p-1.5 pr-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none pt-1">ID: {request.id.slice(0, 10).toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                                        {request.projectType ? tProject(request.projectType.toLowerCase()) : "Prêt Personnel"}
                                    </h1>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                    <div className={`flex items-center gap-2 px-6 py-2 rounded-full leading-none ${style.color === 'ely-mint' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                                        style.color === 'ely-blue' ? 'bg-blue-50 text-ely-blue border border-blue-100/50' :
                                            style.color === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                                                'bg-red-50 text-red-600 border border-red-100/50'
                                        }`}>
                                        <style.icon className="w-4 h-4" />
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest pt-0.5">
                                            {style.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-[2.5rem] border border-slate-100 text-center md:text-right md:min-w-[280px] shadow-sm shadow-slate-100">
                                <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">Montant du Projet</p>
                                <p className="text-4xl md:text-5xl font-black text-ely-blue tracking-tighter leading-none">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.amount || 0)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-slate-50">
                            {[
                                { label: "Durée", value: `${request.duration} mois` },
                                { label: "Mensualité", value: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.monthlyPayment || 0)}/m` },
                                { label: "Taux (TAEG)", value: `${request.rate || "4.95"}%` },
                                { label: "Création", value: request.createdAt?.toDate().toLocaleDateString('fr-FR') },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5 group/item">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 group-hover/item:text-ely-blue transition-colors">{item.label}</p>
                                    <p className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ely-blue to-blue-400 opacity-20" />

                        <h2 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-4 uppercase tracking-tight">
                            <Activity className="w-8 h-8 text-ely-blue" />
                            Progression
                        </h2>

                        <div className="relative space-y-14 md:ml-6 ml-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[24px] top-10 bottom-10 w-[2px] bg-slate-100/80" />

                            {steps.map((step, idx) => (
                                <div key={step.id} className="relative flex gap-8 items-start group/step">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-700
                                        ${step.completed
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30'
                                            : step.active
                                                ? 'bg-gradient-to-br from-ely-blue to-blue-700 text-white ring-8 ring-ely-blue/10 shadow-xl shadow-blue-500/30'
                                                : 'bg-slate-100 text-slate-300 border border-slate-200 shadow-sm'}`}>
                                        {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-base font-black italic">{step.id}</span>}
                                    </div>
                                    <div className="space-y-2 pt-1.5 flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                                            <h3 className={`text-xl font-black uppercase tracking-tight leading-none ${step.active ? 'text-ely-blue' : step.completed ? 'text-emerald-600' : 'text-slate-400'}`}>{step.title}</h3>
                                            {step.date && <span className="md:inline-block w-fit text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100/50">{step.date}</span>}
                                        </div>
                                        <p className="text-base font-medium text-slate-500 leading-relaxed max-w-xl group-hover/step:text-slate-700 transition-colors">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Financial Summary card */}
                    <section className="bg-gradient-to-br from-slate-900 to-blue-950 p-8 md:p-14 rounded-[3rem] text-white shadow-2xl shadow-blue-950/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <CreditCard className="w-64 h-64" />
                        </div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-ely-blue/10 rounded-full blur-[80px]" />

                        <h2 className="text-2xl font-black mb-10 flex items-center gap-4 relative z-10 uppercase tracking-tight">
                            <ShieldCheck className="w-8 h-8 text-ely-mint" />
                            Ma Déclaration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                            {[
                                { label: "Situation Pro", value: request.profession || request.situation || "C.D.I", desc: "Ancienneté confirmée", color: "white" },
                                { label: "Revenus Mensuels", value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.monthlyIncome || 0), desc: "Net avant impôts", color: "ely-mint" },
                                { label: "Charges estimées", value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.monthlyExpenses || request.otherLoans || 0), desc: "Loyer et crédits", color: "red-400" },
                            ].map((box, i) => (
                                <div key={i} className="space-y-4 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest">{box.label}</p>
                                    <div className="space-y-1">
                                        <p className={`text-xl md:text-2xl font-black ${box.color === 'ely-mint' ? 'text-ely-mint' : box.color === 'red-400' ? 'text-red-400' : 'text-white'} tracking-tight`}>{box.value}</p>
                                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{box.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-3 text-xs text-white/20 font-black uppercase tracking-widest relative z-10">
                            <Lock className="w-4 h-4" />
                            Confidentialité totale garantie par ELYSIO
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Advisor Card */}
                    <section className="bg-gradient-to-br from-ely-blue to-blue-800 p-8 md:p-10 rounded-[3rem] text-white overflow-hidden relative group hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-[1.2] transition-transform duration-700">
                            <UserCheck className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <h3 className="text-xl font-bold leading-tight italic opacity-90">"Votre dossier est entre de bonnes mains. Je m'en occupe personnellement."</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none pt-1">Conseiller Senior</p>
                                        <p className="text-xl font-black tracking-tight pt-1">Jean-Luc Dupont</p>
                                    </div>
                                </div>
                                <button className="w-full py-5 bg-white text-ely-blue rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-blue-950/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn">
                                    Contacter
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Quick Info Box */}
                    <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-blue-50 text-ely-blue rounded-2xl">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">Prochaine étape</h3>
                        </div>

                        <p className="text-base font-medium text-slate-500 leading-relaxed italic">
                            {request.status === "pending"
                                ? "L'analyse initiale sera terminée d'ici la fin de journée. Un expert vous contactera si nécessaire."
                                : request.status === "processing"
                                    ? "Nous examinons vos documents. Pas d'action requise de votre part pour le moment."
                                    : "Votre dossier est clôturé. Consultez l'onglet 'Comptes' pour activer votre financement."}
                        </p>

                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/10 p-6 rounded-3xl flex items-center gap-5 border border-slate-100/50">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ely-blue shrink-0 ring-4 ring-blue-50">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1 leading-none mb-1">Délai estimé</p>
                                <p className="text-base font-black text-slate-800 tracking-tight leading-none">Moins de 24h</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
