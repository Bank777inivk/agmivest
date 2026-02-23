"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, Briefcase, Building2, Calculator, Calendar,
    CheckCircle2, Clock, CreditCard, Euro, Globe, HeartPulse, History,
    Info, Mail, MapPin, AlertCircle, FileText, ChevronRight, Search, Lock,
    TrendingUp, Percent, Target, PieChart, ShieldCheck, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, COUNTRY_PHONE_DATA } from "@/lib/constants";
import AddressAutocomplete from "@/components/AddressAutocomplete";

interface CreditRequestProps {
    t: any;
    step: number;
    setStep: (step: number) => void;
    isSubmitting: boolean;
    amount: number;
    setAmount: (amount: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    annualRate: number;
    setAnnualRate: (rate: number) => void;
    projectType: string;
    setProjectType: (type: string) => void;
    projectDescription: string;
    setProjectDescription: (desc: string) => void;
    profileType: "particulier" | "pro";
    setProfileType: (type: "particulier" | "pro") => void;
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: () => Promise<void>;
    totalMonthlyPayment: number;
    totalCost: number;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getDateStatus: (dateStr: string) => "valid" | "invalid" | "underage";
    canGoNext: () => boolean;
    readOnlyFields: Set<string>;
}

export default function DesktopCreditRequest({
    t,
    step,
    setStep,
    isSubmitting,
    amount,
    setAmount,
    duration,
    setDuration,
    annualRate,
    setAnnualRate,
    projectType,
    setProjectType,
    projectDescription,
    setProjectDescription,
    profileType,
    setProfileType,
    formData,
    handleChange,
    handleSubmit,
    totalMonthlyPayment,
    totalCost,
    handleBlur,
    handleDateChange,
    getDateStatus,
    canGoNext,
    readOnlyFields
}: CreditRequestProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-ely-mint to-emerald-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-ely-mint/30 border border-white/20">
                            {t('Simulator.title')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        {t('title.step' + step)}
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Stepper with labels */}
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { id: 1, label: t('Steps.project') },
                        { id: 2, label: t('Steps.identity') },
                        { id: 3, label: t('Steps.situation') },
                        { id: 4, label: t('Steps.finances') },
                        { id: 5, label: t('Steps.account') }
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
                        <div className="lg:col-span-8 bg-gradient-to-br from-ely-blue to-blue-800 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-900/30 border border-white/10 space-y-8 md:space-y-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none text-white group-hover:scale-110 transition-transform duration-1000">
                                <Calculator className="w-64 h-64" />
                            </div>

                            {/* Profile Type Selection */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="w-1.5 h-6 bg-ely-mint rounded-full shadow-[0_0_10px_rgba(0,201,167,0.4)]" />
                                    <label className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">
                                        {t('Profile.label')}
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50/50 rounded-[1.8rem] border border-slate-100">
                                    <button
                                        onClick={() => setProfileType("particulier")}
                                        className={cn(
                                            "py-4 px-4 md:py-5 md:px-6 rounded-[1.4rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 md:gap-3",
                                            profileType === "particulier"
                                                ? "bg-white text-ely-blue shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        )}
                                    >
                                        <User className={cn("w-3 h-3 md:w-4 md:h-4", profileType === "particulier" ? "text-ely-mint" : "text-white/80")} />
                                        {t('Profile.individual')}
                                    </button>
                                    <button
                                        onClick={() => setProfileType("pro")}
                                        className={cn(
                                            "py-4 px-4 md:py-5 md:px-6 rounded-[1.4rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 md:gap-3",
                                            profileType === "pro"
                                                ? "bg-white text-ely-blue shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                        )}
                                    >
                                        <Building2 className={cn("w-3 h-3 md:w-4 md:h-4", profileType === "pro" ? "text-ely-mint" : "text-white/80")} />
                                        {t('Profile.professional')}
                                    </button>
                                </div>
                            </div>

                            {/* Project Type */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="w-1.5 h-7 bg-ely-mint rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" />
                                    <label className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">
                                        {t('Project.detailsLabel')}
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: "personal", icon: User },
                                        { id: "auto", icon: CheckCircle2 },
                                        { id: "pro", icon: History },
                                        { id: "other", icon: Info },
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
                                            )}>{t('Project.labels.' + type.id)}</span>
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
                                                    {t('Project.detailsLabel')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={projectDescription}
                                                    onChange={(e) => setProjectDescription(e.target.value)}
                                                    placeholder={t('Project.detailsPlaceholder')}
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
                                                {t('Simulator.amountLabel')}
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">{t('Simulator.amountHint')}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-4 py-2 md:px-6 md:py-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md transition-transform duration-500">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            onBlur={handleBlur}
                                            className="bg-transparent border-none outline-none font-black text-2xl md:text-3xl text-white w-24 md:w-40 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0"
                                        />
                                        <span className="text-lg md:text-xl font-black text-white/20 ml-1">€</span>
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
                                                {t('Step1.rate')}
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">{t('Simulator.guaranteedRate')}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
                                        <input
                                            type="number"
                                            name="annualRate"
                                            value={annualRate}
                                            step="0.01"
                                            onChange={(e) => setAnnualRate(Number(e.target.value))}
                                            onBlur={handleBlur}
                                            className="bg-transparent border-none outline-none font-black text-3xl text-ely-mint w-24 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0"
                                        />
                                        <span className="text-xl font-black text-white/20 ml-1">%</span>
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
                                                {t('Simulator.durationLabel')}
                                            </label>
                                        </div>
                                        <p className="text-sm text-white/40 font-medium italic">{t('Simulator.durationHint')}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
                                        <input
                                            type="number"
                                            name="duration"
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            onBlur={handleBlur}
                                            className="bg-transparent border-none outline-none font-black text-3xl text-white w-24 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0"
                                        />
                                        <span className="text-xl font-black text-white/20 ml-1">{t('Simulator.months')}</span>
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
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">6 {t('Simulator.months')}</span>
                                        <span className="bg-white px-4 py-1.5 rounded-xl border border-slate-50 shadow-sm">30 {t('Simulator.durationSuffix')}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-[1.8rem] font-black text-lg shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 mt-6"
                            >
                                <span className="uppercase tracking-[0.2em] text-xs">{t('Navigation.next')}</span>
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
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">{t('Summary.monthlyEstimation')}</h3>
                                        <div className="flex items-center justify-center">
                                            <p className="text-5xl font-black text-ely-mint flex items-end drop-shadow-2xl">
                                                {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                <span className="text-xl font-bold ml-2 mb-2 text-white/60">€</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">{t('Summary.capital')}</span>
                                            <span className="font-black text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">{t('Summary.totalCost')}</span>
                                            <span className="font-black text-sm text-ely-mint">{(totalCost - (amount * 0.03)).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-ely-mint">{t('Summary.insurance')}</span>
                                            <span className="font-black text-sm text-ely-mint">+{((amount * 0.03) / duration).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €/{t('Simulator.perMonth')}</span>
                                        </div>

                                        <div className="pt-6 px-2 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">{t('Summary.totalDue')}</span>
                                                <span className="font-black text-2xl text-white tracking-tighter">{(amount + totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">{t('Summary.taeg')}</span>
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
                                        <p className="text-sm font-black text-slate-900">{t('Summary.secureData')}</p>
                                        <p className="text-xs text-slate-400">{t('Summary.secureDesc')}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                                        {t('Summary.expertiseQuote')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {(step === 2 || step === 3 || step === 4) && (
                    <motion.div
                        key={`step-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white space-y-8">
                            {step === 2 && (
                                <>
                                    <div className="space-y-3 border-b border-slate-50 pb-6">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('Identity.title')}</h3>
                                        <p className="text-slate-500 font-medium text-base leading-relaxed">{t('Identity.subtitle')}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.civilityLabel')}</label>
                                            <select
                                                name="civility"
                                                value={formData.civility}
                                                onChange={handleChange}
                                                disabled={readOnlyFields.has('civility')}
                                                className={cn(
                                                    "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('civility') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                <option value="M.">{t('Identity.civilityOptions.mr')}</option>
                                                <option value="Mme">{t('Identity.civilityOptions.mrs')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.nationalityLabel')}</label>
                                            <input
                                                type="text"
                                                name="nationality"
                                                value={formData.nationality}
                                                onChange={handleChange}
                                                placeholder={t('Identity.Placeholders.nationality')}
                                                readOnly={readOnlyFields.has('nationality')}
                                                className={cn(
                                                    "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('nationality') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.firstNameLabel')}</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                readOnly={readOnlyFields.has('firstName')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('firstName') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.lastNameLabel')}</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                readOnly={readOnlyFields.has('lastName')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('lastName') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.birthCountryLabel')}</label>
                                            <select
                                                name="birthCountry"
                                                value={formData.birthCountry}
                                                onChange={handleChange}
                                                disabled={readOnlyFields.has('birthCountry')}
                                                className={cn(
                                                    "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('birthCountry') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.birthDateLabel')}</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="birthDate"
                                                    value={formData.birthDate}
                                                    onChange={handleDateChange}
                                                    placeholder={t('Identity.Placeholders.birthDate')}
                                                    readOnly={readOnlyFields.has('birthDate')}
                                                    className={cn(
                                                        "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                        readOnlyFields.has('birthDate') && "bg-slate-100/80 cursor-not-allowed opacity-70",
                                                        formData.birthDate.length === 14 && !readOnlyFields.has('birthDate')
                                                            ? getDateStatus(formData.birthDate) === "valid"
                                                                ? "border-green-500"
                                                                : "border-red-500"
                                                            : "border-slate-100 focus:border-ely-mint"
                                                    )}
                                                />
                                                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                            </div>
                                            {formData.birthDate.length === 14 && getDateStatus(formData.birthDate) !== "valid" && !readOnlyFields.has('birthDate') && (
                                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">
                                                    {getDateStatus(formData.birthDate) === "underage" ? t('Errors.underage') : t('Errors.invalidDate')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Identity.birthPlaceLabel')}</label>
                                            <input
                                                type="text"
                                                name="birthPlace"
                                                value={formData.birthPlace}
                                                onChange={handleChange}
                                                placeholder={t('Identity.Placeholders.birthPlace')}
                                                readOnly={readOnlyFields.has('birthPlace')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('birthPlace') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="space-y-3 border-b border-slate-50 pb-6">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('Situation.title')}</h3>
                                        <p className="text-slate-500 font-medium text-base leading-relaxed">{t('Situation.subtitle')}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.maritalStatusLabel')}</label>
                                            <select
                                                name="maritalStatus"
                                                value={formData.maritalStatus}
                                                onChange={handleChange}
                                                disabled={readOnlyFields.has('maritalStatus')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('maritalStatus') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                <option value="single">{t('Situation.maritalOptions.single')}</option>
                                                <option value="married">{t('Situation.maritalOptions.married')}</option>
                                                <option value="pacs">{t('Situation.maritalOptions.pacs')}</option>
                                                <option value="divorced">{t('Situation.maritalOptions.divorced')}</option>
                                                <option value="widow">{t('Situation.maritalOptions.widow')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.childrenLabel')}</label>
                                            <input
                                                type="number"
                                                name="children"
                                                value={formData.children}
                                                onChange={handleChange}
                                                readOnly={readOnlyFields.has('children')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('children') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.housingTypeLabel')}</label>
                                            <select
                                                name="housingType"
                                                value={formData.housingType}
                                                onChange={handleChange}
                                                disabled={readOnlyFields.has('housingType')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('housingType') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                <option value="tenant">{t('Situation.housingOptions.tenant')}</option>
                                                <option value="owner">{t('Situation.housingOptions.owner')}</option>
                                                <option value="owner_mortgage">{t('Situation.housingOptions.owner_mortgage')}</option>
                                                <option value="free">{t('Situation.housingOptions.free')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.housingSeniorityLabel')}</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="housingSeniority"
                                                        value={formData.housingSeniority}
                                                        onChange={handleChange}
                                                        placeholder={t('Situation.Placeholders.years')}
                                                        readOnly={readOnlyFields.has('housingSeniority')}
                                                        className={cn(
                                                            "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                            readOnlyFields.has('housingSeniority') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{t('Simulator.durationSuffix')}</span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="housingSeniorityMonths"
                                                        value={formData.housingSeniorityMonths}
                                                        onChange={handleChange}
                                                        placeholder={t('Situation.Placeholders.months')}
                                                        readOnly={readOnlyFields.has('housingSeniorityMonths')}
                                                        className={cn(
                                                            "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                            readOnlyFields.has('housingSeniorityMonths') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                        min="0"
                                                        max="11"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{t('Simulator.months')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.residenceCountryLabel')}</label>
                                            <select
                                                name="residenceCountry"
                                                value={formData.residenceCountry}
                                                onChange={handleChange}
                                                disabled={readOnlyFields.has('residenceCountry')}
                                                className={cn(
                                                    "w-full px-6 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('residenceCountry') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            >
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.phoneLabel')}</label>
                                            <div className="flex gap-4">
                                                <div className="w-24 px-4 py-4 bg-slate-50/50 rounded-[1.3rem] border-2 border-slate-100 flex items-center justify-center font-black text-xl shadow-sm">
                                                    {COUNTRY_PHONE_DATA[formData.phoneCountry]?.flag || "🏳️"}
                                                </div>
                                                <div className="flex-1 relative group">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                                        {COUNTRY_PHONE_DATA[formData.phoneCountry]?.code}
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder={COUNTRY_PHONE_DATA[formData.phoneCountry]?.placeholder || "06 12 34 56 78"}
                                                        readOnly={readOnlyFields.has('phone')}
                                                        className={cn(
                                                            "w-full pl-16 pr-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                            readOnlyFields.has('phone') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.addressLabel')}</label>
                                            <AddressAutocomplete
                                                value={formData.street}
                                                onChange={(val) => handleChange({ target: { name: 'street', value: val } } as any)}
                                                onSelect={(addr) => {
                                                    handleChange({ target: { name: 'street', value: addr.street } } as any);
                                                    handleChange({ target: { name: 'zipCode', value: addr.zipCode } } as any);
                                                    handleChange({ target: { name: 'city', value: addr.city } } as any);
                                                }}
                                                country={formData.residenceCountry}
                                                placeholder={t('Situation.Placeholders.address')}
                                                disabled={readOnlyFields.has('street')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('street') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.zipCodeLabel')}</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                placeholder={t('Situation.Placeholders.zipCode')}
                                                readOnly={readOnlyFields.has('zipCode')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('zipCode') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Situation.cityLabel')}</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder={t('Situation.Placeholders.city')}
                                                readOnly={readOnlyFields.has('city')}
                                                className={cn(
                                                    "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                    readOnlyFields.has('city') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="space-y-3 border-b border-slate-50 pb-6">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('Finances.title')}</h3>
                                        <p className="text-slate-500 font-medium text-base leading-relaxed">{t('Finances.subtitle')}</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Row 1: Contract Type & Company (Conditional) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.contractTypeLabel')}</label>
                                                <select
                                                    name="contractType"
                                                    value={formData.contractType}
                                                    onChange={handleChange}
                                                    disabled={readOnlyFields.has('contractType')}
                                                    className={cn(
                                                        "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                        readOnlyFields.has('contractType') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                    )}
                                                >
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
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                                        {formData.contractType === 'student'
                                                            ? t('Finances.Labels.company_student') || "Établissement / Université"
                                                            : formData.contractType === 'apprentice'
                                                                ? t('Finances.Labels.company_apprentice') || "Entreprise d'accueil / CFA"
                                                                : formData.contractType === 'independent'
                                                                    ? t('Finances.Labels.liberal')
                                                                    : formData.contractType === 'artisan'
                                                                        ? t('Finances.Labels.artisan') || "Enseigne / Nom de l'Entreprise"
                                                                        : formData.contractType === 'civil_servant'
                                                                            ? t('Finances.Labels.civil_servant') || "Ministère / Administration"
                                                                            : formData.contractType === 'temporary'
                                                                                ? t('Finances.Labels.temporary') || "Société d'intérim / Employeur"
                                                                                : formData.contractType === 'liberal'
                                                                                    ? t('Finances.Labels.liberal')
                                                                                    : formData.contractType === 'business_owner'
                                                                                        ? t('Finances.Labels.business_owner') || "Nom de la société / Enseigne"
                                                                                        : t('Finances.Labels.default')}
                                                    </label>
                                                    <div className="relative group">
                                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm" placeholder={t(`Finances.Placeholders.company_${formData.contractType}`) || t('Finances.Placeholders.company_default')} />
                                                        <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Row 2: Profession (Conditional) & Income */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {formData.contractType !== 'unemployed' && (
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                                        {formData.contractType === 'civil_servant'
                                                            ? t('Finances.Labels.profession_civil_servant') || "Fonction / Grade"
                                                            : formData.contractType === 'student'
                                                                ? t('Finances.Labels.profession_student') || "Domaine / Filière d'études"
                                                                : formData.contractType === 'retired'
                                                                    ? t('Finances.Labels.profession_retired')
                                                                    : formData.contractType === 'apprentice'
                                                                        ? t('Finances.Labels.profession_apprentice') || "Métier préparé"
                                                                        : t('Finances.Labels.profession_default')}
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            name="profession"
                                                            value={formData.profession}
                                                            onChange={handleChange}
                                                            placeholder={t(`Finances.Placeholders.profession_${formData.contractType}`) || t('Finances.Placeholders.profession_default')}
                                                            readOnly={readOnlyFields.has('profession')}
                                                            className={cn(
                                                                "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                                readOnlyFields.has('profession') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                            )}
                                                        />
                                                        <Briefcase className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">
                                                    {t(`Finances.Labels.income_${formData.contractType}`) || t('Finances.income')}
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="number"
                                                        name="income"
                                                        value={formData.income}
                                                        onChange={handleChange}
                                                        placeholder="0"
                                                        readOnly={readOnlyFields.has('income')}
                                                        className={cn(
                                                            "w-full px-8 py-6 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm text-2xl pl-16",
                                                            readOnlyFields.has('income') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                    />
                                                    <Euro className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 3: Charges & Other Credits */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.chargesLabel')} (€)</label>
                                                <div className="relative group">
                                                    <input
                                                        type="number"
                                                        name="charges"
                                                        value={formData.charges}
                                                        onChange={handleChange}
                                                        placeholder={t('Finances.Placeholders.charges') || "0"}
                                                        readOnly={readOnlyFields.has('charges')}
                                                        className={cn(
                                                            "w-full px-8 py-6 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm text-2xl pl-16",
                                                            readOnlyFields.has('charges') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                    />
                                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.otherCreditsLabel')} (€)</label>
                                                <div className="relative group">
                                                    <input
                                                        type="number"
                                                        name="otherCredits"
                                                        value={formData.otherCredits}
                                                        onChange={handleChange}
                                                        placeholder={t('Finances.Placeholders.otherCredits') || "0"}
                                                        readOnly={readOnlyFields.has('otherCredits')}
                                                        className={cn(
                                                            "w-full px-8 py-6 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm text-2xl pl-16",
                                                            readOnlyFields.has('otherCredits') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                        )}
                                                    />
                                                    <Percent className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Info Section */}
                                        <div className="pt-8 border-t border-slate-100 space-y-8">
                                            <div className="flex items-center gap-4 ml-2">
                                                <div className="w-10 h-10 rounded-2xl bg-ely-mint/10 flex items-center justify-center text-ely-mint">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">{t('Finances.bankInfo')}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.bankName')}</label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            name="bankName"
                                                            value={formData.bankName}
                                                            onChange={handleChange}
                                                            placeholder={t('Finances.Placeholders.bankName')}
                                                            readOnly={readOnlyFields.has('bankName')}
                                                            className={cn(
                                                                "w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm",
                                                                readOnlyFields.has('bankName') && "bg-slate-100/80 cursor-not-allowed opacity-70"
                                                            )}
                                                        />
                                                        <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.iban')}</label>
                                                    <div className="relative group">
                                                        <input type="text" name="iban" value={formData.iban} onChange={handleChange} placeholder={t('Finances.Placeholders.iban')} className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm font-mono" />
                                                        <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.bic')}</label>
                                                    <div className="relative group">
                                                        <input type="text" name="bic" value={formData.bic} onChange={handleChange} placeholder={t('Finances.Placeholders.bic')} className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm font-mono uppercase" />
                                                        <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] ml-2">{t('Finances.ribEmail')}</label>
                                                    <div className="relative group">
                                                        <input type="email" name="ribEmail" value={formData.ribEmail} onChange={handleChange} placeholder="jean@exemple.com" className="w-full px-8 py-5 bg-slate-50/50 rounded-[1.8rem] border-2 border-slate-100 focus:border-ely-mint focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm" />
                                                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ely-mint transition-colors w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col md:flex-row gap-4 pt-8">
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {t('Common.previous')}
                                </button>
                                <button
                                    onClick={() => canGoNext() && setStep(step + 1)}
                                    disabled={!canGoNext()}
                                    className="flex-[2] py-4 bg-gradient-to-br from-ely-blue to-blue-800 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-ely-blue/20 hover:shadow-ely-blue/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {t('Common.next')}
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
                                        <h3 className="text-xs font-black text-white/80 uppercase tracking-[0.25em]">{t('Summary.monthlyEstimation')}</h3>
                                        <div className="flex items-center justify-center">
                                            <p className="text-5xl font-black text-ely-mint flex items-end drop-shadow-2xl">
                                                {totalMonthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                <span className="text-xl font-bold ml-2 mb-2 text-white/60">€</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">{t('Summary.capital')}</span>
                                            <span className="font-black text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/90">{t('Summary.duration')}</span>
                                            <span className="font-black text-sm">{duration} {t('Simulator.months')}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <span className="text-xs font-black uppercase tracking-widest text-ely-mint">{t('Summary.insurance')}</span>
                                            <span className="font-black text-sm text-ely-mint">+{Math.round((amount * 0.03) / duration).toLocaleString()} €/{t('Simulator.perMonth')}</span>
                                        </div>
                                        <div className="pt-6 px-2 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">{t('Summary.totalDue')}</span>
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
                                        <p className="text-sm font-black text-slate-900">{t('Summary.secureData')}</p>
                                        <p className="text-xs text-slate-400">{t('Summary.rgpdCertified')}</p>
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
                                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">{t('FinalRecap.title')}</h1>
                                <p className="text-white font-medium text-base max-w-xl mx-auto leading-relaxed italic">
                                    {t('FinalRecap.subtitle')}
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
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t('FinalRecap.projectSection')}</h4>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">{t('FinalRecap.amount')}</span>
                                            <span className="font-black text-white text-sm">{amount.toLocaleString()} €</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">{t('FinalRecap.duration')}</span>
                                            <span className="font-black text-white text-sm">{duration} {t('Simulator.months')}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/10 px-5 py-4 rounded-xl border border-white/10 shadow-inner">
                                            <span className="text-white font-bold text-xs">{t('FinalRecap.monthly')}</span>
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
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t('FinalRecap.applicantSection')}</h4>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">{t('FinalRecap.identity')}</span>
                                            <span className="font-black text-white text-sm">{formData.firstName} {formData.lastName.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 px-5 py-3.5 rounded-xl border border-white/5">
                                            <span className="text-white font-bold text-xs">{t('FinalRecap.city')}</span>
                                            <span className="font-black text-white text-sm">{formData.city}</span>
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
                                    {t('Navigation.modify')}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-[2] py-4 bg-gradient-to-r from-ely-mint to-emerald-500 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-ely-mint/20 hover:shadow-ely-mint/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? t('Navigation.submitting') : t('Navigation.confirm')}
                                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
