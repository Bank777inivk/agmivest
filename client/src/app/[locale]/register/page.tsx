"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Eye, EyeOff, Lock, Mail, User, CheckCircle, ArrowLeft, ArrowRight,
    Calendar, MapPin, Globe, Phone, Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Step = 1 | 2 | 3;

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "@/i18n/routing";

export default function RegisterPage() {
    const t = useTranslations('Auth.Register');
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: État Civil
        civility: "M.", // Retained from original, as instruction only showed partial
        firstName: "",
        lastName: "",
        birthDate: "",
        birthPlace: "",
        nationality: "Française", // Retained from original, as instruction only showed partial

        // Step 2: Coordonnées
        address: "",
        city: "",
        zipCode: "",
        phone: "",
        country: "France", // Added from instruction

        // Step 3: Sécurité
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (step < 3) {
            handleNext();
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('errorPasswordsDoNotMatch') || "Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            // Optionally save extra user data to Firestore here
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Registration error:", err);
            let message = "Une erreur est survenue lors de l'inscription.";
            if (err.code === 'auth/email-already-in-use') {
                message = t('errorEmailAlreadyInUse') || "Cet email est déjà utilisé.";
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F1F5F9]">
            {/* Background Decor with Mesh Gradients */}
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-ely-mint/15 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-ely-blue/10 blur-[120px] rounded-full -z-10" />

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
                            <Image
                                src="/logo.png"
                                alt="AGM INVEST"
                                width={160}
                                height={40}
                                className="h-10 mx-auto w-auto object-contain"
                                priority
                            />
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

                <div className="bg-white py-10 px-8 flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-3xl border border-white relative overflow-hidden">
                    {/* Subtle interior glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-ely-mint/5 -z-10" />
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium mb-6"
                            >
                                {error}
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* ... Content of step 1, 2, 3 ... */}
                            {/* Simplified for brevity in thought, but applying to the real file */}
                            {/* I will need to be careful with TargetContent here to match the real file */}
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
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="flex-1 py-4 px-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {t('back')}
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={`flex-[2] flex justify-center items-center gap-3 py-4 px-4 bg-ely-mint text-white rounded-2xl font-bold text-lg shadow-xl shadow-ely-mint/20 hover:bg-ely-mint/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ely-mint transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {step === 3 ? t('submit.finish') : t('submit.next')}
                                        {step === 3 ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                    </>
                                )}
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
