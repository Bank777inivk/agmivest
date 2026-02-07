"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Globe, Shield, Edit2, Save, X, Briefcase, Euro, Home, Heart, Baby } from "lucide-react";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

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
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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
        <div className="space-y-8 max-w-5xl pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
                    <p className="text-slate-500">Gérez vos informations personnelles et votre sécurité.</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-ely-blue text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-ely-blue/20 transition-all active:scale-95"
                    >
                        <Edit2 className="w-4 h-4" />
                        Modifier le profil
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-ely-mint text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-ely-mint/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Enregistrer
                        </button>
                    </div>
                )}
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* État Civil */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-ely-blue/5 text-ely-blue rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">État Civil</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tIdentity('civility')}</label>
                                {isEditing ? (
                                    <select
                                        name="civility"
                                        value={formData.civility}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    >
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                    </select>
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.civility}</p>
                                )}
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tIdentity('firstName')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.firstName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tIdentity('lastName')}</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.lastName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 text-nowrap">{tIdentity('birthDate')}</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all text-sm"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl text-sm">{userData?.birthDate}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tIdentity('birthPlace')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.birthPlace}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Coordonnées */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-ely-mint/5 text-ely-mint rounded-lg">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Coordonnées</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Adresse</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Code Postal</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.zipCode}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ville</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.city}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Téléphone</label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <p className="font-medium text-slate-900">{userData?.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Situation Personnelle */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                            <Heart className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Situation Personnelle</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tSituation('maritalStatus')}</label>
                            {isEditing ? (
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                    <option value="single">{tSituation('options.single')}</option>
                                    <option value="married">{tSituation('options.married')}</option>
                                    <option value="divorced">{tSituation('options.divorced')}</option>
                                </select>
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{tSituation(`options.${userData?.maritalStatus || 'single'}`)}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tSituation('children')}</label>
                            {isEditing ? (
                                <input type="number" name="children" value={formData.children} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.children || 0}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tSituation('housingType')}</label>
                                {isEditing ? (
                                    <select name="housingType" value={formData.housingType} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="tenant">{tSituation('options.tenant')}</option>
                                        <option value="owner">{tSituation('options.owner')}</option>
                                        <option value="hosted">{tSituation('options.hosted')}</option>
                                    </select>
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{tSituation(`options.${userData?.housingType || 'tenant'}`)}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tSituation('housingSeniority')}</label>
                                {isEditing ? (
                                    <input type="number" name="housingSeniority" value={formData.housingSeniority} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.housingSeniority || 0} ans</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Situation Professionnelle */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Situation Professionnelle</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('profession')}</label>
                            {isEditing ? (
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.profession || '-'}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('company')}</label>
                            {isEditing ? (
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.companyName || '-'}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('contractType')}</label>
                            {isEditing ? (
                                <select name="contractType" value={formData.contractType} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                    <option value="cdi">{tFinances('options.cdi')}</option>
                                    <option value="cdd">{tFinances('options.cdd')}</option>
                                    <option value="independent">{tFinances('options.independent')}</option>
                                    <option value="retired">{tFinances('options.retired')}</option>
                                </select>
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{tFinances(`options.${userData?.contractType || 'cdi'}`)}</p>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Situation Financière */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <Euro className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Situation Financière</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('income')}</label>
                            {isEditing ? (
                                <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.income || 0} €</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('charges')}</label>
                            {isEditing ? (
                                <input type="number" name="charges" value={formData.charges} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl text-rose-500">{userData?.charges || 0} €</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{tFinances('otherCredits')}</label>
                            {isEditing ? (
                                <input type="number" name="otherCredits" value={formData.otherCredits} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            ) : (
                                <p className="px-4 py-2 font-medium text-slate-900 bg-slate-50 rounded-xl">{userData?.otherCredits || 0} €</p>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">{tFinances('disposableIncome')}</span>
                                    <span className="text-xl font-black text-emerald-700">
                                        {((userData?.income || 0) -
                                            (userData?.charges || 0) -
                                            (userData?.otherCredits || 0)).toLocaleString()} €
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Account Security */}
                <motion.section variants={item} className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Sécurité du Compte</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email de connexion</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-500">
                                <Mail className="w-4 h-4 opacity-50" />
                                <p className="font-medium">{userData?.email}</p>
                            </div>
                            <p className="text-[10px] text-slate-400 ml-1 italic mt-1">* L'email ne peut pas être modifié pour des raisons de sécurité.</p>
                        </div>

                        <div className="space-y-1 flex flex-col justify-end pb-1">
                            <button className="w-full md:w-auto px-6 py-3 border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                                Changer le mot de passe
                            </button>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
