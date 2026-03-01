"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IdentityBanner from "@/components/dashboard/IdentityBanner";
import { usePathname, useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, query, collection, where, limit, orderBy, getDoc } from "firebase/firestore";
import { useTranslations, useLocale } from "next-intl";
import { createNotification } from "@/hooks/useNotifications";
import { useRef } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(true); // Initial state should be loading
    const [idStatus, setIdStatus] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const prevStatusRef = useRef<string | null>(null);
    const hasInitialStatus = useRef(false);

    useEffect(() => {
        let unsubUser: () => void;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // CLEANUP IMMEDIATELY ON LOGOUT to avoid permission errors during redirection
                if (unsubUser) {
                    unsubUser();
                }

                // Redirect immediately if not logged in
                router.push("/login");
                return;
            } else {
                setLoading(false);
                setUserEmail(user.email);

                // Fetch user data for identity banner and header
                unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const newStatus = data.idStatus || null;
                        setIdStatus(newStatus);
                        setUserName(`${data.firstName} ${data.lastName}`);

                        // Sync language preference from Firestore
                        const preferredLanguage = data.language;
                        if (preferredLanguage && preferredLanguage !== locale) {
                            const supportedLocales = ['fr', 'en', 'es', 'it', 'pt', 'de', 'nl', 'pl', 'ro', 'sv'];
                            if (supportedLocales.includes(preferredLanguage)) {
                                router.push(pathname, { locale: preferredLanguage as any });
                            }
                        }

                        // Notification on KYC status change
                        if (hasInitialStatus.current && prevStatusRef.current !== newStatus && newStatus) {
                            let title = 'statusUpdate.title';
                            let message = 'statusUpdate.message';
                            let type: 'info' | 'success' | 'warning' | 'error' = 'info';

                            if (newStatus === 'verified') {
                                title = 'verified.title';
                                message = 'verified.message';
                                type = 'success';
                            } else if (newStatus === 'rejected') {
                                title = 'rejected.title';
                                message = 'rejected.message';
                                type = 'error';
                            } else if (newStatus === 'partial_rejection') {
                                title = 'partialRejection.title';
                                message = 'partialRejection.message';
                                type = 'warning';
                            }

                            createNotification(user.uid, { title, message, type, link: '/dashboard/verification' });
                        }

                        prevStatusRef.current = newStatus;
                        hasInitialStatus.current = true;
                    }
                }, (error: any) => {
                    console.error("Firestore Error (User Layout):", error);
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

    // Separate effect for chat notifications to avoid layout re-runs
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribeChat = onSnapshot(doc(db, "chats", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.unreadClient > 0) {
                    createNotification(user.uid, {
                        title: 'newMessage.title',
                        message: 'newMessage.message',
                        type: 'info',
                        link: '/dashboard/support'
                    });
                }
            }
        });

        return () => unsubscribeChat();
    }, []);

    // --- GLOBAL AUTO-ANALYSE TRIGGER (1 MINUTE DELAY) ---
    // Watches for pending requests and triggers analysis if user stays online
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Query for pending requests of the user
        const q = query(
            collection(db, "requests"),
            where("userId", "==", user.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!snapshot.empty) {
                // Filter and sort in memory to avoid complex index requirements
                const pendingRequests = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() as any }))
                    .filter(req => req.stepAnalysis === false)
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

                if (pendingRequests.length === 0) return;

                const latestRequest = pendingRequests[0];
                const requestId = latestRequest.id;

                console.log(`[DashboardLayout] Found unanalyzed request: ${requestId}. Starting 1min timer...`);

                const timer = setTimeout(async () => {
                    try {
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        const userData = userDoc.data();

                        await fetch("/api/requests/auto-analyse", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                requestId,
                                userId: user.uid,
                                firstName: userData?.firstName || "",
                                email: userData?.email || user.email,
                                language: locale
                            })
                        });
                        console.log(`[DashboardLayout] Auto-analysis triggered for request ${requestId}`);
                    } catch (err) {
                        console.error("[DashboardLayout] Failed to trigger auto-analysis:", err);
                    }
                }, 60000); // 1 minute

                return () => clearTimeout(timer);
            }
        });

        return () => unsubscribe();
    }, [locale]);

    // On ne bloque plus le rendu global par un spinner
    // Le contenu (children) sera géré par loading.tsx si nécessaire

    // Si on est sur la page caméra, on n'affiche pas le layout dashboard
    // On utilise includes pour gérer les différents chemins de caméra (/billing/camera, /verification/camera, etc.)
    if (pathname?.includes('/camera')) {
        return <>{children}</>;
    }

    // Prevent rendering dashboard content until auth is checked
    if (loading) {
        return <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ely-blue"></div>
        </div>;
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
                    idStatus={idStatus}
                />
            </div>

            {/* Sidebar for Mobile */}
            <Sidebar
                isMobile={true}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={false}
                setIsCollapsed={() => { }}
                idStatus={idStatus}
            />

            <div
                className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out lg:ml-0 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"
                    }`}
            >
                <DashboardHeader
                    onMenuClick={() => setIsSidebarOpen(true)}
                    isCollapsed={isCollapsed}
                    idStatus={idStatus}
                    userName={userName}
                    userEmail={userEmail}
                />
                <main className="flex-1 overflow-y-auto custom-scrollbar pt-20">
                    <div className={`mx-auto max-w-7xl ${pathname?.includes('/verification') ? 'p-0' : 'p-4 md:p-8'}`}>
                        {!pathname?.includes('/verification') && <IdentityBanner idStatus={idStatus} />}
                        {children}
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
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
            `}} />
        </div>
    );
}
