"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter as useNextRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Loader2, X, Play, StopCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function CameraPage() {
    const router = useNextRouter();
    const searchParams = useSearchParams();
    const step = parseInt(searchParams.get("step") || "1"); // 1 = selfie, 2 = video

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Détection de plateforme
    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
            const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
            const hasSmallScreen = window.innerWidth <= 768;
            setIsDesktop(!isMobile && !isTablet && !hasSmallScreen);
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Synchroniser stream avec video element
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Video play error:", err));
        }
    }, [stream]);

    // Démarrer caméra automatiquement
    useEffect(() => {
        if (!isDesktop) {
            startCamera();
        }
        return () => stopCamera();
    }, [isDesktop]);

    const startCamera = async () => {
        if (isDesktop) return;

        try {
            const constraints = {
                video: {
                    facingMode: "user",
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 }
                },
                audio: step === 2 // Audio uniquement pour vidéo
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
        } catch (error) {
            console.error("Camera error:", error);
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

            // Sauvegarder dans localStorage
            localStorage.setItem("selfiePreview", dataUrl);

            stopCamera();

            // Passer à l'étape vidéo
            router.push("/dashboard/billing/camera?step=2");
        }
    };

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];

        let options: MediaRecorderOptions = {};
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
            options = { mimeType: 'video/webm;codecs=vp8,opus' };
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
            options = { mimeType: 'video/webm' };
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoPreview(url);

            // Sauvegarder dans localStorage
            const reader = new FileReader();
            reader.onloadend = () => {
                localStorage.setItem("videoPreview", reader.result as string);
                stopCamera();
            };
            reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= 4) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    stopRecording();
                    return 5;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            if (type === 'selfie') {
                setSelfiePreview(dataUrl);
                localStorage.setItem("selfiePreview", dataUrl);
                router.push("/dashboard/billing/camera?step=2");
            } else {
                setVideoPreview(dataUrl);
                localStorage.setItem("videoPreview", dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFinish = () => {
        router.push("/dashboard/billing?verified=true");
    };

    const handleBack = () => {
        stopCamera();
        if (step === 2) {
            router.push("/dashboard/billing/camera?step=1");
        } else {
            router.push("/dashboard/billing");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl h-full flex flex-col">
                {isDesktop ? (
                    // Message desktop
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-8 max-w-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-amber-400 font-black text-lg mb-2 uppercase tracking-wide">📱 Vérification Mobile Uniquement</h3>
                                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                                        Cette vérification doit être effectuée depuis un smartphone pour des raisons de sécurité.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert("✅ Lien copié !");
                                            }}
                                            className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all"
                                        >
                                            📱 Copier le lien
                                        </button>
                                        <button
                                            onClick={handleBack}
                                            className="text-white/50 text-xs underline hover:text-white/70"
                                        >
                                            ← Retour
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Interface caméra mobile
                    <>
                        <div className="relative flex-1 rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-inner">
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

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handleBack}
                                        className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-white" />
                                    </button>
                                    <div className="px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full">
                                        <p className="text-white font-black uppercase tracking-widest text-xs">
                                            {step === 1 ? "Capturez votre Selfie" : "Prêt pour la Vidéo"}
                                        </p>
                                    </div>
                                    <div className="w-12" />
                                </div>
                            </div>

                            {/* Timer pour vidéo */}
                            {step === 2 && isRecording && (
                                <div className="absolute top-24 left-0 right-0 flex justify-center">
                                    <div className="px-8 py-4 bg-red-500 rounded-full flex items-center gap-3">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                        <span className="text-white font-black text-2xl">{recordingTime}s</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contrôles */}
                        <div className="mt-8 space-y-6">
                            {/* Boutons principaux */}
                            <div className="flex items-center justify-center gap-8">
                                <button
                                    onClick={handleBack}
                                    className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                {step === 1 ? (
                                    <button
                                        onClick={capturePhoto}
                                        disabled={!stream}
                                        className="w-24 h-24 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                                    >
                                        <Camera className="w-10 h-10 text-slate-900" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        disabled={!stream || videoPreview !== null}
                                        className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                                    >
                                        {isRecording ? (
                                            <StopCircle className="w-10 h-10 text-white" />
                                        ) : (
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Upload manuel */}
                            <div className="text-center">
                                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">ou</p>
                                <button
                                    onClick={() => step === 1 ? fileInputRef.current?.click() : videoInputRef.current?.click()}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-bold transition-all flex items-center gap-3 mx-auto border border-white/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    {step === 1 ? "Télécharger une Photo" : "Télécharger une Vidéo"}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleManualUpload(e, 'selfie')}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    onChange={(e) => handleManualUpload(e, 'video')}
                                    accept="video/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Prévisualisation et bouton finaliser */}
                            {step === 2 && videoPreview && (
                                <div className="pt-6 border-t border-white/5">
                                    <button
                                        onClick={handleFinish}
                                        className="w-full px-10 py-5 bg-ely-mint text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                    >
                                        Finaliser
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
