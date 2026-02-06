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
            speed: 250,  // Un peu plus lent pour accompagner le fondu
            minimum: 0.3,
            trickleSpeed: 200
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
