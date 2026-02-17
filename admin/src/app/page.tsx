"use client";

import { useEffect, useState, useRef } from "react";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Search, Bell, CheckCircle, XCircle, Clock, RotateCcw, Menu, X, ExternalLink, ArrowLeft, Shield, Trash2, Mail, Phone, MapPin, TrendingUp, Euro, Briefcase, Calendar, CalendarRange, Send, History, Landmark, ChevronLeft, ChevronRight, CreditCard, ShieldCheck, Info, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, deleteDoc, where, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import AdminChat from "@/components/admin/AdminChat";

// Use standard db instance
const dbInstance = db;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "requests", label: "Dossiers Prêts", icon: FileText },
  { id: "transfers", label: "Virements", icon: Send },
  { id: "schedules", label: "Échéanciers", icon: CalendarRange },
  { id: "kyc", label: "KYC & Documents", icon: Search },
  { id: "support", label: "Support Chat", icon: MessageCircle },
  { id: "settings", label: "Configuration", icon: Settings },
];

// Helper Components
function StatCard({ label, value, trend, color, variant = "premium" }: any) {
  const isWhite = variant === "white";
  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative border min-h-[160px] flex flex-col justify-between",
      isWhite ? "bg-white border-slate-100" : "bg-gradient-to-br from-ely-blue to-blue-800 border-white/10"
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform -z-0",
        isWhite ? "bg-slate-50 group-hover:bg-slate-100" : "bg-white/10"
      )} />

      <p className={cn(
        "text-[10px] font-black uppercase tracking-widest relative z-10",
        isWhite ? "text-slate-400" : "text-white/60"
      )}>{label}</p>

      <div className="flex items-end justify-between relative z-10">
        <span className={cn(
          "text-4xl font-black tracking-tighter",
          isWhite ? "text-slate-900" : "text-white"
        )}>{value}</span>
        <span className={cn(
          "text-[10px] font-black px-4 py-1.5 rounded-2xl shadow-sm border whitespace-nowrap overflow-hidden truncate max-w-[120px]",
          isWhite ? cn("bg-white border-slate-100",
            color.includes("emerald") ? "text-emerald-600 bg-emerald-50" :
              color.includes("amber") || color.includes("orange") ? "text-amber-600 bg-amber-50" :
                color.includes("purple") ? "text-purple-600 bg-purple-50" :
                  "text-blue-600 bg-blue-50"
          ) :
            cn("backdrop-blur-md border-white/20",
              color.includes("emerald") ? "bg-emerald-400/20 text-emerald-300" :
                color.includes("amber") || color.includes("orange") ? "bg-orange-400/20 text-orange-300" :
                  color.includes("purple") ? "bg-purple-400/20 text-purple-300" :
                    "bg-white/10 text-white/70"
            )
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}

const DetailRow = ({ label, value, color, bold }: any) => (
  <div className="flex justify-between items-center text-[11px]">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className={cn(
      bold ? "font-black" : "font-bold text-slate-600",
      color || "text-slate-700"
    )}>{value}</span>
  </div>
);

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
    processing: "bg-ely-blue/5 text-ely-blue border-ely-blue/10"
  };

  const labels: any = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Refusé",
    processing: "En cours"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-xl text-[10px] font-bold uppercase border tracking-wider flex items-center gap-1.5 w-fit shadow-sm whitespace-nowrap",
      styles[status] || "bg-slate-50 text-slate-500 border-slate-100"
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full",
        status === 'pending' ? 'bg-amber-400' :
          status === 'approved' ? 'bg-emerald-400' :
            status === 'rejected' ? 'bg-red-400' :
              'bg-ely-blue'
      )} />
      {labels[status] || status}
    </span>
  );
}

function UserAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || '??';
  // Use a softer color palette for premium feel
  return (
    <div className={cn(
      "w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold border border-slate-200 shadow-sm shrink-0",
      className
    )}>
      {initials}
    </div>
  );
}

