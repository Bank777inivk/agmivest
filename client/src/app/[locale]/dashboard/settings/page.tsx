"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Bell,
    Lock,
    Eye,
    Languages,
    ChevronRight,
    Mail,
    Smartphone,
    Globe,
    ShieldCheck,
    Check,
    ArrowRight,
    Shield,
    X,
    Loader2
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
    onAuthStateChanged,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import { auth, isFirebaseError } from "@/lib/firebase";
import { createNotification } from "@/hooks/useNotifications";

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

export default function SettingsPage() {
    const t = useTranslations('Dashboard.Settings');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: true
    });

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [lastLogin, setLastLogin] = useState<string | null>(null);
    const [inactivityTimeout, setInactivityTimeout] = useState('never');
    const [isMounted, setIsMounted] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isTimeoutOpen, setIsTimeoutOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const langRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<HTMLDivElement>(null);

    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
            if (timeoutRef.current && !timeoutRef.current.contains(event.target as Node)) {
                setIsTimeoutOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMounted(true);
        const storedTimeout = localStorage.getItem('inactivityTimeout');
        if (storedTimeout) setInactivityTimeout(storedTimeout);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                setLastLogin(user.metadata.lastSignInTime || null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Inactivity Timeout Logic
    useEffect(() => {
        if (inactivityTimeout === 'never') return;

        const timeoutMs = parseInt(inactivityTimeout) * 60 * 1000;
        let timeout: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                auth.signOut().then(() => {
                    router.push('/login');
                });
            }, timeoutMs);
        };

        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => document.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            clearTimeout(timeout);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [inactivityTimeout, router]);

    const handleTimeoutChange = (value: string) => {
        setInactivityTimeout(value);
        localStorage.setItem('inactivityTimeout', value);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError(t('PasswordModal.errorMatch'));
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError(t('PasswordModal.errorLength'));
            return;
        }

        setIsUpdatingPassword(true);
        setPasswordError(null);

        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error("Utilisateur non connecté.");

            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Create notification
            await createNotification(user.uid, {
                title: 'securityUpdate.title',
                message: 'securityUpdate.message',
                type: 'success'
            });

            alert(t('PasswordModal.successAlert'));
        } catch (error: unknown) {
            console.error(error);
            if (isFirebaseError(error) && error.code === 'auth/wrong-password') {
                setPasswordError(t('PasswordModal.errorWrong'));
            } else {
                setPasswordError(t('PasswordModal.errorGeneric'));
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    } as const;

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    } as const;

    const switchLanguage = async (newLocale: string) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const { doc, updateDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");
                await updateDoc(doc(db, "users", user.uid), {
                    language: newLocale
                });
            } catch (error) {
                console.error("Error updating language in Firestore:", error);
            }
        }
        router.push(pathname, { locale: newLocale });
    };

    return (
        <div className="min-h-screen pb-20 relative bg-[#F8FAFC]">
            {/* Arrière-plan épuré */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-12 relative z-10 px-4 md:px-6">
                {/* Header Minimaliste */}
                <header className="space-y-3 pt-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400">
                        <Settings className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('title')}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm max-w-lg">
                        {t('subtitle')}
                    </p>
                </header>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Langues */}
                    <motion.section
                        variants={item}
                        className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm shadow-blue-900/5 space-y-6 group hover:border-ely-blue/20 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-ely-blue border border-blue-100">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{t('language')}</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all font-bold text-slate-900 flex items-center gap-3 text-left hover:bg-white"
                                >
                                    <span className="text-xl">
                                        {languages.find(l => l.code === locale)?.flag || '🌐'}
                                    </span>
                                    <span className="flex-1">
                                        {languages.find(l => l.code === locale)?.name || 'Select Language'}
                                    </span>
                                    <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${isLangOpen ? 'rotate-90' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 5 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto custom-scrollbar"
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        switchLanguage(lang.code);
                                                        setIsLangOpen(false);
                                                    }}
                                                    className={`w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${lang.code === locale ? 'bg-blue-50 text-ely-blue font-bold' : 'text-slate-600'}`}
                                                >
                                                    <span className="text-xl">{lang.flag}</span>
                                                    <span className="text-sm">{lang.name}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.section>

                    {/* Statut Système */}
                    <motion.section
                        variants={item}
                        className="bg-ely-blue p-8 rounded-3xl shadow-xl shadow-blue-900/20 flex flex-col justify-center gap-4 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-120 transition-transform duration-500">
                            <Globe className="w-24 h-24 text-white" />
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-100/60 uppercase tracking-[0.2em]">{t('lastLogin')}</span>
                        </div>
                        <p className="text-sm text-white font-medium relative z-10 leading-relaxed uppercase tracking-wider">
                            {isMounted && (lastLogin ? new Date(lastLogin).toLocaleString(locale, {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : t('system.sessionActive'))}
                        </p>
                    </motion.section>

                    {/* Notifications */}
                    <motion.section
                        variants={item}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 md:col-span-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{t('notifications')}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'email', icon: Mail, label: t('Notifications.emailLabel'), desc: t('Notifications.emailDesc') },
                                { id: 'push', icon: Smartphone, label: t('Notifications.pushLabel'), desc: t('Notifications.pushDesc') },
                                { id: 'marketing', icon: Globe, label: t('Notifications.offersLabel'), desc: t('Notifications.offersDesc') }
                            ].map((notif) => (
                                <div
                                    key={notif.id}
                                    className="p-5 rounded-2xl bg-slate-50/50 border border-slate-50 flex flex-col gap-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 bg-white rounded-xl text-slate-400">
                                            <notif.icon className="w-4 h-4" />
                                        </div>
                                        <button
                                            disabled={notif.id === 'email'}
                                            onClick={() => setNotifications({ ...notifications, [notif.id]: !notifications[notif.id as keyof typeof notifications] })}
                                            className={`relative w-12 h-6.5 rounded-full transition-all duration-300 ${notifications[notif.id as keyof typeof notifications] ? 'bg-ely-blue' : 'bg-slate-200'} ${notif.id === 'email' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications[notif.id as keyof typeof notifications] ? 'left-6.5' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{notif.label}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{notif.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Sécurité */}
                    <motion.section
                        variants={item}
                        className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-8 md:col-span-2 relative"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">{t('security')}</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
                            <div className="lg:col-span-6 space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t('loginEmail')}</label>
                                <div className="flex items-center justify-between px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-slate-300">
                                    <p className="font-bold text-sm truncate">{userEmail}</p>
                                    <Check className="w-4 h-4 text-blue-400" />
                                </div>
                            </div>
                            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t('security')}</label>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="w-full px-6 py-4.5 bg-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5 active:scale-95"
                                    >
                                        {t('password')}
                                    </button>
                                </div>
                                <div className="space-y-4 relative" ref={timeoutRef}>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t('autoLogout')}</label>
                                    <button
                                        onClick={() => setIsTimeoutOpen(!isTimeoutOpen)}
                                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white uppercase tracking-widest outline-none flex items-center justify-between hover:bg-white/10 transition-all"
                                    >
                                        <span>
                                            {isMounted ? (inactivityTimeout === 'never' ? t('timeouts.never') : t(`timeouts.${inactivityTimeout}min`)) : '...'}
                                        </span>
                                        <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${isTimeoutOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isTimeoutOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                                            >
                                                {[
                                                    { val: 'never', label: t('timeouts.never') },
                                                    { val: '5', label: t('timeouts.5min') },
                                                    { val: '15', label: t('timeouts.15min') },
                                                    { val: '30', label: t('timeouts.30min') }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.val}
                                                        onClick={() => {
                                                            handleTimeoutChange(opt.val);
                                                            setIsTimeoutOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest transition-colors ${inactivityTimeout === opt.val ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>

                <footer className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t('footer.aes')}</span>
                    </div>
                    <span>{t('footer.lastUpdate')} : {t('footer.february')} 2026</span>
                </footer>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('PasswordModal.title')}</h3>
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('PasswordModal.currentLabel')}</label>
                                        <input
                                            required
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all font-bold"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('PasswordModal.newLabel')}</label>
                                            <input
                                                required
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all font-bold"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('PasswordModal.confirmLabel')}</label>
                                            <input
                                                required
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all font-bold"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-red-100">
                                            {passwordError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-ely-blue transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isUpdatingPassword ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {t('PasswordModal.updating')}
                                            </>
                                        ) : t('PasswordModal.submit')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
