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
import { createNotification } from "@/hooks/useNotifications";
import { useRef } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idStatus, setIdStatus] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
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

                // On laisse un petit délai pour éviter les faux positifs au chargement
                const timeout = setTimeout(() => {
                    if (!auth.currentUser) router.push("/login");
                }, 3000);
                return () => clearTimeout(timeout);
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

                        // Notification on KYC status change
                        if (hasInitialStatus.current && prevStatusRef.current !== newStatus && newStatus) {
                            let title = "Mise à jour d'identité";
                            let message = "Le statut de votre vérification a changé.";
                            let type: 'info' | 'success' | 'warning' | 'error' = 'info';

                            if (newStatus === 'verified') {
                                title = "Identité Vérifiée ✅";
                                message = "Félicitations ! Votre compte est désormais pleinement opérationnel.";
                                type = 'success';
                            } else if (newStatus === 'rejected') {
                                title = "Action Requise ⚠️";
                                message = "Votre vérification a été refusée. Veuillez consulter vos emails.";
                                type = 'error';
                            } else if (newStatus === 'partial_rejection') {
                                title = "Documents à compléter";
                                message = "Certains documents ont été refusés. Merci de les soumettre à nouveau.";
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
                    // We only create a notification if it's "fresh" (last message is from admin)
                    // and if we haven't already notified about THIS unread count.
                    // For simplicity, we create a short-lived logic or just notification if chat is not open.
                    // Note: This logic could be refined but handles the basic "You have a message" requirement.
                    createNotification(user.uid, {
                        title: "Nouveau message 💬",
                        message: "Votre conseiller vous a envoyé un message. Cliquez pour répondre.",
                        type: 'info',
                        link: '/dashboard/support'
                    });
                }
            }
        });

        return () => unsubscribeChat();
    }, []);

    // On ne bloque plus le rendu global par un spinner
    // Le contenu (children) sera géré par loading.tsx si nécessaire

    // Si on est sur la page caméra, on n'affiche pas le layout dashboard
    // On utilise includes pour gérer les différents chemins de caméra (/billing/camera, /verification/camera, etc.)
    if (pathname?.includes('/camera')) {
        return <>{children}</>;
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
