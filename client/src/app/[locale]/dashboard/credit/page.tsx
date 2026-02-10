"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import DesktopCreditRequest from "@/components/dashboard/Credit/DesktopCreditRequest";
import MobileCreditRequest from "@/components/dashboard/Credit/MobileCreditRequest";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import { TrendingUp, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Validation logic and score calculation (Mock)
const calculateScore = (data: any, projectData: any) => {
    const income = parseFloat(data.income) || 0;
    const charges = (parseFloat(data.charges) || 0);
    const requestedAmount = parseFloat(projectData.amount) || 0;
    const duration = parseFloat(projectData.duration) || 12;

    // Theoretical monthly payment (approximate)
    const monthlyPayment = requestedAmount / duration;
    const totalNewCharges = charges + monthlyPayment;
    const debtRatio = income > 0 ? (totalNewCharges / income) * 100 : 100;

    let score = 0;
    let status = "Review";

    if (debtRatio < 33) {
        score = 85 + Math.random() * 10;
        status = "Approved";
    } else if (debtRatio < 45) {
        score = 65 + Math.random() * 15;
        status = "Review";
    } else {
        score = 20 + Math.random() * 20;
        status = "Rejected";
    }

    return { score: Math.round(score), status, debtRatio: Math.round(debtRatio) };
};

export default function CreditRequestPage() {
    const t = useTranslations('CreditRequest');
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingActive, setIsCheckingActive] = useState(true);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [activeLoanData, setActiveLoanData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Form State
    const [amount, setAmount] = useState(50000);
    const [duration, setDuration] = useState(60);
    const [annualRate, setAnnualRate] = useState(3.45);
    const [projectType, setProjectType] = useState("personal");
    const [projectDescription, setProjectDescription] = useState("");
    const [profileType, setProfileType] = useState<"particulier" | "pro">("particulier");

    const [formData, setFormData] = useState({
        civility: "M.",
        firstName: "",
        lastName: "",
        birthDate: "",
        birthPlace: "",
        nationality: "Française",
        maritalStatus: "single",
        children: "0",
        housingType: "tenant",
        housingSeniority: "",
        address: "",
        zipCode: "",
        city: "",
        income: "",
        charges: "",
        contractType: "cdi",
        profession: "",
        companyName: "",
        bankName: ""
    });

    useEffect(() => {
        setIsMounted(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // Fetch user data to pre-fill form
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFormData(prev => ({
                            ...prev,
                            firstName: userData.firstName || "",
                            lastName: userData.lastName || "",
                            city: userData.city || "",
                            address: userData.address || ""
                        }));
                    }

                    // Check for active loan request
                    const q = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid),
                        orderBy("createdAt", "desc"),
                        limit(1)
                    );

                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const requestData = querySnapshot.docs[0].data();
                        // Basic logic: if request is not rejected, it's considered "active" for new requests
                        if (requestData.status !== "rejected") {
                            setHasActiveRequest(true);
                            setActiveLoanData(requestData);
                        }
                    }
                } else {
                    router.push("/login");
                }
            } catch (error: any) {
                console.error("Firestore error in useEffect:", error);
                // Handle permission-denied or other errors gracefully
                if (error.code === 'permission-denied') {
                    // Maybe the rules for 'requests' are strict or index missing
                }
            } finally {
                setIsCheckingActive(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const isApproved = activeLoanData?.status === "approved";
    const isRejected = activeLoanData?.status === "rejected";

    const monthlyRate = annualRate / 100 / 12;
    const totalMonthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration)) + (amount * 0.00035);
    const totalCost = (totalMonthlyPayment * duration) - amount;

    const handleSubmit = async () => {
        if (!auth.currentUser) return;
        setIsSubmitting(true);

        try {
            const { score, status, debtRatio } = calculateScore(formData, { amount, duration });

            const requestData = {
                userId: auth.currentUser.uid,
                ...formData,
                amount,
                duration,
                annualRate,
                projectType,
                projectDescription,
                profileType,
                monthlyPayment: Math.round(totalMonthlyPayment),
                totalCost: Math.round(totalCost),
                score,
                status: status.toLowerCase(),
                debtRatio,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "requests"), requestData);
            setStep(6);
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Une erreur est survenue lors de la soumission. Veuillez vérifier vos permissions.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isMounted || isCheckingActive) {
        return <PremiumSpinner />;
    }

    if (hasActiveRequest) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-ely-blue to-blue-800 p-6 md:p-20 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl shadow-blue-900/40 border border-white/10 space-y-8 md:space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.05] pointer-events-none text-white">
                        {isApproved ? <TrendingUp className="w-32 h-32 md:w-64 md:h-64" /> : <Lock className="w-32 h-32 md:w-64 md:h-64" />}
                    </div>

                    <div className={cn(
                        "relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-8",
                        isApproved ? "bg-ely-mint/10 text-ely-mint ring-ely-mint/5" : "bg-white/10 text-white ring-white/5"
                    )}>
                        {isApproved ? <TrendingUp className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
                    </div>

                    <div className="relative z-10 space-y-6">
                        {isRejected ? (
                            <>
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-tight">
                                    Je vous informe que :
                                </h2>
                                <p className="text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
                                    Votre demande de financement a été refusée par nos services après étude de votre dossier.
                                    <br /><br />
                                    <span className="text-white/40 text-lg italic uppercase tracking-tighter">
                                        Pour plus de détails ou pour échanger avec un conseiller, veuillez contacter notre support.
                                    </span>
                                </p>
                            </>
                        ) : isApproved ? (
                            <>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                    Félicitations ! <br />
                                    <span className="text-ely-mint">C'est le Jackpot.</span>
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                                        Profitez de votre emprunt de <span className="text-white font-black">{activeLoanData?.amount?.toLocaleString()} €</span> pour gérer vos projets.
                                    </p>
                                    <div className="inline-block bg-white/10 py-3 px-6 rounded-2xl text-sm border border-white/10 text-white/70 max-w-lg mx-auto leading-relaxed">
                                        Actuellement, vous n'êtes plus éligible pour faire une demande de prêt car vous en avez déjà une en cours de remboursement.
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase">Je vous informe que :</h2>
                                <p className="text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
                                    Vous avez déjà une demande de financement en cours de traitement.
                                    <br /><br />
                                    <span className="text-white/40 text-lg italic">Par mesure de sécurité et de qualité d'étude, nous ne permettons qu'un seul dossier actif à la fois.</span>
                                </p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10 pt-6 flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => router.push("/dashboard/requests")}
                            className="px-10 py-5 bg-white text-ely-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-white/10 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                        >
                            Suivre mon dossier
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                        >
                            Tableau de bord
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const commonProps = {
        t,
        step,
        setStep,
        isSubmitting,
        amount,
        setAmount,
        duration,
        setDuration,
        annualRate,
        setAnnualRate,
        projectType,
        setProjectType,
        projectDescription,
        setProjectDescription,
        profileType,
        setProfileType,
        formData,
        handleChange,
        handleSubmit,
        totalMonthlyPayment,
        totalCost,
    };

    return (
        <div className="w-full min-h-screen">
            {/* Success Step (handled locally) */}
            {step === 6 ? (
                <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-ely-blue/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[35%] bg-ely-mint/5 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        key="step-success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg text-center bg-gradient-to-br from-ely-blue to-blue-700 backdrop-blur-2xl p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-blue-900/30 border border-white/10 space-y-10 relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-24 h-24 bg-gradient-to-br from-ely-mint to-emerald-400 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-ely-mint/30"
                        >
                            <CheckCircle2 className="w-12 h-12" />
                        </motion.div>
                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-tight">{t('Result.analysisTitle')}</h2>
                            <p className="text-white/80 font-medium text-lg max-w-lg mx-auto leading-relaxed">
                                {t('Result.analysisMessage')}
                            </p>
                        </div>
                        <div className="pt-8 flex flex-col md:flex-row justify-center gap-4">
                            <button
                                onClick={() => router.push("/dashboard/requests")}
                                className="px-10 py-5 bg-white text-ely-blue rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-white/5 hover:scale-[1.05] transition-all"
                            >
                                {t('Common.trackRecord') || "Suivre mon dossier"}
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-10 py-5 bg-white/5 text-white/70 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                            >
                                {t('Common.restart') || "Recommencer"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DesktopCreditRequest {...commonProps} />
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden">
                        <MobileCreditRequest {...commonProps} />
                    </div>
                </>
            )
            }
        </div >
    );
}
