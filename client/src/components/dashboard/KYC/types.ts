import { LucideIcon } from "lucide-react";

export type IdNature = "cni" | "passport" | "resident_card" | "driver_license";

export interface DocumentUpload {
    type: string;
    label: string;
    description: string;
    icon: LucideIcon;
    file: File | null;
    preview: string | null;
    url: string | null;
    status: "idle" | "uploading" | "success" | "error";
    reviewStatus?: "pending" | "approved" | "rejected";
    rejectionReason?: string;
}

export interface VerificationProps {
    documents: Record<string, DocumentUpload>;
    id1Type: IdNature;
    setId1Type: (type: IdNature) => void;
    id2Type: IdNature;
    setId2Type: (type: IdNature) => void;
    completedCount: number;
    docCount: number;
    isSubmitting: boolean;
    isAllSuccess: boolean;
    handleSubmit: () => void;
    triggerFileInput: (type: string) => void;
    removeFile: (type: string) => void;
    setCameraTarget: (type: string) => void;
    setIsCameraOpen: (isOpen: boolean) => void;
}
