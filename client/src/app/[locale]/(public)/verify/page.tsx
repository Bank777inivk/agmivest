"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, Inbox } from "lucide-react";
import { verifyOTP, storeOTP, generateOTP } from "@/lib/otp";

export default function VerifyPage() {
    const t = useTranslations('Verification');
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || "";
    const firstName = searchParams.get('firstName') || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push(`/${locale}/register`);
        }
    }, [email, locale, router]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = (e.currentTarget.previousSibling as HTMLInputElement);
            if (prev) prev.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length !== 6) return;

        setIsLoading(true);
        setError("");

        try {
            const isValid = await verifyOTP(email, fullOtp);
            if (isValid) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/${locale}/dashboard`);
                }, 2000);
            } else {
                setError(t('invalidCode'));
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const newOtp = generateOTP();
            await storeOTP(email, newOtp);

            await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: email,
                    template: "verify-email",
                    language: locale,
                    apiKey: process.env.NEXT_PUBLIC_EMAIL_API_KEY || "agm-invest-email-2024",
                    data: { firstName, otpCode: newOtp }
                }),
            });

            alert(t('success'));
        } catch (err) {
            setError("Could not resend code.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h1>
                    <p className="text-slate-500">
                        {t.rich('subtitle', {
                            email: email,
                            important: (chunks) => <span className="text-slate-900 font-medium">{chunks}</span>
                        })}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2 max-w-xs mx-auto">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm animate-shake">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || otp.join("").length !== 6 || success}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : success ? (
                            <ShieldCheck className="w-5 h-5" />
                        ) : (
                            <>
                                {t('verify')}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto mb-6"
                    >
                        <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                        {t('resend')}
                    </button>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
                        <div className="flex gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 h-fit">
                                <Inbox className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                {t('spamHint')}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
