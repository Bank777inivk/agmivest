"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Euro, Building2, User, FileText, Send, Calendar, MapPin,
    Globe, ShieldCheck, Briefcase, Home, Info, ArrowLeft, ArrowRight,
    Search, CheckCircle2, AlertCircle, TrendingUp, Mail, Lock, ChevronRight, Percent, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Validation logic and score calculation (Mock)
const calculateScore = (data: any) => {
    const income = parseFloat(data.income) || 0;
    const charges = (parseFloat(data.charges) || 0) + (parseFloat(data.otherCredits) || 0);
    const requestedAmount = parseFloat(data.amount) || 0;
    const duration = parseFloat(data.duration) || 12;

    // Theoretical monthly payment (5% annual interest as mock)
    const monthlyPayment = (requestedAmount * (1 + 0.05)) / duration;
    const totalNewCharges = charges + monthlyPayment;
    const debtRatio = income > 0 ? (totalNewCharges / income) * 100 : 100;

    let score = 0;
    let status = "Review";
    let messageKey = "";

    if (debtRatio < 33) {
        score = 85 + Math.random() * 10;
        status = "Approved";
        messageKey = "approvedMessage";
    } else if (debtRatio < 45) {
        score = 65 + Math.random() * 15;
        status = "Review";
        messageKey = "reviewMessage";
    } else {
        score = 20 + Math.random() * 20;
        status = "Rejected";
        messageKey = "rejectedMessage";
    }

    return { score: Math.round(score), status, messageKey, debtRatio: Math.round(debtRatio) };
};

