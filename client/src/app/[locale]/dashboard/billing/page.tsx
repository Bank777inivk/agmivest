"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    CreditCard,
    Landmark,
    CheckCircle,
    Info,
    Copy,
    ArrowLeft,
    ShieldCheck,
    Euro
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import PremiumSpinner from "@/components/dashboard/PremiumSpinner";

export default function BillingPage() {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const advisorRIB = request?.customRIB || {
        bankName: "ELYSSIO INVESTMENT BANK",
        iban: "FR76 3000 3020 1000 5000 7890 123",
        bic: "ELYSPRPPXXX",
        beneficiary: "ELYSSIO FINANCE - CONSEILLER FINANCIER"
    };

    const paymentTypeLabel = {
        frais_dossier: "Frais de Dossier",
        assurance: "Assurance",
        frais_notaire: "Frais de Notaire",
        authentication_deposit: "Dépôt d'Authentification",
        none: "Aucun"
    }[request?.paymentType as string] || "Dépôt d'Authentification";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "requests"),
                        where("userId", "==", user.uid),
                        where("requiresPayment", "==", true),
                        limit(1)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const data = querySnapshot.docs[0].data();
                        setRequest({ id: querySnapshot.docs[0].id, ...data });
                    }
                } catch (error) {
                    console.error("Error fetching payment request:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (isLoading) return <PremiumSpinner />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto"
        >
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-ely-blue transition-all shadow-sm group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mes Factures</h1>
                    <p className="text-sm text-slate-500 font-medium">Gérez vos paiements et facturations.</p>
                </div>
            </header>

            {(!request || request.status !== 'approved' || (request.requiresPayment && request.paymentStatus === 'paid') || request.paymentType === 'none') ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-xl">
                    <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Aucune facturation en attente
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                        Vous n'avez aucune facturation pour le moment.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-8 px-8 py-4 bg-ely-blue text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-ely-blue/20 transition-all uppercase tracking-widest"
                    >
                        Retour au Tableau de Bord
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Zero Fee Policy Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 via-ely-blue to-blue-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck className="w-24 h-24" />
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/90">Charte Zéro Frais</span>
                            </div>

                            <h3 className="text-lg font-black mb-4 relative z-10 leading-tight">Politique de Transparence</h3>
                            <p className="text-white/70 text-xs leading-relaxed relative z-10 mb-6 font-medium">
                                AGM INVEST n'applique <span className="text-white font-bold">aucun frais de dossier, d'assurance ou de notaire</span> à l'ouverture.
                                <br /><br />
                                Le virement demandé est un <span className="text-white font-bold">Dépôt d'Authentification</span> qui sera intégralement crédité sur votre solde personnel.
                            </p>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                                <p className="text-[10px] uppercase font-black text-white/60 mb-1 tracking-widest">Dépôt requis</p>
                                <p className="text-3xl font-black">286.00 €</p>
                                <p className="text-[9px] font-bold text-emerald-400 mt-1 uppercase tracking-tighter">Récupérable à 100% sur votre solde</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Sécurité Bancaire</h4>
                                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-tighter font-bold">
                                    Virement SEPA sécurisé vers notre établissement partenaire.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIB Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-ely-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-ely-blue/20">
                                    <Landmark className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">RIB du Conseiller</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Cordonnées de transfert</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: "Bénéficiaire", value: advisorRIB.beneficiary, field: "beneficiary" },
                                    { label: "Banque", value: advisorRIB.bankName, field: "bank" },
                                    { label: "IBAN", value: advisorRIB.iban, field: "iban", mono: true },
                                    { label: "Code BIC (SWIFT)", value: advisorRIB.bic, field: "bic", mono: true },
                                ].map((item, i) => (
                                    <div key={i} className="group relative">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-ely-blue/30 transition-all">
                                            <p className={cn(
                                                "text-sm font-bold text-slate-900 truncate pr-4",
                                                item.mono && "font-mono tracking-tighter"
                                            )}>
                                                {item.value}
                                            </p>
                                            <button
                                                onClick={() => copyToClipboard(item.value, item.field)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-all shrink-0",
                                                    copiedField === item.field
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-white text-slate-400 hover:text-ely-blue shadow-sm"
                                                )}
                                            >
                                                {copiedField === item.field ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex items-center gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-ely-blue shadow-sm">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
                                    Ce transfert est sécurisé. Votre conseiller recevra une notification automatique dès réception des fonds par notre banque partenaire.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-bold text-sm"
                            >
                                Revenir plus tard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
