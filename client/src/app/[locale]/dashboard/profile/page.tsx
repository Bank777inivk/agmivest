"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Globe, Shield, Edit2, Save, X } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
    const t = useTranslations('Dashboard.Profile');
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
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);
                    setFormData(data);
                }
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
            await updateDoc(userRef, formData);
            setUserData(formData);
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
        <div className="space-y-8 max-w-4xl">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                    <p className="text-gray-500">Gérez vos informations personnelles et votre sécurité.</p>
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
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
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
                {/* Personal Information */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-ely-blue/5 text-ely-blue rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">État Civil</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Civilité</label>
                                {isEditing ? (
                                    <select
                                        name="civility"
                                        value={formData.civility}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    >
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                    </select>
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.civility}</p>
                                )}
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Prénom</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.firstName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nom</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                />
                            ) : (
                                <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.lastName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 text-nowrap">Date de Naissance</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all text-sm"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl text-sm">{userData?.birthDate}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Lieu</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.birthPlace}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Contact Information */}
                <motion.section variants={item} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-ely-mint/5 text-ely-mint rounded-lg">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Coordonnées</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Adresse</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                />
                            ) : (
                                <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Code Postal</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.zipCode}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ville</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 font-medium text-gray-900 bg-gray-50 rounded-xl">{userData?.city}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Téléphone</label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium text-gray-900">{userData?.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Account Security */}
                <motion.section variants={item} className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Sécurité du Compte</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email de connexion</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-500">
                                <Mail className="w-4 h-4 opacity-50" />
                                <p className="font-medium">{userData?.email}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 ml-1 italic mt-1">* L'email ne peut pas être modifié pour des raisons de sécurité.</p>
                        </div>

                        <div className="space-y-1 flex flex-col justify-end pb-1">
                            <button className="w-full md:w-auto px-6 py-3 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
                                Changer le mot de passe
                            </button>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
