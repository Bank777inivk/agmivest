"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && params.id) {
                // Real-time request listener
                const docRef = doc(db, "requests", params.id as string);

                const unsubRequest = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists() && docSnap.data().userId === user.uid) {
                        setRequest({ id: docSnap.id, ...docSnap.data() });
                    } else if (!docSnap.exists()) {
                        router.push("/dashboard/requests");
                    }
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error fetching request:", error);
                    setIsLoading(false);
                });

                return () => unsubRequest();
            } else {
                setIsLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, [params.id]);

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
            active: request.status === "pending"
        },
        {
            id: 2,
            title: "Analyse technique",
            desc: "Nos experts vérifient la faisabilité de votre projet.",
            completed: ["processing", "approved", "rejected"].includes(request.status),
            active: request.status === "processing"
        },
        {
            id: 3,
            title: "Vérification documentaire",
            desc: "Examen détaillé des pièces justificatives transmises.",
            completed: ["approved", "rejected"].includes(request.status),
            active: false
        },
        {
            id: 4,
            title: request.status === "rejected" ? "Décision finale : Refus" : "Décision finale : Accord",
            desc: request.status === "approved"
                ? "Félicitations, votre financement a été validé."
                : request.status === "rejected"
                    ? "Malheureusement, nous ne pouvons donner suite."
                    : "En attente de la commission finale.",
            completed: ["approved", "rejected"].includes(request.status),
            active: ["approved", "rejected"].includes(request.status),
            final: true
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header / Back */}
            <button
                onClick={() => router.push("/dashboard/requests")}
                className="flex items-center gap-2 text-gray-400 hover:text-ely-blue transition-colors font-bold group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Retour aux demandes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-${style.color === 'ely-mint' ? '[#28E898]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-500'} opacity-5 rounded-full`} />

                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{request.projectType || "Prêt Personnel"}</h1>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100">
                                        Réf: {request.id.slice(0, 10).toUpperCase()}
                                    </span>
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-${style.color === 'ely-mint' ? '[#28E898]/10' : style.color === 'ely-blue' ? 'ely-blue/10' : style.color + '-50'} border border-${style.color === 'ely-mint' ? '[#28E898]/20' : style.color === 'ely-blue' ? 'ely-blue/20' : style.color + '-100'}`}>
                                        <style.icon className={`w-4 h-4 text-${style.color === 'ely-mint' ? '[#28E898]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-500'}`} />
                                        <span className={`text-xs font-bold uppercase tracking-widest text-${style.color === 'ely-mint' ? '[#28E898]' : style.color === 'ely-blue' ? 'ely-blue' : style.color + '-500'}`}>
                                            {style.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 text-center min-w-[220px]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Montant du Projet</p>
                                <p className="text-4xl font-black text-ely-blue">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(request.amount || 0)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durée</p>
                                <p className="text-lg font-bold text-gray-900">{request.duration} mois</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mensualité</p>
                                <p className="text-lg font-bold text-gray-900">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(request.monthlyPayment || 0)}/m</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taux (TAEG)</p>
                                <p className="text-lg font-bold text-gray-900">{request.rate || "4.95"}%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Création</p>
                                <p className="text-lg font-bold text-gray-900">{request.createdAt?.toDate().toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-10 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-ely-blue" />
                            Suivi de l'avancement
                        </h2>

                        <div className="relative space-y-12 ml-4">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-100" />

                            {steps.map((step, idx) => (
                                <div key={step.id} className="relative flex gap-8 items-start">
                                    <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500
                                        ${step.completed ? 'bg-ely-mint text-white shadow-lg shadow-ely-mint/20' : step.active ? 'bg-ely-blue text-white ring-8 ring-ely-blue/10 shadow-lg shadow-ely-blue/20' : 'bg-gray-100 text-gray-300'}`}>
                                        {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-black">{step.id}</span>}
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-lg font-bold ${step.active ? 'text-ely-blue' : 'text-gray-900'}`}>{step.title}</h3>
                                            {step.date && <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{step.date}</span>}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-md">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Financial Summary card (NEW) */}
                    <section className="bg-gray-900 p-8 md:p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <CreditCard className="w-48 h-48" />
                        </div>

                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                            <ShieldCheck className="w-6 h-6 text-ely-mint" />
                            Résumé de votre déclaration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Situation Pro</p>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold">{request.profession || request.situation || "C.D.I"}</p>
                                    <p className="text-xs text-white/60">Ancienneté confirmée</p>
                                </div>
                            </div>

                            <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Revenus Mensuels</p>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-ely-mint">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.monthlyIncome || 0)}
                                    </p>
                                    <p className="text-xs text-white/60">Net avant impôts</p>
                                </div>
                            </div>

                            <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Charges totales</p>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-red-400">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(request.monthlyExpenses || request.otherLoans || 0)}
                                    </p>
                                    <p className="text-xs text-white/60">Loyer et crédits</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-white/40 font-medium relative z-10">
                            <Lock className="w-3.5 h-3.5" />
                            Ces informations sont strictement confidentielles et protégées.
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Advisor Card */}
                    <section className="bg-[#003d82] p-8 rounded-[3rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <UserCheck className="w-24 h-24" />
                        </div>

                        <h3 className="text-lg font-bold mb-6 relative z-10 italic">"Votre dossier est entre de bonnes mains."</h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Conseiller en charge</p>
                                    <p className="text-lg font-bold">Jean-Luc Dupont</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white text-ely-blue rounded-2xl font-bold hover:bg-white/90 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3">
                                Contacter mon conseiller
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </section>

                    {/* Quick Info Box */}
                    <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Target className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900">Prochaine étape</h3>
                        </div>

                        <p className="text-sm font-medium text-gray-600 leading-relaxed">
                            {request.status === "pending"
                                ? "L'analyse initiale sera terminée d'ici la fin de journée. Un expert vous contactera si nécessaire."
                                : request.status === "processing"
                                    ? "Nous examinons vos documents. Pas d'action requise de votre part pour le moment."
                                    : "Votre dossier est clôturé. Consultez l'onglet 'Comptes' pour activer votre financement."}
                        </p>

                        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-ely-blue shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimation</p>
                                <p className="text-sm font-bold text-gray-700">Moins de 24h</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
