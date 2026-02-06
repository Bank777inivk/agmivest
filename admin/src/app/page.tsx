"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Search, Bell, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, deleteDoc, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Use standard db instance
// Use standard db instance
const dbInstance = db;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Dossiers Prêts", icon: FileText },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "settings", label: "Configuration", icon: Settings },
];

// Helper Components
function StatCard({ label, value, trend, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", color)}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700"
  };

  const labels: any = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Refusé",
    processing: "En cours"
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", styles[status] || "bg-gray-100 text-gray-700")}>
      {labels[status] || status}
    </span>
  );
}

function IdentityStatusBadge({ status }: { status: string }) {
  const configs: any = {
    verified: { label: "Vérifié", color: "bg-emerald-100 text-emerald-700" },
    pending_verification: { label: "En cours", color: "bg-blue-100 text-blue-700" },
    verification_required: { label: "Requis", color: "bg-amber-100 text-amber-700" },
    rejected: { label: "Refusé", color: "bg-red-100 text-red-700" }
  };
  const config = configs[status] || { label: "Non initié", color: "bg-gray-100 text-gray-500" };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${config.color}`}>{config.label}</span>;
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
  setIsDocModalOpen
}: any) {
  return (
    <div className="flex items-center justify-end gap-2">
      {req.status !== "approved" && req.status !== "rejected" ? (
        <>
          {!req.stepAnalysis && (
            <button
              onClick={() => handleValidateAnalysis(req)}
              className="p-1 px-3 bg-blue-100 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-200 flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              Analyse
            </button>
          )}

          {!req.stepVerification && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleValidateVerification(req)}
                className="p-1 px-3 bg-purple-100 text-purple-700 rounded-md text-xs font-bold hover:bg-purple-200 flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                Docs
              </button>
              {req.kycDocuments && (
                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setSelectedDocs(req.kycDocuments);
                    setIsDocModalOpen(true);
                  }}
                  className="p-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200"
                >
                  <Search className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => handleApprove(req)}
            className="p-1 px-3 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold hover:bg-emerald-200 flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Accorder
          </button>

          <button
            onClick={() => handleReject(req)}
            className="p-1 px-3 bg-red-100 text-red-700 rounded-md text-xs font-bold hover:bg-red-200 flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            Refuser
          </button>
        </>
      ) : (
        <div className="flex items-center gap-1 pr-2">
          {req.status === "approved" && <span className="text-xs font-bold text-emerald-600">Traité</span>}
          {req.status === "rejected" && <span className="text-xs font-bold text-red-600">Refusé</span>}
        </div>
      )}
      <button
        onClick={() => handleReset(req)}
        className="p-1 px-3 bg-gray-100 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-200"
      >
        <RotateCcw className="w-3 h-3" />
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch extra user details (role)
        try {
          const userDoc = await getDoc(doc(dbInstance, "users", u.uid));
          if (userDoc.exists()) {
            setUser({ ...u, ...userDoc.data() });
          } else {
            setUser(u);
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
    if (!user) return;

    // 1. Snapshot Users
    const qUsers = query(collection(dbInstance, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(users);
      setStats(prev => ({ ...prev, totalUsers: users.length }));
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
        idStatus: linkedUser.idStatus,
        kycDocuments: linkedUser.kycDocuments
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
        remainingAmount: request.amount, // Full amount available/due
        rate: request.rate || 4.95,
        duration: request.duration,
        monthlyPayment: request.monthlyPayment,
        status: "active",
        startDate: serverTimestamp(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'), // +30 days mock
        createdAt: serverTimestamp()
      });

      // 3. Update User ID Status if needed
      await updateDoc(doc(dbInstance, "users", request.userId), {
        idStatus: "valid", // or verified
        hasActiveLoan: true
      });

      alert("Prêt accordé et compte rechargé avec succès !");

    } catch (error) {
      console.error("Error approving request:", error);
      alert("Erreur lors de l'approbation. Vérifiez vos permissions.");
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
      await updateDoc(doc(dbInstance, "requests", request.id), {
        stepVerification: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error validating verification:", error);
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

  const handleReject = async (request: any) => {
    if (!confirm("Refuser ce dossier ?")) return;
    try {
      await updateDoc(doc(dbInstance, "requests", request.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error rejecting:", error);
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

  const renderContent = () => {
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
              <StatCard label="En attente" value={stats.pending} trend="Action requise" color="bg-amber-100 text-amber-700" />
              <StatCard label="Approuvées" value={stats.approved} trend="Actifs" color="bg-emerald-100 text-emerald-700" />
              <StatCard label="Utilisateurs" value={stats.totalUsers} trend="Total" color="bg-purple-100 text-purple-700" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Demandes Récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrichedRequests.slice(0, 5).map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{req.firstName} {req.lastName}</p>
                          <p className="text-xs text-slate-500">{req.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.projectType}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(req.amount || 0)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
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
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "requests":
        return (
          <div className="space-y-8">
            <header>
              <h1 className="text-2xl font-bold text-slate-900">Dossiers de Prêts</h1>
              <p className="text-slate-500">Liste exhaustive de toutes les demandes de financement.</p>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Projet</th>
                    <th className="px-6 py-4">Détails Financiers</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrichedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{req.firstName} {req.lastName}</p>
                        <p className="text-xs text-slate-500">{req.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p>{req.projectType}</p>
                        <p className="text-[10px] text-slate-400">ID: {req.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-ely-blue">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(req.amount || 0)}</p>
                        <p className="text-xs text-slate-500">{req.duration} mois - {req.monthlyPayment}€/m</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
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
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Identité</th>
                    <th className="px-6 py-4">Dernière Connexion</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role || 'Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <IdentityStatusBadge status={u.idStatus} />
                        {u.kycDocuments && (
                          <button
                            onClick={() => {
                              setSelectedRequest({ firstName: u.firstName, userId: u.id });
                              setSelectedDocs(u.kycDocuments);
                              setIsDocModalOpen(true);
                            }}
                            className="ml-2 text-ely-blue hover:text-ely-mint underline text-[10px] font-bold"
                          >
                            Voir KYC
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {u.lastLogin?.seconds ? new Date(u.lastLogin.seconds * 1000).toLocaleDateString() : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-ely-blue transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      <aside className="w-64 bg-ely-blue text-white flex flex-col pt-8">
        <div className="px-6 mb-12">
          <img src="/logo-official.png" alt="AGM INVEST" className="h-12 bg-white p-1 rounded-lg object-contain" />
          <span className="text-xs font-bold tracking-tight uppercase block mt-2 opacity-80">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.id)}
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier, un client..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
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
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>

      {/* KYC Documents Modal */}
      {isDocModalOpen && selectedDocs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-ely-blue" />
                Documents de vérification : {selectedRequest?.firstName}
              </h3>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(selectedDocs).map(([key, url]: [string, any]) => (
                  <div key={key} className="space-y-3">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                      {key === 'id_front' ? "Carte ID (Recto)" :
                        key === 'id_back' ? "Carte ID (Verso)" :
                          key === 'address_proof' ? "Justificatif Domicile" : key}
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white"
                    >
                      <img
                        src={url}
                        alt={key}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-xl">
                          Ouvrir en grand
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex flex-col md:flex-row gap-4">
              <button
                onClick={() => handleResetKYC(selectedRequest)}
                className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Réinitialiser les documents
              </button>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

