"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Camera,
    Video,
    Loader2,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, query, collection, where, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import { getMedia, deleteMedia } from "@/lib/idb";

export default function VerificationPage() {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    // 0: Intro, 3: Processing (Success capture)
    const [step, setStep] = useState(0);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<Blob | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                try {
                    const q = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const data = querySnapshot.docs[0].data();
                        setRequest({ id: querySnapshot.docs[0].id, ...data });

                        // Si déjà vérifié, redirection
                        if (data.paymentVerificationStatus === 'verified' || data.paymentVerificationStatus === 'on_review') {
                            router.push("/dashboard");
                        }
                    }
                } catch (error) {
                    console.error("Error fetching request:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Charger les médias capturés depuis IDB
    useEffect(() => {
        const loadMedia = async () => {
            try {
                const selfieBlob = await getMedia("selfieBlob");
                const videoBlob = await getMedia("videoBlob");

                if (selfieBlob && videoBlob) {
                    if (selfieBlob instanceof Blob) {
                        setSelfieFile(new File([selfieBlob], "selfie.jpg", { type: "image/jpeg" }));
                    }
                    if (videoBlob instanceof Blob) {
                        setVideoFile(videoBlob);
                    }
                    setStep(3); // Go to processing
                }
            } catch (error) {
                console.error("Error loading media:", error);
            }
        };
        loadMedia();
    }, []);

    const uploadToCloudinary = async (file: File | Blob, type: "image" | "video") => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);
        formData.append("folder", `payments/verifications/${userId}`);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`,
            { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Erreur lors de l'upload");
        const data = await response.json();
        return data.secure_url;
    };

    const finalizeVerification = async () => {
        if (!userId || !request || !selfieFile || !videoFile) return;

        setIsSubmitting(true);
        try {
            const selfieUrl = await uploadToCloudinary(selfieFile, "image");
            const videoUrl = await uploadToCloudinary(videoFile, "video");

            await updateDoc(doc(db, "requests", request.id), {
                paymentVerificationStatus: 'on_review',
                paymentSelfieUrl: selfieUrl,
                paymentVideoUrl: videoUrl,
                paymentVerificationSubmittedAt: serverTimestamp()
            });

            // Clean IDB
            await deleteMedia("selfieBlob");
            await deleteMedia("videoBlob");
            await deleteMedia("selfiePreview");

            setIsDone(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (error) {
            console.error("Submit error:", error);
            alert("Une erreur est survenue lors de l'envoi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <PremiumSpinner />;

    return (
        <div className="space-y-10 pb-20 relative overflow-hidden">
            <div className="absolute top-[-5%] right-[-15%] w-[70%] h-[30%] bg-ely-blue/10 rounded-full blur-[100px] pointer-events-none md:hidden" />

            <header className="flex items-center gap-4 relative z-10 px-2">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="p-3.5 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-ely-blue transition-all shadow-sm active:scale-95 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Vérification</h1>
                    <p className="text-slate-500 font-medium text-lg leading-none mt-1">Identité sécurisée par biométrie.</p>
                </div>
            </header>

            <div className="max-w-3xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-xl overflow-hidden text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-ely-blue/10 text-ely-blue rounded-3xl flex items-center justify-center mx-auto ring-8 ring-ely-blue/5">
                                <ShieldCheck className="w-10 h-10" />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Vérification de Sécurité</h2>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mx-auto">
                                    Pour valider votre dépôt d'authentification et sécuriser l'accès aux fonds, nous devons confirmer votre identité par un selfie en direct et une courte séquence vidéo.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-ely-blue shrink-0">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 leading-tight uppercase tracking-wider pt-1">
                                        <span className="text-slate-900 block mb-1">Selfie Photo</span>
                                        Visage dégagé, bonne luminosité.
                                    </p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-ely-blue shrink-0">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 leading-tight uppercase tracking-wider pt-1">
                                        <span className="text-slate-900 block mb-1">Selfie Vidéo (10s)</span>
                                        Tournez légèrement la tête.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/dashboard/verification/camera?step=1")}
                                className="w-full py-6 bg-ely-blue text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                            >
                                Démarrer la vérification
                            </button>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Action obligatoire • Conforme GDPR</p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-[3.5rem] p-16 md:p-24 text-center border border-slate-100 shadow-xl space-y-10"
                        >
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 bg-ely-blue/10 rounded-full animate-ping" />
                                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                                    {isSubmitting ? <Loader2 className="w-10 h-10 text-ely-blue animate-spin" /> : (isDone ? <CheckCircle2 className="w-10 h-10 text-emerald-500" /> : <ShieldCheck className="w-10 h-10 text-ely-blue" />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                    {isSubmitting ? "Traitement de vos fichiers" : (isDone ? "Vérification terminée !" : "Fichiers prêts !")}
                                </h2>
                                <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                                    {isSubmitting
                                        ? "Nous sécurisons vos données et finalisons la liaison de votre profil de paiement."
                                        : (isDone
                                            ? "Félicitations, votre identité a été soumise. Redirection vers le tableau de bord..."
                                            : "Vos captures ont été enregistrées localement. Cliquez ci-dessous pour les transmettre.")
                                    }
                                </p>
                            </div>
                            {!isSubmitting && !isDone && (
                                <button
                                    onClick={finalizeVerification}
                                    className="px-14 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                >
                                    Transmettre mes fichiers
                                </button>
                            )}
                            {isSubmitting && (
                                <div className="pt-4 flex flex-col items-center gap-3">
                                    <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-ely-blue"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 10 }}
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiffrement AES-256 en cours</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
