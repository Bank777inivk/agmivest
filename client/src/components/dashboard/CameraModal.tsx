"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
    title: string;
}

export default function CameraModal({ isOpen, onClose, onCapture, title }: CameraModalProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Platform detection
    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
            const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
            setIsDesktop(!isMobile && !isTablet && window.innerWidth > 768);
        };
        checkDevice();
    }, []);

    // Start/Stop Camera
    useEffect(() => {
        if (isOpen && !preview) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, preview]);

    // Sync stream with video element
    useEffect(() => {
        if (stream && videoRef.current && !isReviewing) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Video play error:", err));
        }
    }, [stream, isReviewing]);

    const startCamera = async () => {
        try {
            const constraints = {
                video: {
                    facingMode: "environment", // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
        } catch (error) {
            console.error("Camera error:", error);
            // Fallback to front camera if back fails
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                setStream(mediaStream);
            } catch (err) {
                alert("Impossible d'accéder à la caméra.");
                onClose();
            }
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

            // Draw video to canvas (handle flip if using front camera)
            const track = stream?.getVideoTracks()[0];
            const settings = track?.getSettings();
            const isFront = settings?.facingMode === 'user';

            if (isFront) {
                ctx?.translate(canvas.width, 0);
                ctx?.scale(-1, 1);
            }

            ctx?.drawImage(videoRef.current, 0, 0);

            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            setPreview(dataUrl);
            setIsReviewing(true);
            stopCamera();
        }
    };

    const handleValidate = async () => {
        if (preview) {
            const res = await fetch(preview);
            const blob = await res.blob();
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            onCapture(file);
            setPreview(null);
            setIsReviewing(false);
            onClose();
        }
    };

    const handleRetake = () => {
        setPreview(null);
        setIsReviewing(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10">
                    <button
                        onClick={() => { setPreview(null); setIsReviewing(false); onClose(); }}
                        className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 shadow-2xl"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <div className="px-6 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                        <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{title}</p>
                    </div>
                    <div className="w-12" />
                </div>

                {/* Viewport */}
                <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                    {preview ? (
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full relative"
                        >
                            <Image src={preview} alt="Capture Preview" fill className="object-cover" />
                        </motion.div>
                    ) : stream ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
                            </div>
                            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[9px]">Analyse de l'objectif...</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-black/80 backdrop-blur-2xl p-8 pb-16 pt-10 border-t border-white/5">
                    <div className="flex items-center justify-center gap-10">
                        {isReviewing ? (
                            <>
                                <button
                                    onClick={handleRetake}
                                    className="px-10 py-5 bg-white/5 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <RotateCcw className="w-4 h-4 inline-block mr-2" /> Reprendre
                                </button>
                                <button
                                    onClick={handleValidate}
                                    className="px-12 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-white/10 hover:bg-white/90 transition-all active:scale-95"
                                >
                                    <Check className="w-4 h-4 inline-block mr-2" /> Valider
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={capturePhoto}
                                disabled={!stream}
                                className="relative group disabled:opacity-20 transition-all"
                            >
                                <div className="w-24 h-24 rounded-full border-[6px] border-white/20 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-2xl shadow-white/40 group-hover:scale-95 transition-transform" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
