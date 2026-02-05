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
            speed: 200,  // Plus rapide (était 400)
            minimum: 0.1,  // Commence plus tôt (était 0.2)
            trickleSpeed: 300  // Animation plus rapide
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
