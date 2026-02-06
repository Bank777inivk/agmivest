"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IdentityBanner from "@/components/dashboard/IdentityBanner";
import { usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "@/i18n/routing";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idStatus, setIdStatus] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let unsubUser: () => void;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // On laisse un petit délai pour éviter les faux positifs au chargement
                const timeout = setTimeout(() => {
                    if (!auth.currentUser) router.push("/login");
                }, 1000);
                return () => clearTimeout(timeout);
            } else {
                setLoading(false);

                // Fetch user data for identity banner
                unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setIdStatus(docSnap.data().idStatus || null);
                    }
                });
            }
        });

        // Close mobile sidebar on route change
        setIsSidebarOpen(false);

        return () => {
            unsubscribe();
            if (unsubUser) unsubUser();
        };
    }, [pathname, router]);

    // On ne bloque plus le rendu global par un spinner
    // Le contenu (children) sera géré par loading.tsx si nécessaire

    return (
        <div className="h-screen bg-[#F8FAFC] overflow-hidden flex">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:block">
                <Sidebar
                    isMobile={false}
                    isOpen={false}
                    setIsOpen={() => { }}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </div>

            {/* Sidebar for Mobile */}
            <Sidebar
                isMobile={true}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={false}
                setIsCollapsed={() => { }}
            />

            <div
                className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out lg:ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"
                    }`}
            >
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} isCollapsed={isCollapsed} />
                <main className="flex-1 overflow-y-auto custom-scrollbar pt-20">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <IdentityBanner idStatus={idStatus} />
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F1F5F9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #64748B;
                    border-radius: 10px;
                    border: 2px solid #F1F5F9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
