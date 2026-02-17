"use client";

import { motion } from "framer-motion";
import {
    CheckCircle,
    X,
    Camera,
    Upload,
    Loader2,
    ChevronRight,
    Info
} from "lucide-react";
import Image from "next/image";
import { VerificationProps } from "./types";

export default function DesktopVerification({
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Intro Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-5 bg-ely-blue rounded-full" />
                            <p className="text-[10px] font-black text-ely-blue uppercase tracking-[0.3em]">Instructions de conformité</p>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Finalisez votre dossier de vérification
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Documents d'identité</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Photos <span className="text-slate-900 font-bold underline decoration-ely-mint">couleur nettes</span> uniquement. Assurez-vous que les 4 bordures du document sont bien visibles.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Justificatifs & Finance</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Tous les autres documents doivent être fournis au format <span className="text-slate-900 font-bold underline decoration-ely-mint">PDF natif</span> (non scannés).
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500">Un problème lors du téléchargement ?</p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Support</span>
                            <span className="text-sm font-black text-ely-blue">+33 07 56 84 41 45</span>
                        </div>
                    </div>
                </div>

                {/* Documents List */}
                <div className="grid grid-cols-1 gap-4">
                    {Object.values(documents).map((doc, index) => {
                        const uploadOnly = ["tax_notice", "pay_slip_1", "pay_slip_2", "pay_slip_3", "address_proof", "rib"].includes(doc.type);

                        return (
                            <motion.div
                                key={doc.type}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`relative overflow-hidden p-6 rounded-[2.5rem] transition-all ${doc.status === 'success'
                                    ? 'bg-white border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                                    : 'bg-white border-2 border-slate-50 hover:border-slate-100 shadow-sm'
                                    }`}
                            >
                                {/* Nature Selector Integration */}
                                {(doc.type === 'identity_1' || doc.type === 'identity_1_front') && (
                                    <div className="mb-6 flex items-center gap-4 border-b border-slate-50 pb-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[120px]">Nature ID 1</span>
                                        <div className="flex flex-wrap gap-2">
                                            {(['cni', 'passport', 'resident_card', 'driver_license'] as const).map(nature => (
                                                <button
                                                    key={nature}
                                                    disabled={id2Type === nature}
                                                    onClick={() => setId1Type(nature)}
                                                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-wider border-2 transition-all ${id1Type === nature
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                                        : id2Type === nature
                                                            ? 'bg-slate-50 text-slate-200 border-transparent cursor-not-allowed opacity-40'
                                                            : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200 hover:text-slate-600'}`}
                                                >
                                                    {nature === 'cni' ? 'ID Card' : nature === 'passport' ? 'Passport' : nature === 'resident_card' ? 'Residence' : 'Driver'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(doc.type === 'identity_2' || doc.type === 'identity_2_front') && (
                                    <div className="mb-6 flex items-center gap-4 border-b border-slate-50 pb-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[120px]">Nature ID 2</span>
                                        <div className="flex flex-wrap gap-2">
                                            {(['cni', 'passport', 'resident_card', 'driver_license'] as const).map(nature => (
                                                <button
                                                    key={nature}
                                                    disabled={id1Type === nature}
                                                    onClick={() => setId2Type(nature)}
                                                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-wider border-2 transition-all ${id2Type === nature
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                                        : id1Type === nature
                                                            ? 'bg-slate-50 text-slate-200 border-transparent cursor-not-allowed opacity-40'
                                                            : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200 hover:text-slate-600'}`}
                                                >
                                                    {nature === 'cni' ? 'ID Card' : nature === 'passport' ? 'Passport' : nature === 'resident_card' ? 'Residence' : 'Driver'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${doc.status === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        {doc.status === 'success' ? <CheckCircle className="w-8 h-8" /> : <doc.icon className="w-8 h-8 stroke-[1.5]" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900">{doc.label}</h3>
                                            {doc.reviewStatus === 'approved' && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Cértifié</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium">{doc.description}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {doc.preview || (doc.url && doc.reviewStatus !== 'rejected') ? (
                                            <div className="relative group">
                                                <div className="w-24 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner">
                                                    <Image src={doc.preview || doc.url!} alt="" fill className="object-cover transition-transform group-hover:scale-110" />
                                                    {doc.status === 'uploading' && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                {!isSubmitting && doc.status !== 'success' && (
                                                    <button
                                                        onClick={() => removeFile(doc.type)}
                                                        className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all active:scale-90"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                {!uploadOnly && (
                                                    <button
                                                        onClick={() => { setCameraTarget(doc.type); setIsCameraOpen(true); }}
                                                        className="h-14 px-6 rounded-2xl bg-white border border-slate-100 text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-3 font-bold text-sm shadow-sm"
                                                    >
                                                        <Camera className="w-5 h-5" />
                                                        Capture
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => triggerFileInput(doc.type)}
                                                    className={`h-14 px-6 rounded-2xl transition-all flex items-center gap-3 font-bold text-sm shadow-xl shadow-slate-200 ${uploadOnly
                                                            ? 'bg-ely-blue text-white hover:bg-blue-600'
                                                            : 'bg-slate-900 text-white hover:bg-black'
                                                        }`}
                                                >
                                                    <Upload className="w-5 h-5" />
                                                    Uploader
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar with Progress & Submit */}
            <div className="space-y-6">
                <div className="sticky top-24 space-y-6">
                    {/* Progress Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                                <p className="text-xl font-black text-slate-900">{completedCount} / {docCount}</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                                    <motion.circle
                                        cx="32" cy="32" r="28" fill="transparent" stroke="#1d4ed8" strokeWidth="6"
                                        strokeDasharray="175.93"
                                        initial={{ strokeDashoffset: 175.93 }}
                                        animate={{ strokeDashoffset: 175.93 - (175.93 * (completedCount / (docCount || 1))) }}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900">
                                    {Math.round((completedCount / (docCount || 1)) * 100)}%
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {Object.values(documents).map((doc) => (
                                <div key={doc.type} className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-400 truncate max-w-[120px]">{doc.label}</span>
                                    {doc.status === 'success' ? (
                                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> OK</span>
                                    ) : (
                                        <span className="text-slate-300">Manquant</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Card */}
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 space-y-8">
                        <div className="space-y-1">
                            <h3 className="font-black text-xl">Transmission</h3>
                            <p className="text-xs text-slate-400 font-medium">Envoyez vos documents pour examen.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isAllSuccess}
                            className={`group relative w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all overflow-hidden ${isSubmitting || isAllSuccess
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-ely-blue text-white hover:bg-blue-600 active:scale-95'
                                }`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        En cours...
                                    </>
                                ) : isAllSuccess ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Transmis
                                    </>
                                ) : (
                                    <>
                                        Envoyer le dossier
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <Info className="w-3 h-3" />
                            Validation securisée AES-256
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