function VirementCard({ t, onApprove, onReject, onReview, onAdvanced, onReset, processingId, index }: any) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'review': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">En Examen</span>;
      case 'advanced': return <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">Contrôle Avancé</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100">Refusé</span>;
      case 'approved': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Validé</span>;
      default: return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">Attente Contrôle</span>;
    }
  };

  return (
    <div className={cn(
      "p-6 md:p-8 space-y-6 md:space-y-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border relative overflow-hidden group hover:shadow-2xl transition-all flex flex-col justify-between min-h-[400px] md:min-h-[450px]",
      index % 2 === 1
        ? "bg-gradient-to-br from-ely-blue to-blue-800 border-white/10 text-white shadow-ely-blue/20"
        : "bg-white border-slate-100 text-slate-900"
    )}>
      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <UserAvatar name={t.userName} className={cn(
            "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-none",
            index % 2 === 1 ? "bg-white text-slate-900" : "bg-slate-50 text-slate-900"
          )} />
          <div className="min-w-0">
            <p className={cn("text-sm md:text-base font-black leading-tight truncate", index % 2 === 1 ? "text-white" : "text-slate-900")}>{t.userName}</p>
            <p className={cn("text-[9px] md:text-[10px] font-medium mt-1 truncate", index % 2 === 1 ? "text-white/40" : "text-slate-400")}>{t.userEmail}</p>
          </div>
        </div>
        <div className="shrink-0">
          {index % 2 === 1 ? (
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-white/20 shadow-sm whitespace-nowrap">
              {t.status === 'pending' ? 'Attente Contrôle' : t.status === 'review' ? 'En Examen' : t.status === 'advanced' ? 'Contrôle Avancé' : t.status === 'approved' ? 'Validé' : 'Refusé'}
            </span>
          ) : getStatusBadge(t.status)}
        </div>
      </div>

      <div className={cn(
        "p-4 md:p-6 rounded-[1.5rem] md:rounded-[1.8rem] border relative z-10 space-y-4",
        index % 2 === 1 ? "bg-white/5 border-white/10 shadow-inner" : "bg-slate-50 border-slate-100"
      )}>
        <div className="flex justify-between items-end">
          <div>
            <p className={cn("text-[8px] md:text-[9px] uppercase font-black tracking-widest mb-1", index % 2 === 1 ? "text-white/40" : "text-slate-400")}>Montant</p>
            <p className={cn("text-2xl md:text-3xl font-black tracking-tighter", index % 2 === 1 ? "text-white" : "text-ely-blue")}>
              {t.amount?.toLocaleString()} €
            </p>
          </div>
          <div className="text-right">
            <p className={cn("text-[8px] md:text-[9px] uppercase font-black tracking-widest mb-1", index % 2 === 1 ? "text-white/40" : "text-slate-400")}>Date</p>
            <p className={cn("text-[10px] md:text-[11px] font-bold", index % 2 === 1 ? "text-white/80" : "text-slate-600")}>
              {t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'En cours...'}
            </p>
          </div>
        </div>

        <div className={cn("pt-4 border-t space-y-2", index % 2 === 1 ? "border-white/5" : "border-slate-200/50")}>
          <p className={cn("text-[8px] md:text-[9px] uppercase font-black tracking-widest", index % 2 === 1 ? "text-white/40" : "text-slate-400")}>Destination</p>
          <p className={cn("text-[10px] md:text-[11px] font-bold leading-tight", index % 2 === 1 ? "text-white/90" : "text-slate-700")}>{t.bankName}</p>
          <p className={cn("text-[10px] md:text-[11px] font-mono", index % 2 === 1 ? "text-white/40" : "text-slate-500")}>{t.iban}</p>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3 relative z-10">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <button
            onClick={() => onReview(t.id)}
            disabled={processingId === t.id}
            className={cn(
              "py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border disabled:opacity-50",
              index % 2 === 1
                ? "bg-white/10 text-white border-white/10 hover:bg-white/20"
                : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
            )}
          >
            Examen
          </button>
          <button
            onClick={() => onAdvanced(t.id)}
            disabled={processingId === t.id}
            className={cn(
              "py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border disabled:opacity-50",
              index % 2 === 1
                ? "bg-white/10 text-white border-white/10 hover:bg-white/20"
                : "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100"
            )}
          >
            Avancé
          </button>
          <button
            onClick={() => onReset(t.id)}
            disabled={processingId === t.id}
            className={cn(
              "py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border disabled:opacity-50",
              index % 2 === 1
                ? "bg-white/20 text-white border-white/20 hover:bg-white/30"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            )}
          >
            Réinitialiser
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <button
            onClick={() => onReject(t.id)}
            disabled={processingId === t.id}
            className={cn(
              "py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border disabled:opacity-50",
              index % 2 === 1
                ? "bg-red-400/20 text-red-100 border-red-400/30 hover:bg-red-400/30"
                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
            )}
          >
            Refuser
          </button>
          <button
            onClick={() => onApprove(t.id)}
            disabled={processingId === t.id}
            className={cn(
              "py-3 md:py-4 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border shadow-lg disabled:opacity-50",
              index % 2 === 1
                ? "bg-white text-ely-blue hover:bg-ely-mint hover:text-white border-none"
                : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10"
            )}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

function IdentityStatusBadge({ status }: { status: string }) {
  const configs: any = {
    verified: { label: "Vérifié", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    pending_verification: { label: "À vérifier", color: "bg-ely-blue/5 text-ely-blue border-ely-blue/10" },
    verification_required: { label: "Documents requis", color: "bg-amber-50 text-amber-600 border-amber-100" },
    partial_rejection: { label: "À compléter", color: "bg-orange-50 text-orange-600 border-orange-100" },
    rejected: { label: "Dossier refusé", color: "bg-red-50 text-red-600 border-red-100" }
  };
  const config = configs[status] || { label: "Non initié", color: "bg-slate-50 text-slate-400 border-slate-100" };
  return (
    <span className={cn(
      "px-3 py-1 rounded-xl text-[9px] font-black uppercase border tracking-widest shadow-sm",
      config.color
    )}>
      {config.label}
    </span>
  );
}

function ScoreBadge({ score, status, debtRatio }: { score?: number; status?: string; debtRatio?: number }) {
  if (!score) return <span className="text-slate-300 text-xs font-medium">N/A</span>;

  const getScoreColor = () => {
    if (status === "Approved") return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (status === "Review") return "bg-amber-50 text-amber-600 border-amber-200";
    return "bg-red-50 text-red-600 border-red-200";
  };

  return (
    <div className={cn("px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-2 shadow-sm w-fit", getScoreColor())} title={`Taux d'endettement: ${debtRatio}%`}>
      <TrendingUp className="w-3 h-3" />
      <span>{score}/100</span>
      {debtRatio !== undefined && <span className="text-[9px] opacity-60">({debtRatio}%)</span>}
    </div>
  );
}

const LoadingSpinner = () => <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />;

function ActionButtons({
  req,
  handleValidateAnalysis,
  handleValidateVerification,
  handleApprove,
  handleRejectLoan,
  handleRejectDocs,
  handleReset,
  handleTriggerPayment,
  setSelectedRequest,
  setSelectedDocs,
  setIsDocModalOpen,
  processingId,
}: any) {
  // Always use full width and center content for cleaner grid/stack look
  const btnClass = "w-full justify-center p-1 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
  const isProcessing = processingId === req.id;

  const containerClass = "flex flex-col gap-2 w-[90%] mx-auto md:grid md:grid-cols-2 md:gap-2 md:w-[280px] md:ml-auto md:[&>button:last-child:nth-child(odd)]:col-span-2";

  return (
    <div className={containerClass}>
      {req.status !== "approved" && req.status !== "rejected" ? (
        <>
          {!req.stepAnalysis && (
            <button
              disabled={isProcessing}
              onClick={() => handleValidateAnalysis(req)}
              className={cn(btnClass, "bg-blue-100 text-blue-700 hover:bg-blue-200")}
            >
              {isProcessing ? <LoadingSpinner /> : <Clock className="w-3 h-3" />}
              Analyse
            </button>
          )}

          {!req.stepVerification && req.kycDocuments && (
            <button
              disabled={isProcessing}
              onClick={() => {
                setSelectedRequest(req);
                setSelectedDocs(req.kycDocuments);
                setIsDocModalOpen(true);
              }}
              className={cn(btnClass, "bg-slate-100 text-slate-600 hover:bg-slate-200")}
            >
              <Search className="w-3 h-3" />
              Voir Docs
            </button>
          )}

          {!req.stepVerification && (
            <button
              disabled={isProcessing}
              onClick={() => handleValidateVerification(req)}
              className={cn(btnClass, "bg-purple-100 text-purple-700 hover:bg-purple-200")}
            >
              {isProcessing ? <LoadingSpinner /> : <FileText className="w-3 h-3" />}
              Valider Docs
            </button>
          )}

          {!req.stepVerification && (
            <button
              disabled={isProcessing}
              onClick={() => handleRejectDocs(req)}
              className={cn(btnClass, "bg-red-100 text-red-700 hover:bg-red-200")}
            >
              <XCircle className="w-3 h-3" />
              Refuser Docs
            </button>
          )}

          <button
            disabled={isProcessing}
            onClick={() => handleApprove(req)}
            className={cn(btnClass, "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")}
          >
            {isProcessing ? <LoadingSpinner /> : <CheckCircle className="w-3 h-3" />}
            Accorder Prêt
          </button>

          <button
            disabled={isProcessing}
            onClick={() => handleRejectLoan(req)}
            className={cn(btnClass, "bg-red-100 text-red-700 hover:bg-red-200")}
          >
            {isProcessing ? <LoadingSpinner /> : <XCircle className="w-3 h-3" />}
            Refuser Prêt
          </button>

          <button
            disabled={isProcessing}
            onClick={() => handleTriggerPayment(req)}
            className={cn(btnClass, "bg-amber-100 text-amber-700 hover:bg-amber-200")}
            title="Déclencher Paiement"
          >
            <CreditCard className="w-3 h-3" />
            Paiement
          </button>

          <button
            disabled={isProcessing}
            onClick={() => handleReset(req)}
            className={cn(btnClass, "bg-gray-100 text-gray-700 hover:bg-gray-200")}
            title="Réinitialiser"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </>
      ) : (
        <div className="flex items-center justify-end gap-1 col-span-2">
          {req.status === "approved" && <span className="text-xs font-bold text-emerald-600 mr-auto">Traité</span>}
          {req.status === "rejected" && <span className="text-xs font-bold text-red-600 mr-auto">Refusé</span>}

          {req.status === "approved" && (
            <button
              disabled={isProcessing}
              onClick={() => handleTriggerPayment(req)}
              className={cn(btnClass, "bg-amber-100 text-amber-700 hover:bg-amber-200 w-auto")}
              title="Déclencher Paiement"
            >
              <CreditCard className="w-3 h-3" />
              Paiement
            </button>
          )}

          <button
            disabled={isProcessing}
            onClick={() => handleReset(req)}
            className={cn(btnClass, "bg-gray-100 text-gray-700 hover:bg-gray-200 w-auto ml-2")}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-12 py-6 border-t border-slate-100">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-ely-blue hover:border-ely-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded-2xl text-xs font-black transition-all shadow-sm",
              currentPage === page
                ? "bg-ely-blue text-white shadow-lg shadow-ely-blue/20"
                : "bg-white text-slate-400 border border-slate-100 hover:border-ely-blue/30"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-ely-blue hover:border-ely-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
      </button>
    </div>
  );
}

// Helper function to translate contract types
function getContractLabel(contractType: string | undefined): string {
  if (!contractType) return '---';

  const labels: { [key: string]: string } = {
    'cdi': 'CDI',
    'cdd': 'CDD',
    'interim': 'Intérim',
    'freelance': 'Freelance',
    'business_owner': 'Chef d\'entreprise',
    'retired': 'Retraité',
    'student': 'Étudiant',
    'unemployed': 'Sans emploi',
    'other': 'Autre'
  };

  return labels[contractType.toLowerCase()] || contractType.toUpperCase();
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveTab') || "dashboard";
    }
    return "dashboard";
  });
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
    setCurrentPage(1);
  }, [activeTab]);
  const [requests, setRequests] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalUsers: 0
  });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedDocs, setSelectedDocs] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [managingUser, setManagingUser] = useState<any>(null);
  const [managingTransfersUser, setManagingTransfersUser] = useState<any | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRequestForApproval, setSelectedRequestForApproval] = useState<any>(null);
  const [startDelay, setStartDelay] = useState(1);

  // Payment Request States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRequestForPayment, setSelectedRequestForPayment] = useState<any>(null);
  const [paymentSettings, setPaymentSettings] = useState({
    type: 'authentication_deposit',
    bankName: "ELYSSIO INVESTMENT BANK",
    iban: "FR76 3000 3020 1000 5000 7890 123",
    bic: "ELYSPRPPXXX",
    beneficiary: "ELYSSIO FINANCE - CONSEILLER FINANCIER"
  });

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const clearNotifications = async (userId: string) => {
    if (!userId) return;
    try {
      const notificationsRef = collection(dbInstance, "users", userId, "notifications");
      const snapshot = await getDocs(notificationsRef);
      const batch = writeBatch(dbInstance);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`Notifications cleared for user ${userId}`);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleAdminAction = async (action: string, id: string, type: 'loan' | 'doc' | 'transfer' = 'loan') => {
    setProcessingId(id);
    try {
      if (type === 'transfer') {
        const transferRef = doc(dbInstance, "transfers", id);
        if (action === 'approve') {
          // 1. Fetch transfer details
          const transferSnap = await getDoc(transferRef);
          if (!transferSnap.exists()) return;
          const transferData = transferSnap.data();

          // 2. Debit logic for outbound transfers
          if (transferData.type !== 'inbound' && transferData.type !== 'deposit') {
            let accountRef = null;
            let currentRemaining = 0;

            // Try to find account by ID or User ID
            if (transferData.accountId) {
              const accRef = doc(dbInstance, "accounts", transferData.accountId);
              const accSnap = await getDoc(accRef);
              if (accSnap.exists()) {
                accountRef = accRef;
                currentRemaining = accSnap.data().remainingAmount || 0;
              }
            }

            if (!accountRef && transferData.userId) {
              const q = query(collection(dbInstance, "accounts"), where("userId", "==", transferData.userId));
              const qSnap = await getDocs(q);
              if (!qSnap.empty) {
                accountRef = doc(dbInstance, "accounts", qSnap.docs[0].id);
                currentRemaining = qSnap.docs[0].data().remainingAmount || 0;
              }
            }

            // 3. Execute Debit if account found
            if (accountRef) {
              await updateDoc(accountRef, {
                remainingAmount: currentRemaining - (transferData.amount || 0),
                updatedAt: serverTimestamp()
              });
            }
          }

          // 4. Update Transfer Status
          await updateDoc(transferRef, {
            status: 'approved',
            updatedAt: serverTimestamp(),
            approvedBy: user.email
          });

          // Create Notification for Client
          await addDoc(collection(dbInstance, "users", transferData.userId, "notifications"), {
            title: "Virement Validé ✅",
            message: `Votre virement de ${transferData.amount.toLocaleString()} € a été validé et est en cours de traitement.`,
            type: 'success',
            read: false,
            timestamp: serverTimestamp(),
            link: '/dashboard/accounts/transfer',
            icon: 'Landmark'
          });

        } else if (action === 'review') {
          await updateDoc(transferRef, {
            status: 'review',
            updatedAt: serverTimestamp(),
            reviewedBy: user.email
          });
        } else if (action === 'advanced') {
          await updateDoc(transferRef, {
            status: 'advanced',
            updatedAt: serverTimestamp(),
            advancedReviewBy: user.email
          });
        } else if (action === 'pending') {
          await updateDoc(transferRef, {
            status: 'pending',
            updatedAt: serverTimestamp(),
            resetBy: user.email
          });
        } else if (action === 'reject') {
          // Fetch transfer details for notification
          const transferSnap = await getDoc(transferRef);
          if (!transferSnap.exists()) return;
          const transferData = transferSnap.data();

          const reason = prompt("Raison du refus :");
          await updateDoc(transferRef, {
            status: 'rejected',
            rejectReason: reason,
            updatedAt: serverTimestamp(),
            rejectedBy: user.email
          });

          // Create Notification for Client
          await addDoc(collection(dbInstance, "users", transferData.userId, "notifications"), {
            title: "Virement Refusé ❌",
            message: `Votre virement de ${transferData.amount.toLocaleString()} € a été refusé. Raison : ${reason || 'Non spécifiée'}.`,
            type: 'error',
            read: false,
            timestamp: serverTimestamp(),
            link: '/dashboard/accounts/transfer',
            icon: 'XCircle'
          });
        }
      } else {
        // ... existing handleApprove / handleReject logic (already handled by other functions in this file)
      }
    } catch (error) {
      console.error(`Error in admin action ${action}:`, error);
      alert(`Erreur lors de l'action ${action}.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveTransfer = (id: string) => handleAdminAction('approve', id, 'transfer');
  const handleReviewTransfer = (id: string) => handleAdminAction('review', id, 'transfer');
  const handleAdvancedTransfer = (id: string) => handleAdminAction('advanced', id, 'transfer');
  const handleRejectTransfer = (id: string) => handleAdminAction('reject', id, 'transfer');
  const handleResetTransfer = (id: string) => handleAdminAction('pending', id, 'transfer');

  const handleApprove = (request: any) => {
    setSelectedRequestForApproval(request);
    setStartDelay(1); // Default to 1 month (standard)
    setIsApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    const request = selectedRequestForApproval;
    if (!request) return;

    setProcessingId(request.id);
    try {
      // Calculate startDate based on delay
      // Delay 1 month = Start NOW (first payment in 1 month)
      // Delay 3 months = Start in 2 months (first payment in 3 months)
      const now = new Date();
      // If delay is > 1, add (delay - 1) months to start date
      if (startDelay > 1) {
        now.setMonth(now.getMonth() + (startDelay - 1));
      }

      const startDate = now;

      // 1. Update Request Status & Auto-trigger Authentication Deposit (286€)
      await updateDoc(doc(dbInstance, "requests", request.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
        requiresPayment: true,
        paymentStatus: 'pending',
        paymentType: 'authentication_deposit',
        paymentAmount: 286,
        customRIB: {
          bankName: "ELYSSIO INVESTMENT BANK",
          iban: "FR76 3000 3020 1000 5000 7890 123",
          bic: "ELYSPRPPXXX",
          beneficiary: "ELYSSIO FINANCE - CONSEILLER FINANCIER"
        },
        paymentTriggeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Create/Recharge Account
      await addDoc(collection(dbInstance, "accounts"), {
        userId: request.userId,
        requestId: request.id,
        totalAmount: request.amount,
        remainingAmount: request.amount,
        rate: request.annualRate || request.rate || 4.95,
        duration: request.duration,
        monthlyPayment: request.monthlyPayment,
        projectType: request.projectType,
        status: "active",
        startDate: startDate,
        iban: request.iban || "", // Copy IBAN to account
        createdAt: serverTimestamp(),
        installments: {},
        // Keep a copy of full request details for the scheduler
        details: request.details || {},
        originalRequest: {
          amount: request.amount,
          duration: request.duration,
          rate: request.annualRate || request.rate
        }
      });

      // 3. Create Notification for Client
      await addDoc(collection(dbInstance, "users", request.userId, "notifications"), {
        title: "Prêt Accordé ! 🎉",
        message: `Votre demande de prêt de ${request.amount.toLocaleString()} € a été approuvée. Crédit disponible sur votre compte.`,
        type: 'success',
        read: false,
        timestamp: serverTimestamp(),
        link: '/dashboard/accounts',
        icon: 'ShieldCheck'
      });

      // 4. Update User ID Status if needed
      await updateDoc(doc(dbInstance, "users", request.userId), {
        idStatus: "verified",
        hasActiveLoan: true
      });

      alert("Prêt accordé et compte rechargé avec succès !");
      setIsApproveModalOpen(false);
      setSelectedRequestForApproval(null);

    } catch (error) {
      console.error("Error approving request:", error);
      alert("Erreur lors de l'approbation. Vérifiez vos permissions.");
    } finally {
      setProcessingId(null);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch extra user details (role)
        try {
          const userDoc = await getDoc(doc(dbInstance, "users", u.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Check if user has admin role
            if (userData.role === 'admin' || userData.role === 'super_admin') {
              setUser({ ...u, ...userData });
            } else {
              console.error("Access denied: User is not an admin");
              alert("Accès refusé. Vous n'avez pas les droits d'administrateur.");
              await signOut(auth);
            }
          } else {
            console.error("User document not found");
            await signOut(auth);
          }
        } catch (e) {
          console.error("Error fetching user role:", e);
          setUser(u);
        }
      } else {
        setUser(null);
        setRequests([]);
        setUsersList([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;

    // 1. Snapshot Users
    const qUsers = query(collection(dbInstance, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(users);
      setStats(prev => ({ ...prev, totalUsers: users.length }));
    }, (error) => {
      console.error("Firestore Error (Users):", error);
      if (error.code === 'permission-denied') {
        console.warn("Permission denied for collection 'users'. Check security rules.");
      }
    });

    // 2. Snapshot Requests
    const qReq = query(collection(dbInstance, "requests"), orderBy("createdAt", "desc"));
    const unsubRequests = onSnapshot(qReq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);

      setStats(prev => ({
        ...prev,
        total: data.length,
        pending: data.filter((r: any) => r.status === "pending" || r.status === "processing").length,
        approved: data.filter((r: any) => r.status === "approved").length,
        rejected: data.filter((r: any) => r.status === "rejected").length
      }));
    }, (error) => {
      console.error("Firestore Error (Requests):", error);
      if (error.code === 'permission-denied') {
        console.warn("Permission denied for collection 'requests'. Check security rules.");
      }
    });

    // 3. Snapshot Accounts
    const qAcc = query(collection(dbInstance, "accounts"), orderBy("createdAt", "desc"));
    const unsubAccounts = onSnapshot(qAcc, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error (Accounts):", error);
    });

    // 4. Snapshot Transfers
    const qTransfers = query(collection(dbInstance, "transfers"), orderBy("createdAt", "desc"));
    const unsubTransfers = onSnapshot(qTransfers, (snapshot) => {
      setTransfers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error (Transfers):", error);
    });

    // 4. Snapshot Chats
    const qChats = query(collection(dbInstance, "chats"), orderBy("lastTimestamp", "desc"));
    const unsubChats = onSnapshot(qChats, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubUsers();
      unsubRequests();
      unsubAccounts();
      unsubTransfers();
      unsubChats();
    };
  }, [user]);

  // Handle selected chat messages





  const renderSupportChat = () => {
    return (
      <AdminChat
        chats={chats}
        setChats={setChats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
    );
  };

  // Enrich request with user data for display
  const getEnrichedRequest = (req: any) => {
    const linkedUser = usersList.find(u => u.id === req.userId);
    if (linkedUser) {
      return {
        ...req,
        firstName: req.firstName || linkedUser.firstName,
        lastName: req.lastName || linkedUser.lastName,
        email: req.email || linkedUser.email,
        phone: req.phone || linkedUser.phone,
        idStatus: linkedUser.idStatus,
        kycDocuments: linkedUser.kycDocuments,
        // Added personal & professional status fields from user profile
        maritalStatus: req.maritalStatus || linkedUser.maritalStatus,
        children: req.children || linkedUser.children,
        housingType: req.housingType || linkedUser.housingType,
        housingSeniority: req.housingSeniority || linkedUser.housingSeniority,
        profession: req.profession || linkedUser.profession,
        companyName: req.companyName || linkedUser.companyName,
        contractType: req.contractType || linkedUser.contractType || req.situation
      };
    }
    return req;
  };

  const enrichedRequests = requests.map(getEnrichedRequest);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      alert("Erreur de connexion : Vérifiez vos identifiants ou vos droits.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Constants
  const itemsPerPage = 10;

  const handleValidateAnalysis = async (request: any) => {
    if (!confirm(`Valider l'étape "Analyse Technique" pour ${request.firstName} ?`)) return;
    try {
      // 1. Update Request
      await updateDoc(doc(dbInstance, "requests", request.id), {
        stepAnalysis: true,
        status: "processing", // Move to processing status
        updatedAt: serverTimestamp()
      });

      // 2. Trigger Identity Verification for User
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "verification_required"
        });
      }

    } catch (error) {
      console.error("Error validating analysis:", error);
    }
  };

  const handleValidateVerification = async (request: any) => {
    if (!confirm(`Valider l'étape "Vérification Documentaire" pour ${request.firstName} ?`)) return;
    try {
      // 1. Update Request
      await updateDoc(doc(dbInstance, "requests", request.id), {
        stepVerification: true,
        updatedAt: serverTimestamp()
      });

      // 2. Update User Profile Status to verified
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "verified"
        });
      }
    } catch (error) {
      console.error("Error validating verification:", error);
    }
  };

  // Approve individual document
  const handleApproveDocument = async (userId: string, documentKey: string) => {
    if (!userId) return;
    try {
      const userRef = doc(dbInstance, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const kycDocs = userData.kycDocuments || {};

        // Convert old format to new format if needed
        const currentDoc = kycDocs[documentKey];
        const docUrl = typeof currentDoc === 'string' ? currentDoc : currentDoc?.url;

        // Optimistic UI Update
        setSelectedDocs((prev: any) => ({
          ...prev,
          [documentKey]: {
            ...(typeof prev[documentKey] === 'object' ? prev[documentKey] : { url: prev[documentKey] }),
            status: 'approved',
            reviewedAt: new Date(),
            reviewedBy: user?.email
          }
        }));

        // Update document status
        await updateDoc(userRef, {
          [`kycDocuments.${documentKey}`]: {
            url: docUrl,
            status: 'approved',
            reviewedAt: serverTimestamp(),
            reviewedBy: user.email
          }
        });

        // Check status of all documents
        const updatedDocs = { ...kycDocs, [documentKey]: { url: docUrl, status: 'approved' } };
        const allApproved = Object.values(updatedDocs).every((doc: any) =>
          (typeof doc === 'object' && doc.status === 'approved')
        );
        const hasRejected = Object.values(updatedDocs).some((doc: any) =>
          (typeof doc === 'object' && doc.status === 'rejected')
        );

        // Update global idStatus based on document statuses
        let newIdStatus = userData.idStatus;
        if (allApproved) {
          newIdStatus = 'verified';
        } else if (hasRejected) {
          newIdStatus = 'partial_rejection';
        }

        if (newIdStatus !== userData.idStatus) {
          await updateDoc(userRef, {
            idStatus: newIdStatus
          });
        }
      }
    } catch (error) {
      console.error("Error approving document:", error);
      alert("Erreur lors de la validation du document.");
    }
  };

  // Reject individual document
  const handleRejectDocument = async (userId: string, documentKey: string) => {
    const reason = prompt("Raison du refus (optionnel) :");
    if (!userId) return;

    try {
      const userRef = doc(dbInstance, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const kycDocs = userData.kycDocuments || {};
        const currentDoc = kycDocs[documentKey];
        const docUrl = typeof currentDoc === 'string' ? currentDoc : currentDoc?.url;

        // Optimistic UI Update
        setSelectedDocs((prev: any) => ({
          ...prev,
          [documentKey]: {
            ...(typeof prev[documentKey] === 'object' ? prev[documentKey] : { url: prev[documentKey] }),
            status: 'rejected',
            rejectionReason: reason || "Document non conforme",
            reviewedAt: new Date(),
            reviewedBy: user?.email
          }
        }));

        // Update document status
        await updateDoc(userRef, {
          [`kycDocuments.${documentKey}`]: {
            url: docUrl,
            status: 'rejected',
            rejectionReason: reason || "Document non conforme",
            reviewedAt: serverTimestamp(),
            reviewedBy: user.email
          }
        });

        // Check status of all documents
        const updatedDocs = { ...kycDocs, [documentKey]: { url: docUrl, status: 'rejected' } };
        const allRejected = Object.values(updatedDocs).every((doc: any) =>
          (typeof doc === 'object' && doc.status === 'rejected')
        );
        const hasApproved = Object.values(updatedDocs).some((doc: any) =>
          (typeof doc === 'object' && doc.status === 'approved')
        );

        // Update global idStatus based on document statuses
        let newIdStatus;
        if (allRejected) {
          newIdStatus = 'rejected'; // All documents rejected
        } else if (hasApproved) {
          newIdStatus = 'partial_rejection'; // Mix of approved and rejected
        } else {
          newIdStatus = 'partial_rejection'; // Some rejected, others pending
        }

        await updateDoc(userRef, {
          idStatus: newIdStatus
        });
      }
    } catch (error) {
      console.error("Error rejecting document:", error);
      alert("Erreur lors du refus du document.");
    }
  };

  const handleResetKYC = async (request: any) => {
    if (!confirm(`Réinitialiser les documents KYC de ${request.firstName} ? L'utilisateur devra les renvoyer.`)) return;
    try {
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "verification_required", // Remet la bannière d'upload
          kycDocuments: null,
          kycSubmittedAt: null
        });

        // Réinitialiser aussi la vérification selfie dans la request
        await updateDoc(doc(dbInstance, "requests", request.id), {
          paymentVerificationStatus: null,
          paymentSelfieUrl: null,
          paymentVideoUrl: null,
          paymentVerificationSubmittedAt: null
        });

        // Clear notifications header
        await clearNotifications(request.userId);

        setIsDocModalOpen(false);
        alert("Les documents ont été réinitialisés. L'utilisateur peut à nouveau soumettre son dossier.");
      }
    } catch (error) {
      console.error("Error resetting KYC:", error);
      alert("Erreur lors de la réinitialisation.");
    }
  };

  const handleTriggerPayment = (request: any) => {
    setSelectedRequestForPayment(request);
    setIsPaymentModalOpen(true);
  };

  const processPaymentTrigger = async () => {
    if (!selectedRequestForPayment) return;
    setProcessingId(selectedRequestForPayment.id);
    try {
      await updateDoc(doc(dbInstance, "requests", selectedRequestForPayment.id), {
        requiresPayment: true,
        paymentStatus: 'pending',
        paymentType: paymentSettings.type,
        customRIB: {
          bankName: paymentSettings.bankName,
          iban: paymentSettings.iban,
          bic: paymentSettings.bic,
          beneficiary: paymentSettings.beneficiary
        },
        paymentTriggeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create Notification for Client
      await addDoc(collection(dbInstance, "users", selectedRequestForPayment.userId, "notifications"), {
        title: "Dépôt d'Authentification 💳",
        message: `Une demande de dépôt de 286 € a été émise pour finaliser votre dossier. Consultez la page Facturation.`,
        type: 'warning',
        read: false,
        timestamp: serverTimestamp(),
        link: '/dashboard/billing',
        icon: 'CreditCard'
      });

      alert("Demande de paiement déclenchée avec succès.");
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Error triggering payment:", error);
      alert("Erreur lors du déclenchement du paiement.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmPaymentReceived = async () => {
    if (!selectedRequestForPayment) return;
    setProcessingId(selectedRequestForPayment.id);
    try {
      // 1. Update request payment status
      await updateDoc(doc(dbInstance, "requests", selectedRequestForPayment.id), {
        requiresPayment: false,
        paymentStatus: 'paid',
        updatedAt: serverTimestamp()
      });

      // Create Notification for Client
      await addDoc(collection(dbInstance, "users", selectedRequestForPayment.userId, "notifications"), {
        title: "Dépôt Confirmé ✅",
        message: "Nous avons bien reçu votre dépôt de 286 €. Votre solde a été crédité et votre dossier progresse.",
        type: 'success',
        read: false,
        timestamp: serverTimestamp(),
        link: '/dashboard',
        icon: 'ShieldCheck'
      });

      // 2. Credit 286€ to user's account balance
      const accountsRef = collection(dbInstance, "accounts");
      const q = query(accountsRef, where("userId", "==", selectedRequestForPayment.userId));
      const accountSnapshot = await getDocs(q);

      if (!accountSnapshot.empty) {
        const accountDoc = accountSnapshot.docs[0];
        const currentRemaining = accountDoc.data().remainingAmount || 0;
        await updateDoc(doc(dbInstance, "accounts", accountDoc.id), {
          remainingAmount: currentRemaining + 286,
          updatedAt: serverTimestamp()
        });

        // 3. Create transaction record for history
        await addDoc(collection(dbInstance, "transfers"), {
          userId: selectedRequestForPayment.userId,
          accountId: accountDoc.id,
          type: "inbound", // Changed to inbound for positive value logic if applicable, or rely on status
          amount: 286,
          description: "Dépôt d'Authentification",
          status: "approved", // Changed to 'approved' to match frontend green styling
          bankName: "Dépôt Initial", // Added for display
          createdAt: serverTimestamp()
        });
      }

      alert("Paiement confirmé avec succès. 286€ ont été crédités au solde du client.");
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Erreur lors de la confirmation du paiement.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReset = async (request: any) => {
    if (!confirm(`Réinitialiser le dossier de ${request.firstName} ?`)) return;
    try {
      // 1. Reset Request
      await updateDoc(doc(dbInstance, "requests", request.id), {
        stepAnalysis: false,
        stepVerification: false,
        status: "pending",
        requiresPayment: false,
        paymentStatus: null,
        paymentType: null,
        customRIB: null,
        paymentTriggeredAt: null,
        paymentVerificationStatus: null,
        paymentSelfieUrl: null,
        paymentVideoUrl: null,
        paymentVerificationSubmittedAt: null,
        updatedAt: serverTimestamp()
      });

      // 2. Reset User Account in 'users' collection
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "pending",
          hasActiveLoan: false,
          balance: 0,
          kycDocuments: null, // Clear KYC on full reset too
          kycSubmittedAt: null
        });

        // 3. Delete related Account in 'accounts' collection
        const accountsRef = collection(dbInstance, "accounts");
        const q = query(accountsRef, where("requestId", "==", request.id));
        const querySnapshot = await getDocs(q);

        const accountDeletions = querySnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(dbInstance, "accounts", docSnapshot.id))
        );
        await Promise.all(accountDeletions);

        // 4. Delete all transfers (transaction history)
        const transfersRef = collection(dbInstance, "transfers");
        const qTransfers = query(transfersRef, where("userId", "==", request.userId));
        const transfersSnapshot = await getDocs(qTransfers);

        const transferDeletions = transfersSnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(dbInstance, "transfers", docSnapshot.id))
        );
        await Promise.all(transferDeletions);

        // 5. Clear notifications
        await clearNotifications(request.userId);
      }

    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  const handleToggleAdmin = async (u: any) => {
    const newRole = u.role === 'super_admin' ? 'client' : 'super_admin';
    if (!confirm(`Changer le rôle de ${u.firstName} en ${newRole === 'super_admin' ? 'Super Admin' : 'Client'} ?`)) return;
    try {
      await updateDoc(doc(dbInstance, "users", u.id), { role: newRole });
      setActiveActionMenu(null);
    } catch (e) {
      console.error("Error toggling admin:", e);
    }
  };

  const handleDeleteUser = async (u: any) => {
    if (!confirm(`SUPPRESSION DÉFINITIVE du compte de ${u.firstName} ${u.lastName} ? Cette action est irréversible.`)) return;
    try {
      // Clear notifications first
      await clearNotifications(u.id);
      await deleteDoc(doc(dbInstance, "users", u.id));
      setActiveActionMenu(null);
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  };

  const handleRejectLoan = async (request: any) => {
    if (!confirm("Refuser ce prêt définitivement ? (L'identité de l'utilisateur restera inchangée)")) return;
    setProcessingId(request.id);
    try {
      await updateDoc(doc(dbInstance, "requests", request.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create Notification for Client
      await addDoc(collection(dbInstance, "users", request.userId, "notifications"), {
        title: "Décision sur votre demande 📄",
        message: "Votre demande de prêt n'a pas pu être acceptée pour le moment. Consultez vos emails pour plus de détails.",
        type: 'error',
        read: false,
        timestamp: serverTimestamp(),
        link: '/dashboard/requests',
        icon: 'Bell'
      });

      alert("Prêt refusé. Le statut de l'utilisateur est préservé.");
    } catch (error) {
      console.error("Error rejecting loan:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDocs = async (request: any) => {
    if (!confirm("Refuser les documents (Identité) de cet utilisateur ?")) return;
    setProcessingId(request.id);
    try {
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "rejected"
        });
        alert("Identité marquée comme refusée.");
      }
    } catch (error) {
      console.error("Error rejecting docs:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Chargement...</div>;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100">
          <div className="text-center">
            <img src="/logo-official.png" alt="AGM INVEST" className="h-16 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-gray-900">Connexion Admin</h1>
            <p className="text-gray-500">Accès sécurisé réservé aux administrateurs.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue focus:border-ely-blue transition-all outline-none"
                placeholder="admin@agm-invest.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue focus:border-ely-blue transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-ely-blue text-white font-bold rounded-xl hover:bg-ely-blue/90 transition-all shadow-lg shadow-ely-blue/20">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  const renderUserManagement = (u: any) => {
    const userRequests = enrichedRequests.filter(req => req.userId === u.id);
    // Smart merge: Use user profile as base, but prefer non-empty request data if available
    const latestReq = userRequests[0] || {};
    const mergedData = { ...u };

    // Only overwrite with request data if it's not empty/null
    Object.keys(latestReq).forEach(key => {
      if (latestReq[key] !== undefined && latestReq[key] !== null && latestReq[key] !== "") {
        mergedData[key] = latestReq[key];
      }
    });

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setManagingUser(null);
                setExpandedRequestId(null);
              }}
              className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Gérer l'utilisateur</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-500 text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{mergedData.firstName} {mergedData.lastName}</p>
                <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-mono truncate max-w-[100px] md:max-w-none">{u.id}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IdentityStatusBadge status={u.idStatus} />
            <span className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
              u.role === 'super_admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-100'
            )}>
              {u.role === 'super_admin' ? 'Super Admin' : 'Client'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Identity & Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Stats Summary (from merged data) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Revenu", value: mergedData.monthlyIncome || mergedData.income, icon: TrendingUp, color: "text-emerald-600" },
                { label: "Charges", value: mergedData.monthlyExpenses || mergedData.charges, icon: Euro, color: "text-red-500" },
                { label: "Reste à vivre", value: (Number(mergedData.monthlyIncome || mergedData.income) || 0) - (Number(mergedData.monthlyExpenses || mergedData.charges) || 0), icon: Shield, color: "text-blue-500" },
                { label: "Taux", value: mergedData.rate || mergedData.annualRate, icon: CheckCircle, color: "text-blue-600" },
                { label: "Contrat", value: getContractLabel(mergedData.contractType || mergedData.situation), icon: Briefcase, color: "text-purple-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={cn("w-3 h-3", stat.color)} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 leading-none">
                    {stat.value !== undefined && stat.value !== null && stat.value !== "" ? (
                      (typeof stat.value === 'number' || !isNaN(Number(stat.value))) ?
                        (stat.label === "Taux" ? `${stat.value} %` : `${Number(stat.value).toLocaleString()} €`) :
                        stat.value
                    ) : (stat.label === "Reste à vivre" ? "0 €" : "---")}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-ely-blue" />
                  Profil & KYC
                </h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-6">
                  {/* Contact Quick Access */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                        <p className="text-sm font-bold text-slate-900">{mergedData.email}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Téléphone</p>
                        <p className="text-sm font-bold text-slate-900">
                          {mergedData.phone || mergedData.phoneNumber || mergedData.tel || mergedData.mobile || 'Non renseigné'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Civilité</p>
                      <p className="text-sm font-bold text-slate-900">{mergedData.civility || '---'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationalité</p>
                      <p className="text-sm font-bold text-slate-900">{mergedData.nationality || '---'}</p>
                    </div>
                    <div className="space-y-1 text-right md:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Naissance</p>
                      <p className="text-sm font-bold text-slate-900">
                        {mergedData.birthDate ? (typeof mergedData.birthDate === 'string' ? mergedData.birthDate : new Date(mergedData.birthDate).toLocaleDateString()) : '---'} ({mergedData.birthPlace || '---'})
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                      <MapPin className="w-24 h-24 text-slate-900" />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse de résidence</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900 leading-tight">
                          {mergedData.address || mergedData.residence_address || mergedData.residenceAddress || mergedData.street || 'Non spécifiée'}
                        </p>
                        {(mergedData.zipCode || mergedData.city || mergedData.zip_code) && (
                          <p className="text-sm text-slate-500 font-medium">
                            {mergedData.zipCode || mergedData.zip_code || ''} {mergedData.city || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC Documents Preview */}
                {u.kycDocuments ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pièces justificatives</p>
                      <IdentityStatusBadge status={u.idStatus} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(u.kycDocuments).map(([key, docData]: [string, any]) => {
                        const url = typeof docData === 'string' ? docData : docData?.url;
                        const status = typeof docData === 'object' ? docData?.status : 'pending';
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              const reqWithSelfie = userRequests.find(r => r.paymentSelfieUrl || r.paymentVideoUrl);
                              setSelectedRequest(reqWithSelfie || { firstName: u.firstName, userId: u.id });
                              setSelectedDocs(u.kycDocuments);
                              setIsDocModalOpen(true);
                            }}
                            className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-50 relative group cursor-pointer"
                          >
                            <img src={url} alt={key} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Search className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                              <div className={cn(
                                "w-2 h-2 rounded-full border border-white",
                                status === 'approved' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                              )} />
                              <span className="text-[8px] bg-white text-slate-900 px-1 rounded-sm border font-bold uppercase">{key}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        const reqWithSelfie = userRequests.find(r => r.paymentSelfieUrl || r.paymentVideoUrl);
                        setSelectedRequest(reqWithSelfie || { firstName: u.firstName, userId: u.id });
                        setSelectedDocs(u.kycDocuments);
                        setIsDocModalOpen(true);
                      }}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-ely-blue transition-all flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Ouvrir la Galerie KYC
                    </button>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400">
                    <p className="text-xs font-medium italic">Aucun document téléversé</p>
                  </div>
                )}
              </div>
            </div>

            {/* User Loans Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ely-blue" />
                  Dossiers de Prêts
                </h3>
                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500">
                  {userRequests.length} DOSSIER(S)
                </span>
              </div>
              <div className="p-4 space-y-4">
                {userRequests.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 italic text-sm">
                    Aucun dossier de prêt trouvé pour cet utilisateur.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRequests.map((req) => (
                      <div key={req.id} className="bg-gradient-to-br from-ely-blue to-blue-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all relative border border-white/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform -z-0" />
                        <div className="p-8 relative z-10">
                          {/* Mobile Layout */}
                          <div className="flex flex-col gap-6 md:hidden">
                            {/* Header: Statut + Meta */}
                            <div className="flex justify-between items-start">
                              <StatusBadge status={req.status} />
                              <div className="text-right">
                                <span className="block text-[10px] font-mono text-white/40 mb-1">#{req.id.slice(-6).toUpperCase()}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                  {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Main Info: Montant & Projet */}
                            <div className="text-center py-2">
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Montant demandé</p>
                              <p className="text-3xl font-black text-ely-mint mb-2">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                              </p>
                              <p className="text-sm font-bold text-white">{req.projectType || 'Projet Personnel'}</p>
                            </div>

                            {/* Secondary Info Grid */}
                            <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-2xl p-4">
                              <div className="text-center">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Taux</p>
                                <p className="text-lg font-black text-blue-300">{(req.rate || req.annualRate || 0)} %</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Durée</p>
                                <p className="text-lg font-bold text-white">{req.duration} mois</p>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <StatusBadge status={req.status} />
                                <span className="text-[10px] font-mono text-white/40">#{req.id.slice(-6).toUpperCase()}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                  {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              <div className="grid grid-cols-5 gap-10">
                                <div>
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Projet</p>
                                  <p className="text-sm font-bold text-white">{req.projectType || 'Projet Personnel'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Montant</p>
                                  <p className="text-xl font-black text-ely-mint">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taux</p>
                                  <p className="text-sm font-black text-blue-300">{(req.rate || req.annualRate || 0)} %</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Durée</p>
                                  <p className="text-sm font-bold text-white">{req.duration} mois</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {/* Desktop Actions will be rendered here via absolute positioning or similar if needed, 
                                  but current structure wraps actions below. 
                                  Actually, the original code had ActionButtons outside this div. 
                                  Let's keep the ActionButtons separate as they were. 
                              */}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <ActionButtons
                              req={req}
                              handleValidateAnalysis={handleValidateAnalysis}
                              handleValidateVerification={handleValidateVerification}
                              handleApprove={handleApprove}
                              handleRejectLoan={handleRejectLoan}
                              handleRejectDocs={handleRejectDocs}
                              handleReset={handleReset}
                              handleTriggerPayment={handleTriggerPayment}
                              setSelectedRequest={setSelectedRequest}
                              setSelectedDocs={setSelectedDocs}
                              setIsDocModalOpen={setIsDocModalOpen}
                              processingId={processingId}
                            />
                            <button
                              onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                              className="w-[90%] mx-auto md:w-full py-2 text-[10px] font-black uppercase text-white/40 hover:text-ely-mint flex items-center justify-center gap-2 transition-colors border border-white/5 hover:border-white/20 rounded-lg hover:bg-white/5"
                            >
                              {expandedRequestId === req.id ? (
                                <>Réduire les détails <ArrowLeft className="w-3 h-3 rotate-90" /></>
                              ) : (
                                <>Voir les détails complets <ArrowLeft className="w-3 h-3 -rotate-90" /></>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Section: Full Request Details */}
                        <AnimatePresence>
                          {expandedRequestId === req.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-white border-t border-slate-100"
                            >
                              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {/* Section: Situation Personnelle */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-ely-blue uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Situation Personnelle</h4>
                                  <div className="space-y-3">
                                    <DetailRow label="État Civil" value={req.maritalStatus === 'single' ? 'Célibataire' : req.maritalStatus === 'married' ? 'Marié(e)' : req.maritalStatus === 'divorced' ? 'Divorcé(e)' : req.maritalStatus} />
                                    <DetailRow label="Enfants" value={req.children || '0'} />
                                    <DetailRow label="Logement" value={req.housingType === 'tenant' ? 'Locataire' : req.housingType === 'owner' ? 'Propriétaire' : req.housingType === 'hosted' ? 'Hébergé' : req.housingType} />
                                    <DetailRow label="Ancienneté" value={`${req.housingSeniority || 0} ans`} />
                                    <DetailRow label="Téléphone" value={req.phone || 'N/A'} />
                                  </div>
                                </div>

                                {/* Section: Situation Professionnelle */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-ely-blue uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Situation Professionnelle</h4>
                                  <div className="space-y-3">
                                    <DetailRow label="Profession" value={req.profession || 'N/A'} />
                                    <DetailRow label="Employeur" value={req.companyName || 'N/A'} />
                                    <DetailRow label="Contrat" value={getContractLabel(req.contractType)} />
                                  </div>
                                </div>

                                {/* Section: Situation Financière */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-ely-blue uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Situation Financière</h4>
                                  <div className="space-y-3">
                                    <DetailRow label="Revenus Nets" value={`${(req.monthlyIncome || req.income || 0).toLocaleString()} €`} bold />
                                    <DetailRow label="Charges Fixes" value={`${(req.monthlyExpenses || req.charges || 0).toLocaleString()} €`} color="text-red-500" />
                                    <DetailRow label="Autres Crédits" value={`${(req.otherLoans || req.otherCredits || 0).toLocaleString()} €`} />
                                    <div className="pt-2 mt-2 border-t border-slate-50 flex justify-between items-center bg-emerald-50/50 p-2 rounded-lg">
                                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Reste à vivre</span>
                                      <span className="text-sm font-black text-emerald-700">{(Number(req.monthlyIncome || req.income) || 0) - (Number(req.monthlyExpenses || req.charges) || 0)} €</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Section: Analyse de Solvabilité */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-ely-blue uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Analyse de Solvabilité</h4>
                                  <div className="space-y-3">
                                    {req.score ? (
                                      <>
                                        <DetailRow label="Score AGM" value={`${req.score}/100`} bold color="text-ely-blue" />
                                        <DetailRow
                                          label="Statut"
                                          value={req.scoringStatus === "Approved" ? "Approuvé" : req.scoringStatus === "Review" ? "À réviser" : "Refusé"}
                                          color={req.scoringStatus === "Approved" ? "text-emerald-600" : req.scoringStatus === "Review" ? "text-amber-600" : "text-red-600"}
                                        />
                                        <DetailRow label="Taux d'endettement" value={`${req.debtRatio}%`} color={req.debtRatio < 33 ? "text-emerald-600" : req.debtRatio < 45 ? "text-amber-600" : "text-red-600"} />
                                      </>
                                    ) : (
                                      <p className="text-xs text-slate-400 italic">Score non calculé</p>
                                    )}
                                  </div>
                                </div>

                                {/* Section: Gestion du Conseiller */}
                                <div className="space-y-4 lg:col-span-3 pt-6 border-t border-slate-100">
                                  <h4 className="text-[10px] font-black text-ely-blue uppercase tracking-[0.2em] pb-2">Gestion du Conseiller</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-black text-slate-400 uppercase">Nom du Conseiller</label>
                                      <input
                                        type="text"
                                        defaultValue={req.advisorName || "Jean-Luc Dupont"}
                                        id={`advisor-name-${req.id}`}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-ely-blue transition-colors"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-black text-slate-400 uppercase">Email du Conseiller</label>
                                      <input
                                        type="email"
                                        defaultValue={req.advisorEmail || "j.dupont@elyssio.com"}
                                        id={`advisor-email-${req.id}`}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-ely-blue transition-colors"
                                      />
                                    </div>
                                    <button
                                      onClick={() => {
                                        const name = (document.getElementById(`advisor-name-${req.id}`) as HTMLInputElement).value;
                                        const email = (document.getElementById(`advisor-email-${req.id}`) as HTMLInputElement).value;
                                        handleUpdateAdvisor(req.id, name, email);
                                      }}
                                      disabled={processingId === req.id}
                                      className="py-3 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ely-blue transition-all disabled:opacity-50"
                                    >
                                      {processingId === req.id ? "Mise à jour..." : "Enregistrer le Conseiller"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-400" />
                    Paramètres du Compte
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <button
                    onClick={() => handleToggleAdmin(u)}
                    className="w-full p-4 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-between group transition-all rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span>{u.role === 'super_admin' ? 'Rétrograder en Client' : 'Promouvoir Admin'}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>

                  <button
                    onClick={() => {
                      handleResetKYC({ userId: u.id, firstName: u.firstName });
                    }}
                    className="w-full p-4 hover:bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-between group transition-all rounded-2xl border border-amber-100"
                  >
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-4 h-4" />
                      <span>Réinitialiser les documents KYC</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="w-full p-4 hover:bg-red-50 text-red-600 text-xs font-bold flex items-center justify-between group transition-all rounded-2xl border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer définitivement</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleUpdateAdvisor = async (requestId: string, name: string, email: string) => {
    setProcessingId(requestId);
    try {
      await updateDoc(doc(dbInstance, "requests", requestId), {
        advisorName: name,
        advisorEmail: email,
        updatedAt: serverTimestamp()
      });
      alert("Conseiller mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating advisor:", error);
      alert("Erreur lors de la mise à jour du conseiller.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateInstallmentStatus = async (accountId: string, monthIndex: number, newStatus: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    try {
      // Use an object instead of an array to prevent sparse array issues in Firestore
      const installments = account.installments || {};
      const updatedInstallments = {
        ...installments,
        [monthIndex]: {
          status: newStatus,
          updatedAt: new Date()
        }
      };

      await updateDoc(doc(dbInstance, "accounts", accountId), {
        installments: updatedInstallments,
        updatedAt: serverTimestamp()
      });

      // No alert here for smoother UX, but adding console.log to confirm
      console.log(`Status updated to ${newStatus} for month ${monthIndex + 1}`);
    } catch (error) {
      console.error("Error updating installment:", error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleResetFullSchedule = async (accountId: string) => {
    if (!confirm("Réinitialiser COMPLÈTEMENT cet échéancier ? Tous les statuts validés seront effacés.")) return;
    try {
      await updateDoc(doc(dbInstance, "accounts", accountId), {
        installments: {},
        updatedAt: serverTimestamp()
      });
      alert("Échéancier réinitialisé avec succès !");
    } catch (error) {
      console.error("Error resetting schedule:", error);
    }
  };

  const renderSchedules = () => {
    const filteredAccounts = accounts.filter(acc => {
      const user = usersList.find(u => u.id === acc.userId);
      const searchStr = `${user?.firstName} ${user?.lastName} ${acc.id}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des Échéanciers</h1>
            <p className="text-slate-500">Suivi des remboursements et validation des mensualités.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un client ou un compte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ely-blue outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {filteredAccounts.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <CalendarRange className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucun compte de prêt actif trouvé.</p>
            </div>
          ) : (
            filteredAccounts.map((acc) => {
              const user = usersList.find(u => u.id === acc.userId);

              // Dynamic Calculation for Next Payment Date
              const rawDate = acc.startDate || acc.createdAt;
              const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : (rawDate?.toDate ? rawDate.toDate() : new Date(rawDate || Date.now()));
              const duration = acc.duration || 12;
              const installments = acc.installments || {};

              let nextPaymentDateDisplay = "Terminé";

              for (let i = 0; i < duration; i++) {
                const isPaid = installments[i]?.status === 'paid';
                if (!isPaid) {
                  const pDate = new Date(startDate);
                  pDate.setMonth(startDate.getMonth() + (i + 1));
                  nextPaymentDateDisplay = pDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  break;
                }
              }

              return (
                <div key={acc.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                      <UserAvatar name={`${user?.firstName} ${user?.lastName}`} className="w-16 h-16 rounded-[2rem] bg-slate-50 text-slate-900 border-none text-lg shadow-inner" />
                      <div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">ID Compte: {acc.id.slice(0, 8)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 w-full lg:w-auto px-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Total</p>
                        <p className="text-lg font-black text-slate-900">{acc.totalAmount?.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reste à payer</p>
                        <p className="text-lg font-black text-ely-blue">{acc.remainingAmount?.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mensualité</p>
                        <p className="text-lg font-black text-emerald-600">{acc.monthlyPayment?.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prochaine Échéance</p>
                        <p className="text-sm font-bold text-slate-900">{nextPaymentDateDisplay}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAccount(acc)}
                      className="w-full lg:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-ely-blue transition-all shadow-lg active:scale-95"
                    >
                      Gérer l'échéancier
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Gestionnaire d'échéancier détaillé */}
        <AnimatePresence>
          {selectedAccount && (() => {
            const activeAccount = accounts.find(a => a.id === selectedAccount.id) || selectedAccount;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && setSelectedAccount(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-ely-blue text-white flex items-center justify-center shadow-lg shadow-ely-blue/20">
                        <CalendarRange className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Détail de l'Échéancier</h2>
                        <p className="text-sm text-slate-500 font-medium">Compte #{activeAccount.id.slice(0, 12)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleResetFullSchedule(activeAccount.id)}
                        className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100 shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Réinitialiser Tout
                      </button>
                      <button onClick={() => setSelectedAccount(null)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
                        <X className="w-6 h-6 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 overflow-y-auto flex-1 space-y-8">
                    <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm text-[10px]">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Mensualité</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Date Prévue</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Montant</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {Array.from({ length: activeAccount.duration || 12 }).map((_, i) => {
                            const installmentData = activeAccount.installments?.[i];
                            const status = installmentData?.status || 'pending';

                            // Robust date conversion handling both Timestamp and JS Date
                            const rawDate = activeAccount.startDate || activeAccount.createdAt;
                            const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : (rawDate?.toDate ? rawDate.toDate() : new Date(rawDate || Date.now()));

                            const pDate = new Date(startDate);
                            pDate.setMonth(startDate.getMonth() + (i + 1));
                            const formattedDate = pDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                            return (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5 font-bold text-slate-900">Mois {i + 1}</td>
                                <td className="px-6 py-5 text-slate-500 font-medium">{formattedDate}</td>
                                <td className="px-6 py-5 font-black text-slate-900">{activeAccount.monthlyPayment?.toLocaleString()} €</td>
                                <td className="px-6 py-5">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                                    status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                      status === 'overdue' ? "bg-red-50 text-red-600 border-red-100 animate-pulse" :
                                        "bg-slate-50 text-slate-400 border-slate-100"
                                  )}>
                                    <span className={cn("w-1 h-1 rounded-full",
                                      status === 'paid' ? "bg-emerald-400" :
                                        status === 'overdue' ? "bg-red-400" : "bg-slate-300"
                                    )} />
                                    {status === 'paid' ? 'Payé' : status === 'overdue' ? 'En retard' : 'En attente'}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleUpdateInstallmentStatus(activeAccount.id, i, 'paid')}
                                      className={cn("p-2 rounded-lg transition-all", status === 'paid' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}
                                      title="Marquer comme payé"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateInstallmentStatus(activeAccount.id, i, 'overdue')}
                                      className={cn("p-2 rounded-lg transition-all", status === 'overdue' ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-red-50 text-red-600 hover:bg-red-100")}
                                      title="Marquer comme retard"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateInstallmentStatus(activeAccount.id, i, 'pending')}
                                      className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors"
                                      title="Réinitialiser le mois"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    );
  };

  const renderContent = () => {
    if (managingUser) return renderUserManagement(managingUser);

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
              <p className="text-slate-500">Aperçu global et gestion des demandes de crédit.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Demandes" value={stats.total} trend="Global" color="bg-blue-100 text-blue-700" />
              <StatCard label="En attente" value={stats.pending} trend="Action requise" color="bg-amber-100 text-amber-700" variant="white" />
              <StatCard label="Approuvées" value={stats.approved} trend="Actifs" color="bg-emerald-100 text-emerald-700" variant="white" />
              <StatCard label="Utilisateurs" value={stats.totalUsers} trend="Total" color="bg-purple-100 text-purple-700" />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-ely-blue rounded-full" />
                  <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Portefeuille Récent</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-ely-blue animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Live Status</span>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
                {enrichedRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="p-8 space-y-6 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all border border-white/10 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform -z-0" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-4">
                        <UserAvatar name={`${req.firstName} ${req.lastName}`} className="w-12 h-12 rounded-2xl bg-white text-slate-900 border-none text-xs shadow-lg" />
                        <div>
                          <p className="text-sm font-black text-white leading-tight">{req.firstName} {req.lastName}</p>
                          <p className="text-[10px] font-medium text-white/40 mt-1">{req.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Nature du projet</p>
                        <p className="font-bold text-white text-xs uppercase tracking-tight">{req.projectType || 'Prêt personnel'}</p>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Montant sollicité</p>
                        <div className="text-right">
                          <p className="font-black text-ely-mint text-base leading-none">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                          </p>
                          <div className="flex items-center justify-end gap-1.5 mt-1.5 opacity-40">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">{req.duration} mois</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-1 pt-4 border-t border-white/5 opacity-40 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-white" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards (Simplified) */}
              <div className="md:hidden space-y-6 p-4">
                {enrichedRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="p-6 space-y-6 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />
                    <div className="flex justify-between items-center gap-4 relative z-10 w-full overflow-hidden">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <UserAvatar name={`${req.firstName} ${req.lastName}`} className="w-14 h-14 rounded-[1.5rem] bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-white leading-tight truncate">{req.firstName} {req.lastName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">{req.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Nature du projet</p>
                        <p className="font-bold text-white text-xs uppercase tracking-tight">{req.projectType || 'Prêt personnel'}</p>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Financement souhaité</p>
                        <div className="text-right">
                          <p className="font-black text-ely-mint text-base leading-none">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 block mt-1 opacity-60 lowercase tracking-widest text-right">{req.duration} mois</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-1 pt-4 border-t border-white/5 opacity-40 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-white" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div >
        );

      case "requests":
        return (
          <div className="space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dossiers de Prêts</h1>
                <p className="text-slate-500">Liste exhaustive de toutes les demandes de financement.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: </span>
                <span className="text-sm font-black text-ely-blue">{enrichedRequests.length}</span>
              </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-ely-blue rounded-full" />
                  <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Portefeuille de Demandes</h3>
                </div>
              </div>

              {/* Desktop Cards for All Requests with Pagination */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 p-8">
                {enrichedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((req) => (
                  <div key={req.id} className="p-8 space-y-8 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all border border-white/10 flex flex-col justify-between min-h-[400px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />

                    <div className="flex justify-between items-start relative z-10 w-full">
                      <div className="flex items-center gap-4 min-w-0">
                        <UserAvatar name={`${req.firstName} ${req.lastName}`} className="w-14 h-14 rounded-2xl bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0">
                          <p className="text-base font-black text-white leading-tight truncate">{req.firstName} {req.lastName}</p>
                          <p className="text-[10px] font-medium text-white/40 mt-1.5 truncate">{req.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-2">Nature du Projet</p>
                          <p className="font-bold text-white text-[11px] uppercase truncate">{req.projectType || 'Personnel'}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-2">Durée</p>
                          <p className="font-bold text-white text-[11px] uppercase">{req.duration} mois</p>
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md p-6 rounded-[1.8rem] border border-white/10 shadow-inner flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Montant Demandé</p>
                          <p className="font-black text-ely-mint text-xl tracking-tighter">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Soumis le</p>
                          <p className="font-bold text-white/80 text-[10px] uppercase tracking-tighter">
                            {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                          </p>
                          <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter mt-1">
                            à {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 relative z-10">
                      <ActionButtons
                        req={req}
                        handleValidateAnalysis={handleValidateAnalysis}
                        handleValidateVerification={handleValidateVerification}
                        handleApprove={handleApprove}
                        handleRejectLoan={handleRejectLoan}
                        handleRejectDocs={handleRejectDocs}
                        handleReset={handleReset}
                        handleTriggerPayment={handleTriggerPayment}
                        setSelectedRequest={setSelectedRequest}
                        setSelectedDocs={setSelectedDocs}
                        setIsDocModalOpen={setIsDocModalOpen}
                        processingId={processingId}
                        mobile={true}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards for All Requests with Pagination */}
              <div className="md:hidden space-y-8 p-4">
                {enrichedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((req) => (
                  <div key={req.id} className="p-6 space-y-8 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />
                    <div className="flex justify-between items-center gap-4 relative z-10 w-full overflow-hidden">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <UserAvatar name={`${req.firstName} ${req.lastName}`} className="w-14 h-14 rounded-[1.5rem] bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-white leading-tight truncate">{req.firstName} {req.lastName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">{req.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Nature du projet</p>
                        <p className="font-bold text-white text-[11px] uppercase tracking-tight">{req.projectType || 'Prêt personnel'}</p>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Financement souhaité</p>
                        <div className="text-right">
                          <div className="font-black text-ely-mint text-base leading-none">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(req.amount || 0)}
                            <span className="text-[9px] font-bold text-slate-400 block mt-1 opacity-60 lowercase tracking-widest">{req.duration} mois</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-1 pt-2 border-t border-white/5 opacity-40">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-white" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                            {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-white" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                            {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 relative z-10 space-y-4">
                      <ActionButtons
                        mobile={true}
                        req={req}
                        handleValidateAnalysis={handleValidateAnalysis}
                        handleValidateVerification={handleValidateVerification}
                        handleApprove={handleApprove}
                        handleRejectLoan={handleRejectLoan}
                        handleRejectDocs={handleRejectDocs}
                        handleReset={handleReset}
                        handleTriggerPayment={handleTriggerPayment}
                        setSelectedRequest={setSelectedRequest}
                        setSelectedDocs={setSelectedDocs}
                        setIsDocModalOpen={setIsDocModalOpen}
                        processingId={processingId}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(enrichedRequests.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div >
        );

      case "kyc":
        const kycUsers = usersList.filter(u => {
          const hasKycDocs = u.kycDocuments && Object.keys(u.kycDocuments).length > 0;
          const hasPendingStatus = u.idStatus === 'pending_verification' || u.idStatus === 'partial_rejection';

          // Check for payment verification in requests associated with this user
          const hasPaymentVerification = requests.some(req =>
            req.userId === u.id && (req.paymentSelfieUrl || req.paymentVideoUrl)
          );

          return hasKycDocs || hasPendingStatus || hasPaymentVerification;
        });
        return (
          <div className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-slate-900">KYC & Documents</h1>
              <p className="text-slate-500">Validation centralisée des pièces justificatives.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kycUsers.length === 0 ? (
                <div className="col-span-full p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
                  <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Aucun document KYC à traiter pour le moment.</p>
                </div>
              ) : (
                kycUsers.map((u) => (
                  <div key={u.id} className="bg-gradient-to-br from-ely-blue to-blue-800 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl hover:shadow-xl transition-all group relative overflow-hidden min-h-[350px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />

                    <div className="flex items-center justify-between gap-4 mb-8 relative z-10 w-full overflow-hidden">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <UserAvatar name={`${u.firstName} ${u.lastName}`} className="w-14 h-14 rounded-2xl bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-white truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <IdentityStatusBadge status={u.idStatus} />
                      </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 opacity-60 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-ely-mint" />
                          <span>Inscrit le {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <FileText className="w-3 h-3 text-ely-mint" />
                          <span className="text-[10px] font-bold">
                            {(() => {
                              const kycCount = u.kycDocuments ? Object.keys(u.kycDocuments).length : 0;
                              const paymentDocsCount = requests
                                .filter(req => req.userId === u.id)
                                .reduce((acc, req) => acc + (req.paymentSelfieUrl ? 1 : 0) + (req.paymentVideoUrl ? 1 : 0), 0);
                              return kycCount + paymentDocsCount;
                            })()} fichiers
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const userRequest = requests.find(req => req.userId === u.id && (req.paymentSelfieUrl || req.paymentVideoUrl));
                          const requestData = userRequest ? { ...userRequest, firstName: u.firstName, lastName: u.lastName } : { firstName: u.firstName, userId: u.id };

                          setSelectedRequest(requestData);
                          setSelectedDocs(u.kycDocuments || {});
                          setIsDocModalOpen(true);
                        }}
                        className="w-full py-5 bg-white text-slate-900 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-ely-mint hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                      >
                        <Search className="w-4 h-4" />
                        Vérifier le dossier
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "schedules":
        return renderSchedules();

      case "users":
        return (
          <div className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
              <p className="text-slate-500">Gestion des comptes clients et de la vérification d'identité.</p>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-ely-blue rounded-full" />
                  <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Annuaire des Utilisateurs</h3>
                </div>
              </div>

              {/* Desktop Cards for Users with Pagination */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 p-8">
                {usersList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u) => (
                  <div key={u.id} className="p-8 space-y-8 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all border border-white/10 flex flex-col justify-between min-h-[350px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />

                    <div className="flex justify-between items-start relative z-10 w-full gap-4">
                      <div className="flex items-center gap-5 min-w-0 flex-1">
                        <UserAvatar name={`${u.firstName} ${u.lastName}`} className="w-16 h-16 rounded-[1.8rem] bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-black text-white leading-tight truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] font-medium text-white/40 mt-1.5 truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0 pt-2">
                        <span className={cn(
                          "px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm h-fit backdrop-blur-md whitespace-nowrap",
                          u.role === 'super_admin' ? 'bg-purple-400/20 text-purple-300 border-purple-400/30' : 'bg-white/10 text-white/70 border-white/20'
                        )}>
                          {u.role === 'super_admin' ? 'Super Admin' : 'Client'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">État de l'identité</p>
                        <IdentityStatusBadge status={u.idStatus} />
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Inscrit le</p>
                        <div className="flex items-center gap-2 text-white/80">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          <p className="font-bold text-[11px] uppercase tracking-tighter">
                            {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Dernière activité</p>
                        <div className="flex items-center gap-2 text-white/80">
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          <p className="font-bold text-[11px] uppercase tracking-tighter">
                            {u.lastLogin?.seconds ? new Date(u.lastLogin.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jamais'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 relative z-10">
                      <button
                        onClick={() => setManagingUser(u)}
                        className="w-full py-5 bg-white text-slate-900 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ely-mint hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                      >
                        Gérer le compte
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards for Users with Pagination */}
              <div className="md:hidden space-y-8 p-4">
                {usersList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u) => (
                  <div key={u.id} className="p-8 space-y-6 bg-gradient-to-br from-ely-blue to-blue-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform -z-0" />
                    <div className="flex justify-between items-center gap-4 relative z-10 w-full overflow-hidden">
                      <div className="flex items-center gap-5 min-w-0 flex-1">
                        <UserAvatar name={`${u.firstName} ${u.lastName}`} className="w-14 h-14 rounded-[1.5rem] bg-white text-slate-900 border-none text-xs shadow-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-black text-white leading-tight truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1.5 truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={cn(
                          "px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-[0.15em] border shadow-sm h-fit backdrop-blur-md whitespace-nowrap",
                          u.role === 'super_admin' ? 'bg-purple-400/20 text-purple-300 border-purple-400/30' : 'bg-white/10 text-white/70 border-white/20'
                        )}>
                          {u.role === 'super_admin' ? 'Admin' : 'Client'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">État de l'identité</p>
                        <IdentityStatusBadge status={u.idStatus} />
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Inscrit le</p>
                        <p className="font-bold text-white/80 text-[11px] font-outfit uppercase tracking-tighter">
                          {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-5 rounded-[1.8rem] border border-white/10 shadow-inner">
                        <p className="text-[9px] text-slate-300 uppercase font-black tracking-widest opacity-60">Dernière activité</p>
                        <p className="font-bold text-white/80 text-[11px] font-outfit uppercase tracking-tighter">
                          {u.lastLogin?.seconds ? new Date(u.lastLogin.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jamais'}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <button
                        onClick={() => setManagingUser(u)}
                        className="w-full py-4.5 bg-white text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-ely-mint hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                      >
                        <Settings className="w-5 h-5" />
                        Gérer le profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(usersList.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        );


      case "transfers": {
        const grouped = transfers.reduce((acc: any, t) => {
          if (!acc[t.userId]) {
            acc[t.userId] = {
              id: t.userId,
              name: t.userName || "Utilisateur inconnu",
              email: t.userEmail || "Pas d'email",
              transfers: [],
              pendingCount: 0
            };
          }
          acc[t.userId].transfers.push(t);
          if (t.status === 'pending') acc[t.userId].pendingCount++;
          return acc;
        }, {});
        const userGroups = Object.values(grouped).filter((u: any) => {
          const searchStr = `${u.name} ${u.email}`.toLowerCase();
          return searchStr.includes(searchTerm.toLowerCase());
        });

        if (managingTransfersUser) {
          const userTransfers = managingTransfersUser.transfers.sort((a: any, b: any) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );
          const userAcc = accounts.find(acc => acc.userId === managingTransfersUser.id);

          return (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <header className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => setManagingTransfersUser(null)}
                  className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">Virements : {managingTransfersUser.name}</h1>
                  <p className="text-xs md:text-slate-500 font-medium truncate">{managingTransfersUser.email}</p>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* RIB info card */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-ely-blue text-white flex items-center justify-center shadow-lg shadow-ely-blue/20">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900">Coordonnées Bancaires</h3>
                    </div>

                    <div className="space-y-3 md:space-y-4 pt-2">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Banque</p>
                        <p className="text-sm font-bold text-slate-900">{userAcc?.bankName || "Non renseigné"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">IBAN</p>
                        <p className="text-sm font-mono font-bold text-slate-900 break-all">{userAcc?.iban || "Non renseigné"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">BIC</p>
                        <p className="text-sm font-mono font-bold text-slate-900">{userAcc?.bic || "Non renseigné"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email pour les virements</p>
                        <p className="text-sm font-bold text-slate-900">{userAcc?.ribEmail || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transfers cards */}
                <div className="lg:col-span-2 space-y-6">
                  {userTransfers.slice((currentPage - 1) * 10, currentPage * 10).map((t: any, idx: number) => (
                    <VirementCard
                      key={t.id}
                      t={t}
                      index={idx + (currentPage - 1) * 10}
                      onApprove={handleApproveTransfer}
                      onReject={handleRejectTransfer}
                      onReview={handleReviewTransfer}
                      onAdvanced={handleAdvancedTransfer}
                      onReset={handleResetTransfer}
                      processingId={processingId}
                    />
                  ))}

                  {userTransfers.length > 10 && (
                    <div className="flex items-center justify-center gap-4 py-4">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-black text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        PAGE {currentPage} / {Math.ceil(userTransfers.length / 10)}
                      </span>
                      <button
                        disabled={currentPage >= Math.ceil(userTransfers.length / 10)}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gestion des Virements</h1>
                <p className="text-sm md:text-slate-500 font-medium">Contrôle de conformité et validation par utilisateur.</p>
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ely-blue outline-none transition-all shadow-sm"
                />
              </div>
            </header>

            {/* View for Desktop / Tablet */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">En Attente</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Total Virements</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {userGroups.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium italic">
                          Aucun virement trouvé pour le moment.
                        </td>
                      </tr>
                    ) : (
                      userGroups.map((group: any) => (
                        <tr key={group.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <UserAvatar name={group.name} className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border-none text-xs" />
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-tight">{group.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{group.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            {group.pendingCount > 0 ? (
                              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black border border-amber-100">
                                {group.pendingCount} EN ATTENTE
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black border border-slate-100">
                                AUCUN
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-sm font-black text-slate-700">{group.transfers.length}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => setManagingTransfersUser(group)}
                              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ely-blue transition-all shadow-md active:scale-95"
                            >
                              Gérer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* View for Mobile */}
            <div className="md:hidden space-y-4">
              {userGroups.length === 0 ? (
                <div className="p-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-400 font-medium italic">Aucun virement trouvé.</p>
                </div>
              ) : (
                userGroups.map((group: any) => (
                  <div key={group.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <UserAvatar name={group.name} className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border-none text-xs" />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 leading-tight truncate">{group.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 truncate">{group.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">En attente</p>
                        <p className={cn("text-xs font-black", group.pendingCount > 0 ? "text-amber-500" : "text-slate-400")}>
                          {group.pendingCount}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xs font-black text-slate-700">{group.transfers.length}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setManagingTransfersUser(group)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ely-blue transition-all active:scale-95"
                    >
                      Gérer les virements
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }


      case "support":
        return renderSupportChat();

      case "settings":
        return (
          <div className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-slate-900">Configuration</h1>
              <p className="text-slate-500">Paramètres du système et gestion des administrateurs.</p>
            </header>
            <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <Settings className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium font-outfit">L'interface de configuration globale sera bientôt disponible.</p>
            </div>
          </div>
        );

      default:
        return <div className="p-8 text-center text-slate-500">Sélectionnez un onglet.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-ely-blue text-white flex flex-col pt-8 transition-transform duration-300 md:translate-x-0 md:relative shadow-2xl md:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-2 right-2 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 mb-12">
          <img src="/logo-official.png" alt="AGM INVEST" className="h-12 bg-white p-1 rounded-lg object-contain" />
          <span className="text-xs font-bold tracking-tight uppercase block mt-2 opacity-80">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.id);
                setManagingUser(null);
                setManagingTransfersUser(null);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id ? "bg-white/10 text-ely-mint" : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors text-sm font-medium w-full"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un dossier, un client..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user.email}</p>
                <p className="text-[10px] text-slate-500 uppercase">
                  {user.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}
                </p>
              </div>
              <div className="w-10 h-10 bg-ely-mint rounded-full flex items-center justify-center text-white font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main >

      {/* Approve Confirmation Modal with Delay Selection */}
      <AnimatePresence>
        {
          isApproveModalOpen && selectedRequestForApproval && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-black text-slate-900 mb-1">Confirmer l'accord de prêt</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Pour {selectedRequestForApproval.firstName} {selectedRequestForApproval.lastName}
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant</span>
                      <span className="text-lg font-black text-ely-blue">{selectedRequestForApproval.amount?.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mensualité</span>
                      <span className="text-sm font-bold text-slate-700">{selectedRequestForApproval.monthlyPayment?.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">
                      Début de l'échéancier (Différé)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 3, 6, 9, 12].map((months) => (
                        <button
                          key={months}
                          onClick={() => setStartDelay(months)}
                          className={cn(
                            "py-3 px-4 rounded-2xl text-xs font-bold transition-all border",
                            startDelay === months
                              ? "bg-ely-blue text-white border-ely-blue shadow-lg shadow-ely-blue/30 scale-[1.02]"
                              : "bg-white text-slate-500 border-slate-200 hover:border-ely-blue/50 hover:bg-slate-50"
                          )}
                        >
                          {months === 1 ? "1 mois (Standard)" : months === 12 ? "1 an après" : `${months} mois après`}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium ml-1 mt-2">
                      Le premier prélèvement aura lieu {startDelay === 1 ? "le mois suivant" : `dans ${startDelay + 1} mois`}.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button
                    onClick={() => setIsApproveModalOpen(false)}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-white rounded-2xl transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmApprove}
                    disabled={!!processingId}
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processingId ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Valider l'accord
                  </button>
                </div>
              </motion.div>
            </div>
          )
        }
      </AnimatePresence >

      {/* KYC Documents Modal */}
      <AnimatePresence>
        {
          isDocModalOpen && selectedDocs && (
            <div key="kyc-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
              <motion.div
                key="kyc-modal-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ely-blue/5 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-ely-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-none">Documents KYC</h3>
                      <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest leading-none">{selectedRequest?.firstName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResetKYC(selectedRequest)}
                      className="px-6 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-2 border border-amber-100"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser KYC
                    </button>
                    <button
                      onClick={() => setIsDocModalOpen(false)}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
                    >
                      <XCircle className="w-7 h-7 text-slate-300 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                  {/* Payment Verification Proofs */}
                  {(selectedRequest?.paymentSelfieUrl || selectedRequest?.paymentVideoUrl) && (
                    <div className="mb-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Vérification de Paiement (Live)</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedRequest.paymentSelfieUrl && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Selfie Photo</p>
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-white group hover:shadow-2xl transition-all">
                              <img src={selectedRequest.paymentSelfieUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Selfie Paiement" />
                              <a href={selectedRequest.paymentSelfieUrl} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                                <ExternalLink className="w-5 h-5" /> Voir plein écran
                              </a>
                            </div>
                          </div>
                        )}
                        {selectedRequest.paymentVideoUrl && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Selfie Vidéo (Liveness)</p>
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-black group hover:shadow-2xl transition-all">
                              <video src={selectedRequest.paymentVideoUrl} controls className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="h-px bg-slate-200" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(selectedDocs || {}).map(([key, docData]: [string, any], idx) => {
                      const url = typeof docData === 'string' ? docData : docData?.url;
                      const status = typeof docData === 'object' ? docData?.status : 'pending';
                      const rejectionReason = typeof docData === 'object' ? docData?.rejectionReason : null;

                      const getLabel = (k: string) => {
                        const lowKey = k.toLowerCase();
                        if (lowKey === 'identity_1') return "Pièce d'Identité 1";
                        if (lowKey === 'identity_1_front') return "Pièce ID 1 (Recto)";
                        if (lowKey === 'identity_1_back') return "Pièce ID 1 (Verso)";
                        if (lowKey === 'identity_2') return "Pièce d'Identité 2";
                        if (lowKey === 'identity_2_front') return "Pièce ID 2 (Recto)";
                        if (lowKey === 'identity_2_back') return "Pièce ID 2 (Verso)";
                        if (lowKey === 'vital_card') return "Carte Vitale";
                        if (lowKey === 'tax_notice') return "Avis d'Imposition";
                        if (lowKey === 'rib') return "RIB";
                        if (lowKey.includes('front')) return "Carte ID (Recto)";
                        if (lowKey.includes('back')) return "Carte ID (Verso)";
                        if (lowKey.includes('address') || lowKey.includes('proof')) return "Justificatif Domicile";
                        return k;
                      };

                      return (
                        <div key={key || `doc-${idx}`} className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {getLabel(key)}
                            </p>
                            <IdentityStatusBadge status={status} />
                          </div>

                          <div className="group relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1">
                            <img
                              src={url}
                              alt={key}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white text-white hover:text-slate-900 transition-all shadow-xl"
                              >
                                <ExternalLink className="w-6 h-6" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleApproveDocument(selectedRequest.userId, key)}
                              disabled={status === 'approved'}
                              className={cn(
                                "flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm",
                                status === 'approved'
                                  ? "bg-emerald-500 text-white shadow-emerald-200"
                                  : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100"
                              )}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Valider
                            </button>
                            <button
                              onClick={() => handleRejectDocument(selectedRequest.userId, key)}
                              disabled={status === 'rejected'}
                              className={cn(
                                "flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm",
                                status === 'rejected'
                                  ? "bg-red-500 text-white shadow-red-200"
                                  : "bg-white text-red-600 hover:bg-red-50 border border-red-100"
                              )}
                            >
                              <XCircle className="w-4 h-4" />
                              Refuser
                            </button>
                          </div>

                          {rejectionReason && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                              <p className="text-[10px] font-bold text-red-700 uppercase leading-none mb-1">Motif du refus</p>
                              <p className="text-xs text-red-600 font-medium">{rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400 max-w-sm">
                    La validation est granulaire. Si vous refusez un document, l'utilisateur pourra le soumettre à nouveau sans perdre les autres.
                  </p>
                  <button
                    onClick={() => setIsDocModalOpen(false)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  >
                    Fermer la vue
                  </button>
                </div>
              </motion.div>
            </div>
          )
        }
        {/* Payment Request Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 leading-none mb-1">Configuration du Paiement</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dossier : {selectedRequestForPayment?.firstName} {selectedRequestForPayment?.lastName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Authentication Deposit Info */}
                  <div className="space-y-4">
                    <div className="p-6 bg-ely-blue/5 border-2 border-ely-blue rounded-3xl flex items-center gap-6 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-ely-blue shrink-0 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Dépôt d'Authentification</h3>
                        <p className="text-sm text-slate-500 font-medium">Validation de l'identité financière du demandeur</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-ely-blue text-white rounded-full text-xs font-black tracking-widest uppercase">
                          Montant Fixe : 286.00 €
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        Ce dépôt sera crédité sur le solde du client et reste intégralement sa propriété.
                        <strong> Il ne constitue pas un frais facturé.</strong>
                      </p>
                    </div>
                  </div>

                  {/* RIB Customization Section */}
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Coordonnées bancaires du bénéficiaire</label>
                      <span className="text-[9px] font-bold text-ely-blue bg-ely-blue/5 px-3 py-1 rounded-full uppercase">RIB de l'établissement</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Bénéficiaire</label>
                        <input
                          type="text"
                          value={paymentSettings.beneficiary}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, beneficiary: e.target.value }))}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ely-blue/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Banque</label>
                        <input
                          type="text"
                          value={paymentSettings.bankName}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, bankName: e.target.value }))}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ely-blue/20"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">IBAN</label>
                        <input
                          type="text"
                          value={paymentSettings.iban}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, iban: e.target.value }))}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ely-blue/20"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Code BIC / SWIFT</label>
                        <input
                          type="text"
                          value={paymentSettings.bic}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, bic: e.target.value }))}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ely-blue/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Annuler
                  </button>
                  {selectedRequestForPayment?.requiresPayment && selectedRequestForPayment?.paymentStatus === 'pending' && (
                    <button
                      onClick={confirmPaymentReceived}
                      disabled={processingId === selectedRequestForPayment?.id}
                      className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
                    >
                      {processingId === selectedRequestForPayment?.id ? <LoadingSpinner /> : <CheckCircle className="w-5 h-5" />}
                      Confirmer la réception
                    </button>
                  )}
                  <button
                    onClick={processPaymentTrigger}
                    disabled={processingId === selectedRequestForPayment?.id}
                    className="px-10 py-4 bg-ely-blue text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-ely-blue/20 flex items-center gap-2"
                  >
                    {processingId === selectedRequestForPayment?.id ? <LoadingSpinner /> : <CheckCircle className="w-5 h-5" />}
                    Déclencher la demande
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence >
    </div >
  );
}
