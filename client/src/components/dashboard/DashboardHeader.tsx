"use client";

import { useState, useEffect } from "react";
import {
    Bell,
    Search,
    Menu,
    User,
    ChevronDown,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardHeader({ onMenuClick, isCollapsed }: { onMenuClick: () => void, isCollapsed: boolean }) {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserEmail(user.email);
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserName(`${userDoc.data().firstName} ${userDoc.data().lastName}`);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <header className={`fixed top-0 right-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-72"
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
                        placeholder="Rechercher une demande..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                {/* Notifications */}
                <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all group">
                    <Bell className="w-5 h-5 group-hover:text-ely-blue" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-ely-mint rounded-full border-2 border-white animate-pulse" />
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl transition-all duration-200"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ely-blue to-blue-600 flex items-center justify-center text-white shadow-lg shadow-ely-blue/20">
                            {userName ? userName.charAt(0) : <User className="w-5 h-5" />}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold text-gray-900 leading-none">{userName || "Utilisateur"}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ShieldCheck className="w-3 h-3 text-ely-mint" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client Vérifié</span>
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
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Mon Profil</button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Paramètres</button>
                                <div className="border-t border-gray-50 mt-1" />
                                <button
                                    onClick={() => auth.signOut()}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                >
                                    Déconnexion
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
