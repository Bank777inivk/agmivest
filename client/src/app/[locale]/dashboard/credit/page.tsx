"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calculator,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Info,
    TrendingUp,
    Clock,
    Euro,
    ArrowLeft,
    Percent,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    FileText,
    History,
    Building2,
    Briefcase,
    Globe,
    ChevronRight,
    Search,
    Lock
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";

export default function CreditRequestPage() {
    const t = useTranslations('CreditRequest');
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingActive, setIsCheckingActive] = useState(true);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
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
                    const active = querySnapshot.docs.some(d => d.data().status === "pending" || d.data().status === "processing");

                    if (active) {
                        setHasActiveRequest(true);
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
                    className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl border border-gray-100 space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-gray-200">
                        <Lock className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 w-24 h-24 bg-ely-blue/5 text-ely-blue rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-8 ring-ely-blue/5">
                        <Lock className="w-12 h-12" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Je vous informe que :</h2>
                        <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                            Vous avez déjà une demande de financement en cours de traitement.
                            <br />
                            <span className="text-gray-400 text-lg">Par mesure de sécurité et de qualité d'étude, nous ne permettons qu'un seul dossier actif à la fois.</span>
                        </p>
                    </div>

                    <div className="relative z-10 pt-10 flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => router.push("/dashboard/requests")}
                            className="px-10 py-5 bg-ely-blue text-white rounded-2xl font-bold shadow-2xl shadow-ely-blue/20 hover:bg-ely-blue/90 transition-all flex items-center justify-center gap-3 group"
                        >
                            Suivre mon dossier
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Retour au tableau de bord
                        </button>
                    </div>

                    {/* Support note */}
                    <p className="relative z-10 text-sm font-medium text-gray-400 pt-10">
                        Besoin d'aide ? <button className="text-ely-blue hover:underline font-bold">Contactez un conseiller</button>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-ely-mint text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-ely-mint/20">
                            Simulation Premium
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Faire une demande de crédit</h1>
                    <p className="text-gray-500 font-medium font-sans">Financez vos projets les plus ambitieux avec nos options sur-mesure.</p>
                </div>

                {/* Stepper with labels */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 1, label: "Projet" },
                        { id: 2, label: "Identité" },
                        { id: 3, label: "Situation" },
                        { id: 4, label: "Finances" },
                        { id: 5, label: "Résumé" }
                    ].map((s) => (
                        <div key={s.id} className="flex items-center gap-3 shrink-0">
                            <div className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s.id ? "bg-ely-blue text-white shadow-lg shadow-ely-blue/20" : "bg-gray-50 text-gray-300"
                                    }`}>
                                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-tighter ${step >= s.id ? "text-ely-blue" : "text-gray-300"}`}>{s.label}</span>
                            </div>
                            {s.id < 5 && <div className={`w-4 sm:w-8 h-[2px] rounded-full mb-3 ${step > s.id ? "bg-ely-blue" : "bg-gray-100"}`} />}
                        </div>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step-simulator"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Simulation controls - SIMPLE GRAY THEME */}
                        <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none text-gray-200">
                                <Calculator className="w-64 h-64" />
                            </div>

                            {/* Profile Type Selection */}
                            <div className="space-y-6">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4 text-ely-blue" />
                                    Votre Profil
                                </label>
                                <div className="grid grid-cols-2 gap-4 p-2 bg-white rounded-3xl border border-gray-100">
                                    <button
                                        onClick={() => setProfileType("particulier")}
                                        className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${profileType === "particulier"
                                            ? "bg-ely-blue text-white shadow-lg shadow-ely-blue/20"
                                            : "text-gray-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        <User className="w-4 h-4" />
                                        Particulier
                                    </button>
                                    <button
                                        onClick={() => setProfileType("pro")}
                                        className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${profileType === "pro"
                                            ? "bg-ely-blue text-white shadow-lg shadow-ely-blue/20"
                                            : "text-gray-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Building2 className="w-4 h-4" />
                                        Professionnel
                                    </button>
                                </div>
                            </div>

                            {/* Project Type */}
                            <div className="space-y-6">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-ely-blue" />
                                    Nature de votre prêt
                                </label>
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
                                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center group ${projectType === type.id
                                                ? "border-ely-mint bg-ely-mint/5 text-ely-blue shadow-lg shadow-ely-mint/5"
                                                : "border-gray-100 text-gray-400 bg-white hover:border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <type.icon className={`w-6 h-6 ${projectType === type.id ? "text-ely-mint" : "text-gray-300 group-hover:text-gray-400"}`} />
                                            <span className="text-sm font-bold">{type.label}</span>
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
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-ely-blue" />
                                                    Précisez votre projet
                                                </label>
                                                <input
                                                    type="text"
                                                    value={projectDescription}
                                                    onChange={(e) => setProjectDescription(e.target.value)}
                                                    placeholder="Décrivez brièvement votre besoin (ex: Travaux, Mariage, Voyage...)"
                                                    className="w-full px-8 py-5 bg-white rounded-[2rem] border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900 shadow-sm"
                                                    autoFocus
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Amount Slider */}
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Euro className="w-4 h-4 text-ely-blue" />
                                        Montant souhaité
                                    </label>
                                    <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 font-black text-3xl text-ely-blue">
                                        {amount.toLocaleString()} <span className="text-lg font-bold text-gray-400 ml-1">€</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="2000"
                                    max="1000000"
                                    step="1000"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-ely-blue transition-all"
                                />
                                <div className="flex justify-between text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">Min: 2 000€</span>
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">Max: 1 000 000€</span>
                                </div>
                            </div>

                            {/* Rate Slider */}
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-ely-blue" />
                                        Taux d'intérêt annuel (fixe)
                                    </label>
                                    <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 font-black text-3xl text-ely-mint">
                                        {annualRate.toFixed(2)} <span className="text-lg font-bold text-gray-400 ml-1">%</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="15.0"
                                    step="0.01"
                                    value={annualRate}
                                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-ely-mint transition-all"
                                />
                                <div className="flex justify-between text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">0.50 %</span>
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">15.00 %</span>
                                </div>
                            </div>

                            {/* Duration Slider */}
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-ely-blue" />
                                        Durée du remboursement
                                    </label>
                                    <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 font-black text-3xl text-ely-blue">
                                        {duration} <span className="text-lg font-bold text-gray-400 ml-1">mois</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="6"
                                    max="360"
                                    step="6"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-ely-blue transition-all"
                                />
                                <div className="flex justify-between text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">6 mois</span>
                                    <span className="bg-white px-3 py-1 rounded-full border border-gray-100">360 mois (30 ans)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-6 bg-ely-blue text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                            >
                                Étape suivante: Validation profil
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>

                        {/* Summary View */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#0A2647] text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group border border-white/5">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-ely-mint/10 rounded-full blur-3xl" />

                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estimation Mensuelle</h3>
                                        <p className="text-6xl font-black text-ely-mint flex items-end justify-center">
                                            {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            <span className="text-2xl font-bold ml-2 mb-2 text-white/60">€</span>
                                        </p>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-white/60">Capital emprunté</span>
                                            <span className="font-black">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-white/60">Coût total (intérêts)</span>
                                            <span className="font-black text-ely-mint">{(totalCost - (amount * 0.00035 * duration)).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                            <span className="font-bold text-white/90">Montant total dû</span>
                                            <span className="font-black text-xl text-white">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">TAEG appliqué</p>
                                        <p className="text-2xl font-black text-ely-mint">{(annualRate + 0.55).toFixed(2)} %</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ely-blue/5 text-ely-blue rounded-2xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">100% Sécurisé</p>
                                        <p className="text-xs text-gray-400">Chiffrement AES-256 bits</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Votre Identité</h3>
                                <p className="text-gray-500 font-medium font-sans">Ces informations sont nécessaires pour l'édition de votre contrat.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-4 h-4 text-ely-blue" />
                                        Civilité
                                    </label>
                                    <select
                                        name="civility"
                                        value={formData.civility}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    >
                                        <option value="M.">Monsieur (M.)</option>
                                        <option value="Mme">Madame (Mme)</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-ely-blue" />
                                        Nationalité
                                    </label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Ex: Française"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <History className="w-4 h-4 text-ely-blue" />
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-ely-blue" />
                                        Lieu de naissance
                                    </label>
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleChange}
                                        placeholder="Ex: Paris"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-lg hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-[2] py-6 bg-ely-blue text-white rounded-3xl font-black text-lg shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Étape suivante: Situation
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#0A2647] text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group border border-white/5">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-ely-mint/10 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estimation Mensuelle</h3>
                                        <p className="text-6xl font-black text-ely-mint flex items-end justify-center">
                                            {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            <span className="text-2xl font-bold ml-2 mb-2 text-white/60">€</span>
                                        </p>
                                    </div>
                                    <div className="space-y-6 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-white/60">Capital emprunté</span>
                                            <span className="font-black">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-white/60">Durée</span>
                                            <span className="font-black">{duration} mois</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                            <span className="font-bold text-white/90">Montant total dû</span>
                                            <span className="font-black text-xl text-white">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-ely-blue/5 text-ely-blue rounded-2xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">Données Sécurisées</p>
                                        <p className="text-xs text-gray-400">Certifié conforme RGPD</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step-situation"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Votre Situation</h3>
                                <p className="text-gray-500 font-medium font-sans">Détails sur votre cadre de vie et famille.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <History className="w-4 h-4 text-ely-blue" />
                                        État Civil
                                    </label>
                                    <select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    >
                                        <option value="single">Célibataire</option>
                                        <option value="married">Marié(e)</option>
                                        <option value="pacs">Pacsé(e)</option>
                                        <option value="divorced">Divorcé(e)</option>
                                        <option value="widow">Veuf/Veuve</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Enfants à charge
                                    </label>
                                    <input
                                        type="number"
                                        name="children"
                                        value={formData.children}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-ely-blue" />
                                        Logement actuel
                                    </label>
                                    <select
                                        name="housingType"
                                        value={formData.housingType}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    >
                                        <option value="tenant">Locataire</option>
                                        <option value="owner">Propriétaire</option>
                                        <option value="owner_mortgage">Propriétaire avec crédit</option>
                                        <option value="free">Hébergé gratuitement</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Ancienneté (ans)
                                    </label>
                                    <input
                                        type="number"
                                        name="housingSeniority"
                                        value={formData.housingSeniority}
                                        onChange={handleChange}
                                        placeholder="Ex: 5"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-ely-blue" />
                                        Adresse de résidence
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Numéro et nom de rue"
                                        className="w-full px-8 py-5 bg-white rounded-3xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-ely-blue" />
                                        Code Postal
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        placeholder="Ex: 75000"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-ely-blue" />
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ex: Paris"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-ely-blue" />
                                        Numéro de téléphone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-8 py-5 bg-white rounded-3xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-10">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-lg hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-[2] py-6 bg-ely-blue text-white rounded-3xl font-black text-lg shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Étape suivante: Finances
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#0A2647] text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group border border-white/5">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-ely-mint/10 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estimation Mensuelle</h3>
                                        <p className="text-6xl font-black text-ely-mint flex items-end justify-center">
                                            {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            <span className="text-2xl font-bold ml-2 mb-2 text-white/60">€</span>
                                        </p>
                                    </div>
                                    <div className="space-y-6 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-white/60">Capital emprunté</span>
                                            <span className="font-black">{amount.toLocaleString()} €</span>
                                        </div>
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
                        <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Vos Finances</h3>
                                <p className="text-gray-500 font-medium font-sans">Informations sur vos revenus et votre profession.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-ely-blue" />
                                        Profession
                                    </label>
                                    <input
                                        type="text"
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleChange}
                                        placeholder="Ex: Consultant"
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Société / Employeur
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Type de contrat
                                    </label>
                                    <select
                                        name="contractType"
                                        value={formData.contractType}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    >
                                        <option value="cdi">CDI</option>
                                        <option value="cdd">CDD</option>
                                        <option value="liberal">Libéral / Indépendant</option>
                                        <option value="pro">Chef d'entreprise</option>
                                        <option value="retired">Retraité</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Euro className="w-4 h-4 text-ely-blue" />
                                        Revenus nets mensuels (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="income"
                                        value={formData.income}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Charges fixes mensuelles (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="charges"
                                        value={formData.charges}
                                        onChange={handleChange}
                                        placeholder="Loyer, crédits en cours..."
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Personnel
                                        Autres crédits en cours
                                    </label>
                                    <input
                                        type="number"
                                        name="otherCredits"
                                        value={formData.otherCredits}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-ely-mint outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-10">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-lg hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setStep(5)}
                                    className="flex-[2] py-6 bg-ely-blue text-white rounded-3xl font-black text-lg shadow-xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Étape suivante: Récapitulatif
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Summary View (Right Column) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-[#0A2647] text-white p-10 rounded-[3.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group border border-white/5">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-ely-mint/10 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Votre Reste à vivre</h3>
                                        <p className="text-5xl font-black text-ely-mint flex items-end justify-center">
                                            {Math.max(0, (Number(formData.income) || 0) - (Number(formData.charges) || 0)).toLocaleString()}
                                            <span className="text-xl font-bold ml-2 mb-2 text-white/60">€/m</span>
                                        </p>
                                    </div>
                                    <div className="space-y-6 pt-10 border-t border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest text-center leading-relaxed">
                                        Ce calcul est une estimation simplifiée basée sur vos déclarations.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step-recap"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Récapitulatif de votre demande</h2>
                                <p className="text-gray-500 font-medium font-sans">Vérifiez vos informations avant l'envoi définitif.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 p-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                                    <h4 className="font-black text-ely-blue uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <Calculator className="w-4 h-4" />
                                        Le Projet
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Montant :</span><span className="font-bold text-gray-900">{amount.toLocaleString()} €</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Durée :</span><span className="font-bold text-gray-900">{duration} mois</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Mensualité :</span><span className="font-bold text-ely-mint">{totalMonthlyPayment.toFixed(2)} €</span></div>
                                    </div>
                                </div>
                                <div className="space-y-6 p-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                                    <h4 className="font-black text-ely-blue uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Identité
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Nom :</span><span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Email :</span><span className="font-bold text-gray-900">{auth.currentUser?.email}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">Profil :</span><span className="font-black uppercase text-[10px] bg-ely-blue text-white px-3 py-1 rounded-full">{profileType}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 pt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-8 bg-ely-blue text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-ely-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                                >
                                    {isSubmitting ? <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : (
                                        <>
                                            TRANSMETTRE MON DOSSIER
                                            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <button onClick={() => setStep(4)} className="py-2 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-gray-600 transition-colors">Modifier mes informations</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 6 && (
                    <motion.div
                        key="step-success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-white p-12 md:p-24 rounded-[5rem] shadow-2xl shadow-ely-mint/10 border border-gray-100 space-y-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-32 h-32 bg-ely-mint text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-ely-mint/40"
                        >
                            <CheckCircle2 className="w-16 h-16" />
                        </motion.div>
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tight italic uppercase">Dossier Transmis !</h2>
                            <p className="text-gray-500 font-medium text-xl max-w-xl mx-auto leading-relaxed">
                                Votre demande de financement de <span className="text-ely-blue font-bold">{amount.toLocaleString()} €</span> est désormais en cours d'analyse par nos experts.
                            </p>
                        </div>
                        <div className="pt-10 flex flex-col md:flex-row justify-center gap-6">
                            <button
                                onClick={() => router.push("/dashboard/requests")}
                                className="px-12 py-5 bg-ely-blue text-white rounded-[2rem] font-black text-lg shadow-xl shadow-ely-blue/20 hover:scale-[1.05] transition-all"
                            >
                                Suivre ma demande
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-12 py-5 bg-gray-50 text-gray-400 rounded-[2rem] font-black text-lg border border-gray-100 hover:bg-gray-100 transition-all font-sans"
                            >
                                Faire une autre demande
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
