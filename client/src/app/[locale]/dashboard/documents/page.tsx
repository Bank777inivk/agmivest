"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ShieldCheck, AlertCircle, FileSignature, FolderOpen, Lock } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { generateLoanContract, generateInsuranceCertificate, generatePrivacyPolicy } from "@/lib/pdfGenerator";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import { useTranslations } from "next-intl";

export default function DocumentsPage() {
    const t = useTranslations('Dashboard.Documents');
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
        <div className="space-y-10 pb-20 relative overflow-hidden">
            {/* Mobile Decorative Orbs */}
            <div className="absolute top-[-5%] right-[-15%] w-[70%] h-[30%] bg-ely-blue/10 rounded-full blur-[100px] pointer-events-none md:hidden" />
            <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[25%] bg-ely-mint/5 rounded-full blur-[80px] pointer-events-none md:hidden" />

            <header className="relative z-10 px-2">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-ely-blue">
                        <FolderOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">
                        {t('title')}
                    </h1>
                </div>
                <p className="text-slate-500 font-medium text-lg leading-tight max-w-2xl">
                    {t('subtitle')}
                </p>
            </header>

            {!hasDocuments ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-16 md:p-24 rounded-[3.5rem] shadow-sm border border-slate-100 text-center relative z-10 overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-slate-50 opacity-50 rounded-full group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
                            <FolderOpen className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('empty.title')}</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                            {t('empty.message')}
                        </p>
                    </div>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
                    {/* Contract Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <FileSignature className="w-48 h-48" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-ely-blue mb-8 ring-8 ring-blue-50/20 group-hover:scale-110 transition-transform duration-500">
                                <FileText className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">{t('contract.title')}</h3>
                            <p className="text-base font-medium text-slate-500 mb-10 flex-1 leading-relaxed">
                                {t('contract.description')}
                            </p>

                            <button
                                onClick={handleDownloadContract}
                                className="w-full py-5 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/10"
                            >
                                <Download className="w-5 h-5" />
                                {t('contract.button')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Insurance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                            <ShieldCheck className="w-48 h-48 text-emerald-600" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 ring-8 ring-emerald-50/20 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">{t('insurance.title')}</h3>
                            <p className="text-base font-medium text-slate-500 mb-10 flex-1 leading-relaxed">
                                {t('insurance.description')}
                            </p>

                            <button
                                onClick={handleDownloadInsurance}
                                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/10"
                            >
                                <Download className="w-5 h-5" />
                                {t('insurance.button')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Privacy Policy Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Lock className="w-48 h-48 text-slate-600" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-8 ring-8 ring-slate-50/20 group-hover:scale-110 transition-transform duration-500">
                                <Lock className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">{t('privacy.title')}</h3>
                            <p className="text-base font-medium text-slate-500 mb-10 flex-1 leading-relaxed">
                                {t('privacy.description')}
                            </p>

                            <button
                                onClick={handleDownloadPrivacy}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                            >
                                <Download className="w-5 h-5" />
                                {t('privacy.button')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Secure Info */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 lg:col-span-2 xl:col-span-3 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group/info"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-3xl group-hover/info:scale-150 transition-transform duration-700" />

                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 shrink-0">
                            <Lock className="w-7 h-7" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-1">{t('security.title')}</h4>
                            <p className="text-sm text-slate-500 italic font-medium">
                                {t('security.message')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
