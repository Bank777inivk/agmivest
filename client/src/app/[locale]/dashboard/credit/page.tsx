"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { auth, db, isFirebaseError } from "@/lib/firebase";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import DesktopCreditRequest from "@/components/dashboard/Credit/DesktopCreditRequest";
import MobileCreditRequest from "@/components/dashboard/Credit/MobileCreditRequest";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";
import { TrendingUp, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { createNotification } from "@/hooks/useNotifications";
import { COUNTRIES, COUNTRY_TO_NATIONALITY, COUNTRY_PHONE_DATA } from "@/lib/constants";

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
    const locale = useLocale();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingActive, setIsCheckingActive] = useState(true);
    const [hasActiveRequest, setHasActiveRequest] = useState(false);
    const [activeLoanData, setActiveLoanData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [readOnlyFields, setReadOnlyFields] = useState<Set<string>>(new Set());

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
        birthCountry: "France",
        maritalStatus: "single",
        children: "0",
        housingType: "tenant",
        housingSeniority: "",
        housingSeniorityMonths: "0",
        residenceCountry: "France",
        phoneCountry: "France",
        phone: "",
        address: "",
        street: "",
        zipCode: "",
        city: "",
        income: "",
        charges: "",
        contractType: "cdi",
        profession: "",
        companyName: "",
        otherCredits: "0",
        bankName: "",
        iban: "",
        bic: "",
        ribEmail: ""
    });

    useEffect(() => {
        setIsMounted(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // Fetch user data to pre-fill form
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};
                    const newReadOnlyFields = new Set<string>();

                    // Fields to pre-fill from Firestore
                    const fieldsToPreFill = [
                        'civility', 'firstName', 'lastName', 'birthDate', 'birthPlace',
                        'birthCountry', 'nationality', 'maritalStatus', 'children',
                        'housingType', 'housingSeniority', 'housingSeniorityMonths',
                        'residenceCountry', 'phoneCountry', 'phone', 'address', 'street',
                        'zipCode', 'city', 'income', 'charges', 'otherCredits',
                        'contractType', 'profession', 'companyName', 'bankName',
                        'iban', 'bic', 'ribEmail'
                    ];

                    // Fields that should be locked if pre-filled (Identity & Address)
                    const fieldsToLock = [
                        'civility', 'firstName', 'lastName', 'birthDate', 'birthPlace',
                        'birthCountry', 'nationality', 'residenceCountry', 'phone',
                        'address', 'street', 'zipCode', 'city'
                    ];

                    setFormData(prev => {
                        const updated = { ...prev };
                        fieldsToPreFill.forEach(field => {
                            const value = (field === 'residenceCountry' && !userData[field] && userData['country'])
                                ? userData['country']
                                : userData[field];

                            if (value !== undefined && value !== "") {
                                updated[field as keyof typeof prev] = value;

                                // Only add to read-only if it's in the locking list
                                if (fieldsToLock.includes(field)) {
                                    newReadOnlyFields.add(field);
                                }
                            }
                        });
                        // Special case for street mapping from address if street is missing
                        if (!userData.street && userData.address) {
                            updated.street = userData.address;
                        }
                        return updated;
                    });
                    setReadOnlyFields(newReadOnlyFields);

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

                        // Pre-fill from the last request if data is missing
                        setFormData(prev => ({
                            ...prev,
                            civility: userData.civility || requestData.civility || prev.civility,
                            firstName: userData.firstName || requestData.firstName || prev.firstName,
                            lastName: userData.lastName || requestData.lastName || prev.lastName,
                            birthDate: userData.birthDate || requestData.birthDate || prev.birthDate,
                            birthPlace: userData.birthPlace || requestData.birthPlace || prev.birthPlace,
                            birthCountry: userData.birthCountry || requestData.birthCountry || prev.birthCountry,
                            nationality: userData.nationality || requestData.nationality || prev.nationality,
                            maritalStatus: userData.maritalStatus || requestData.maritalStatus || prev.maritalStatus,
                            children: userData.children || requestData.children || prev.children,
                            housingType: userData.housingType || requestData.housingType || prev.housingType,
                            housingSeniority: userData.housingSeniority || requestData.housingSeniority || prev.housingSeniority,
                            housingSeniorityMonths: userData.housingSeniorityMonths || requestData.housingSeniorityMonths || prev.housingSeniorityMonths,
                            residenceCountry: userData.residenceCountry || userData.country || requestData.residenceCountry || requestData.country || prev.residenceCountry,
                            phoneCountry: userData.phoneCountry || requestData.phoneCountry || prev.phoneCountry,
                            phone: userData.phone || requestData.phone || prev.phone,
                            address: userData.address || requestData.address || prev.address,
                            street: userData.street || userData.address || requestData.street || requestData.address || prev.street,
                            zipCode: userData.zipCode || requestData.zipCode || prev.zipCode,
                            city: userData.city || requestData.city || prev.city,
                            income: userData.income || requestData.income || prev.income,
                            charges: userData.charges || requestData.charges || prev.charges,
                            contractType: userData.contractType || requestData.contractType || prev.contractType,
                            profession: userData.profession || requestData.profession || prev.profession,
                            companyName: userData.companyName || requestData.companyName || prev.companyName,
                            bankName: userData.bankName || requestData.bankName || prev.bankName
                        }));

                        // Also lock fields pre-filled from request history if they are in security list
                        const updatedReadOnly = new Set(newReadOnlyFields);
                        fieldsToLock.forEach(field => {
                            const userValue = (field === 'residenceCountry' && !userData[field] && userData['country']) ? userData['country'] : userData[field];
                            const requestValue = (field === 'residenceCountry' && !requestData[field] && requestData['country']) ? requestData['country'] : requestData[field];

                            if ((userValue !== undefined && userValue !== "") ||
                                (requestValue !== undefined && requestValue !== "")) {
                                updatedReadOnly.add(field);
                            }
                        });
                        // Specific check for street mapping
                        if ((!userData.street && userData.address) || (!requestData.street && requestData.address)) {
                            updatedReadOnly.add('street');
                        }
                        setReadOnlyFields(updatedReadOnly);

                        setHasActiveRequest(true);
                        setActiveLoanData(requestData);
                    }
                } else {
                    router.push("/login");
                }
            } catch (error: unknown) {
                console.error("Firestore error in useEffect:", error);
                // Handle permission-denied or other errors gracefully
                if (isFirebaseError(error) && error.code === 'permission-denied') {
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
    const totalMonthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration)) + ((amount * 0.03) / duration);
    const totalCost = (totalMonthlyPayment * duration) - amount;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const num = parseFloat(value);

        if (name === "amount") {
            if (num < 2000) setAmount(2000);
            if (num > 1000000) setAmount(1000000);
        } else if (name === "duration") {
            if (num < 6) setDuration(6);
            if (num > 360) setDuration(360);
        } else if (name === "annualRate") {
            if (num < 0.5) setAnnualRate(0.5);
            if (num > 15) setAnnualRate(15);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);

        let formatted = "";
        if (value.length > 0) formatted += value.slice(0, 2);
        if (value.length > 2) formatted += " / " + value.slice(2, 4);
        if (value.length > 4) formatted += " / " + value.slice(4, 8);

        setFormData(prev => ({ ...prev, birthDate: formatted }));
    };

    const getDateStatus = (dateStr: string) => {
        const cleaned = dateStr.replace(/\s\/\s/g, "");
        if (cleaned.length !== 8) return "invalid";

        const day = parseInt(cleaned.slice(0, 2));
        const month = parseInt(cleaned.slice(2, 4)) - 1;
        const year = parseInt(cleaned.slice(4, 8));

        const date = new Date(year, month, day);
        if (isNaN(date.getTime()) || date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
            return "invalid";
        }

        const now = new Date();
        const age = now.getFullYear() - year - (now.getMonth() < month || (now.getMonth() === month && now.getDate() < day) ? 1 : 0);
        if (age < 18) return "underage";

        return "valid";
    };

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
                status: "pending",
                scoringStatus: status,
                debtRatio,
                language: locale,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "requests"), requestData);

            // Send Loan Submitted Email
            try {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                const userData = userDoc.data();

                await fetch("/api/email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: auth.currentUser.email,
                        template: "loan-submitted",
                        language: locale,
                        apiKey: process.env.NEXT_PUBLIC_EMAIL_API_KEY || "agm-invest-email-2024",
                        data: {
                            firstName: userData?.firstName || auth.currentUser.displayName || "",
                            amount: amount,
                            duration: duration
                        }
                    })
                });
            } catch (emailErr) {
                console.error("Failed to send loan submitted email:", emailErr);
            }

            // Create notification for user
            await createNotification(auth.currentUser.uid, {
                title: 'requestSubmitted.title',
                message: 'requestSubmitted.message',
                params: { amount: amount.toLocaleString() },
                type: 'success',
                link: '/dashboard/requests'
            });

            // Also update user profile with latest info
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                ...formData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setStep(6);
        } catch (error) {
            console.error("Error submitting request:", error);
            alert(t('Notifications.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = value;

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };

            // Sync birthCountry with nationality
            if (name === "birthCountry") {
                updated.nationality = COUNTRY_TO_NATIONALITY[value] || prev.nationality;
            }

            // Mutual exclusivity for housing seniority
            if (name === "housingSeniority" && value !== "" && parseInt(value) > 0) {
                updated.housingSeniorityMonths = "0";
            }
            if (name === "housingSeniorityMonths" && value !== "" && parseInt(value) > 0) {
                updated.housingSeniority = "0";
            }

            return updated;
        });
    };

    if (!isMounted || isCheckingActive) {
        return <PremiumSpinner />;
    }

    if (hasActiveRequest) {
        return (
            <div className="min-h-[calc(100vh-80px)] md:min-h-screen bg-[#F8FAFC] md:bg-transparent flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
                {/* Mobile Decorative Orbs (Mirroring simulator) */}
                <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-ely-blue/10 rounded-full blur-[120px] pointer-events-none md:hidden" />
                <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[35%] bg-ely-mint/5 rounded-full blur-[100px] pointer-events-none md:hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full max-w-4xl bg-gradient-to-br from-ely-blue to-blue-800 p-8 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-blue-900/40 border border-white/10 space-y-10 md:space-y-12 relative overflow-hidden z-10"
                >
                    <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.05] pointer-events-none text-white">
                        {isApproved ? <TrendingUp className="w-48 h-48 md:w-64 md:h-64" /> : <Lock className="w-48 h-48 md:w-64 md:h-64" />}
                    </div>

                    <div className={cn(
                        "relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto ring-8",
                        isApproved ? "bg-ely-mint/10 text-ely-mint ring-ely-mint/5" : "bg-white/10 text-white ring-white/5"
                    )}>
                        {isApproved ? <TrendingUp className="w-10 h-10 md:w-12 md:h-12" /> : <Lock className="w-10 h-10 md:w-12 md:h-12" />}
                    </div>

                    <div className="relative z-10 space-y-6 text-center">
                        {isRejected ? (
                            <>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                                    {t('Banners.Rejected.title')}
                                </h2>
                                <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
                                    {t('Banners.Rejected.message')}
                                    <br /><br />
                                    <span className="text-white/40 text-base md:text-lg italic uppercase tracking-tighter">
                                        {t('Banners.Rejected.extra')}
                                    </span>
                                </p>
                            </>
                        ) : isApproved ? (
                            <>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                    {t('Banners.Approved.title')} <br />
                                    <span className="text-ely-mint">{t('Banners.Approved.subtitle')}</span>
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                                        {t('Banners.Approved.message', { amount: activeLoanData?.amount?.toLocaleString() })}
                                    </p>
                                    <div className="inline-block bg-white/10 py-3 px-6 rounded-2xl text-xs md:text-sm border border-white/10 text-white/70 max-w-lg mx-auto leading-relaxed">
                                        {t('Banners.Approved.warning')}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">{t('Banners.Pending.title')}</h2>
                                <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
                                    {t('Banners.Pending.message')}
                                    <br /><br />
                                    <span className="text-white/40 text-base md:text-lg italic">{t('Banners.Pending.warning')}</span>
                                </p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10 pt-6 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => router.push("/dashboard/requests")}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-ely-blue rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            {t('Common.trackRecord')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                        >
                            {t('Result.dashboardButton')}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const canGoNext = () => {
        if (step === 2) {
            return (
                formData.firstName.trim() !== "" &&
                formData.lastName.trim() !== "" &&
                formData.birthPlace.trim() !== "" &&
                formData.nationality.trim() !== "" &&
                getDateStatus(formData.birthDate) === "valid"
            );
        }
        if (step === 3) {
            return (
                formData.housingSeniority.toString().trim() !== "" &&
                formData.phone.trim() !== "" &&
                formData.street.trim() !== "" &&
                formData.zipCode.trim() !== "" &&
                formData.city.trim() !== ""
            );
        }
        if (step === 4) {
            const isUnemployed = formData.contractType === 'unemployed';
            const isRetired = formData.contractType === 'retired';

            return (
                (isUnemployed || formData.profession.trim() !== "") &&
                (isUnemployed || isRetired || formData.companyName.trim() !== "") &&
                formData.income.toString().trim() !== "" &&
                formData.charges.toString().trim() !== "" &&
                formData.bankName.trim() !== "" &&
                formData.iban.trim() !== "" &&
                formData.bic.trim() !== "" &&
                formData.ribEmail.trim() !== ""
            );
        }
        return true;
    };

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
        handleBlur,
        handleDateChange,
        getDateStatus,
        canGoNext,
        readOnlyFields
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
