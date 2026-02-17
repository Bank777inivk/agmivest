"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Upload,
    FileText,
    CheckCircle,
    ArrowLeft,
    Loader2,
    X,
    Camera,
    ChevronRight,
    Search,
    CreditCard,
    Info
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import CameraModal from "@/components/dashboard/CameraModal";

import DesktopVerification from "@/components/dashboard/KYC/DesktopVerification";
import MobileVerification from "@/components/dashboard/KYC/MobileVerification";
import { DocumentUpload, IdNature } from "@/components/dashboard/KYC/types";

export default function IdentityVerificationPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [residenceCountry, setResidenceCountry] = useState<string>("France");
    const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({});
    const [isMobile, setIsMobile] = useState(false);

    // Identity Types
    const [id1Type, setId1Type] = useState<IdNature>("cni");
    const [id2Type, setId2Type] = useState<IdNature>("passport");

    // Camera Modal State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraTarget, setCameraTarget] = useState<string | null>(null);
    const [activeDoc, setActiveDoc] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Device Detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        let unsubDoc: () => void;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);

                const userDocRef = doc(db, "users", user.uid);
                unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const kycDocs = userData.kycDocuments || {};
                        const country = userData.residenceCountry || "France";
                        setResidenceCountry(country);
                        const isFrance = country === "France";

                        const isRectoVerso = (nature: IdNature) => nature === "cni" || nature === "resident_card";

                        const docDefinitions: Record<string, Partial<DocumentUpload>> = {};

                        if (isFrance) {
                            if (isRectoVerso(id1Type)) {
                                docDefinitions.identity_1_front = { label: "Identité 1 (Recto)", description: `Avant de votre ${id1Type === 'cni' ? 'CNI' : 'Titre'}.`, icon: CreditCard };
                                docDefinitions.identity_1_back = { label: "Identité 1 (Verso)", description: `Arrière de votre ${id1Type === 'cni' ? 'CNI' : 'Titre'}.`, icon: CreditCard };
                            } else {
                                const label = id1Type === 'passport' ? "Passeport" : "Permis";
                                docDefinitions.identity_1 = { label: `Identité 1 (${label})`, description: `Photo claire de votre ${label.toLowerCase()}.`, icon: CreditCard };
                            }

                            if (isRectoVerso(id2Type)) {
                                docDefinitions.identity_2_front = { label: "Identité 2 (Recto)", description: `Avant de votre ${id2Type === 'cni' ? 'CNI' : 'Titre'}.`, icon: CreditCard };
                                docDefinitions.identity_2_back = { label: "Identité 2 (Verso)", description: `Arrière de votre ${id2Type === 'cni' ? 'CNI' : 'Titre'}.`, icon: CreditCard };
                            } else {
                                const label = id2Type === 'passport' ? "Passeport" : "Permis";
                                docDefinitions.identity_2 = { label: `Identité 2 (${label})`, description: `Photo claire de votre ${label.toLowerCase()}.`, icon: CreditCard };
                            }

                            docDefinitions.vital_card = { label: "Carte Vitale", description: "Copie lisible de votre carte vitale.", icon: ShieldCheck };
                            docDefinitions.tax_notice = { label: "Avis d'imposition", description: "Dernier avis fiscal complet.", icon: FileText };
                            docDefinitions.pay_slip_1 = { label: "Bulletin de paie n°1", description: "Le plus récent (M).", icon: FileText };
                            docDefinitions.pay_slip_2 = { label: "Bulletin de paie n°2", description: "Mois précédent (M-1).", icon: FileText };
                            docDefinitions.pay_slip_3 = { label: "Bulletin de paie n°3", description: "Avant-dernier (M-2).", icon: FileText };
                            docDefinitions.address_proof = { label: "Justificatif Domicile", description: "Facture récente (-3 mois).", icon: Search };
                            docDefinitions.rib = { label: "RIB / IBAN", description: "À votre nom et prénom.", icon: CreditCard };
                        } else {
                            docDefinitions.id_front = { label: "Pièce ID (Recto)", description: "Copie de l'avant de votre pièce.", icon: CreditCard };
                            docDefinitions.id_back = { label: "Pièce ID (Verso)", description: "Copie de l'arrière de votre pièce.", icon: CreditCard };
                            docDefinitions.address_proof = { label: "Justificatif Domicile", description: "Facture ou certificat récent.", icon: Search };
                        }

                        setDocuments(prev => {
                            const updated: Record<string, DocumentUpload> = {};
                            Object.entries(docDefinitions).forEach(([key, def]) => {
                                const docKey = key;
                                const docData = kycDocs[docKey];
                                const url = typeof docData === 'string' ? docData : docData?.url;
                                const reviewStatus = typeof docData === 'object' ? docData?.status : 'pending';
                                const rejectionReason = typeof docData === 'object' ? docData?.rejectionReason : null;

                                updated[docKey] = {
                                    type: docKey,
                                    label: def.label!,
                                    description: def.description!,
                                    icon: def.icon!,
                                    file: prev[docKey]?.file || null,
                                    preview: prev[docKey]?.preview || null,
                                    url: url || null,
                                    status: url ? 'success' : (prev[docKey]?.status || 'idle'),
                                    reviewStatus,
                                    rejectionReason
                                };
                            });
                            return updated;
                        });
                    }
                }, (error) => {
                    console.error("Firestore Error:", error);
                });
            } else {
                if (unsubDoc) unsubDoc();
                router.push("/login");
            }
        });
        return () => {
            unsubscribe();
            if (unsubDoc) unsubDoc();
        };
    }, [router, id1Type, id2Type]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 8MB)");
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setDocuments(prev => ({
            ...prev,
            [activeDoc]: {
                ...prev[activeDoc],
                file,
                preview: previewUrl,
                status: "idle"
            }
        }));
        e.target.value = '';
    };

    const handleCameraCapture = (file: File) => {
        if (!cameraTarget) return;
        const previewUrl = URL.createObjectURL(file);
        setDocuments(prev => ({
            ...prev,
            [cameraTarget]: {
                ...prev[cameraTarget],
                file,
                preview: previewUrl,
                status: "idle"
            }
        }));
        setIsCameraOpen(false);
    };

    const triggerFileInput = (type: string) => {
        setActiveDoc(type);
        fileInputRef.current?.click();
    };

    const removeFile = (type: string) => {
        if (documents[type].preview) {
            URL.revokeObjectURL(documents[type].preview!);
        }
        setDocuments(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                file: null,
                preview: null,
                url: null,
                status: "idle"
            }
        }));
    };

    const uploadToCloudinary = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);
        formData.append("folder", `kyc/${userId}`);
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) throw new Error("Erreur upload");
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!userId) return;
        const allDocsPresent = Object.values(documents).every(doc => doc && (doc.file || doc.url));
        if (!allDocsPresent) {
            alert("Veuillez fournir tous les documents.");
            return;
        }
        setIsSubmitting(true);
        try {
            const kycDocuments: Record<string, any> = {};
            for (const key of Object.keys(documents)) {
                const docData = documents[key];
                if (!docData) continue;
                if (docData.file) {
                    setDocuments(prev => ({ ...prev, [key]: { ...prev[key], status: "uploading" } }));
                    try {
                        const url = await uploadToCloudinary(docData.file);
                        kycDocuments[key] = { url, status: 'pending', uploadedAt: serverTimestamp() };
                        setDocuments(prev => ({ ...prev, [key]: { ...prev[key], status: "success", url } }));
                    } catch (error) {
                        setDocuments(prev => ({ ...prev, [key]: { ...prev[key], status: "error" } }));
                        throw error;
                    }
                } else if (docData.url) {
                    kycDocuments[key] = { url: docData.url, status: docData.reviewStatus || 'pending' };
                }
            }
            await updateDoc(doc(db, "users", userId), {
                idStatus: "pending_verification",
                kycDocuments,
                kycSubmittedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (error) {
            console.error("Submit error:", error);
            alert("Erreur lors de l'envoi.");
            setIsSubmitting(false);
        }
    };

    const isAllSuccess = Object.values(documents).length > 0 && Object.values(documents).every(doc => doc?.status === "success");
    const docCount = Object.values(documents).length;
    const completedCount = Object.values(documents).filter(d => d && (d.file || d.url)).length;

    const commonProps = {
        documents,
        id1Type,
        setId1Type,
        id2Type,
        setId2Type,
        completedCount,
        docCount,
        isSubmitting,
        isAllSuccess,
        handleSubmit,
        triggerFileInput,
        removeFile,
        setCameraTarget,
        setIsCameraOpen
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className={`absolute -top-24 -left-24 w-96 h-96 blur-[120px] opacity-10 rounded-full bg-blue-400 pointer-events-none`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] opacity-[0.03] rounded-full bg-blue-600 pointer-events-none`} />

            {isMobile ? (
                <MobileVerification {...commonProps} />
            ) : (
                <div className="max-w-6xl mx-auto py-12 px-6">
                    <DesktopVerification {...commonProps} />
                </div>
            )}

            <CameraModal
                isOpen={isCameraOpen}
                title={documents[cameraTarget || ""]?.label || "Capture"}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
            />

            {/* Success Fullscreen Overlay */}
            <AnimatePresence>
                {isAllSuccess && !Object.values(documents).some(doc => doc.reviewStatus === 'rejected') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center space-y-8 max-w-sm"
                        >
                            <div className="relative w-32 h-32 mx-auto">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    className="absolute inset-0 bg-emerald-50 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle className="w-16 h-16 text-emerald-500" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-2 border-2 border-dashed border-emerald-200 rounded-full"
                                />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Succès !</h2>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    Vos documents ont été transmis à notre équipe d'analyse. Nous reviendrons vers vous sous 24h.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                            >
                                Revenir à l'accueil
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
