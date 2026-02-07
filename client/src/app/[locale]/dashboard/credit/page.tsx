"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, Briefcase, Building2, Calculator, Calendar,
    CheckCircle2, Clock, CreditCard, Euro, Globe, HeartPulse, History,
    Info, Mail, MapPin, AlertCircle, FileText, ChevronRight, Search, Lock,
    TrendingUp, Percent, Target, PieChart, ShieldCheck, User
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default function CreditRequestPage() {
    const t = useTranslations('CreditRequest');
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingActive, setIsCheckingActive] = useState(true);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [activeLoanData, setActiveLoanData] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);

    // Form State
    const [amount, setAmount] = useState(250000);
    const [duration, setDuration] = useState(180); // 15 years
    const [annualRate, setAnnualRate] = useState(4.25);
    const [projectType, setProjectType] = useState("personal");
    const [projectDescription, setProjectDescription] = useState("");
    const [profileType, setProfileType] = useState<"particulier" | "pro">("particulier");

    const [formData, setFormData] = useState({
        // Identity
        civility: "M.",
        firstName: "",
        lastName: "",
        birthDate: "",
        birthPlace: "",
        nationality: "Française",
        idType: "Passeport",
        idNumber: "",
        idExpiry: "",
        idIssuingCountry: "France",
        // Situation
        maritalStatus: "single",
        children: "0",
        housingType: "tenant",
        housingSeniority: "",
        address: "",
        zipCode: "",
        city: "",
        phone: "",
        // Financial
        profession: "",
        companyName: "",
        contractType: "cdi",
        income: "",
        charges: "",
        otherCredits: "0",
        bankName: "",
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check for active requests
                try {
                    const { collection, query, where, getDocs } = await import("firebase/firestore");
                    const q = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid)
                    );
                    const querySnapshot = await getDocs(q);

                    // Find any relevant request (pending, processing, approved, active)
                    const activeDoc = querySnapshot.docs.find(d =>
                        ["pending", "processing", "approved", "active"].includes(d.data().status)
                    );

                    if (activeDoc) {
                        const data = activeDoc.data();
                        setHasActiveRequest(true);
                        setActiveLoanData(data);
                        if (data.status === "approved" || data.status === "active") {
                            setIsApproved(true);
                        }
                        setIsCheckingActive(false);
                        return;
                    }
                } catch (error) {
                    console.error("Error checking active requests:", error);
                } finally {
                    setIsCheckingActive(false);
                }

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setFormData(prev => ({
                        ...prev,
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        civility: data.civility || "M.",
                        birthDate: data.birthDate || "",
                        birthPlace: data.birthPlace || "",
                        address: data.address || "",
                        city: data.city || "",
                        zipCode: data.zipCode || "",
                        phone: data.phone || "",
                        nationality: data.nationality || "Française",
                    }));
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Financial calculations
    const monthlyInterestRate = annualRate / 100 / 12;
    const monthlyPaymentPrincipal = (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -duration));
    const insuranceRate = 0.035; // 0.035%
    const monthlyInsurance = amount * insuranceRate / 100;
    const totalMonthlyPayment = monthlyPaymentPrincipal + monthlyInsurance;
    const totalCost = (totalMonthlyPayment * duration) - amount;

    const handleSubmit = async () => {
        if (!auth.currentUser) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "requests"), {
                userId: auth.currentUser.uid,
                profileType,
                type: projectType === "personal" ? "Prêt Personnel" : projectType === "auto" ? "Prêt Auto" : projectType === "pro" ? "Prêt Business" : (projectDescription || "Autre"),
                amount,
                duration,
                monthlyPayment: totalMonthlyPayment,
                annualRate,
                totalCost,
                status: "pending",
                createdAt: serverTimestamp(),
                userEmail: auth.currentUser.email,
                userName: `${formData.firstName} ${formData.lastName}`,
                ...formData,
                details: {
                    monthlyPrincipal: monthlyPaymentPrincipal,
                    monthlyInsurance: monthlyInsurance,
                    taeg: annualRate + 0.55
                }
            });
            setStep(6);
        } catch (error) {
            console.error("Error submitting request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isMounted || isCheckingActive) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (hasActiveRequest) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-ely-blue to-blue-800 p-12 md:p-20 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 border border-white/10 space-y-10 relative overflow-hidden"
                >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none text-white">
                        {isApproved ? <TrendingUp className="w-64 h-64" /> : <Lock className="w-64 h-64" />}
                    </div>

                    <div className={cn(
                        "relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-8",
                        isApproved ? "bg-ely-mint/10 text-ely-mint ring-ely-mint/5" : "bg-white/10 text-white ring-white/5"
                    )}>
                        {isApproved ? <TrendingUp className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
                    </div>

                    <div className="relative z-10 space-y-6">
                        {isApproved ? (
                            <>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                    Félicitations ! <br />
                                    <span className="text-ely-mint">C'est le Jackpot.</span>
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                                        Profitez de votre emprunt de <span className="text-white font-black">{activeLoanData?.amount?.toLocaleString()} €</span> pour gérer vos projets.
                                    </p>
                                    <div className="inline-block bg-white/10 py-3 px-6 rounded-2xl text-sm border border-white/10 text-white/70 max-w-lg mx-auto leading-relaxed">
                                        Actuellement, vous n'êtes plus éligible pour faire une demande de prêt car vous en avez déjà une en cours de remboursement.
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase">Accès restreint</h2>
                                <p className="text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
                                    Vous avez déjà une demande de financement en cours de traitement.
                                    <br /><br />
                                    <span className="text-white/40 text-lg italic">Par mesure de sécurité et de qualité d'étude, nous ne permettons qu'un seul dossier actif à la fois.</span>
                                </p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10 pt-6 flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => router.push("/dashboard/requests")}
                            className="px-10 py-5 bg-white text-ely-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-white/10 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                        >
                            Suivre mon dossier
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                        >
                            Tableau de bord
                        </button>
                    </div>

                    {/* Support note */}
                    <div className="relative z-10 pt-10">
                        <p className="text-sm font-black text-white/20 uppercase tracking-widest flex items-center justify-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-ely-mint" />
                            Besoin d'assistance ? <button className="text-white hover:text-ely-mint transition-colors underline decoration-white/20">Contactez un conseiller</button>
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-ely-mint to-emerald-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-ely-mint/30 border border-white/20">
                            Simulation Premium
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Faire une demande <br className="hidden md:block" />
                        <span className="text-ely-blue">de crédit</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">
                        Financez vos projets les plus ambitieux avec nos options sur-mesure.
                    </p>
                </div>

                {/* Stepper with labels */}
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { id: 1, label: "Projet" },
                        { id: 2, label: "Identité" },
                        { id: 3, label: "Situation" },
                        { id: 4, label: "Finances" },
                        { id: 5, label: "Résumé" }
                    ].map((s) => (
                        <div key={s.id} className="flex items-center gap-2 shrink-0">
                            <div className="flex flex-col items-center gap-2 px-2">
                                <div className={cn(
                                    "w-9 h-9 rounded-2xl flex items-center justify-center font-black text-[10px] transition-all duration-500",
                                    step >= s.id
                                        ? "bg-ely-blue text-white shadow-lg shadow-ely-blue/30 scale-110"
                                        : "bg-slate-100 text-slate-400"
                                )}>
                                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                                </div>
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest transition-colors duration-500",
                                    step >= s.id ? "text-ely-blue" : "text-slate-300"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                            {s.id < 5 && (
                                <div className="w-4 h-[2px] rounded-full bg-slate-100 mb-5 overflow-hidden">
                                    <div className={cn(
                                        "h-full bg-ely-blue transition-all duration-700 ease-out",
                                        step > s.id ? "w-full" : "w-0"
                                    )} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step-simulator"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* Simulation controls */}
                        <div className="lg:col-span-8 bg-gradient-to-br from-ely-blue to-blue-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 border border-white/10 space-y-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none text-white group-hover:scale-110 transition-transform duration-1000">
                                <Calculator className="w-64 h-64" />
                            </div>

                            {/* Profile Type Selection */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="w-1.5 h-6 bg-ely-mint rounded-full shadow-[0_0_10px_rgba(0,201,167,0.4)]" />
                                    <label className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">
                                        Votre Profil
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50/50 rounded-[1.8rem] border border-slate-100">
                                    <button
                                        onClick={() => setProfileType("particulier")}
                                        className={cn(
                                            "py-5 px-6 rounded-[1.4rem] font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3",
                                            profileType === "particulier"
                                                ? "bg-white text-ely-blue shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        )}
                                    >
                                        <User className={cn("w-4 h-4", profileType === "particulier" ? "text-ely-mint" : "text-white/80")} />
                                        Particulier
                                    </button>
                                    <button
                                        onClick={() => setProfileType("pro")}
                                        className={cn(
                                            "py-5 px-6 rounded-[1.4rem] font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3",
                                            profileType === "pro"
                                                ? "bg-white text-ely-blue shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        )}
                                    >
                                        <Building2 className={cn("w-4 h-4", profileType === "pro" ? "text-ely-mint" : "text-white/80")} />
                                        Professionnel
                                    </button>
                                </div>
                            </div>

                            {/* Project Type */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="w-1.5 h-7 bg-ely-mint rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" />
                                    <label className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">
                                        Nature de votre prêt
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: "personal", label: "Personnel", icon: User },
                                        { id: "auto", label: "Auto/Moto", icon: CheckCircle2 },
                                        { id: "pro", label: "Business", icon: History },
                                        { id: "other", label: "Autre", icon: Info },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setProjectType(type.id)}
                                            className={cn(
                                                "p-5 rounded-[1.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-3 text-center group relative overflow-hidden",
                                                projectType === type.id
                                                    ? "border-ely-mint bg-white/10 text-white shadow-xl shadow-ely-mint/10 scale-105"
                                                    : "border-white/5 text-white/50 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-3 rounded-xl transition-all duration-500",
                                                projectType === type.id ? "bg-white shadow-lg text-ely-mint" : "bg-white/20 text-white/80 group-hover:bg-white/30 group-hover:text-white"
                                            )}>
                                                <type.icon className="w-5 h-5" />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-widest transition-colors",
                                                projectType === type.id ? "text-white" : "text-white/90"
                                            )}>{type.label}</span>
                                            {projectType === type.id && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-2 h-2 bg-ely-mint rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Conditional Description for "Other" */}
                                <AnimatePresence>
                                    {projectType === "other" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-white/90 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-ely-blue" />
                                                    Précisez votre projet
                                                </label>
                                                <input
                                                    type="text"
                                                    value={projectDescription}
                                                    onChange={(e) => setProjectDescription(e.target.value)}
                                                    placeholder="Décrivez brièvement votre besoin (ex: Travaux, Mariage, Voyage...)"
                                                    className="w-full px-8 py-5 bg-white rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint outline-none transition-all font-bold text-slate-900 shadow-sm"
                                                    autoFocus
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Amount Slider */}
                            <div className="space-y-10">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-5 bg-ely-mint rounded-full shadow-[0_0_8px_rgba(0,201,167,0.4)]" />
                                            <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">
                                                Montant souhaité
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">Ajustez selon votre besoin réel.</p>
                                    </div>
                                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 font-black text-3xl text-white shadow-xl backdrop-blur-md group-hover:scale-105 transition-transform duration-500">
                                        {amount.toLocaleString()} <span className="text-xl font-black text-white/20 ml-1">€</span>
                                    </div>
                                </div>
                                <div className="relative pt-4">
                                    <input
                                        type="range"
                                        min="2000"
                                        max="1000000"
                                        step="1000"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ely-mint [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ely-mint [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] transition-all"
                                    />
                                    <div className="flex justify-between mt-6 text-xs font-black text-slate-900 uppercase tracking-[0.15em]">
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">Min: 2 000€</span>
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">Max: 1 000 000€</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rate Slider */}
                            <div className="space-y-10">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-5 bg-ely-mint rounded-full shadow-[0_0_8px_rgba(0,201,167,0.4)]" />
                                            <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">
                                                Taux d'intérêt annuel
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">Taux fixe AGMINVEST</p>
                                    </div>
                                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 font-black text-3xl text-ely-mint shadow-xl backdrop-blur-md">
                                        {annualRate.toFixed(2)} <span className="text-xl font-black text-white/20 ml-1">%</span>
                                    </div>
                                </div>
                                <div className="relative pt-4">
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="15.0"
                                        step="0.01"
                                        value={annualRate}
                                        onChange={(e) => setAnnualRate(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ely-mint [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ely-mint [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] transition-all"
                                    />
                                    <div className="flex justify-between mt-6 text-xs font-black text-slate-900 uppercase tracking-[0.15em]">
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">0.50 %</span>
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">15.00 %</span>
                                    </div>
                                </div>
                            </div>

                            {/* Duration Slider */}
                            <div className="space-y-10">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-5 bg-ely-mint rounded-full shadow-[0_0_8px_rgba(0,201,167,0.4)]" />
                                            <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">
                                                Durée du remboursement
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">Exprimée en mensualités</p>
                                    </div>
                                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 font-black text-3xl text-white shadow-xl backdrop-blur-md">
                                        {duration} <span className="text-xl font-black text-white/20 ml-1">mois</span>
                                    </div>
                                </div>
                                <div className="relative pt-4">
                                    <input
                                        type="range"
                                        min="6"
                                        max="360"
                                        step="6"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ely-mint [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ely-mint [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_20px_rgba(0,201,167,0.6)] transition-all"
                                    />
                                    <div className="flex justify-between mt-6 text-xs font-black text-slate-900 uppercase tracking-[0.15em]">
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">6 mois</span>
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">30 ans</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-[1.8rem] font-black text-lg shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 mt-6"
                            >
                                <span className="uppercase tracking-[0.2em] text-xs">Continuer vers l'identité</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                            </button>
                        </div>

                        {/* Summary View */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/20 relative overflow-hidden group border border-white/10 backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-ely-mint/5 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">Estimation Mensuelle</h3>
                                        <div className="flex items-center justify-center">
                                            <p className="text-5xl font-black text-ely-mint flex items-end drop-shadow-2xl">
                                                {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                <span className="text-xl font-bold ml-2 mb-2 text-white/60">€</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Capital</span>
                                            <span className="font-black text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Coût total</span>
                                            <span className="font-black text-sm text-ely-mint">{(totalCost - (amount * 0.00035 * duration)).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €</span>
                                        </div>

                                        <div className="pt-6 px-2 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Montant total dû</span>
                                                <span className="font-black text-2xl text-white tracking-tighter">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">TAEG</span>
                                                <span className="px-3 py-1 bg-ely-mint/10 text-ely-mint rounded-lg text-[11px] font-black border border-ely-mint/20">
                                                    {(annualRate + 0.55).toFixed(2)} %
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ely-blue/5 text-ely-blue rounded-2xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">100% Sécurisé</p>
                                        <p className="text-xs text-slate-400">Chiffrement AES-256 bits</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                                        "L'expertise AGM INVEST pour vos financements jusqu'à 1 million d'euros."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step-identity"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white space-y-8">
                            <div className="space-y-3 border-b border-slate-50 pb-6">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Votre Identité</h3>
                                <p className="text-slate-500 font-medium text-base leading-relaxed">Ces informations sont nécessaires pour l'édition de votre contrat.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Civilité
                                    </label>
                                    <select
                                        name="civility"
                                        value={formData.civility}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    >
                                        <option value="M.">Monsieur (M.)</option>
                                        <option value="Mme">Madame (Mme)</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Nationalité
                                    </label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Ex: Française"
                                        className="w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Nom de famille
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm custom-date-input"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Lieu de naissance
                                    </label>
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleChange}
                                        placeholder="Ex: Paris"
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-[2] py-4 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Suivant: Votre Situation
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 relative overflow-hidden group border border-white/10 backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-ely-mint/5 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">Estimation Mensuelle</h3>
                                        <div className="flex items-center justify-center">
                                            <p className="text-5xl font-black text-ely-mint flex items-end drop-shadow-2xl">
                                                {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                <span className="text-xl font-bold ml-2 mb-2 text-white/60">€</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Capital</span>
                                            <span className="font-black text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Durée</span>
                                            <span className="font-black text-sm">{duration} mois</span>
                                        </div>
                                        <div className="pt-6 px-2 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Montant total dû</span>
                                                <span className="font-black text-2xl text-white tracking-tighter">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ely-blue/5 text-ely-blue rounded-2xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Données Sécurisées</p>
                                        <p className="text-xs text-slate-400">Certifié conforme RGPD</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step-situation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white space-y-8">
                            <div className="space-y-3 border-b border-slate-50 pb-6">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Votre Situation</h3>
                                <p className="text-slate-500 font-medium text-base leading-relaxed">Détails sur votre cadre de vie et famille.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        État Civil
                                    </label>
                                    <select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    >
                                        <option value="single">Célibataire</option>
                                        <option value="married">Marié(e)</option>
                                        <option value="pacs">Pacsé(e)</option>
                                        <option value="divorced">Divorcé(e)</option>
                                        <option value="widow">Veuf/Veuve</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Enfants à charge
                                    </label>
                                    <input
                                        type="number"
                                        name="children"
                                        value={formData.children}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Logement actuel
                                    </label>
                                    <select
                                        name="housingType"
                                        value={formData.housingType}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    >
                                        <option value="tenant">Locataire</option>
                                        <option value="owner">Propriétaire</option>
                                        <option value="owner_mortgage">Propriétaire avec crédit</option>
                                        <option value="free">Hébergé gratuitement</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Ancienneté (ans)
                                    </label>
                                    <input
                                        type="number"
                                        name="housingSeniority"
                                        value={formData.housingSeniority}
                                        onChange={handleChange}
                                        placeholder="Ex: 5"
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Adresse de résidence
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Numéro et nom de rue"
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Code Postal
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        placeholder="Ex: 75000"
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ex: Paris"
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-[2] py-4 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Suivant: Vos Finances
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 relative overflow-hidden group border border-white/10 backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-ely-mint/5 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">Estimation Mensuelle</h3>
                                        <div className="flex items-center justify-center">
                                            <p className="text-5xl font-black text-ely-mint flex items-end drop-shadow-2xl">
                                                {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                <span className="text-xl font-bold ml-2 mb-2 text-white/60">€</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Capital</span>
                                            <span className="font-black text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">Durée</span>
                                            <span className="font-black text-sm">{duration} mois</span>
                                        </div>
                                        <div className="pt-6 px-2 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Montant total dû</span>
                                                <span className="font-black text-2xl text-white tracking-tighter">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ely-blue/5 text-ely-blue rounded-2xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Données Sécurisées</p>
                                        <p className="text-xs text-slate-400">Certifié conforme RGPD</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step-finances"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white space-y-8">
                            <div className="space-y-3 border-b border-slate-50 pb-6">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vos Finances</h3>
                                <p className="text-slate-500 font-medium text-base leading-relaxed">Évaluation de la faisabilité de votre projet.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Revenus mensuels nets
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="income"
                                            value={formData.income}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                        />
                                        <Euro className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Charges mensuelles
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="charges"
                                            value={formData.charges}
                                            onChange={handleChange}
                                            className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                        />
                                        <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Profession
                                    </label>
                                    <select
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                    >
                                        <option value="cdi">CDI</option>
                                        <option value="cdd">CDD</option>
                                        <option value="liberal">Libéral / Indépendant</option>
                                        <option value="retired">Retraité</option>
                                        <option value="student">Étudiant</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                        Banque principale
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            placeholder="Ex: Société Générale"
                                            className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm"
                                        />
                                        <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-8">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(5)}
                                    className="flex-[2] py-4 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Résumé de la demande
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-gradient-to-br from-ely-blue to-blue-800 text-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 relative overflow-hidden group border border-white/10 backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">Votre Reste à vivre</h3>
                                        <p className="text-4xl font-black text-ely-mint flex items-end justify-center drop-shadow-2xl">
                                            {Math.max(0, (Number(formData.income) || 0) - (Number(formData.charges) || 0)).toLocaleString()}
                                            <span className="text-xl font-bold ml-2 mb-2 text-white/60">€/m</span>
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-8 border-t border-white/10 text-[9px] font-bold text-white/30 uppercase tracking-widest text-center leading-relaxed">
                                        Ce calcul est une estimation simplifiée basée sur vos déclarations réeelles.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step-final"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-ely-blue to-blue-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 border border-white/10 space-y-10 relative overflow-hidden group">
                            <div className="text-center space-y-4 relative">
                                <div className="inline-flex items-center justify-center p-5 bg-white/5 rounded-[2rem] mb-2 border border-white/10 shadow-xl backdrop-blur-md">
                                    <ShieldCheck className="w-12 h-12 text-ely-mint" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Récapitulatif Final</h1>
                                <p className="text-white font-medium text-base max-w-xl mx-auto leading-relaxed italic">
                                    Veuillez vérifier vos informations avant la soumission sécurisée de votre dossier.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8 p-8 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white">
                                        <Calculator className="w-40 h-40" />
                                    </div>
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                                        <div className="p-2.5 bg-white/10 rounded-xl shadow-sm text-ely-mint border border-white/10">
                                            <Calculator className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Le Projet</h4>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">Montant</span>
                                            <span className="font-black text-white text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">Durée</span>
                                            <span className="font-black text-white text-sm">{duration} mois</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/10 px-5 py-4 rounded-xl border border-white/10 shadow-inner">
                                            <span className="text-white font-bold text-xs">Mensualité</span>
                                            <span className="font-black text-ely-mint text-lg">{totalMonthlyPayment.toLocaleString()} €</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 p-8 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white">
                                        <User className="w-40 h-40" />
                                    </div>
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                                        <div className="p-2.5 bg-white/10 rounded-xl shadow-sm text-ely-mint border border-white/10">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Demandeur</h4>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">Identité</span>
                                            <span className="font-black text-white text-sm">{formData.firstName} {formData.lastName.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">Ville</span>
                                            <span className="font-black text-white text-sm">{formData.city}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">Profession</span>
                                            <span className="font-black text-white text-xs uppercase tracking-wider">{formData.profession}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-8">
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white/50 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
                                    disabled={isSubmitting}
                                >
                                    <ArrowLeft className="w-4 h-4 text-ely-mint" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-[2] py-4 bg-gradient-to-r from-ely-mint to-emerald-500 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-ely-mint/20 hover:shadow-ely-mint/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Traitement..." : "Confirmer"}
                                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Lock className="w-3 h-3 text-ely-mint" />
                                    Données sécurisées par cryptage AGMINVEST
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 6 && (
                    <motion.div
                        key="step-success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-gradient-to-br from-ely-blue to-blue-800 p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/30 border border-white/10 space-y-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-24 h-24 bg-ely-mint text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-ely-mint/30"
                        >
                            <CheckCircle2 className="w-12 h-12" />
                        </motion.div>
                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Dossier Transmis !</h2>
                            <p className="text-white font-medium text-lg max-w-lg mx-auto leading-relaxed">
                                Votre demande de <span className="text-ely-mint font-bold">{amount.toLocaleString()} €</span> est en cours d'analyse.
                            </p>
                        </div>
                        <div className="pt-8 flex flex-col md:flex-row justify-center gap-4">
                            <button
                                onClick={() => router.push("/dashboard/requests")}
                                className="px-10 py-4 bg-ely-mint text-ely-blue rounded-2xl font-black text-base shadow-lg shadow-ely-mint/20 hover:scale-[1.05] transition-all"
                            >
                                Suivre ma demande
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-10 py-4 bg-white/5 text-white/70 rounded-2xl font-black text-base border border-white/10 hover:bg-white/10 hover:text-white transition-all font-sans"
                            >
                                Recommencer
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
