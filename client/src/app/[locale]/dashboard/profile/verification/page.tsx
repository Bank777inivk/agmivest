"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Camera,
    ArrowLeft,
    Loader2,
    X
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

// Document Types
type DocType = "id_front" | "id_back" | "address_proof";

interface DocumentUpload {
    type: DocType;
    label: string;
    description: string;
    icon: any;
    file: File | null;
    preview: string | null;
    url: string | null;
    status: "idle" | "uploading" | "success" | "error";
    reviewStatus?: "pending" | "approved" | "rejected";
    rejectionReason?: string;
}

export default function IdentityVerificationPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeDoc, setActiveDoc] = useState<DocType>("id_front");
    const [documents, setDocuments] = useState<Record<DocType, DocumentUpload>>({
        id_front: {
            type: "id_front",
            label: "Carte d'identité (Recto)",
            description: "Une photo claire de l'avant de votre carte d'identité ou passeport.",
            icon: Camera,
            file: null,
            preview: null,
            url: null,
            status: "idle"
        },
        id_back: {
            type: "id_back",
            label: "Carte d'identité (Verso)",
            description: "Une photo de l'arrière de votre carte d'identité.",
            icon: Camera,
            file: null,
            preview: null,
            url: null,
            status: "idle"
        },
        address_proof: {
            type: "address_proof",
            label: "Justificatif de domicile",
            description: "Facture EDF, téléphone ou loyer de moins de 3 mois.",
            icon: FileText,
            file: null,
            preview: null,
            url: null,
            status: "idle"
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let unsubDoc: () => void;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);

                // Load existing KYC documents
                const userDocRef = doc(db, "users", user.uid);
                unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const kycDocs = userData.kycDocuments || {};

                        // Update documents state with existing data
                        setDocuments(prev => {
                            const updated = { ...prev };
                            Object.keys(updated).forEach(key => {
                                const docData = kycDocs[key];
                                if (docData) {
                                    const url = typeof docData === 'string' ? docData : docData?.url;
                                    const reviewStatus = typeof docData === 'object' ? docData?.status : 'pending';
                                    const rejectionReason = typeof docData === 'object' ? docData?.rejectionReason : null;

                                    updated[key as DocType] = {
                                        ...updated[key as DocType],
                                        url,
                                        reviewStatus,
                                        rejectionReason,
                                        status: url ? 'success' : 'idle'
                                    };
                                }
                            });
                            return updated;
                        });
                    }
                }, (error) => {
                    console.error("Firestore Error (KYC Doc):", error);
                });
            } else {
                // CLEANUP IMMEDIATELY ON LOGOUT
                if (unsubDoc) unsubDoc();
                router.push("/login");
            }
        });
        return () => {
            unsubscribe();
            if (unsubDoc) unsubDoc();
        };
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation simple
        if (file.size > 5 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 5MB)");
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
    };

    const triggerFileInput = (type: DocType) => {
        setActiveDoc(type);
        fileInputRef.current?.click();
    };

    const removeFile = (type: DocType) => {
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
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

    const handleSubmit = async () => {
        if (!userId) return;

        // Vérifier si tous les documents sont présents (soit déjà uploadés, soit nouveaux)
        const allDocsPresent = Object.values(documents).every(doc => doc.file || doc.url);
        if (!allDocsPresent) {
            alert("Veuillez fournir tous les documents demandés.");
            return;
        }

        setIsSubmitting(true);

        try {
            const kycDocuments: Record<string, any> = {};

            // Process each document
            for (const type of Object.keys(documents) as DocType[]) {
                const doc = documents[type];

                if (doc.file) {
                    // New file to upload
                    setDocuments(prev => ({
                        ...prev,
                        [type]: { ...prev[type], status: "uploading" }
                    }));

                    try {
                        const url = await uploadToCloudinary(doc.file);
                        kycDocuments[type] = {
                            url,
                            status: 'pending',
                            uploadedAt: serverTimestamp()
                        };
                        setDocuments(prev => ({
                            ...prev,
                            [type]: { ...prev[type], status: "success", url }
                        }));
                    } catch (error) {
                        setDocuments(prev => ({
                            ...prev,
                            [type]: { ...prev[type], status: "error" }
                        }));
                        throw error;
                    }
                } else if (doc.url && doc.reviewStatus === 'approved') {
                    // Keep approved documents as-is
                    kycDocuments[type] = {
                        url: doc.url,
                        status: 'approved',
                        reviewedAt: serverTimestamp()
                    };
                } else if (doc.url) {
                    // Keep existing documents with their current status
                    kycDocuments[type] = {
                        url: doc.url,
                        status: doc.reviewStatus || 'pending'
                    };
                }
            }

            // Mettre à jour Firestore
            await updateDoc(doc(db, "users", userId), {
                idStatus: "pending_verification",
                kycDocuments,
                kycSubmittedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Succès
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (error) {
            console.error("Submit error:", error);
            alert("Une erreur est survenue lors de l'envoi de vos documents.");
            setIsSubmitting(false);
        }
    };

    const isAllSuccess = Object.values(documents).every(doc => doc.status === "success");

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 relative min-h-[600px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-ely-blue transition-colors mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-ely-blue" />
                        Vérification d'Identité
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Vos données sont cryptées et traitées selon les normes bancaires Européennes.
                    </p>
                </div>
            </div>

            {/* Steps & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="space-y-6">
                    {(Object.values(documents) as DocumentUpload[]).map((doc, index) => (
                        <motion.div
                            key={doc.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-3xl bg-white border-2 transition-all ${activeDoc === doc.type ? 'border-ely-blue shadow-xl shadow-ely-blue/5' : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className={`p-4 rounded-2xl ${doc.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                    doc.status === 'uploading' ? 'bg-blue-50 text-blue-600' :
                                        'bg-gray-50 text-gray-400'
                                    }`}>
                                    {doc.status === 'success' ? <CheckCircle className="w-6 h-6" /> : <doc.icon className="w-6 h-6" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{doc.label}</h3>
                                        {doc.reviewStatus === 'approved' && (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Validé
                                            </span>
                                        )}
                                        {doc.reviewStatus === 'rejected' && (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Refusé
                                            </span>
                                        )}
                                        {doc.reviewStatus === 'pending' && doc.url && (
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                En attente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{doc.description}</p>
                                    {doc.rejectionReason && (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="text-xs text-red-700"><strong>Raison du refus :</strong> {doc.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-auto">
                                    {doc.url && doc.reviewStatus === 'approved' ? (
                                        // Document approved - show preview only, no re-upload
                                        <div className="relative group">
                                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border-2 border-emerald-500">
                                                <Image
                                                    src={doc.url}
                                                    alt="Document validé"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) : doc.preview ? (
                                        // New file selected for upload
                                        <div className="relative group cursor-pointer">
                                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                <Image
                                                    src={doc.preview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                {doc.status === 'uploading' && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            {!isSubmitting && doc.status !== 'success' && (
                                                <button
                                                    onClick={() => removeFile(doc.type)}
                                                    className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ) : doc.url && (doc.reviewStatus === 'pending' || doc.reviewStatus === 'rejected') ? (
                                        // Document pending or rejected - show current + allow re-upload
                                        <div className="flex flex-col gap-2">
                                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                <Image
                                                    src={doc.url}
                                                    alt="Document actuel"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {doc.reviewStatus === 'rejected' && (
                                                <button
                                                    onClick={() => triggerFileInput(doc.type)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 text-xs"
                                                >
                                                    <Upload className="w-3 h-3" />
                                                    Remplacer
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        // No document yet - allow upload
                                        <button
                                            onClick={() => triggerFileInput(doc.type)}
                                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 text-sm"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Choisir le fichier
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Action */}
                <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <ShieldCheck className="w-6 h-6 text-ely-mint" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Soumettre mon dossier</h3>
                            <p className="text-gray-400 text-sm">Prêt à être envoyé pour vérification</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Documents complétés</span>
                            <span className="font-bold">
                                {Object.values(documents).filter(d => d.file).length} / 3
                            </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-ely-mint"
                                initial={{ width: 0 }}
                                animate={{ width: `${(Object.values(documents).filter(d => d.file).length / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isAllSuccess}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isSubmitting || isAllSuccess
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-ely-mint text-gray-900 hover:bg-ely-mint/90 shadow-xl shadow-ely-mint/10'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : isAllSuccess ? (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                Cabinet envoyé
                            </>
                        ) : (
                            <>
                                Envoyer mes documents
                                <ChevronRight className="w-6 h-6" />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">
                        Données traitées sécuritairement • Conforme GDPR
                    </p>
                </div>
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
            />

            {/* Success Overlay */}
            <AnimatePresence>
                {isAllSuccess && !Object.values(documents).some(doc => doc.reviewStatus === 'rejected') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 rounded-3xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-6 max-w-sm"
                        >
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900">Documents reçus !</h2>
                            <p className="text-gray-500">
                                Vos documents ont été transmis à notre équipe d'analyse. Nous reviendrons vers vous sous 24h.
                            </p>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                            >
                                Retour au tableau de bord
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
