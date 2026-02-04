"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Eye, EyeOff, Lock, Mail, User, CheckCircle, ArrowLeft, ArrowRight,
    Calendar, MapPin, Globe, Phone, Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
    const t = useTranslations('Auth.Register');
    const [step, setStep] = useState<Step>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: État Civil
        civility: "M.",
        firstName: "",
        lastName: "",
        birthDate: "",
        birthPlace: "",
        nationality: "Française",

        // Step 2: Coordonnées
        address: "",
        city: "",
        zipCode: "",
        phone: "",

        // Step 3: Sécurité
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const nextStep = () => setStep((s) => (s < 3 ? (s + 1) as Step : s));
    const prevStep = () => setStep((s) => (s > 1 ? (s - 1) as Step : s));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            nextStep();
            return;
        }
        console.log("Account Opening Data:", formData);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#fafafa]">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-ely-mint/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-ely-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl w-full space-y-8 relative z-10"
            >
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ely-mint transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t('backToHome')}
                    </Link>

                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block"
                        >
                            <span className="text-4xl md:text-5xl font-black tracking-tighter text-ely-blue uppercase block">AGM INVEST</span>
                            <span className="h-1 w-24 bg-ely-mint mx-auto mt-2 block rounded-full"></span>
                        </motion.div>
                        <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">
                            {t('title')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {t('stepIndicator', {
                                current: step,
                                total: 3,
                                stepName: step === 1 ? t('step1') : step === 2 ? t('step2') : t('step3')
                            })}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-ely-mint shadow-sm shadow-ely-mint/50" : "bg-gray-200"
                                }`}
                        />
                    ))}
                </div>

                <div className="bg-white/70 backdrop-blur-xl py-10 px-8 flex flex-col shadow-2xl shadow-ely-mint/10 rounded-3xl border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-1 col-span-1">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.civility')}</label>
                                            <select
                                                name="civility"
                                                value={formData.civility}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                            >
                                                <option>M.</option>
                                                <option>Mme</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.firstName')}</label>
                                            <input
                                                name="firstName"
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="Jean"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.lastName')}</label>
                                        <input
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                            placeholder="Dupont"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.birthDate')}</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                                </div>
                                                <input
                                                    name="birthDate"
                                                    type="date"
                                                    required
                                                    value={formData.birthDate}
                                                    onChange={handleChange}
                                                    className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.birthPlace')}</label>
                                            <input
                                                name="birthPlace"
                                                type="text"
                                                required
                                                value={formData.birthPlace}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="Nantes"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.nationality')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="nationality"
                                                type="text"
                                                required
                                                value={formData.nationality}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="Française"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.address')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Home className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="address"
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="123 rue de la Paix"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.zipCode')}</label>
                                            <input
                                                name="zipCode"
                                                type="text"
                                                required
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="75000"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.city')}</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                                </div>
                                                <input
                                                    name="city"
                                                    type="text"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                    placeholder="Paris"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.phone')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="phone"
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="06 12 34 56 78"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.email')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.password')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-ely-mint transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 ml-1">{t('Fields.confirmPassword')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-ely-mint transition-colors" />
                                            </div>
                                            <input
                                                name="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-mint/20 focus:border-ely-mint transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start px-1">
                                        <div className="flex items-center h-6">
                                            <input
                                                name="acceptTerms"
                                                type="checkbox"
                                                required
                                                checked={formData.acceptTerms}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-ely-mint focus:ring-ely-mint border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="text-gray-600 leading-tight block">
                                                {t.rich('Fields.terms', {
                                                    bold: (chunks) => <span className="font-bold text-ely-blue hover:underline cursor-pointer">{chunks}</span>
                                                })}
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-4 px-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {t('back')}
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex-[2] flex justify-center items-center gap-3 py-4 px-4 bg-ely-mint text-white rounded-2xl font-bold text-lg shadow-xl shadow-ely-mint/20 hover:bg-ely-mint/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ely-mint transition-all"
                            >
                                {step === 3 ? t('submit.finish') : t('submit.next')}
                                {step === 3 ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100/50 text-center text-sm">
                        <p className="text-gray-500 font-medium mb-4">
                            {t('alreadyClient')}
                        </p>
                        <Link
                            href="/login"
                            className="w-full flex justify-center items-center py-3 px-4 border-2 border-ely-blue text-ely-blue rounded-2xl font-bold text-base hover:bg-ely-blue hover:text-white transition-all"
                        >
                            {t('login')}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
