"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    X,
    Camera,
    Upload,
    Loader2,
    ChevronRight,
    ShieldCheck,
    LucideIcon,
    AlertCircle
} from "lucide-react";
import Image from "next/image";
import { VerificationProps, DocumentUpload, IdNature } from "./types";

/**
 * ChecklistItem: A clean, row-based document item
 */
const ChecklistItem = ({
    doc,
    onCamera,
    onUpload,
    onRemove,
    isSubmitting
}: {
    doc: DocumentUpload;
    onCamera: () => void;
    onUpload: () => void;
    onRemove: () => void;
    isSubmitting: boolean;
}) => {
    const isSuccess = doc.status === 'success';
    const isError = doc.status === 'error' || doc.reviewStatus === 'rejected';

    return (
        <div className="flex items-center gap-4 py-6 border-b border-slate-100 last:border-0">
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSuccess ? 'bg-emerald-500 text-white' :
                isError ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                {isSuccess ? <CheckCircle className="w-4 h-4" /> :
                    isError ? <AlertCircle className="w-4 h-4" /> :
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
            </div>

            {/* Labels */}
            <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-slate-800 truncate">{doc.label}</h4>
                <p className="text-[11px] font-medium text-slate-400 tracking-tight">
                    {isSuccess ? 'Document enregistré' : doc.description}
                </p>
            </div>

            {/* Actions / Preview */}
            <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                    {doc.preview || (doc.url && doc.reviewStatus !== 'rejected') ? (
                        <div key="preview" className="relative group">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative">
                                <Image src={doc.preview || doc.url!} alt="" fill className="object-cover" />
                                {doc.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            {!isSubmitting && !isSuccess && (
                                <button
                                    onClick={onRemove}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white shadow-md rounded-full flex items-center justify-center text-red-500 border border-slate-50 active:scale-90"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div key="actions" className="flex gap-1.5">
                            <button
                                onClick={onCamera}
                                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 active:scale-95 transition-all"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onUpload}
                                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 active:bg-slate-200 active:scale-95 transition-all"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function MobileVerification({
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
}: VerificationProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Minimal Header - FIXED (Actually attached to global header) */}
            <div className="fixed top-20 left-0 right-0 px-6 py-6 bg-gradient-to-br from-[#003d82] to-[#1e40af] border-b border-white/10 z-30 shadow-xl h-[132px]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-ely-mint rounded-full shadow-[0_0_10px_rgba(40,232,152,0.4)]" />
                        <span className="text-[10px] font-black text-ely-mint uppercase tracking-[0.2em]">Vérification</span>
                    </div>
                    <div className="text-[10px] font-black text-white/50 tracking-wider">
                        {completedCount} / {docCount} Validés
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black text-white tracking-tight leading-none drop-shadow-sm">
                        Dossier KYC
                    </h2>
                    <div className="flex-1 max-w-[120px] bg-white/10 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / (docCount || 1)) * 100}%` }}
                            className="h-full bg-ely-mint shadow-[0_0_15px_rgba(40,232,152,0.6)]"
                        />
                    </div>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-[132px] w-full shrink-0" />

            {/* Checklist Content */}
            <div className="flex-1 px-6 pb-48">
                <div className="mt-4 mb-6">
                    <p className="text-xs text-slate-400 font-bold leading-relaxed opacity-80">
                        Veuillez renseigner tous les documents pour finaliser votre demande.
                    </p>
                </div>
                {Object.values(documents).map((doc, index) => (
                    <div key={doc.type}>
                        {/* Inline Nature Selectors */}
                        {(doc.type === 'identity_1' || doc.type === 'identity_1_front') && (
                            <div className="py-4 overflow-x-auto no-scrollbar border-b border-slate-100">
                                <div className="flex gap-2 min-w-max">
                                    {(['cni', 'passport', 'resident_card', 'driver_license'] as const).map(nature => (
                                        <button
                                            key={nature}
                                            onClick={() => setId1Type(nature)}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${id1Type === nature
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                : 'bg-white text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {nature === 'cni' ? 'CNI' : nature === 'passport' ? 'Passeport' : nature === 'resident_card' ? 'Titre' : 'Permis'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(doc.type === 'identity_2' || doc.type === 'identity_2_front') && (
                            <div className="py-4 overflow-x-auto no-scrollbar border-b border-slate-100">
                                <div className="flex gap-2 min-w-max">
                                    {(['cni', 'passport', 'resident_card', 'driver_license'] as const).map(nature => (
                                        <button
                                            key={nature}
                                            onClick={() => setId2Type(nature)}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${id2Type === nature
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                : 'bg-white text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {nature === 'cni' ? 'CNI' : nature === 'passport' ? 'Passeport' : nature === 'resident_card' ? 'Titre' : 'Permis'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <ChecklistItem
                            doc={doc}
                            isSubmitting={isSubmitting}
                            onCamera={() => { setCameraTarget(doc.type); setIsCameraOpen(true); }}
                            onUpload={() => triggerFileInput(doc.type)}
                            onRemove={() => removeFile(doc.type)}
                        />
                    </div>
                ))}

                {/* Secure Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Cryptage AES-256</span>
                </div>
            </div>

            {/* Minimal Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-20">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isAllSuccess || completedCount < docCount}
                    className={`h-14 w-full rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${isSubmitting || isAllSuccess || completedCount < docCount
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-900 text-white shadow-xl shadow-slate-200 active:scale-[0.98]'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Transmission...
                        </>
                    ) : isAllSuccess ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Dossier Transmis
                        </>
                    ) : (
                        <>
                            Finaliser mon dossier
                            <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
