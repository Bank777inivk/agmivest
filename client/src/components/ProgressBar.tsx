"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBarCustom() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        nProgress.configure({
            showSpinner: false,
            speed: 100,  // Ultra rapide
            minimum: 0.05, // Commence tout de suite
            trickleSpeed: 150
        });
    }, []);

    useEffect(() => {
        nProgress.done();
        return () => {
            nProgress.start();
        };
    }, [pathname, searchParams]);

    return null;
}
