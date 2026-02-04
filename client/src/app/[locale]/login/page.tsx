"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations('Auth.Login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login with:", email, password);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F1F5F9]">
            {/* Background Decor with Mesh Gradients */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ely-blue/10 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ely-mint/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ely-blue transition-colors mb-8 group"
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
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                <div className="bg-white py-10 px-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-3xl border border-white relative overflow-hidden">
                    {/* Subtle interior glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-ely-blue/5 -z-10" />
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 ml-1 mb-1"
                                >
                                    {t('email')}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-ely-blue transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-blue/20 focus:border-ely-blue transition-all"
                                        placeholder="jean-dupont@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 ml-1 mb-1"
                                >
                                    {t('password')}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-ely-blue transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ely-blue/20 focus:border-ely-blue transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-ely-blue transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-ely-blue focus:ring-ely-blue border-gray-300 rounded-md cursor-pointer"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
                                >
                                    {t('rememberMe')}
                                </label>
                            </div>

                            <a href="#" className="text-sm font-semibold text-ely-blue hover:text-ely-blue/80 transition-colors whitespace-nowrap">
                                {t('forgotPassword')}
                            </a>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex justify-center items-center gap-3 py-4 px-4 bg-ely-blue text-white rounded-2xl font-bold text-lg shadow-xl shadow-ely-blue/20 hover:bg-ely-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ely-blue transition-all"
                        >
                            {t('submit')}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100/50 text-center">
                        <p className="text-sm text-gray-500 mb-4">
                            {t('newHere')}
                        </p>
                        <Link
                            href="/register"
                            className="w-full flex justify-center items-center py-3 px-4 border-2 border-ely-mint text-ely-mint rounded-2xl font-bold text-base hover:bg-ely-mint hover:text-white transition-all"
                        >
                            {t('createAccount')}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