export default function CreditRequestPage() {
    const t = useTranslations('CreditRequest');
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [profileType, setProfileType] = useState<"particulier" | "pro">("particulier");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scoringResult, setScoringResult] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        // Project
        creditType: "personal",
        amount: "",
        duration: "",
        rate: "",
        purpose: "",
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
        // Personal
        phone: "",
        maritalStatus: "single",
        children: "0",
        housingType: "tenant",
        housingSeniority: "",
        address: "",
        // Financial
        profession: "",
        companyName: "",
        contractType: "cdi",
        income: "",
        charges: "",
        otherCredits: "0",
        // Account
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

    useEffect(() => {
        const amount = searchParams.get("amount");
        const duration = searchParams.get("duration");
        const rate = searchParams.get("rate");

        if (amount || duration || rate) {
            setFormData(prev => ({
                ...prev,
                amount: amount || prev.amount,
                duration: duration || prev.duration,
                rate: rate || prev.rate
            }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 6));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des mots de passe
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        if (formData.password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Créer le compte utilisateur
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // 2. Enregistrer les données utilisateur dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                civility: formData.civility,
                birthDate: formData.birthDate,
                birthPlace: formData.birthPlace,
                nationality: formData.nationality,
                idType: formData.idType,
                idNumber: formData.idNumber,
                idExpiry: formData.idExpiry,
                idIssuingCountry: formData.idIssuingCountry,
                phone: formData.phone,
                maritalStatus: formData.maritalStatus,
                children: parseInt(formData.children) || 0,
                housingType: formData.housingType,
                housingSeniority: parseInt(formData.housingSeniority) || 0,
                address: formData.address,
                profession: formData.profession,
                companyName: formData.companyName,
                contractType: formData.contractType,
                income: parseFloat(formData.income) || 0,
                charges: parseFloat(formData.charges) || 0,
                otherCredits: parseFloat(formData.otherCredits) || 0,
                idStatus: "pending",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // 3. Créer la demande de prêt
            const requestData = {
                userId: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                projectType: formData.creditType === "personal" ? "Prêt Personnel" :
                    formData.creditType === "auto" ? "Crédit Auto" :
                        formData.creditType === "pro" ? "Crédit Professionnel" : "Autre",
                amount: parseFloat(formData.amount) || 0,
                duration: parseInt(formData.duration) || 12,
                rate: parseFloat(formData.rate) || 4.95,
                monthlyPayment: (parseFloat(formData.amount) * (1 + (parseFloat(formData.rate) || 4.95) / 100)) / (parseInt(formData.duration) || 12),
                monthlyIncome: parseFloat(formData.income) || 0,
                monthlyExpenses: parseFloat(formData.charges) || 0,
                otherLoans: parseFloat(formData.otherCredits) || 0,
                phone: formData.phone,
                companyName: formData.companyName,
                profession: formData.profession,
                situation: formData.contractType,
                status: "pending",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, "requests"), requestData);

            // 4. Calculer le score pour affichage
            const result = calculateScore(formData);
            setScoringResult(result);
            setIsSubmitting(false);
            setStep(6);

        } catch (error: any) {
            setIsSubmitting(false);
            console.error("Erreur lors de la soumission:", error);

            // Gestion des erreurs Firebase
            if (error.code === "auth/email-already-in-use") {
                alert("Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.");
            } else if (error.code === "auth/weak-password") {
                alert("Le mot de passe est trop faible. Utilisez au moins 6 caractères.");
            } else if (error.code === "auth/invalid-email") {
                alert("L'adresse email n'est pas valide.");
            } else {
                alert("Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.");
            }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // Dynamic Step Titles
    const getStepTitle = () => {
        if (step <= 5) return t('title.step' + step as any);
        return t('title.analysis');
    }

    return (
        <main className="min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans overflow-x-hidden">
            {/* Mesh Gradients for Premium Look */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ely-mint/20 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ely-blue/10 blur-[120px] rounded-full -z-10" />

            {/* Minimalist Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10">
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#00D1B2 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center justify-center gap-2 mb-4"
                    >
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-official.png"
                                alt="AGM INVEST"
                                width={128}
                                height={64}
                                className="h-12 sm:h-16 w-auto object-contain"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-gray-200 mx-2"></div>
                        <motion.span
                            key={profileType}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap ${profileType === "pro" ? "bg-ely-blue text-white" : "bg-ely-mint text-white shadow-lg shadow-ely-mint/20"
                                }`}
                        >
                            {profileType === "pro" ? t('Profile.pro_badge') : t('Profile.individual_badge')}
                        </motion.span>
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                        {getStepTitle()}
                    </h1>
                    {step <= 5 && (
                        <p className="text-gray-500 max-w-md">
                            {t('subtitle')}
                        </p>
                    )}
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white relative overflow-hidden">
                    {/* Subtle interior glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-ely-mint/5 -z-10" />
                    {/* Progress Bar (Stepper) */}
                    {step <= 5 && (
                        <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
                            <div className="flex justify-between items-center relative">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className="flex flex-col items-center relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? "bg-ely-mint text-white" : "bg-white border border-gray-200 text-gray-400"
                                            }`}>
                                            {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                        </div>
                                        <span className={`mt-2 text-[10px] font-semibold uppercase tracking-wider hidden sm:block ${step >= s ? "text-ely-blue" : "text-gray-400"
                                            }`}>
                                            {s === 1 ? t('Steps.project') : s === 2 ? t('Steps.identity') : s === 3 ? t('Steps.situation') : s === 4 ? t('Steps.finances') : t('Steps.account')}
                                        </span>
                                    </div>
                                ))}
                                {/* Connector Line */}
                                <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-200 -z-0">
                                    <motion.div
                                        className="h-full bg-ely-mint"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${((Math.max(1, step) - 1) / 4) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {/* STEP 1: PROJET */}
                                {step === 1 && (
                                    <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Profile.label')}</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 bg-gray-50 rounded-[20px] border border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileType("particulier")}
                                                        className={`py-3 sm:py-4 px-6 rounded-[16px] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${profileType === "particulier"
                                                            ? "bg-white text-ely-blue shadow-lg shadow-gray-200/50 border-2 border-ely-mint"
                                                            : "text-gray-400 hover:text-gray-500 border-2 border-transparent"
                                                            }`}
                                                    >
                                                        <User className={`w-4 h-4 ${profileType === "particulier" ? "text-ely-mint" : ""}`} />
                                                        {t('Profile.individual')}
                                                        {profileType === "particulier" && <CheckCircle2 className="w-4 h-4 text-ely-mint ml-auto" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileType("pro")}
                                                        className={`py-3 sm:py-4 px-6 rounded-[16px] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${profileType === "pro"
                                                            ? "bg-white text-ely-blue shadow-lg shadow-gray-200/50 border-2 border-ely-mint"
                                                            : "text-gray-400 hover:text-gray-500 border-2 border-transparent"
                                                            }`}
                                                    >
                                                        <Building2 className={`w-4 h-4 ${profileType === "pro" ? "text-ely-mint" : ""}`} />
                                                        {t('Profile.professional')}
                                                        {profileType === "pro" && <CheckCircle2 className="w-4 h-4 text-ely-mint ml-auto" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Project.label')}</label>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {[
                                                        { id: "personal", icon: User, label: t('Project.labels.personal') },
                                                        { id: "auto", icon: MapPin, label: t('Project.labels.auto') },
                                                        { id: "pro", icon: Building2, label: t('Project.labels.pro') },
                                                        { id: "other", icon: Send, label: t('Project.labels.other') },
                                                    ].map((type) => (
                                                        <div
                                                            key={type.id}
                                                            onClick={() => setFormData(f => ({ ...f, creditType: type.id }))}
                                                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 text-center ${formData.creditType === type.id ? "border-ely-mint bg-ely-mint/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-100"
                                                                }`}
                                                        >
                                                            <type.icon className={`w-6 h-6 ${formData.creditType === type.id ? "text-ely-mint" : "text-gray-300"}`} />
                                                            <span className="text-sm font-bold text-gray-700">{type.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {formData.creditType === "other" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-3 overflow-hidden"
                                                    >
                                                        <label className="text-sm font-semibold text-gray-700">{t('Project.detailsLabel')}</label>
                                                        <textarea
                                                            name="purpose"
                                                            required
                                                            value={formData.purpose}
                                                            onChange={handleChange}
                                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint outline-none transition-all font-medium min-h-[100px]"
                                                            placeholder={t('Project.detailsPlaceholder')}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Project.amount')}</label>
                                                    <div className="relative">
                                                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            required
                                                            value={formData.amount}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint outline-none transition-all font-semibold"
                                                            placeholder="Ex: 15 000"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Project.duration')}</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="number"
                                                            name="duration"
                                                            required
                                                            value={formData.duration}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint outline-none transition-all font-semibold"
                                                            placeholder="Ex: 48"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Project.rate')}</label>
                                                    <div className="relative">
                                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="number"
                                                            name="rate"
                                                            step="0.01"
                                                            min="0"
                                                            max="20"
                                                            value={formData.rate}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint outline-none transition-all font-semibold"
                                                            placeholder="Ex: 4.95"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center sm:justify-end pt-4">
                                            <button type="button" onClick={nextStep} className="w-full sm:w-auto bg-ely-blue text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-ely-blue/90 transition-all">
                                                {t('Navigation.next')} <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: IDENTITÉ */}
                                {step === 2 && (
                                    <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Identity.civility')}</label>
                                                <select name="civility" value={formData.civility} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint focus:ring-2 focus:ring-ely-mint/20">
                                                    <option>M.</option>
                                                    <option>Mme</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Identity.firstName')}</label>
                                                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="Jean" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">{t('Identity.lastName')}</label>
                                            <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="Dupont" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Identity.birthDate')}</label>
                                                <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">Numéro de Téléphone</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90" />
                                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="06 12 34 56 78" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                            <button type="button" onClick={prevStep} className="w-full sm:w-auto text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-600 py-2">
                                                <ArrowLeft className="w-5 h-5" /> {t('Navigation.back')}
                                            </button>
                                            <button type="button" onClick={nextStep} className="w-full sm:w-auto bg-ely-blue text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                                {t('Navigation.next')} <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: SITUATION */}
                                {step === 3 && (
                                    <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Situation.maritalStatus')}</label>
                                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none">
                                                    <option value="single">{t('Situation.options.single')}</option>
                                                    <option value="married">{t('Situation.options.married')}</option>
                                                    <option value="divorced">{t('Situation.options.divorced')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Situation.children')}</label>
                                                <input type="number" name="children" value={formData.children} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="0" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Situation.housingType')}</label>
                                                <select name="housingType" value={formData.housingType} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none">
                                                    <option value="tenant">{t('Situation.options.tenant')}</option>
                                                    <option value="owner">{t('Situation.options.owner')}</option>
                                                    <option value="hosted">{t('Situation.options.hosted')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Situation.housingSeniority')}</label>
                                                <input type="number" name="housingSeniority" value={formData.housingSeniority} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Ex: 5" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                            <button type="button" onClick={prevStep} className="w-full sm:w-auto text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-600 py-2">
                                                <ArrowLeft className="w-5 h-5" /> {t('Navigation.back')}
                                            </button>
                                            <button type="button" onClick={nextStep} className="w-full sm:w-auto bg-ely-blue text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                                {t('Navigation.next')} <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: FINANCES */}
                                {step === 4 && (
                                    <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Finances.contractType')}</label>
                                                <select name="contractType" value={formData.contractType} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none">
                                                    <option value="cdi">{t('Finances.options.cdi')}</option>
                                                    <option value="cdd">{t('Finances.options.cdd')}</option>
                                                    <option value="independent">{t('Finances.options.independent')}</option>
                                                    <option value="retired">{t('Finances.options.retired')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">Nom de l'Employeur / Entreprise</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Ex: AGM INVEST" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Finances.income')}</label>
                                                <div className="relative">
                                                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none font-bold text-ely-blue" placeholder="3 000" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Finances.charges')}</label>
                                                    <input type="number" name="charges" value={formData.charges} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Loyer, etc." />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Finances.otherCredits')}</label>
                                                    <input type="number" name="otherCredits" value={formData.otherCredits} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                            <button type="button" onClick={prevStep} className="w-full sm:w-auto text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-600 py-2">
                                                <ArrowLeft className="w-5 h-5" /> {t('Navigation.back')}
                                            </button>
                                            <button type="button" onClick={nextStep} className="w-full sm:w-auto bg-ely-blue text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                                {t('Navigation.next')} <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 5: COMPTE */}
                                {step === 5 && (
                                    <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Account.email')}</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="jean@exemple.com" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Account.password')}</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-12 p-4 bg-white border border-gray-200 rounded-xl outline-none"
                                                            placeholder="••••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Account.confirmPassword')}</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="confirmPassword"
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 pr-12 p-4 bg-white border border-gray-200 rounded-xl outline-none"
                                                            placeholder="••••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} required className="mt-1 w-5 h-5 accent-ely-mint" />
                                                <span className="text-xs text-gray-500 leading-relaxed">
                                                    {t('Account.terms')}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                            <button type="button" onClick={prevStep} className="w-full sm:w-auto text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-600 py-2">
                                                <ArrowLeft className="w-5 h-5" /> {t('Navigation.back')}
                                            </button>
                                            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-ely-mint text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-ely-mint/90 transition-all shadow-lg shadow-ely-mint/10">
                                                {isSubmitting ? t('Navigation.analyzing') : t('Navigation.submit')}
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 6: RÉSULTATS */}
                                {step === 6 && scoringResult && (
                                    <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-4">
                                        <div className="relative inline-block">
                                            <div className="w-40 h-40 rounded-full border-[10px] border-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <span className={`text-4xl font-bold block ${scoringResult.status === "Approved" ? "text-ely-mint" :
                                                        scoringResult.status === "Review" ? "text-orange-500" : "text-red-500"
                                                        }`}>
                                                        {scoringResult.score}%
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{t('Result.scoreLabel')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                {scoringResult.status === "Approved" ? t('Result.approvedTitle') :
                                                    scoringResult.status === "Review" ? t('Result.reviewTitle') : t('Result.rejectedTitle')}
                                            </h2>
                                            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                                                {t('Result.' + scoringResult.messageKey)}
                                            </p>
                                        </div>

                                        <div className="flex justify-center">
                                            <Link href="/dashboard" className="px-10 py-4 bg-ely-blue text-white rounded-xl font-bold hover:bg-ely-blue/90 shadow-xl shadow-ely-blue/10">
                                                {t('Result.dashboardButton')}
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-ely-mint" /> SSL SECURE 256-BIT
                    </div>
                    <div className="w-px h-3 bg-gray-20 flex" />
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                        KYC VERIFIED
                    </div>
                </div>
            </div>

            {/* Global Loading Overlay */}
            {isSubmitting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 border-4 border-ely-mint/10 border-t-ely-mint rounded-full animate-spin mx-auto"></div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-ely-blue">{t('Loading.title')}</h3>
                            <p className="text-gray-400 font-medium">{t('Loading.subtitle')}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
