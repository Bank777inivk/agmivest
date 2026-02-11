"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, Briefcase, Building2, Calculator, Calendar,
    CheckCircle2, Clock, CreditCard, Euro, Globe, HeartPulse, History,
    Info, Mail, MapPin, AlertCircle, FileText, ChevronRight, Search, Lock,
    TrendingUp, Percent, Target, PieChart, ShieldCheck, User
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export default function MobileCreditRequest({
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
    totalCost
}: CreditRequestProps) {
    const steps = [
        { id: 1, label: "Projet" },
        { id: 2, label: "Identité" },
        { id: 3, label: "Situation" },
        { id: 4, label: "Finances" },
        { id: 5, label: "Résumé" }
    ];

    const currentStepLabel = steps.find(s => s.id === step)?.label;

    return (
        <div className="flex flex-col min-h-screen pb-36 bg-[#F8FAFC] overflow-x-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-ely-blue/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[35%] bg-ely-mint/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Mobile Header & Progress Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200/50 px-6 py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1 h-3 bg-ely-mint rounded-full shadow-[0_0_8px_rgba(0,201,167,0.3)]" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Common.step')} {step} / 5</p>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{currentStepLabel}</h1>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                            <Calculator className="w-6 h-6 text-ely-mint" />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div
                            className="h-full bg-gradient-to-r from-ely-mint to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 5) * 100}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-5 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="mobile-step-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Premium Card Container */}
                            <div className="bg-gradient-to-br from-ely-blue to-blue-700 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-900/30 space-y-8">
                                {/* Profile Type Toggle */}
                                <div className="bg-blue-950/20 p-1.5 rounded-2xl border border-white/10 flex gap-1">
                                    <button
                                        onClick={() => setProfileType("particulier")}
                                        className={cn(
                                            "flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300",
                                            profileType === "particulier"
                                                ? "bg-white text-ely-blue shadow-lg scale-[1.02]"
                                                : "text-white/60 hover:text-white/80"
                                        )}
                                    >
                                        {t('Personal.title')}
                                    </button>
                                    <button
                                        onClick={() => setProfileType("pro")}
                                        className={cn(
                                            "flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300",
                                            profileType === "pro"
                                                ? "bg-white text-ely-blue shadow-lg scale-[1.02]"
                                                : "text-white/60 hover:text-white/80"
                                        )}
                                    >
                                        {t('Professional.title')}
                                    </button>
                                </div>

                                {/* Project Types Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "personal", label: t('Simulator.personalProject'), icon: User },
                                        { id: "auto", label: t('Simulator.autoProject'), icon: History },
                                        { id: "pro", label: t('Simulator.proProject'), icon: Building2 },
                                        { id: "other", label: t('Simulator.otherProject'), icon: Info },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setProjectType(type.id)}
                                            className={cn(
                                                "p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group",
                                                projectType === type.id
                                                    ? "border-ely-mint bg-white/10 text-white shadow-xl"
                                                    : "border-white/5 bg-white/5 text-white/40 grayscale opacity-80"
                                            )}
                                        >
                                            <type.icon className={cn("w-7 h-7 transition-transform group-active:scale-90", projectType === type.id ? "text-ely-mint" : "text-white/30")} />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{type.label}</span>
                                            {projectType === type.id && (
                                                <motion.div layoutId="active-indicator" className="absolute top-2 right-2 w-1.5 h-1.5 bg-ely-mint rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {projectType === "other" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                        <input
                                            type="text"
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            placeholder={t('Simulator.otherPrompt')}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-ely-mint outline-none font-bold text-sm text-white placeholder:text-white/20 transition-all shadow-inner"
                                        />
                                    </motion.div>
                                )}

                                {/* Sliders Section */}
                                <div className="space-y-10 pt-4">
                                    <section className="space-y-5">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-ely-mint" />
                                                {t('Simulator.amountLabel')}
                                            </label>
                                            <div className="text-2xl font-black text-white">
                                                {amount.toLocaleString()}<span className="text-ely-mint ml-1 text-lg">€</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range" min="2000" max="1000000" step="1000"
                                            value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-blue-950/30 rounded-full appearance-none cursor-pointer accent-ely-mint custom-range"
                                        />
                                    </section>

                                    <section className="space-y-5">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-ely-mint" />
                                                {t('Simulator.durationLabel')}
                                            </label>
                                            <div className="text-2xl font-black text-white">
                                                {duration}<span className="text-ely-mint ml-1 text-lg">{t('Simulator.months')}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range" min="6" max="360" step="6"
                                            value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                                            className="w-full h-2 bg-blue-950/30 rounded-full appearance-none cursor-pointer accent-ely-mint custom-range"
                                        />
                                    </section>

                                    <section className="space-y-5">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                <Percent className="w-3.5 h-3.5 text-ely-mint" />
                                                {t('Simulator.rateLabel')}
                                            </label>
                                            <div className="text-2xl font-black text-white">
                                                {annualRate.toFixed(2)}<span className="text-ely-mint ml-1 text-lg">%</span>
                                            </div>
                                        </div>
                                        <input
                                            type="range" min="0.5" max="15.0" step="0.01"
                                            value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))}
                                            className="w-full h-2 bg-blue-950/30 rounded-full appearance-none cursor-pointer accent-ely-mint custom-range"
                                        />
                                    </section>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {(step === 2 || step === 3 || step === 4) && (
                        <motion.div
                            key={`mobile-step-${step}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-7">
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.civility')}</label>
                                            <select name="civility" value={formData.civility} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 appearance-none">
                                                <option value="M." className="bg-white">Monsieur (M.)</option>
                                                <option value="Mme" className="bg-white">Madame (Mme)</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.firstName')}</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jean" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.lastName')}</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="DUPONT" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 uppercase placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.birthDate')}</label>
                                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 [color-scheme:light]" />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.maritalStatus')}</label>
                                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 appearance-none">
                                                <option value="single" className="bg-white">{t('Form.single')}</option>
                                                <option value="married" className="bg-white">{t('Form.married')}</option>
                                                <option value="pacs" className="bg-white">{t('Form.pacs')}</option>
                                                <option value="divorced" className="bg-white">{t('Form.divorced')}</option>
                                                <option value="widow" className="bg-white">{t('Form.widow')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.address')}</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Rue de la Paix" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.zipCode')}</label>
                                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="75000" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.city')}</label>
                                                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Paris" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.monthlyIncome')}</label>
                                            <div className="relative">
                                                <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 pr-12 shadow-sm" />
                                                <Euro className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ely-mint" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.monthlyCharges')}</label>
                                            <div className="relative">
                                                <input type="number" name="charges" value={formData.charges} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 pr-12 shadow-sm" />
                                                <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ely-mint" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Form.contractType')}</label>
                                            <select name="contractType" value={formData.contractType} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm text-slate-900 appearance-none">
                                                <option value="cdi" className="bg-white">CDI</option>
                                                <option value="cdd" className="bg-white">CDD</option>
                                                <option value="temporary" className="bg-white">{t('Form.temporary')}</option>
                                                <option value="civil_servant" className="bg-white">{t('Form.civilServant')}</option>
                                                <option value="independent" className="bg-white">{t('Form.independent')}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="mobile-step-5"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-br from-ely-blue to-blue-700 p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(30,58,138,0.3)]">
                                <div className="absolute top-[-20px] right-[-20px] p-10 opacity-10 rotate-12">
                                    <ShieldCheck className="w-40 h-40" />
                                </div>
                                <div className="text-center space-y-3 relative z-10">
                                    <div className="w-16 h-1 bg-ely-mint mx-auto rounded-full mb-4 opacity-50" />
                                    <p className="text-[10px] font-black text-ely-mint uppercase tracking-[0.3em]">{t('Result.summaryTitle')}</p>
                                    <h2 className="text-3xl font-black tracking-tight">{amount.toLocaleString()} <span className="text-ely-mint">€</span></h2>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">{t('Simulator.monthlyLabel')}</span>
                                        <span className="text-lg font-black text-ely-mint">{totalMonthlyPayment.toLocaleString()} €</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">{t('Simulator.durationLabel')}</span>
                                        <span className="text-sm font-bold">{duration} {t('Simulator.months')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">{t('Form.lastName')}</span>
                                        <span className="text-sm font-bold">{formData.firstName} {formData.lastName.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="pt-4 text-center relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <Lock className="w-3 h-3 text-ely-mint" />
                                        <span className="text-[10px] font-bold text-white/60 tracking-wide uppercase">ELY-SECURE 256-BIT</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-5">
                                <div className="w-14 h-14 bg-ely-mint/10 rounded-2xl flex items-center justify-center border border-ely-mint/20">
                                    <Info className="w-7 h-7 text-ely-mint" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-wide mb-1">{t('Result.checkPrompt')}</p>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{t('Result.checkMessage')}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fixed Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-30 p-6 bg-white/90 backdrop-blur-2xl border-t border-slate-100">
                <div className="flex gap-4 max-w-lg mx-auto">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all shadow-sm"
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex-1 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(30,58,138,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10 py-5"
                        >
                            {t('Common.next')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-ely-mint to-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(0,201,167,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-5"
                        >
                            {isSubmitting ? t('Common.submitting') : t('Common.confirm')}
                            {!isSubmitting && <CheckCircle2 className="w-5 h-5 shadow-lg" />}
                        </button>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 4px solid #00c9a7;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 15px rgba(0, 201, 167, 0.4);
                    transition: all 0.2s ease;
                }
                .custom-range::-webkit-slider-thumb:active {
                    transform: scale(1.2);
                    box-shadow: 0 0 25px rgba(0, 201, 167, 0.6);
                }
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1.5rem center;
                    background-size: 1rem;
                }
            `}</style>
        </div>
    );
}
