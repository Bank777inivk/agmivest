"use client";

import { useState, useEffect, useRef } from "react";
import {
    Bell,
    Search,
    Menu,
    User,
    ChevronDown,
    ShieldCheck,
    Clock,
    AlertCircle,
    XCircle,
    Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardHeaderProps {
    onMenuClick: () => void;
    isCollapsed: boolean;
    idStatus: string | null;
    userName: string;
    userEmail: string | null;
}

export default function DashboardHeader({ onMenuClick, isCollapsed, idStatus, userName, userEmail }: DashboardHeaderProps) {
    const router = useRouter();
    const t = useTranslations();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusInfo = () => {
        switch (idStatus) {
            case 'verified':
                return {
                    label: t('Dashboard.Layout.Header.verifiedClient'),
                    icon: ShieldCheck,
                    color: "text-ely-mint",
                    bgColor: "bg-ely-mint/10"
                };
            case 'pending_verification':
                return {
                    label: t('Dashboard.Layout.Header.verificationInProgress'),
                    icon: Clock,
                    color: "text-blue-500",
                    bgColor: "bg-blue-50"
                };
            case 'verification_required':
                return {
                    label: t('Dashboard.Layout.Header.actionRequired'),
                    icon: AlertCircle,
                    color: "text-amber-500",
                    bgColor: "bg-amber-50"
                };
            case 'rejected':
                return {
                    label: t('Dashboard.Layout.Header.identityRejected'),
                    icon: XCircle,
                    color: "text-red-500",
                    bgColor: "bg-red-50"
                };
            case 'partial_rejection':
                return {
                    label: t('Dashboard.Layout.Header.docsToComplete'),
                    icon: AlertCircle,
                    color: "text-orange-500",
                    bgColor: "bg-orange-50"
                };
            default:
                return {
                    label: t('Dashboard.Layout.Header.accountToVerify'),
                    icon: User,
                    color: "text-gray-400",
                    bgColor: "bg-gray-50"
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <header className={`fixed top-0 right-0 z-40 flex items-center justify-between h-20 px-4 md:px-8 bg-white border-b border-gray-100 transition-all duration-300 ${isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-72"
            }`}>
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl lg:hidden transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl w-72 lg:w-96 group focus-within:bg-white focus-within:ring-2 focus-within:ring-ely-blue/10 focus-within:border-ely-blue/40 transition-all">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-ely-blue" />
                    <input
                        type="text"
                        placeholder={t('Dashboard.Layout.Header.searchPlaceholder')}
                        className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all group"
                    >
                        <Bell className="w-5 h-5 group-hover:text-ely-blue" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in duration-300">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 5, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-50"
                            >
                                <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
                                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">{t('Dashboard.Layout.Header.notifications')}</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={() => markAllAsRead()}
                                            className="text-[10px] font-bold text-ely-blue hover:text-blue-700 transition-colors uppercase tracking-wider"
                                        >
                                            {t('Dashboard.Layout.Header.markAllAsRead')}
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 px-6 text-center space-y-3">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                                                <Bell className="w-6 h-6" />
                                            </div>
                                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{t('Dashboard.Layout.Header.noNotifications')}</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <button
                                                key={notif.id}
                                                onClick={() => {
                                                    markAsRead(notif.id);
                                                    if (notif.link) router.push(notif.link);
                                                    setShowNotifications(false);
                                                }}
                                                className={`w-full p-5 text-left flex gap-4 transition-colors border-b border-slate-50 last:border-0 ${notif.read ? 'opacity-60 grayscale-[0.5]' : 'bg-blue-50/30'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${notif.type === 'success' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                    notif.type === 'warning' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                        notif.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' :
                                                            'bg-blue-50 text-ely-blue border-blue-100'
                                                    }`}>
                                                    {notif.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                </div>
                                                <div className="space-y-1 overflow-hidden">
                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{notif.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{notif.message}</p>
                                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.15em] pt-1">
                                                        {notif.timestamp ? formatDistanceToNow(notif.timestamp.toDate(), { addSuffix: true, locale: fr }) : 'À l\'instant'}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 rounded-full bg-ely-blue shrink-0 mt-5" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                                    <button
                                        onClick={() => {
                                            router.push('/dashboard/settings');
                                            setShowNotifications(false);
                                        }}
                                        className="text-[9px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
                                    >
                                        {t('Dashboard.Layout.Header.managePreferences')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile */}
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl transition-all duration-200"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ely-blue to-blue-600 flex items-center justify-center text-white shadow-lg shadow-ely-blue/20">
                            {userName ? userName.charAt(0) : <User className="w-5 h-5" />}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold text-gray-900 leading-none">{userName || t('Dashboard.Layout.Header.user')}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {idStatus === 'verified' && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />}
                                <statusInfo.icon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${statusInfo.color}`}>{statusInfo.label}</span>
                            </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 5, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                            >
                                <div className="px-4 py-3 border-b border-gray-50 lg:hidden">
                                    <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{userEmail}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        router.push("/dashboard/profile");
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    {t('Dashboard.Layout.Sidebar.myProfile')}
                                </button>
                                <button
                                    onClick={() => {
                                        router.push("/dashboard/settings");
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    {t('Dashboard.Layout.Sidebar.settings')}
                                </button>
                                <div className="border-t border-gray-50 mt-1" />
                                <button
                                    onClick={async () => {
                                        await auth.signOut();
                                        setShowProfileMenu(false);
                                        router.push("/login");
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                >
                                    {t('Dashboard.Layout.Sidebar.logout')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
