"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ShieldCheck, AlertCircle, FileSignature, FolderOpen, Lock } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { generateLoanContract, generateInsuranceCertificate, generatePrivacyPolicy } from "@/lib/pdfGenerator";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";

export default function DocumentsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [loanAccount, setLoanAccount] = useState<any>(null);
    const [activeRequest, setActiveRequest] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // 1. User Profile
                    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
                    if (userSnap.exists()) {
                        setUser({ uid: currentUser.uid, ...userSnap.data() });
                    }

                    // 2. Active Account?
                    const qAccount = query(
                        collection(db, "accounts"),
                        where("userId", "==", currentUser.uid),
                        limit(1)
                    );
                    const accountSnap = await getDocs(qAccount);
                    if (!accountSnap.empty) {
                        const data = accountSnap.docs[0].data();
                        // Format formatting for PDF
                        const rawDate = data.startDate || data.createdAt;
                        const startDate = rawDate?.seconds ? new Date(rawDate.seconds * 1000) : new Date();

                        setLoanAccount({
                            id: accountSnap.docs[0].id,
                            ...data,
                            startDateFormatted: startDate.toLocaleDateString('fr-FR'),
                            monthlyPayment: data.monthlyPayment || 0 // Ensure existed
                        });
                    }

                    // 3. Approved Request? (If no active account yet)
                    if (accountSnap.empty) {
                        const qRequest = query(
                            collection(db, "requests"),
                            where("userId", "==", currentUser.uid),
                            where("status", "==", "approved"),
                            limit(1)
                        );
                        const requestSnap = await getDocs(qRequest);
                        if (!requestSnap.empty) {
                            const reqData = requestSnap.docs[0].data();
                            setActiveRequest({
                                id: requestSnap.docs[0].id,
                                ...reqData,
                                startDateFormatted: new Date().toLocaleDateString('fr-FR') // Hypothetical start
                            });
                        }
                    }

                } catch (error) {
                    console.error("Error fetching documents data:", error);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDownloadContract = () => {
        const data = loanAccount || activeRequest;
        if (data && user) {
            generateLoanContract(user, data);
        }
    };

    const handleDownloadInsurance = () => {
        const data = loanAccount || activeRequest;
        if (data && user) {
            generateInsuranceCertificate(user, data);
        }
    };

    const handleDownloadPrivacy = () => {
        if (user) {
            generatePrivacyPolicy(user);
        }
    };

    if (isLoading) return <PremiumSpinner />;

    const hasDocuments = loanAccount || activeRequest;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FolderOpen className="text-ely-blue" />
                    Mes Documents
                </h1>
                <p className="text-gray-500">
                    Consultez et téléchargez vos documents contractuels et attestations.
                </p>
            </header>

            {!hasDocuments ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun document disponible</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Vos documents seront disponibles une fois votre demande de financement validée par nos services.
                    </p>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Contract Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <FileSignature className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-ely-blue/10 rounded-2xl flex items-center justify-center text-ely-blue mb-6">
                                <FileText className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Contrat de Prêt</h3>
                            <p className="text-sm text-gray-500 mb-8 flex-1">
                                Votre contrat de crédit détaillé incluant l'échéancier prévisionnel, les conditions générales et les mentions légales obligatoires.
                            </p>

                            <button
                                onClick={handleDownloadContract}
                                className="w-full py-4 bg-ely-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-ely-blue/20"
                            >
                                <Download className="w-5 h-5" />
                                Télécharger le PDF
                            </button>
                        </div>
                    </motion.div>

                    {/* Insurance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-32 h-32 text-emerald-600" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Attestation d'Assurance</h3>
                            <p className="text-sm text-gray-500 mb-8 flex-1">
                                Certificat d'adhésion à l'assurance emprunteur AGM INVEST (Décès, PTIA, ITT) couvrant votre financement à 100%.
                            </p>

                            <button
                                onClick={handleDownloadInsurance}
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Download className="w-5 h-5" />
                                Télécharger le certificat
                            </button>
                        </div>
                    </motion.div>

                    {/* Privacy Policy Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden md:col-span-2 lg:col-span-1"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Lock className="w-32 h-32 text-slate-600" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                                <Lock className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Politique de Confidentialité (RGPD)</h3>
                            <p className="text-sm text-gray-500 mb-8 flex-1">
                                Document officiel détaillant nos engagements sur la protection de vos données personnelles et vos droits.
                            </p>

                            <button
                                onClick={handleDownloadPrivacy}
                                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-95 transition-all shadow-lg shadow-slate-500/20"
                            >
                                <Download className="w-5 h-5" />
                                Télécharger le document
                            </button>
                        </div>
                    </motion.div>

                    {/* Secure Info */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4"
                    >
                        <Lock className="w-6 h-6 text-slate-400 mt-1" />
                        <div>
                            <h4 className="font-bold text-slate-700 text-sm">Documents Certifiés</h4>
                            <p className="text-xs text-slate-500 mt-1">
                                Tous les documents générés depuis cet espace sont protégés électroniquement et certifiés conformes par AGM INVEST. Ils ont valeur légale pour vos démarches administratives.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
