"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // 1. Scroll to top on every navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // 2. Content Protection (Right-click, Copy, Drag)
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            // Allow context menu on input fields
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }
            e.preventDefault();
        };

        const handleCopy = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }
            // Optional: Alert the user or just prevent
            e.preventDefault();
        };

        const handleDragStart = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    return <>{children}</>;
}
