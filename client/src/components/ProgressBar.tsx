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
            speed: 150,  // Encore plus rapide
            minimum: 0.2,
            trickleSpeed: 200  // Progression plus fluide et rapide
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
