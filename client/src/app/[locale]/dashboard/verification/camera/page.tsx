"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter as useNextRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Loader2, X, Play, StopCircle, ArrowLeft, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import { saveMedia, getMedia } from "@/lib/idb";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, query, collection, where, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { deleteMedia } from "@/lib/idb";

export default function CameraPage() {
    const router = useNextRouter();
    const searchParams = useSearchParams();
    const step = parseInt(searchParams.get("step") || "1"); // 1 = selfie, 2 = video

    const [userId, setUserId] = useState<string | null>(null);
    const [request, setRequest] = useState<any>(null);

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Initialiser Auth et Request
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
                    }
                } catch (error) {
                    console.error("Error fetching request:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Initialiser le selfie depuis IDB si on est à l'étape 2 (vidéo)
    useEffect(() => {
        if (step === 2) {
            getMedia("selfiePreview").then((data) => {
                if (data && typeof data === 'string') {
                    setSelfiePreview(data);
                    setIsSelfieValidated(true);
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

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
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
                const res = await fetch(selfiePreview);
                const blob = await res.blob();
                await saveMedia("selfieBlob", blob);
                await saveMedia("selfiePreview", selfiePreview);

                setIsSelfieValidated(true);
                setIsReviewing(false);
                router.push("/dashboard/verification/camera?step=2");
            } catch (error) {
                console.error("Error saving selfie:", error);
                alert("❌ Erreur de sauvegarde du selfie.");
            }
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
            setIsVideoReviewing(true);
            stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= 15) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    stopRecording();
                    return 15;
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
    };

    const validateVideo = () => {
        if (videoPreview) {
            fetch(videoPreview)
                .then(r => r.blob())
                .then(async (blob) => {
                    try {
                        await saveMedia("videoBlob", blob);
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
                setIsVideoReviewing(true);
            }
        };
        reader.readAsDataURL(file);
    };

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

    const handleFinish = async () => {
        if (!isSelfieValidated || !isVideoValidated || !userId || !request) return;

        setIsSubmitting(true);
        try {
            // Récupérer les blobs de IDB
            const selfieBlob = await getMedia("selfieBlob");
            const videoBlob = await getMedia("videoBlob");

            if (!selfieBlob || !videoBlob) throw new Error("Médias manquants");

            const selfieFile = new File([selfieBlob as Blob], "selfie.jpg", { type: "image/jpeg" });
            const finalVideoBlob = videoBlob as Blob;

            // Upload Cloudinary
            const selfieUrl = await uploadToCloudinary(selfieFile, "image");
            const videoUrl = await uploadToCloudinary(finalVideoBlob, "video");

            // Update Firestore
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
            }, 2000);
        } catch (error) {
            console.error("Submission error:", error);
            alert("❌ Erreur lors de l'envoi des fichiers.");
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (isReviewing) {
            retakePhoto();
        } else if (isVideoReviewing && !isVideoValidated) {
            retakeVideo();
        } else if (step === 2) {
            if (isVideoValidated) {
                setIsVideoValidated(false);
            } else {
                router.push("/dashboard/verification/camera?step=1");
            }
        } else {
            router.push("/dashboard/verification");
        }
    };

    const handleClearSession = async () => {
        if (window.confirm("Voulez-vous vraiment effacer toutes les captures et recommencer ?")) {
            await deleteMedia("selfieBlob");
            await deleteMedia("videoBlob");
            await deleteMedia("selfiePreview");
            setSelfiePreview(null);
            setVideoPreview(null);
            setIsSelfieValidated(false);
            setIsVideoValidated(false);
            setIsReviewing(false);
            setIsVideoReviewing(false);
            router.push("/dashboard/verification/camera?step=1");
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {isDesktop ? (
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
                                    <button onClick={handleBack} className="text-white/50 text-xs underline hover:text-white/70">← Retour</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative flex-1 bg-black overflow-hidden">
                        {isReviewing && selfiePreview ? (
                            <div className="w-full h-full relative">
                                <Image src={selfiePreview} alt="Selfie Preview" fill className="object-cover scale-x-[-1]" />
                                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                            </div>
                        ) : isVideoReviewing && videoPreview ? (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <video ref={videoPreviewRef} src={videoPreview} controls={!isVideoValidated} autoPlay={!isVideoValidated} playsInline className="w-full h-full object-contain" />
                                {isVideoValidated && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <div className="bg-green-500/20 p-8 rounded-full border-4 border-green-500 animate-[bounce_1s_ease-out]">
                                            <Check className="w-16 h-16 text-green-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : stream ? (
                            <div className="w-full h-full relative">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />


                                {/* Oval Mask Overlay - Video Section Only & Head Sized */}
                                {step === 2 && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="w-full h-full bg-black/40 backdrop-blur-sm" style={{
                                            maskImage: 'radial-gradient(ellipse 140px 200px at center, transparent 100%, black 100%)',
                                            WebkitMaskImage: 'radial-gradient(ellipse 140px 200px at center, transparent 100%, black 100%)'
                                        }} />

                                        {/* Dynamic Border Color based on time with Directional Animations */}
                                        <div className={`absolute w-[280px] h-[400px] border-4 rounded-[140px/200px] flex flex-col items-center justify-center transition-all duration-300 ${!isRecording ? "border-white/50" :
                                                recordingTime < 4 ? "border-l-green-500 border-y-white/10 border-r-white/10 shadow-[-15px_0_30px_rgba(34,197,94,0.4)] animate-pulse" : // Left
                                                    recordingTime < 8 ? "border-r-green-500 border-y-white/10 border-l-white/10 shadow-[15px_0_30px_rgba(34,197,94,0.4)] animate-pulse" : // Right
                                                        recordingTime < 12 ? "border-t-green-500 border-x-white/10 border-b-white/10 shadow-[0_-15px_30px_rgba(34,197,94,0.4)] animate-pulse" : // Top
                                                            "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.8)]" // Perfect
                                            }`}>
                                            <div className="mt-auto mb-10 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300">
                                                <p className={`text-white text-xs font-black uppercase tracking-widest whitespace-nowrap ${recordingTime >= 12 ? "text-green-400" : ""}`}>
                                                    {!isRecording ? "Appuyez pour lancer" :
                                                        recordingTime < 4 ? "Tournez la tête à GAUCHE" :
                                                            recordingTime < 8 ? "Tournez la tête à DROITE" :
                                                                recordingTime < 12 ? "Soulevez la tête" :
                                                                    "Parfait !"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-12 h-12 text-ely-blue animate-spin" />
                                <p className="text-white/40 font-black uppercase tracking-widest text-xs">Accès caméra en cours...</p>
                            </div>
                        )}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 pointer-events-auto">
                            {!isVideoValidated && (
                                <button onClick={handleBack} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all border border-white/10">
                                    <ArrowLeft className="w-5 h-5 text-white" />
                                </button>
                            )}
                            <div className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                <p className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                                    {step === 1 ? (isReviewing ? "Valider la photo" : <><Camera className="w-3 h-3" /> Selfie Photo</>) : (isVideoReviewing ? (isVideoValidated ? "Vérification terminée" : "Valider la vidéo") : <><Video className="w-3 h-3" /> Selfie Vidéo</>)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {step === 2 && selfiePreview && (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg relative group">
                                        <Image src={selfiePreview} alt="Selfie" fill className="object-cover scale-x-[-1]" />
                                        {isSelfieValidated && (
                                            <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                                                <div className="bg-green-500 rounded-full p-0.5 shadow-sm"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button onClick={handleClearSession} className="w-10 h-10 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/40 transition-all border border-red-500/30 group">
                                    <X className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                        {step === 2 && isRecording && (
                            <div className="absolute top-20 left-0 right-0 flex justify-center z-10">
                                <div className="px-6 py-2 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-white font-black text-lg font-mono">{recordingTime}s / 10s</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-black p-6 pb-10 pt-4 rounded-t-[2rem] -mt-6 relative z-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center justify-center w-full gap-6">
                                {isReviewing ? (
                                    <>
                                        <button onClick={retakePhoto} className="px-6 py-4 bg-white/10 text-white rounded-full font-bold text-xs uppercase tracking-wide border border-white/10 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reprendre</button>
                                        <button onClick={validatePhoto} className="px-8 py-4 bg-ely-blue text-white rounded-full font-bold text-xs uppercase tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-2"><Check className="w-4 h-4" /> Valider</button>
                                    </>
                                ) : isVideoReviewing ? (
                                    isVideoValidated ? <div className="text-green-500 font-bold flex items-center gap-2 py-4"><Check className="w-5 h-5" /> Vidéo validée</div> : (
                                        <>
                                            <button onClick={retakeVideo} className="px-6 py-4 bg-white/10 text-white rounded-full font-bold text-xs uppercase tracking-wide border border-white/10 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reprendre</button>
                                            <button onClick={validateVideo} className="px-8 py-4 bg-ely-blue text-white rounded-full font-bold text-xs uppercase tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-2"><Check className="w-4 h-4" /> Valider</button>
                                        </>
                                    )
                                ) : (
                                    step === 1 ? (
                                        <button onClick={capturePhoto} disabled={!stream} className="relative group disabled:opacity-50 disabled:cursor-not-allowed">
                                            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"><div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-all duration-200" /></div>
                                        </button>
                                    ) : (
                                        <button onClick={isRecording ? stopRecording : startRecording} disabled={!stream} className="relative group disabled:opacity-50 disabled:cursor-not-allowed">
                                            <div className={`w-20 h-20 rounded-full border-4 ${isRecording ? 'border-red-500' : 'border-white'} flex items-center justify-center transition-colors duration-300`}><div className={`w-16 h-16 ${isRecording ? 'bg-red-500 scale-50 rounded-md' : 'bg-red-500 rounded-full'} group-hover:scale-95 transition-all duration-300`} /></div>
                                        </button>
                                    )
                                )}
                            </div>
                            {!isReviewing && !isVideoReviewing && !isRecording && (
                                <button onClick={() => step === 1 ? fileInputRef.current?.click() : videoInputRef.current?.click()} className="text-white/40 text-xs font-medium hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 uppercase tracking-widest font-black">Télécharger</button>
                            )}
                            <AnimatePresence>
                                {isSelfieValidated && isVideoValidated && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                                        <button onClick={handleFinish} className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"><Check className="w-5 h-5" /> Finaliser la vérification</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={(e) => handleManualUpload(e, 'selfie')} accept="image/*" className="hidden" />
                    <input type="file" ref={videoInputRef} onChange={(e) => handleManualUpload(e, 'video')} accept="video/*" className="hidden" />
                </>
            )}

            {/* Submitting Overlay */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 bg-ely-blue/20 rounded-full animate-ping" />
                            <div className="relative w-24 h-24 bg-ely-blue rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                {isDone ? (
                                    <Check className="w-10 h-10 text-white" />
                                ) : (
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                {isDone ? "Vérification Terminée" : "Transmission en cours"}
                            </h2>
                            <p className="text-white/60 font-medium text-sm leading-relaxed">
                                {isDone
                                    ? "Votre identité a été soumise avec succès. Vous allez être redirigé..."
                                    : "Nous sécurisons vos données et finalisons la liaison de votre profil de paiement."
                                }
                            </p>
                        </div>

                        {!isDone && (
                            <div className="mt-12 flex flex-col items-center gap-3">
                                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-ely-blue"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear" }}
                                    />
                                </div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Chiffrement AES-256 en cours</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
