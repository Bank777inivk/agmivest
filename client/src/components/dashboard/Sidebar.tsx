"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    FileSignature,
    Info,
    LayoutDashboard,
    FileText,
    Landmark,
    FolderOpen,
    User,
    Settings,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    TrendingUp
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "@/i18n/routing";

const menuItems = [
    { icon: LayoutDashboard, label: "Mon Espace Client", href: "/dashboard" },
    { icon: Landmark, label: "Mon solde crédit AGM", href: "/dashboard/accounts" },
    { icon: Plus, label: "Faire une demande", href: "/dashboard/credit" },
    { icon: FileText, label: "Mes Demandes", href: "/dashboard/requests" },
    { icon: FolderOpen, label: "Mes Documents", href: "/dashboard/documents" },
    { icon: User, label: "Mon Profil", href: "/dashboard/profile" },
];

const secondaryItems = [
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Aide & Support", href: "/dashboard/support" },
];

export default function Sidebar({
    isMobile,
    isOpen,
    setIsOpen,
    isCollapsed,
    setIsCollapsed
}: {
    isMobile: boolean,
    isOpen: boolean,
    setIsOpen: (val: boolean) => void,
    isCollapsed: boolean,
    setIsCollapsed: (val: boolean) => void
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-gradient-to-br from-[#003d82] to-[#1e40af] border-r border-white/5">
            {/* Logo Area */}
            <div className="p-6">
                <Link href="/" className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed && !isMobile ? "justify-center" : ""}`}>
                    <div className={`bg-white p-2 rounded-xl shadow-lg transition-all duration-300 ${isCollapsed && !isMobile ? "w-11 h-11 flex items-center justify-center" : "w-32 h-12"}`}>
                        <div className="relative w-full h-full">
                            <Image
                                src="/logo-official.png"
                                alt="AGM INVEST"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-4 space-y-4 py-2 overflow-y-auto custom-scrollbar">
                <div>
                    {!isCollapsed && (
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-5 mb-4 drop-shadow-sm">
                            Menu Principal
                        </p>
                    )}
                    <nav className="space-y-0.5">
                        {menuItems.map((item) => {
                            const isActive = pathname.includes(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? "bg-white/10 backdrop-blur-md text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-l-4 border-ely-mint pl-3"
                                        : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-ely-mint' : 'group-hover:scale-110 text-white translate-z-0'}`} />
                                    {(!isCollapsed || isMobile) && (
                                        <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && (!isCollapsed || isMobile) && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-ely-mint shadow-[0_0_12px_rgba(40,232,152,0.8)]"
                                        />
                                    )}
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-ely-mint/0 via-ely-mint/5 to-ely-mint/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    {!isCollapsed && (
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-5 mb-4 drop-shadow-sm">
                            Préférences
                        </p>
                    )}
                    <nav className="space-y-0.5">
                        {secondaryItems.map((item) => {
                            const isActive = pathname.includes(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? "bg-white/10 backdrop-blur-md text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-l-4 border-ely-mint pl-3"
                                        : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-ely-mint' : 'group-hover:scale-110 text-white'}`} />
                                    {(!isCollapsed || isMobile) && (
                                        <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-ely-mint/0 via-ely-mint/5 to-ely-mint/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer Section */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-white/[0.03] rounded-2xl transition-all font-medium group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
                </button>
            </div>

            {/* Collapse Toggle (Desktop only) */}
            {!isMobile && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute bottom-24 -right-3 w-6 h-6 bg-[#003d82] border border-white/20 rounded-full flex items-center justify-center shadow-lg text-white/50 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <aside
            className={`fixed left-0 top-0 bottom-0 bg-[#003d82] z-20 transition-all duration-300 ease-in-out border-r border-white/5 ${isCollapsed ? "w-20" : "w-72"
                }`}
        >
            {sidebarContent}
        </aside>
    );
}
