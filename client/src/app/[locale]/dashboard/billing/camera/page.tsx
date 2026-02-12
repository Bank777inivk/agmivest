"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter as useNextRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Loader2, X, Play, StopCircle, ArrowLeft, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import { saveMedia, getMedia } from "@/lib/idb";

export default function CameraPage() {
    const router = useNextRouter();
    const searchParams = useSearchParams();
    const step = parseInt(searchParams.get("step") || "1"); // 1 = selfie, 2 = video

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    // États de validation
    const [isSelfieValidated, setIsSelfieValidated] = useState(false);
    const [isVideoValidated, setIsVideoValidated] = useState(false);

    // États de review
    const [isReviewing, setIsReviewing] = useState(false); // Pour le selfie
    const [isVideoReviewing, setIsVideoReviewing] = useState(false); // Pour la vidéo

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Initialiser le selfie depuis localStorage/IDB si on est à l'étape 2 (vidéo)
    useEffect(() => {
        if (step === 2) {
            // Essayer de charger depuis IDB d'abord
            getMedia("selfiePreview").then((data) => {
                if (data && typeof data === 'string') {
                    setSelfiePreview(data);
                    setIsSelfieValidated(true);
                } else {
                    // Fallback localStorage si non trouvé (anciens users)
                    const storedSelfie = localStorage.getItem("selfiePreview");
                    if (storedSelfie) {
                        setSelfiePreview(storedSelfie);
                        setIsSelfieValidated(true);
                    }
                }
            });
        }
    }, [step]);

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
        if (stream && videoRef.current && !isReviewing && !isVideoReviewing) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Video play error:", err));
        }
    }, [stream, isReviewing, isVideoReviewing]);

    // Démarrer caméra automatiquement
    useEffect(() => {
        const shouldStartCamera = !isDesktop && !isReviewing && !isVideoReviewing;
        if (shouldStartCamera) {
            startCamera();
        }
        return () => stopCamera();
    }, [isDesktop, step, isReviewing, isVideoReviewing]);

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

    // --- SELFIE LOGIC ---

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");

            // Miroir horizontal
            ctx?.translate(canvas.width, 0);
            ctx?.scale(-1, 1);

            ctx?.drawImage(videoRef.current, 0, 0);

            const dataUrl = canvas.toDataURL("image/jpeg");
            setSelfiePreview(dataUrl);
            setIsReviewing(true);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setSelfiePreview(null);
        setIsReviewing(false);
        setIsSelfieValidated(false);
    };

    const validatePhoto = async () => {
        if (selfiePreview) {
            try {
                // Convertir base64 en blob pour stockage efficace
                const res = await fetch(selfiePreview);
                const blob = await res.blob();
                await saveMedia("selfieBlob", blob);
                await saveMedia("selfiePreview", selfiePreview); // Garder preview pour affichage rapide si besoin

                setIsSelfieValidated(true);
                setIsReviewing(false);
                router.push("/dashboard/billing/camera?step=2");
            } catch (error) {
                console.error("Error saving selfie:", error);
                alert("❌ Erreur de sauvegarde du selfie.");
            }
        }
    };

    // --- VIDEO LOGIC ---

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
            setIsVideoReviewing(true); // Passer en mode review vidéo
            stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= 10) { // Limite 10s
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    stopRecording();
                    return 10;
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

    const retakeVideo = () => {
        setVideoPreview(null);
        setIsVideoReviewing(false);
        setIsVideoValidated(false);
        // La caméra redémarrera grâce au useEffect
    };

    const validateVideo = () => {
        if (videoPreview) {
            fetch(videoPreview)
                .then(r => r.blob())
                .then(async (blob) => {
                    try {
                        await saveMedia("videoBlob", blob);
                        // On garde aussi une preview légère si possible, ou on la régénérera
                        // Pour l'instant on stocke juste le blob
                        setIsVideoValidated(true);
                    } catch (error) {
                        console.error("Storage error:", error);
                        alert("❌ Erreur de sauvegarde vidéo.");
                    }
                })
                .catch(err => {
                    console.error("Video validation error:", err);
                    alert("❌ Une erreur est survenue lors de la validation.");
                });
        }
    };

    // --- SHARED LOGIC ---

    const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            if (type === 'selfie') {
                setSelfiePreview(dataUrl);
                setIsReviewing(true);
            } else {
                setVideoPreview(dataUrl);
                // Sauvegarder direct pour éviter perte si refresh ? Non, attendons validation
                // Mais pour preview de gros fichier, FileReader ok
                setIsVideoReviewing(true);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFinish = () => {
        if (isSelfieValidated && isVideoValidated) {
            router.push("/dashboard/billing?verified=true");
        }
    };

    const handleBack = () => {
        if (isReviewing) {
            retakePhoto();
        } else if (isVideoReviewing && !isVideoValidated) {
            retakeVideo();
        } else if (step === 2) {
            // Si on a validé la vidéo mais qu'on veut revenir, peut-être interdire ou reset
            if (isVideoValidated) {
                setIsVideoValidated(false); // Reset validation si on revient
            } else {
                router.push("/dashboard/billing/camera?step=1");
            }
        } else {
            router.push("/dashboard/billing");
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {isDesktop ? (
                // Message desktop - Inchangé
                <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
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
                // Interface mobile
                <>
                    <div className="relative flex-1 bg-black overflow-hidden">

                        {/* VIEWPORT CONTENT */}
                        {isReviewing && selfiePreview ? (
                            // REVIEW SELFIE
                            <div className="w-full h-full relative">
                                <Image src={selfiePreview} alt="Selfie Preview" fill className="object-cover scale-x-[-1]" />
                                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                            </div>
                        ) : isVideoReviewing && videoPreview ? (
                            // REVIEW VIDEO
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <video
                                    ref={videoPreviewRef}
                                    src={videoPreview}
                                    controls={!isVideoValidated} // Contrôles si non validé
                                    autoPlay={!isVideoValidated}
                                    playsInline
                                    className="w-full h-full object-contain"
                                    onEnded={() => {
                                        if (videoPreviewRef.current) {
                                            // Replay automatique ou icône replay ?
                                        }
                                    }}
                                />
                                {isVideoValidated && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <div className="bg-green-500/20 p-8 rounded-full border-4 border-green-500 animate-[bounce_1s_ease-out]">
                                            <Check className="w-16 h-16 text-green-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : stream ? (
                            // CAMÉRA LIVE
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]"
                            />
                        ) : (
                            // LOADING
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-12 h-12 text-ely-blue animate-spin" />
                                <p className="text-white/40 font-black uppercase tracking-widest text-xs">Accès caméra en cours...</p>
                            </div>
                        )}

                        {/* OVERLAYS ET HEADER */}

                        {/* Top Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 pointer-events-auto">
                            {!isVideoValidated && (
                                <button
                                    onClick={handleBack}
                                    className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
                                >
                                    <ArrowLeft className="w-5 h-5 text-white" />
                                </button>
                            )}

                            <div className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                <p className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                                    {step === 1 ? (
                                        isReviewing ? "Valider la photo" : <><Camera className="w-3 h-3" /> Selfie Photo</>
                                    ) : (
                                        isVideoReviewing
                                            ? (isVideoValidated ? "Vérification terminée" : "Valider la vidéo")
                                            : <><Video className="w-3 h-3" /> Selfie Vidéo</>
                                    )}
                                </p>
                            </div>

                            {/* Selfie Thumbnail (visible in Step 2) */}
                            {step === 2 && selfiePreview ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg relative ml-2 group">
                                    <Image src={selfiePreview} alt="Selfie" fill className="object-cover scale-x-[-1]" />
                                    {isSelfieValidated && (
                                        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                                            <div className="bg-green-500 rounded-full p-0.5 shadow-sm">
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-10" />
                            )}
                        </div>

                        {/* Timer Recording */}
                        {step === 2 && isRecording && (
                            <div className="absolute top-20 left-0 right-0 flex justify-center z-10">
                                <div className="px-6 py-2 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-white font-black text-lg font-mono">{recordingTime}s / 10s</span>
                                </div>
                            </div>
                        )}

                        {/* Guide Text (Supprimé "Dites : ...") */}
                        {!isReviewing && !isVideoReviewing && (
                            <div className="absolute bottom-40 left-0 right-0 text-center px-6 pointer-events-none">
                                <p className="text-white/80 text-sm font-medium drop-shadow-md">
                                    {step === 1
                                        ? "Placez votre visage dans le cadre"
                                        : isRecording
                                            ? "Enregistrement en cours..."
                                            : "Appuyez pour enregistrer une vidéo"
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CONTROLS AREA */}
                    <div className="bg-black p-6 pb-10 pt-4 rounded-t-[2rem] -mt-6 relative z-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                        <div className="flex flex-col items-center gap-6">

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center w-full gap-6">
                                {isReviewing ? (
                                    // REVIEW SELFIE
                                    <>
                                        <button onClick={retakePhoto} className="px-6 py-4 bg-white/10 text-white rounded-full font-bold text-xs uppercase tracking-wide border border-white/10 flex items-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> Reprendre
                                        </button>
                                        <button onClick={validatePhoto} className="px-8 py-4 bg-ely-blue text-white rounded-full font-bold text-xs uppercase tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Valider
                                        </button>
                                    </>
                                ) : isVideoReviewing ? (
                                    // REVIEW VIDEO
                                    isVideoValidated ? (
                                        // VIDEO VALIDATED -> WAITING FOR FINISH
                                        <div className="text-green-500 font-bold flex items-center gap-2 py-4">
                                            <Check className="w-5 h-5" /> Vidéo validée
                                        </div>
                                    ) : (
                                        // VIDEO REVIEW
                                        <>
                                            <button onClick={retakeVideo} className="px-6 py-4 bg-white/10 text-white rounded-full font-bold text-xs uppercase tracking-wide border border-white/10 flex items-center gap-2">
                                                <RotateCcw className="w-4 h-4" /> Reprendre
                                            </button>
                                            <button onClick={validateVideo} className="px-8 py-4 bg-ely-blue text-white rounded-full font-bold text-xs uppercase tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                                <Check className="w-4 h-4" /> Valider
                                            </button>
                                        </>
                                    )
                                ) : (
                                    // CAPTURE MODE
                                    step === 1 ? (
                                        <button onClick={capturePhoto} disabled={!stream} className="relative group disabled:opacity-50 disabled:cursor-not-allowed">
                                            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-all duration-200" />
                                            </div>
                                        </button>
                                    ) : (
                                        <button onClick={isRecording ? stopRecording : startRecording} disabled={!stream} className="relative group disabled:opacity-50 disabled:cursor-not-allowed">
                                            <div className={`w-20 h-20 rounded-full border-4 ${isRecording ? 'border-red-500' : 'border-white'} flex items-center justify-center transition-colors duration-300`}>
                                                <div className={`w-16 h-16 ${isRecording ? 'bg-red-500 scale-50 rounded-md' : 'bg-red-500 rounded-full'} group-hover:scale-95 transition-all duration-300`} />
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Secondary Actions (Upload) - Hidden during review or recording */}
                            {!isReviewing && !isVideoReviewing && !isRecording && (
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => step === 1 ? fileInputRef.current?.click() : videoInputRef.current?.click()}
                                        className="text-white/40 text-xs font-medium hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5"
                                    >
                                        Uploader
                                    </button>
                                </div>
                            )}

                            {/* Final Finish Button */}
                            <AnimatePresence>
                                {isSelfieValidated && isVideoValidated && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full"
                                    >
                                        <button
                                            onClick={handleFinish}
                                            className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" /> Finaliser la vérification
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={(e) => handleManualUpload(e, 'selfie')} accept="image/*" className="hidden" />
                    <input type="file" ref={videoInputRef} onChange={(e) => handleManualUpload(e, 'video')} accept="video/*" className="hidden" />
                </>
            )}
        </div>
    );
}
