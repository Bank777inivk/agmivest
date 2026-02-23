"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface IdentityBannerProps {
    idStatus: string | null;
}

export default function IdentityBanner({ idStatus }: IdentityBannerProps) {
    const router = useRouter();
    const t = useTranslations("Dashboard.Layout.IdentityBanner");

    if (idStatus !== "verification_required" && idStatus !== "pending_verification") return null;

    const isPending = idStatus === "pending_verification";

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`relative mb-8 overflow-hidden rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 isolation-auto
                ${isPending
                    ? "bg-blue-50/40 border border-blue-200/50 backdrop-blur-xl"
                    : "bg-amber-50/40 border border-amber-200/50 backdrop-blur-xl"
                }
            `}
        >
            {/* Ambient Background Glows */}
            <div className={`absolute -top-12 -left-12 w-32 h-32 blur-[60px] opacity-20 rounded-full ${isPending ? "bg-blue-400" : "bg-amber-400"}`} />
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 blur-[60px] opacity-20 rounded-full ${isPending ? "bg-blue-400" : "bg-amber-400"}`} />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <motion.div
                    animate={isPending ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
                    transition={isPending ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
                    className={`p-4 rounded-2xl shadow-xl flex items-center justify-center
                        ${isPending
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20"
                            : "bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/20"
                        }
                    `}
                >
                    {isPending
                        ? <Clock className="w-8 h-8 text-white" />
                        : <AlertCircle className="w-8 h-8 text-white" />
                    }
                </motion.div>

                <div className="flex flex-col items-center md:items-start space-y-1">
                    <h4 className={`text-xl font-black tracking-tight ${isPending ? "text-blue-950" : "text-amber-950"}`}>
                        {isPending ? t("pendingTitle") : t("requiredTitle")}
                    </h4>
                    <p className={`text-sm font-medium leading-relaxed max-w-md text-center md:text-left ${isPending ? "text-blue-800/80" : "text-amber-800/80"}`}>
                        {isPending
                            ? t("pendingMessage")
                            : t("requiredMessage")
                        }
                    </p>
                </div>
            </div>

            {!isPending && (
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/dashboard/profile/verification")}
                    className="relative z-10 w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-2"
                >
                    {t("action")}
                </motion.button>
            )}
        </motion.div>
    );
}
