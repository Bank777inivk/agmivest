"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Search, Bell, CheckCircle, XCircle, Clock, RotateCcw, Menu, X, ExternalLink, ArrowLeft, Shield, Trash2, Mail, Phone, MapPin, TrendingUp, Euro, Briefcase, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, deleteDoc, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Use standard db instance
// Use standard db instance
const dbInstance = db;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "requests", label: "Dossiers Prêts", icon: FileText },
  { id: "kyc", label: "KYC & Documents", icon: Search },
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

function ActionButtons({
  req,
  handleValidateAnalysis,
  handleValidateVerification,
  handleApprove,
  handleReject,
  handleReset,
  setSelectedRequest,
  setSelectedDocs,
  setIsDocModalOpen,
  processingId,
  mobile = false
}: any) {
  // Always use full width and center content for cleaner grid/stack look
  const btnClass = "w-full justify-center p-1 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
  const isProcessing = processingId === req.id;

  const containerClass = mobile
    ? "flex flex-col gap-2 w-full"
    : "grid grid-cols-2 gap-2 w-[280px] ml-auto [&>button:last-child:nth-child(odd)]:col-span-2";

  const LoadingSpinner = () => <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />;

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
              onClick={() => handleReject(req)}
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
            onClick={() => handleReject(req)}
            className={cn(btnClass, "bg-red-100 text-red-700 hover:bg-red-200")}
          >
            {isProcessing ? <LoadingSpinner /> : <XCircle className="w-3 h-3" />}
            Refuser Prêt
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
          {req.status === "approved" && <span className="text-xs font-bold text-emerald-600">Traité</span>}
          {req.status === "rejected" && <span className="text-xs font-bold text-red-600">Refusé</span>}
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedDocs, setSelectedDocs] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [managingUser, setManagingUser] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

    return () => {
      unsubUsers();
      unsubRequests();
    };
  }, [user]);

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

  const handleApprove = async (request: any) => {
    if (!confirm(`Confirmer l'accord du prêt pour ${request.firstName} ${request.lastName} ?\nMontant: ${request.amount}€`)) return;

    setProcessingId(request.id);
    try {
      // 1. Update Request Status
      await updateDoc(doc(dbInstance, "requests", request.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
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
        startDate: serverTimestamp(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
        createdAt: serverTimestamp(),
        // Keep a copy of full request details for the scheduler
        details: request.details || {},
        originalRequest: {
          amount: request.amount,
          duration: request.duration,
          rate: request.annualRate || request.rate
        }
      });

      // 3. Update User ID Status if needed
      await updateDoc(doc(dbInstance, "users", request.userId), {
        idStatus: "verified",
        hasActiveLoan: true
      });

      alert("Prêt accordé et compte rechargé avec succès !");

    } catch (error) {
      console.error("Error approving request:", error);
      alert("Erreur lors de l'approbation. Vérifiez vos permissions.");
    } finally {
      setProcessingId(null);
    }
  };

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

        setIsDocModalOpen(false);
        alert("Les documents ont été réinitialisés. L'utilisateur peut à nouveau soumettre son dossier.");
      }
    } catch (error) {
      console.error("Error resetting KYC:", error);
      alert("Erreur lors de la réinitialisation.");
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

        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(dbInstance, "accounts", docSnapshot.id));
        });
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
      await deleteDoc(doc(dbInstance, "users", u.id));
      setActiveActionMenu(null);
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  };

  const handleReject = async (request: any) => {
    if (!confirm("Refuser ce dossier ?")) return;
    setProcessingId(request.id);
    try {
      // 1. Update Request
      await updateDoc(doc(dbInstance, "requests", request.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Update User Profile Status to rejected
      if (request.userId) {
        await updateDoc(doc(dbInstance, "users", request.userId), {
          idStatus: "rejected"
        });
      }
    } catch (error) {
      console.error("Error rejecting:", error);
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
                { label: "Contrat", value: (mergedData.contractType || mergedData.situation)?.toUpperCase(), icon: Briefcase, color: "text-purple-500" },
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
                              setSelectedRequest({ firstName: u.firstName, userId: u.id });
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
                        setSelectedRequest({ firstName: u.firstName, userId: u.id });
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
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <StatusBadge status={req.status} />
                                <span className="text-[10px] font-mono text-white/40">#{req.id.slice(-6).toUpperCase()}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                  {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-10">
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
                              <ActionButtons
                                req={req}
                                handleValidateAnalysis={handleValidateAnalysis}
                                handleValidateVerification={handleValidateVerification}
                                handleApprove={handleApprove}
                                handleReject={handleReject}
                                handleReset={handleReset}
                                setSelectedRequest={setSelectedRequest}
                                setSelectedDocs={setSelectedDocs}
                                setIsDocModalOpen={setIsDocModalOpen}
                                processingId={processingId}
                              />
                              <button
                                onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                                className="w-full py-2 text-[10px] font-black uppercase text-white/40 hover:text-ely-mint flex items-center justify-center gap-2 transition-colors border border-white/5 hover:border-white/20 rounded-lg hover:bg-white/5"
                              >
                                {expandedRequestId === req.id ? (
                                  <>Réduire les détails <ArrowLeft className="w-3 h-3 rotate-90" /></>
                                ) : (
                                  <>Voir les détails complets <ArrowLeft className="w-3 h-3 -rotate-90" /></>
                                )}
                              </button>
                            </div>
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
                                    <DetailRow label="Contrat" value={req.contractType?.toUpperCase() || 'N/A'} />
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
                        handleReject={handleReject}
                        handleReset={handleReset}
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
                        handleReject={handleReject}
                        handleReset={handleReset}
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
        const kycUsers = usersList.filter(u => u.kycDocuments || u.idStatus === 'pending_verification' || u.idStatus === 'partial_rejection');
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
                          <span className="text-[10px] font-bold">{u.kycDocuments ? Object.keys(u.kycDocuments).length : 0} fichiers</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRequest({ firstName: u.firstName, userId: u.id });
                          setSelectedDocs(u.kycDocuments);
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
      </main>

      {/* KYC Documents Modal */}
      {isDocModalOpen && selectedDocs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(selectedDocs).map(([key, docData]: [string, any]) => {
                  const url = typeof docData === 'string' ? docData : docData?.url;
                  const status = typeof docData === 'object' ? docData?.status : 'pending';
                  const rejectionReason = typeof docData === 'object' ? docData?.rejectionReason : null;

                  const getLabel = (k: string) => {
                    const lowKey = k.toLowerCase();
                    if (lowKey.includes('front')) return "Carte ID (Recto)";
                    if (lowKey.includes('back')) return "Carte ID (Verso)";
                    if (lowKey.includes('address') || lowKey.includes('proof')) return "Justificatif Domicile";
                    return k;
                  };

                  return (
                    <div key={key} className="space-y-4">
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
      )}
    </div>
  );
}
