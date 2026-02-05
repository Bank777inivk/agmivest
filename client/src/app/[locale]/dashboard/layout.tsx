"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        });

        // Close mobile sidebar on route change
        setIsSidebarOpen(false);

        return () => unsubscribe();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="h-10 w-10 border-4 border-ely-blue/30 border-t-ely-blue rounded-full animate-spin" />
            </div>
        );
    }

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
