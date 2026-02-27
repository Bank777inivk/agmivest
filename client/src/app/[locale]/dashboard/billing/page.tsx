"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
    CreditCard,
    Landmark,
    CheckCircle,
    Info,
    Copy,
    ArrowLeft,
    ShieldCheck,
    Euro,
    Lock,
    Camera,
    Video,
    Loader2,
    X,
    CheckCircle2,
    Play,
    StopCircle,
    History
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs, limit, onSnapshot } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import Image from "next/image";
import { getMedia, deleteMedia } from "@/lib/idb";

export default function BillingPage() {
    const t = useTranslations('Dashboard.Billing');
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Tunnel Steps: 0: Intro, 1: Selfie, 2: Video, 3: Processing, 4: RIB
    const [verificationStep, setVerificationStep] = useState(0);
    const [userData, setUserData] = useState<any>(null);
    const searchParams = useSearchParams();
    const locale = useLocale();
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<Blob | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [systemError, setSystemError] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    const advisorRIB = request?.customRIB || {
        bankName: "ELYSSIO INVESTMENT BANK",
        iban: "FR76 3000 3020 1000 5000 7890 123",
        bic: "ELYSPRPPXXX",
        beneficiary: "ELYSSIO FINANCE - CONSEILLER FINANCIER"
    };

    const paymentTypeLabel = {
        frais_dossier: t('paymentTypes.frais_dossier'),
        assurance: t('paymentTypes.assurance'),
        frais_notaire: t('paymentTypes.frais_notaire'),
        authentication_deposit: t('paymentTypes.authentication_deposit'),
        none: t('paymentTypes.none')
    }[request?.paymentType as string] || t('paymentTypes.authentication_deposit');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                try {
                    const q = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const data = querySnapshot.docs[0].data();
                        setRequest({ id: querySnapshot.docs[0].id, ...data });
                    }

                    // Fetch user data for name
                    const userSnap = await getDoc(doc(db, "users", user.uid));
                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    }
                } catch (error: unknown) {
                    console.error("Error fetching payment request:", error);
                    setSystemError(error.code === 'permission-denied' ? t('errors.accessDenied') : error.message);
                } finally {
                    setIsLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Handle verification success email
    useEffect(() => {
        if (searchParams.get('verified') === 'true' && userData && userId) {
            const sendIdentityEmail = async () => {
                try {
                    await fetch("/api/email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            to: auth.currentUser?.email,
                            template: "identity-received",
                            language: locale,
                            apiKey: process.env.NEXT_PUBLIC_EMAIL_API_KEY || "agm-invest-email-2024",
                            data: {
                                firstName: userData.firstName || userData.displayName || "Client"
                            }
                        })
                    });
                    // Clean URL to prevent multiple sends on refresh
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                } catch (err) {
                    console.error("Failed to send identity confirmation email:", err);
                }
            };
            sendIdentityEmail();
        }
    }, [searchParams, userData, userId, locale]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (isLoading) return <PremiumSpinner />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20 relative overflow-hidden"
        >
            {/* Mobile Decorative Orbs */}
            <div className="absolute top-[-5%] right-[-15%] w-[70%] h-[30%] bg-ely-blue/10 rounded-full blur-[100px] pointer-events-none md:hidden" />

            {systemError && (
                <div className="absolute top-0 left-0 right-0 z-[100] p-4 bg-red-500 text-white text-center font-bold animate-in slide-in-from-top duration-500">
                    <p className="flex items-center justify-center gap-2">
                        <Info className="w-5 h-5" />
                        {systemError}
                        <button onClick={() => setSystemError(null)} className="ml-4 underline">OK</button>
                    </p>
                </div>
            )}

            <header className="flex items-center gap-4 relative z-10 px-2">
                <button
                    onClick={() => router.back()}
                    className="p-3.5 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-ely-blue transition-all shadow-sm active:scale-95 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">{t('title')}</h1>
                    <p className="text-slate-500 font-medium text-lg leading-none mt-1">{t('subtitle')}</p>
                </div>
            </header>

            {(!request || request.status !== 'approved' || request.paymentStatus === 'paid' || request.paymentType === 'none' || (request.paymentVerificationStatus !== 'verified' && request.paymentVerificationStatus !== 'on_review')) ? (
                <div className="bg-white rounded-[3.5rem] p-16 md:p-24 text-center border border-slate-100 shadow-sm relative z-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-slate-50 opacity-50 rounded-full group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
                            <CreditCard className="w-12 h-12 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                            {t('empty.title')}
                        </h2>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                            {t('empty.message')}
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="mt-10 px-10 py-5 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/10"
                        >
                            {t('empty.dashboardButton')}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        {/* Status Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gradient-to-br from-slate-900 via-ely-blue to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <ShieldCheck className="w-32 h-32" />
                                </div>

                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/10">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black tracking-widest uppercase text-white/90 pt-0.5">{t('policy.badge')}</span>
                                </div>

                                <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tight leading-tight uppercase">{t('policy.title')}</h3>
                                <div className="space-y-4 text-white/80 text-sm leading-relaxed relative z-10 mb-10 font-medium italic">
                                    <p>
                                        {t('policy.noHiddenFees.text')} <span className="text-white font-black underline underline-offset-4 decoration-emerald-400">{t('policy.noHiddenFees.highlight')}</span>.
                                    </p>
                                    <p>
                                        {t('policy.depositExplanation.text1')} <span className="text-white font-bold">286.00 €</span> {t('policy.depositExplanation.text2')} <span className="text-white font-bold">{paymentTypeLabel}</span> {t('policy.depositExplanation.text3')}
                                    </p>
                                    <p className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-emerald-400 font-bold underline">{t('policy.important.label')}</span> {t('policy.important.text1')} <span className="text-white font-bold">{t('policy.important.highlight')}</span> {t('policy.important.text2')}
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-inner group-hover:bg-white/15 transition-colors">
                                    <p className="text-[10px] uppercase font-black text-white/50 mb-2 tracking-widest">{t('deposit.label')}</p>
                                    <p className="text-5xl font-black tracking-tighter">286.00 €</p>
                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('deposit.credited')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-start gap-5 group transition-all hover:bg-slate-50">
                                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ring-8 ring-amber-50/50 group-hover:scale-110 transition-transform">
                                    <Info className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">{t('sepa.title')}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-bold italic opacity-80">
                                        {t('sepa.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIB Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-ely-blue to-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 ring-4 ring-blue-50">
                                            <Landmark className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{t('rib.title')}</h3>
                                            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{t('rib.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex flex-col items-end">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-ely-blue rounded-full border border-blue-100">
                                            <Lock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{t('rib.secureTransfer')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    {[
                                        { label: t('rib.fields.beneficiary'), value: advisorRIB.beneficiary, field: "beneficiary" },
                                        { label: t('rib.fields.bank'), value: advisorRIB.bankName, field: "bank" },
                                        { label: t('rib.fields.iban'), value: advisorRIB.iban, field: "iban", mono: true },
                                        { label: t('rib.fields.bic'), value: advisorRIB.bic, field: "bic", mono: true },
                                    ].map((item, i) => (
                                        <div key={i} className="group/item">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{item.label}</p>
                                                {copiedField === item.field && (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">{t('rib.copied')}</span>
                                                )}
                                            </div>
                                            <div className={cn(
                                                "flex items-center justify-between p-5 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group-hover/item:border-ely-blue/30 group-hover/item:bg-white transition-all duration-300",
                                                copiedField === item.field && "border-emerald-500/50 bg-emerald-50/10"
                                            )}>
                                                <p className={cn(
                                                    "text-sm md:text-lg font-black text-slate-900 truncate pr-4 transition-colors",
                                                    item.mono && "font-mono tracking-tight text-base md:text-xl",
                                                    copiedField === item.field && "text-emerald-600"
                                                )}>
                                                    {item.value}
                                                </p>
                                                <button
                                                    onClick={() => copyToClipboard(item.value, item.field)}
                                                    className={cn(
                                                        "p-3 rounded-2xl transition-all shrink-0 active:scale-90",
                                                        copiedField === item.field
                                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                            : "bg-white text-slate-400 hover:text-ely-blue shadow-sm border border-slate-100"
                                                    )}
                                                >
                                                    {copiedField === item.field ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-14 flex flex-col md:flex-row items-center gap-6 p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50 relative overflow-hidden group/info">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover/info:rotate-12 transition-transform duration-700">
                                        <ShieldCheck className="w-24 h-24" />
                                    </div>
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-ely-blue shadow-sm shrink-0 ring-4 ring-blue-50">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm text-blue-900/80 font-bold italic leading-relaxed text-center md:text-left relative z-10">
                                        {t('rib.confidentialNote')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-black text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {t('backLater')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
