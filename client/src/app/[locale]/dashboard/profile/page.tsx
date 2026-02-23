"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Globe, Edit2, Edit3, Save, X, Briefcase, Euro, Home, Heart, Baby, CheckCircle, ArrowLeft } from "lucide-react";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { COUNTRY_PHONE_DATA, COUNTRIES } from "@/lib/constants";

export default function ProfilePage() {
    const t = useTranslations('Dashboard.Profile');
    const tSituation = useTranslations('CreditRequest.Situation');
    const tFinances = useTranslations('CreditRequest.Finances');
    const tIdentity = useTranslations('CreditRequest.Identity');

    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                let finalData: any = {};

                if (userSnap.exists()) {
                    finalData = userSnap.data();
                }

                // Normalisation initiale
                let normalized = {
                    ...finalData,
                    country: finalData.country || "France",
                    phoneCountry: finalData.phoneCountry || finalData.country || "France",
                    street: finalData.street || finalData.address || "",
                    birthCountry: finalData.birthCountry || "France",
                    income: finalData.income || finalData.monthlyIncome || 0,
                    charges: finalData.charges || finalData.monthlyExpenses || 0,
                    otherCredits: finalData.otherCredits || finalData.otherLoans || 0
                };

                // Si les données financières sont à 0, on cherche dans la dernière demande de prêt
                if (normalized.income === 0 && normalized.charges === 0) {
                    try {
                        const q = query(
                            collection(db, "requests"),
                            where("userId", "==", user.uid),
                            orderBy("createdAt", "desc"),
                            limit(1)
                        );
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const latestRequest = querySnapshot.docs[0].data();
                            normalized = {
                                ...normalized,
                                income: latestRequest.monthlyIncome || latestRequest.income || 0,
                                charges: latestRequest.monthlyExpenses || latestRequest.charges || 0,
                                otherCredits: latestRequest.otherLoans || latestRequest.otherCredits || 0,
                                profession: latestRequest.profession || normalized.profession,
                                companyName: latestRequest.companyName || normalized.companyName,
                                street: latestRequest.street || latestRequest.address || normalized.street,
                                birthCountry: latestRequest.birthCountry || normalized.birthCountry,
                                contractType: latestRequest.contractType || latestRequest.situation || normalized.contractType
                            };
                        }
                    } catch (err) {
                        console.error("Error fetching latest request as fallback:", err);
                    }
                }

                setUserData(normalized);
                setFormData(normalized);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let val = value;

        // Restrict phone to digits and spaces, with dynamic max digit limit and generic auto-format
        if (name === "phone") {
            let digits = val.replace(/\D/g, "");
            const country = COUNTRY_PHONE_DATA[formData.phoneCountry];
            const limit = country?.maxLength || 15;
            if (digits.length > limit) digits = digits.slice(0, limit);

            if (country && country.grouping) {
                let formatted = "";
                let currentPos = 0;
                for (let groupSize of country.grouping) {
                    if (currentPos >= digits.length) break;
                    let group = digits.slice(currentPos, currentPos + groupSize);
                    formatted += (formatted ? " " : "") + group;
                    currentPos += groupSize;
                }
                val = formatted;
            } else {
                val = digits;
            }
        }

        setFormData((prev: any) => {
            const newData = { ...prev, [name]: val };

            if (name === "country" && COUNTRY_PHONE_DATA[value]) {
                newData.phoneCountry = value;
            }

            // Exclusivité stricte Ans / Mois
            if (name === "housingSeniority" && value !== "" && parseInt(value) > 0) {
                newData.housingSeniorityMonths = "0";
            }
            if (name === "housingSeniorityMonths" && value !== "" && parseInt(value) > 0) {
                newData.housingSeniority = "0";
            }

            return newData;
        });
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);

            const cleanedData = { ...formData };
            if (cleanedData.children) cleanedData.children = parseInt(cleanedData.children) || 0;
            if (cleanedData.housingSeniority) cleanedData.housingSeniority = parseInt(cleanedData.housingSeniority) || 0;
            if (cleanedData.income) cleanedData.income = parseFloat(cleanedData.income) || 0;
            if (cleanedData.charges) cleanedData.charges = parseFloat(cleanedData.charges) || 0;
            if (cleanedData.otherCredits) cleanedData.otherCredits = parseFloat(cleanedData.otherCredits) || 0;

            await updateDoc(userRef, cleanedData);
            setUserData(cleanedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-10 pb-20 relative overflow-hidden">
            {/* Mobile Decorative Orbs */}
            <div className="absolute top-[-5%] right-[-15%] w-[70%] h-[30%] bg-ely-blue/10 rounded-full blur-[100px] pointer-events-none md:hidden" />
            <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[25%] bg-ely-mint/5 rounded-full blur-[80px] pointer-events-none md:hidden" />

            <header className="relative z-10 px-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 font-medium text-lg mt-2 leading-tight">
                        {t('subtitle')}
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-ely-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/10"
                    >
                        <Edit2 className="w-5 h-5" />
                        {t('editButton')}
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                            {t('cancelButton')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {t('saveButton')}
                        </button>
                    </div>
                )}
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
            >
                {/* État Civil */}
                <motion.section variants={item} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                        <User className="w-48 h-48" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50/50 rounded-2xl flex items-center justify-center text-ely-blue ring-8 ring-blue-50/20">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('sections.identity')}</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 hover:bg-slate-50 text-slate-300 hover:text-ely-blue rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('civility')}</label>
                                {isEditing ? (
                                    <select
                                        name="civility"
                                        value={formData.civility}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-bold text-slate-900"
                                    >
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                        <option value="Mlle">Mlle</option>
                                    </select>
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.civility}</p>
                                )}
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('firstName')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-bold text-slate-900"
                                    />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.firstName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('lastName')}</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900 uppercase"
                                />
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 uppercase">{userData?.lastName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('birthDate')}</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-bold text-slate-900"
                                    />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.birthDate}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('birthPlace')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-bold text-slate-900"
                                    />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.birthPlace}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tIdentity('birthCountry')}</label>
                            {isEditing ? (
                                <select
                                    name="birthCountry"
                                    value={formData.birthCountry}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-bold text-slate-900"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.birthCountry || 'France'}</p>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Coordonnées */}
                <motion.section variants={item} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group/coord">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/coord:scale-110 group-hover/coord:-rotate-6 transition-all duration-700 pointer-events-none">
                        <MapPin className="w-48 h-48" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50/20">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('sections.contact')}</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 hover:bg-slate-50 text-slate-300 hover:text-ely-blue rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fields.address')}</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900"
                                />
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.street || '-'}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fields.zipCode')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900"
                                    />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 font-mono italic">{userData?.zipCode}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fields.city')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900"
                                    />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.city}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fields.country')}</label>
                            {isEditing ? (
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.country || 'France'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fields.phone')}</label>
                            {isEditing ? (
                                <div className="flex gap-3 relative group/tel">
                                    <div className="w-20 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-2xl shadow-sm" title={formData.phoneCountry}>
                                        {COUNTRY_PHONE_DATA[formData.phoneCountry]?.flag || "🏳️"}
                                    </div>
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-black text-sm pt-0.5">
                                            {COUNTRY_PHONE_DATA[formData.phoneCountry]?.code}
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-16 pr-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900"
                                            placeholder={COUNTRY_PHONE_DATA[formData.phoneCountry]?.placeholder}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 px-5 py-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <span className="text-2xl filter drop-shadow-sm">{COUNTRY_PHONE_DATA[userData?.phoneCountry || "France"]?.flag}</span>
                                    <p className="font-black text-slate-900 font-mono">
                                        {COUNTRY_PHONE_DATA[userData?.phoneCountry || "France"]?.code} {userData?.phone}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Situation Personnelle */}
                <motion.section variants={item} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group/perso">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/perso:scale-110 group-hover/perso:rotate-12 transition-all duration-700 pointer-events-none">
                        <Heart className="w-48 h-48" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50/50 rounded-2xl flex items-center justify-center text-rose-500 ring-8 ring-rose-50/20">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('sections.personal')}</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 hover:bg-slate-50 text-slate-300 hover:text-ely-blue rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tSituation('maritalStatus')}</label>
                            {isEditing ? (
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900">
                                    <option value="single">{tSituation('options.single')}</option>
                                    <option value="married">{tSituation('options.married')}</option>
                                    <option value="divorced">{tSituation('options.divorced')}</option>
                                </select>
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{tSituation(`options.${userData?.maritalStatus || 'single'}`)}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tSituation('children')}</label>
                            {isEditing ? (
                                <input type="number" name="children" value={formData.children} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.children || 0}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tSituation('housingType')}</label>
                                {isEditing ? (
                                    <select name="housingType" value={formData.housingType} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900">
                                        <option value="tenant">{tSituation('options.tenant')}</option>
                                        <option value="owner">{tSituation('options.owner')}</option>
                                        <option value="hosted">{tSituation('options.hosted')}</option>
                                    </select>
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{tSituation(`options.${userData?.housingType || 'tenant'}`)}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tSituation('housingSeniority')}</label>
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <input type="number" name="housingSeniority" value={formData.housingSeniority} onChange={handleChange} className="w-full pl-5 pr-9 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{tSituation('seniorityYears')}</span>
                                        </div>
                                        <div className="relative">
                                            <input type="number" name="housingSeniorityMonths" value={formData.housingSeniorityMonths} onChange={handleChange} className="w-full pl-5 pr-9 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" min="0" max="11" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{tSituation('seniorityMonths')}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 text-sm">
                                        {userData?.housingSeniority || 0} {tSituation('seniorityYears').toLowerCase()}, {userData?.housingSeniorityMonths || 0} {tSituation('seniorityMonths').toLowerCase()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Situation Professionnelle */}
                <motion.section variants={item} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group/pro">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/pro:scale-110 group-hover/pro:-rotate-12 transition-all duration-700 pointer-events-none">
                        <Briefcase className="w-48 h-48" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-indigo-500 ring-8 ring-indigo-50/20">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('sections.professional')}</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 hover:bg-slate-50 text-slate-300 hover:text-ely-blue rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tFinances('profession')}</label>
                            {isEditing ? (
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50">{userData?.profession || '-'}</p>
                            )}
                        </div>
                        {!(formData.contractType === 'retired' || formData.contractType === 'unemployed') && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    {formData.contractType === 'student'
                                        ? t('companyLabels.student')
                                        : formData.contractType === 'apprentice'
                                            ? t('companyLabels.apprentice')
                                            : formData.contractType === 'independent'
                                                ? t('companyLabels.independent')
                                                : formData.contractType === 'artisan'
                                                    ? t('companyLabels.artisan')
                                                    : formData.contractType === 'civil_servant'
                                                        ? t('companyLabels.civil_servant')
                                                        : formData.contractType === 'temporary'
                                                            ? t('companyLabels.temporary')
                                                            : formData.contractType === 'liberal'
                                                                ? t('companyLabels.liberal')
                                                                : formData.contractType === 'business_owner'
                                                                    ? t('companyLabels.business_owner')
                                                                    : tFinances('company')}
                                </label>
                                {isEditing ? (
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 uppercase tracking-wide text-xs">{userData?.companyName || '-'}</p>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tFinances('contractType')}</label>
                            {isEditing ? (
                                <select name="contractType" value={formData.contractType} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900">
                                    <option value="cdi">{tFinances('options.cdi')}</option>
                                    <option value="cdd">{tFinances('options.cdd')}</option>
                                    <option value="temporary">{tFinances('options.temporary')}</option>
                                    <option value="civil_servant">{tFinances('options.civil_servant')}</option>
                                    <option value="liberal">{tFinances('options.liberal')}</option>
                                    <option value="business_owner">{tFinances('options.business_owner')}</option>
                                    <option value="artisan">{tFinances('options.artisan')}</option>
                                    <option value="independent">{tFinances('options.independent')}</option>
                                    <option value="retired">{tFinances('options.retired')}</option>
                                    <option value="student">{tFinances('options.student')}</option>
                                    <option value="apprentice">{tFinances('options.apprentice')}</option>
                                    <option value="unemployed">{tFinances('options.unemployed')}</option>
                                </select>
                            ) : (
                                <div className="flex items-center gap-3 px-5 py-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <p className="font-black text-slate-900">{tFinances(`options.${userData?.contractType || 'cdi'}`)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Situation Financière */}
                <motion.section variants={item} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group/finance">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/finance:scale-110 transition-all duration-700 pointer-events-none">
                        <Euro className="w-48 h-48" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50/20">
                                <Euro className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('sections.financial')}</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 hover:bg-slate-50 text-slate-300 hover:text-ely-blue rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                {formData.contractType === 'retired'
                                    ? t('incomeLabels.retired')
                                    : formData.contractType === 'unemployed'
                                        ? t('incomeLabels.unemployed')
                                        : formData.contractType === 'student'
                                            ? t('incomeLabels.student')
                                            : formData.contractType === 'apprentice'
                                                ? t('incomeLabels.apprentice')
                                                : formData.contractType === 'civil_servant'
                                                    ? t('incomeLabels.civil_servant')
                                                    : ['independent', 'artisan', 'liberal', 'business_owner'].includes(formData.contractType)
                                                        ? t('incomeLabels.selfEmployed')
                                                        : tFinances('income')}
                            </label>
                            {isEditing ? (
                                <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                            ) : (
                                <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 text-xl tracking-tight">{userData?.income?.toLocaleString() || 0} €</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tFinances('charges')}</label>
                                {isEditing ? (
                                    <input type="number" name="charges" value={formData.charges} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                                ) : (
                                    <p className="px-5 py-4 font-black text-rose-500 bg-slate-50/50 rounded-2xl border border-slate-50 text-xl tracking-tight leading-none italic">
                                        -{userData?.charges?.toLocaleString() || 0} €
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{tFinances('otherCredits')}</label>
                                {isEditing ? (
                                    <input type="number" name="otherCredits" value={formData.otherCredits} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-ely-blue/5 focus:border-ely-blue/50 outline-none transition-all font-black text-slate-900" />
                                ) : (
                                    <p className="px-5 py-4 font-black text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-50 text-xl tracking-tight">{userData?.otherCredits?.toLocaleString() || 0} €</p>
                                )}
                            </div>
                        </div>

                        {!isEditing && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex flex-col gap-2 p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-xl shadow-emerald-500/10">
                                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">{tFinances('disposableIncome')}</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">
                                        {((userData?.income || 0) -
                                            (userData?.charges || 0) -
                                            (userData?.otherCredits || 0)).toLocaleString()} €
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.section>

            </motion.div>
        </div>
    );
}
