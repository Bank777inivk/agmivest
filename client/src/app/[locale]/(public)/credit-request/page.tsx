"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Euro, Building2, User, FileText, Send, Calendar, MapPin,
    Globe, ShieldCheck, Briefcase, Home, Info, ArrowLeft, ArrowRight,
    Search, CheckCircle2, AlertCircle, TrendingUp, Mail, Lock, ChevronRight, Percent, Eye, EyeOff, Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import Simulator from "@/components/Simulator";
import { COUNTRY_PHONE_DATA, COUNTRIES, COUNTRY_TO_NATIONALITY } from "@/lib/constants";
import AddressAutocomplete from "@/components/AddressAutocomplete";

// Validation logic and score calculation (Mock)
const calculateScore = (data: any) => {
    const income = parseFloat(data.income) || 0;
    const charges = (parseFloat(data.charges) || 0) + (parseFloat(data.otherCredits) || 0);
    const requestedAmount = parseFloat(data.amount) || 0;
    const duration = parseFloat(data.duration) || 12;

    // Monthly payment calculation with integrated 3% insurance
    const annualRate = parseFloat(data.rate) || 4.95;
    const monthlyRate = annualRate / 100 / 12;
    const loanMonthly = (requestedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));

    // Add 3% fixed insurance cost spread over the duration
    const totalInsurance = requestedAmount * 0.03;
    const monthlyInsurance = totalInsurance / duration;

    const monthlyPayment = (loanMonthly + monthlyInsurance) || 0;
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
        birthCountry: "France",
        nationality: "Française",
        // Personal
        phone: "",
        phoneCountry: "France",
        maritalStatus: "single",
        children: "0",
        housingType: "tenant",
        housingSeniority: "",
        housingSeniorityMonths: "",
        street: "",
        zipCode: "",
        city: "",
        residenceCountry: "France",
        // Financial
        profession: "",
        companyName: "",
        contractType: "cdi",
        income: "",
        charges: "",
        otherCredits: "0",
        bankName: "",
        iban: "",
        bic: "",
        ribEmail: "",
        // Account
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let val: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        // Prevent negative values for numeric inputs
        if (type === 'number' && val !== "" && parseFloat(val) < 0) {
            val = "0";
        }

        // Restrict phone to digits and spaces, with dynamic max digit limit and auto-format for France
        if (name === "phone") {
            // Remove everything except digits
            let digits = val.replace(/\D/g, "");
            const country = COUNTRY_PHONE_DATA[formData.phoneCountry];
            const limit = country?.maxLength || 15;
            if (digits.length > limit) digits = digits.slice(0, limit);

            // Generic Auto-format based on grouping: [2, 2, 2, 2, 2] -> XX XX XX XX XX
            if (country && country.grouping) {
                let formatted = "";
                let currentPos = 0;
                for (let groupSize of country.grouping) {
                    if (currentPos >= digits.length) break;
                    let group = digits.slice(currentPos, currentPos + groupSize);
                    formatted += (formatted ? " " : "") + group;
                    currentPos += groupSize;
                }
                val = formatted;
            } else {
                val = digits;
            }
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: val };

            // Auto-update nationality when birthCountry changes
            if (name === "birthCountry") {
                if (COUNTRY_TO_NATIONALITY[value]) {
                    newData.nationality = COUNTRY_TO_NATIONALITY[value];
                }
                if (COUNTRY_PHONE_DATA[value]) {
                    newData.phoneCountry = value;
                }
            }

            // Sync phoneCountry with residenceCountry
            if (name === "residenceCountry" && COUNTRY_PHONE_DATA[value]) {
                newData.phoneCountry = value;
            }

            // Logic: Strict mutual exclusivity between Years and Months.
            // If one is modified and contains a value > 0, the other is forced to "0".
            if (name === "housingSeniority" && val !== "" && parseInt(val) > 0) {
                newData.housingSeniorityMonths = "0";
            }
            if (name === "housingSeniorityMonths" && val !== "" && parseInt(val) > 0) {
                newData.housingSeniority = "0";
            }

            return newData;
        });
    };

    const handleAddressSelect = (address: { street: string; city: string; zipCode: string }) => {
        setFormData(prev => ({
            ...prev,
            street: address.street,
            city: address.city,
            zipCode: address.zipCode
        }));
    };

    const getDateStatus = (dateStr: string) => {
        const clean = dateStr.replace(/\s/g, "");
        if (clean.length < 10) return "incomplete";

        const [day, month, year] = clean.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();

        const isLogical = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        if (!isLogical || year < 1900 || date > today) return "invalid";

        // Age check
        let age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;

        return age >= 18 ? "valid" : "underage";
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let digits = e.target.value.replace(/\D/g, "");
        if (digits.length > 8) digits = digits.slice(0, 8);

        // Real-time logical caps
        let day = digits.slice(0, 2);
        let month = digits.slice(2, 4);
        let year = digits.slice(4, 8);

        const currentYear = new Date().getFullYear();

        if (day.length === 2) {
            let d = parseInt(day);
            if (d > 31) day = "31";
            if (d === 0) day = "01";
        }
        if (month.length === 2) {
            let m = parseInt(month);
            if (m > 12) month = "12";
            if (m === 0) month = "01";
        }
        if (year.length === 4) {
            let y = parseInt(year);
            if (y > currentYear) year = currentYear.toString();
        }

        const value = day + month + year;

        let maskedValue = "";
        if (value.length > 0) {
            maskedValue = value.slice(0, 2);
            if (value.length > 2) {
                maskedValue += " / " + value.slice(2, 4);
                if (value.length > 4) {
                    maskedValue += " / " + value.slice(4, 8);
                }
            }
        }

        setFormData(prev => ({ ...prev, birthDate: maskedValue }));
    };

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


    const handleSimulatorChange = useCallback((amount: number, duration: number, rate: number) => {
        // Synchronisation depuis la calculatrice (durée déjà en mois)
        setFormData(prev => {
            // prevent update if values are identical to avoid loops
            if (prev.amount === amount.toString() &&
                prev.duration === duration.toString() &&
                prev.rate === rate.toString()) {
                return prev;
            }
            return {
                ...prev,
                amount: amount.toString(),
                duration: duration.toString(),
                rate: rate.toString()
            };
        });
    }, []);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        let correctedValue = numValue;

        if (name === "amount") {
            if (numValue < 2000) correctedValue = 2000;
            if (numValue > 1000000) correctedValue = 1000000;
        } else if (name === "duration") {
            if (numValue < 6) correctedValue = 6;
            if (numValue > 360) correctedValue = 360;
        } else if (name === "rate") {
            if (numValue < 0.5) correctedValue = 0.5;
            if (numValue > 15) correctedValue = 15;
        }

        if (correctedValue !== numValue || value !== correctedValue.toString()) {
            setFormData(prev => ({ ...prev, [name]: correctedValue.toString() }));
        }
    };

    const nextStep = (e?: React.MouseEvent) => {
        // Validation de l'étape actuelle avant de passer à la suivante
        if (e) {
            const form = (e.currentTarget as HTMLElement).closest('form');
            if (form && !form.reportValidity()) {
                return;
            }
        }

        // Robust Age and Logical Date validation for Step 2
        if (step === 2) {
            const birthDateStr = formData.birthDate.replace(/\s/g, ""); // Remove spaces
            if (birthDateStr.length === 10) { // Format JJ/MM/AAAA with slashes
                const [day, month, year] = birthDateStr.split("/").map(Number);
                const birthDate = new Date(year, month - 1, day);
                const today = new Date();

                // 1. Check if date is logical (e.g. not Feb 31st)
                // When you create a Date object with an invalid day, JS automatically overflows it to the next month.
                // We check if the components match after creating the Date object.
                const isValidLogicalDate = birthDate.getFullYear() === year &&
                    birthDate.getMonth() === month - 1 &&
                    birthDate.getDate() === day;

                if (!isValidLogicalDate || month > 12 || month < 1 || day > 31 || day < 1 || year < 1900) {
                    alert(t('Errors.invalidDate'));
                    return;
                }

                // 2. Check if date is in the future
                if (birthDate > today) {
                    alert(t('Errors.invalidDate'));
                    return;
                }

                // 3. Calculation of age for 18+ requirement
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    alert(t('Errors.underage'));
                    return;
                }
            } else if (formData.birthDate.length > 0) {
                // If date is partially filled but not complete
                alert(t('Errors.invalidDate'));
                return;
            }
        }

        setStep(s => Math.min(s + 1, 6));
    };
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
                birthCountry: formData.birthCountry,
                nationality: formData.nationality,
                phone: formData.phone,
                maritalStatus: formData.maritalStatus,
                children: parseInt(formData.children) || 0,
                housingType: formData.housingType,
                housingSeniority: parseInt(formData.housingSeniority) || 0,
                street: formData.street,
                zipCode: formData.zipCode,
                city: formData.city,
                profession: formData.profession,
                companyName: formData.companyName,
                contractType: formData.contractType,
                income: parseFloat(formData.income) || 0,
                charges: parseFloat(formData.charges) || 0,
                otherCredits: parseFloat(formData.otherCredits) || 0,
                bankName: formData.bankName,
                iban: formData.iban,
                bic: formData.bic,
                ribEmail: formData.ribEmail || formData.email,
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
                monthlyPayment: (() => {
                    const amt = parseFloat(formData.amount) || 0;
                    const dur = parseInt(formData.duration) || 12;
                    const r = parseFloat(formData.rate) || 4.95;
                    const mRate = r / 100 / 12;
                    const loanM = (amt * mRate) / (1 - Math.pow(1 + mRate, -dur));
                    const insuranceM = (amt * 0.03) / dur;
                    return (loanM + insuranceM) || 0;
                })(),
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

            // 4. Calculer le score (Sauvegardé pour l'admin, caché pour le client)
            const result = calculateScore(formData);

            await addDoc(collection(db, "requests"), {
                ...requestData,
                score: result.score,
                scoringStatus: result.status,
                debtRatio: result.debtRatio
            });

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

            <div className="max-w-7xl mx-auto px-4 py-12">
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

                {/* Layout Grid: Formulaire + Calculatrice */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                    {/* Calculatrice Mini (Sidebar) - GAUCHE (1/3) */}
                    <div className={`order-1 md:order-1 ${step === 1 ? 'md:col-span-1' : 'hidden'}`}>
                        {step === 1 && (
                            <div className="sticky top-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-sm w-full">
                                    <div className="bg-ely-mint/10 p-2 rounded-lg">
                                        <Lightbulb className="w-5 h-5 text-ely-mint" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Simulateur</h3>
                                </div>
                                <Simulator
                                    embedded={true}
                                    onValuesChange={handleSimulatorChange}
                                    syncAmount={parseFloat(formData.amount) || 0}
                                    syncDuration={parseFloat(formData.duration) || 0}
                                    syncRate={parseFloat(formData.rate) || 0}
                                />
                                <p className="text-xs text-gray-500 text-center">
                                    Ajustez les valeurs ci-dessus pour pré-remplir le formulaire
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Main Form Card - DROITE (2/3 ou Pleine largeur) */}
                    <div className={`order-2 md:order-2 ${step === 1 ? 'md:col-span-2' : 'md:col-span-3'} bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white relative overflow-hidden`}>
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

                                            {/* Montant, Durée et Taux Inputs */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Step1.amount')}</label>
                                                    <div className="relative group">
                                                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            required
                                                            min="2000"
                                                            max="1000000"
                                                            value={formData.amount}
                                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                            onBlur={handleBlur}
                                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-ely-mint focus:ring-0 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                                            placeholder="20000"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Step1.duration')}</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                                        <input
                                                            type="number"
                                                            name="duration"
                                                            required
                                                            min="6"
                                                            max="360"
                                                            value={formData.duration}
                                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                            onBlur={handleBlur}
                                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-ely-mint focus:ring-0 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                                            placeholder="24"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Step1.rate')}</label>
                                                    <div className="relative group">
                                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                                        <input
                                                            type="number"
                                                            name="rate"
                                                            required
                                                            min="0.5"
                                                            max="15"
                                                            step="0.01"
                                                            value={formData.rate}
                                                            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                                            onBlur={handleBlur}
                                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-ely-mint focus:ring-0 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                                            placeholder="2.95"
                                                        />
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
                                                        <option>Mlle</option>
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
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="text"
                                                            name="birthDate"
                                                            required
                                                            value={formData.birthDate}
                                                            onChange={handleDateChange}
                                                            className={`w-full pl-12 p-4 bg-white border rounded-xl outline-none focus:ring-2 transition-all ${formData.birthDate.length === 14
                                                                ? getDateStatus(formData.birthDate) === "valid"
                                                                    ? "border-green-500 focus:ring-green-200"
                                                                    : "border-red-500 focus:ring-red-200"
                                                                : "border-gray-200 focus:border-ely-mint focus:ring-ely-mint/20"
                                                                }`}
                                                            placeholder="JJ / MM / AAAA"
                                                        />
                                                    </div>
                                                    {formData.birthDate.length === 14 && getDateStatus(formData.birthDate) !== "valid" && (
                                                        <p className="text-xs text-red-500 font-medium mt-1">
                                                            {getDateStatus(formData.birthDate) === "underage" ? t('Errors.underage') : t('Errors.invalidDate')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Identity.birthPlace')}</label>
                                                    <input type="text" name="birthPlace" required value={formData.birthPlace} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Paris" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Identity.birthCountry')}</label>
                                                    <select name="birthCountry" value={formData.birthCountry} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none">
                                                        {COUNTRIES.map(country => (
                                                            <option key={country} value={country}>{country}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Identity.nationality')}</label>
                                                    <input type="text" name="nationality" required value={formData.nationality} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Française" />
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
                                                    <input type="number" name="children" required value={formData.children} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="0" />
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
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="relative">
                                                            <input type="number" name="housingSeniority" required value={formData.housingSeniority} onChange={handleChange} className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="0" />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{t('Situation.seniorityYears')}</span>
                                                        </div>
                                                        <div className="relative">
                                                            <input type="number" name="housingSeniorityMonths" required value={formData.housingSeniorityMonths} onChange={handleChange} className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="0" min="0" max="11" />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{t('Situation.seniorityMonths')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Pays de résidence</label>
                                                    <select
                                                        name="residenceCountry"
                                                        value={formData.residenceCountry}
                                                        onChange={handleChange}
                                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint"
                                                    >
                                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Numéro de Téléphone</label>
                                                    <div className="flex gap-2 h-[58px]">
                                                        <div className="w-20 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl text-2xl select-none" title={formData.phoneCountry}>
                                                            {COUNTRY_PHONE_DATA[formData.phoneCountry]?.flag || "🏳️"}
                                                        </div>
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                                                {COUNTRY_PHONE_DATA[formData.phoneCountry]?.code}
                                                            </span>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                required
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                                className="w-full h-full pl-14 p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint"
                                                                placeholder={COUNTRY_PHONE_DATA[formData.phoneCountry]?.placeholder || "06 12 34 56 78"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">{t('Situation.street')}</label>
                                                <AddressAutocomplete
                                                    value={formData.street}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, street: val }))}
                                                    onSelect={handleAddressSelect}
                                                    country={formData.residenceCountry}
                                                    placeholder="123 rue de la Paix"
                                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Situation.zipCode')}</label>
                                                    <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="75000" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">{t('Situation.city')}</label>
                                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Paris" />
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
                                                        <option value="temporary">{t('Finances.options.temporary')}</option>
                                                        <option value="civil_servant">{t('Finances.options.civil_servant')}</option>
                                                        <option value="liberal">{t('Finances.options.liberal')}</option>
                                                        <option value="business_owner">{t('Finances.options.business_owner')}</option>
                                                        <option value="artisan">{t('Finances.options.artisan')}</option>
                                                        <option value="independent">{t('Finances.options.independent')}</option>
                                                        <option value="retired">{t('Finances.options.retired')}</option>
                                                        <option value="student">{t('Finances.options.student')}</option>
                                                        <option value="apprentice">{t('Finances.options.apprentice')}</option>
                                                        <option value="unemployed">{t('Finances.options.unemployed')}</option>
                                                    </select>
                                                </div>
                                                {!(formData.contractType === 'retired' || formData.contractType === 'unemployed') && (
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            {formData.contractType === 'student'
                                                                ? "Établissement / Université"
                                                                : formData.contractType === 'apprentice'
                                                                    ? "Entreprise d'accueil / CFA"
                                                                    : formData.contractType === 'independent'
                                                                        ? "Nom de votre activité"
                                                                        : formData.contractType === 'artisan'
                                                                            ? "Enseigne / Nom de l'Entreprise"
                                                                            : formData.contractType === 'civil_servant'
                                                                                ? "Ministère / Administration"
                                                                                : formData.contractType === 'temporary'
                                                                                    ? "Société d'intérim / Employeur"
                                                                                    : formData.contractType === 'liberal'
                                                                                        ? "Cabinet / Raison sociale"
                                                                                        : formData.contractType === 'business_owner'
                                                                                            ? "Nom de la société / Enseigne"
                                                                                            : "Nom de l'Employeur"}
                                                        </label>
                                                        <div className="relative">
                                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder={formData.contractType === 'student' ? "Ex: Sorbonne" : formData.contractType === 'independent' ? "Ex: Freelance IT" : formData.contractType === 'civil_servant' ? "Ex: Préfecture" : "Ex: AGM INVEST"} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {formData.contractType !== 'unemployed' && (
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">
                                                        {formData.contractType === 'civil_servant'
                                                            ? "Fonction / Grade"
                                                            : formData.contractType === 'student'
                                                                ? "Domaine / Filière d'études"
                                                                : formData.contractType === 'retired'
                                                                    ? "Ancienne profession"
                                                                    : formData.contractType === 'apprentice'
                                                                        ? "Métier préparé"
                                                                        : "Profession / Métier"}
                                                    </label>
                                                    <div className="relative">
                                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input
                                                            type="text"
                                                            name="profession"
                                                            required
                                                            value={formData.profession}
                                                            onChange={handleChange}
                                                            className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint transition-colors"
                                                            placeholder={formData.contractType === 'civil_servant' ? "Ex: Adjoint Administratif" : formData.contractType === 'student' ? "Ex: Management / Finance" : "Ex: Chef de projet"}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-4">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">
                                                        {formData.contractType === 'retired'
                                                            ? "Pension mensuelle (€)"
                                                            : formData.contractType === 'unemployed'
                                                                ? "Allocations / Revenus (€)"
                                                                : formData.contractType === 'student'
                                                                    ? "Bourses / Revenus mensuels (€)"
                                                                    : formData.contractType === 'apprentice'
                                                                        ? "Rémunération mensuelle (€)"
                                                                        : formData.contractType === 'civil_servant'
                                                                            ? "Traitement mensuel net (€)"
                                                                            : ['independent', 'artisan', 'liberal', 'business_owner'].includes(formData.contractType)
                                                                                ? "Revenu mensuel moyen (€)"
                                                                                : t('Finances.income')}
                                                    </label>
                                                    <div className="relative">
                                                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                        <input type="number" name="income" required value={formData.income} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none font-bold text-ely-blue" placeholder="3 000" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.charges')}</label>
                                                        <input type="number" name="charges" required value={formData.charges} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Loyer, etc." />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.otherCredits')}</label>
                                                        <input type="number" name="otherCredits" value={formData.otherCredits} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="0" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-ely-mint/10 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-ely-mint" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-ely-blue">{t('Finances.bankInfo')}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.bankName')}</label>
                                                        <input type="text" name="bankName" required value={formData.bankName} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="Nom de votre banque" />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.iban')}</label>
                                                        <input type="text" name="iban" required value={formData.iban} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint font-mono" placeholder="FR76 ..." />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.bic')}</label>
                                                        <input type="text" name="bic" required value={formData.bic} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint font-mono uppercase" placeholder="XXXXXXXX" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-gray-700">{t('Finances.ribEmail')}</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input type="email" name="ribEmail" required value={formData.ribEmail} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-ely-mint" placeholder="jean@exemple.com" />
                                                        </div>
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
                                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-xl outline-none" placeholder="jean@exemple.com" />
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
                                                                required
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
                                                                required
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
                                    {step === 6 && (
                                        <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-10">
                                            <div className="relative inline-block">
                                                <div className="w-24 h-24 rounded-full bg-ely-mint/10 flex items-center justify-center mx-auto mb-8">
                                                    <CheckCircle2 className="w-12 h-12 text-ely-mint" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h2 className="text-3xl font-bold text-gray-900">
                                                    {t('Result.analysisTitle')}
                                                </h2>
                                                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                                                    {t('Result.analysisMessage')}
                                                </p>
                                            </div>

                                            <div className="flex justify-center pt-6">
                                                <Link href="/dashboard" className="px-10 py-4 bg-ely-blue text-white rounded-xl font-bold hover:bg-ely-blue/90 shadow-xl shadow-ely-blue/10 transition-all hover:scale-105 active:scale-95">
                                                    {t('Result.dashboardButton')}
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
