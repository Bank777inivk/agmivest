"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    ShieldCheck,
    Gavel,
    Download,
    Eye,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Plus,
    FileSignature,
    Info
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Category = "contracts" | "insurance" | "legal";

const categories = [
    { id: "contracts", label: "Mes Contrats", icon: FileSignature, color: "ely-blue" },
    { id: "insurance", label: "Assurances", icon: ShieldCheck, color: "ely-mint" },
    { id: "legal", label: "Documents Légaux", icon: Gavel, color: "purple" },
];

const statusConfig: any = {
    signed: { label: "Signé", color: "text-ely-mint bg-ely-mint/10", icon: CheckCircle2 },
    pending: { label: "À signer", color: "text-amber-500 bg-amber-50", icon: Clock },
    expiring: { label: "Expire bientôt", color: "text-red-500 bg-red-50", icon: AlertTriangle },
};

export default function DocumentsPage() {
    const t = useTranslations('Dashboard.Documents');
    const [activeCategory, setActiveCategory] = useState<Category>("contracts");
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // In a real app, we'd fetch from Firestore. 
                // For now, let's mock some data to show the beautiful UI structure
                const mockDocs = [
                    { id: '1', name: "Contrat de Prêt Personnel #4582", category: "contracts", status: "signed", date: "15/05/2024", size: "2.4 MB" },
                    { id: '2', name: "Conditions Générales d'Utilisation", category: "legal", status: "signed", date: "10/01/2024", size: "1.1 MB" },
                    { id: '3', name: "Attestation Assurance Emprunteur", category: "insurance", status: "signed", date: "20/05/2024", size: "850 KB" },
                    { id: '4', name: "Avenant au contrat de crédit", category: "contracts", status: "pending", date: "01/06/2024", size: "1.5 MB" },
                    { id: '5', name: "Certificat de conformité légale", category: "legal", status: "expiring", date: "30/06/2024", size: "3.2 MB" },
                ];
                setDocuments(mockDocs);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredDocs = documents.filter(doc =>
        doc.category === activeCategory &&
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Documents</h1>
                    <p className="text-gray-500">Votre coffre-fort numérique pour vos contrats et assurances.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-ely-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher un document..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-ely-blue/10 focus:border-ely-blue transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </header>

            {/* Category Switcher */}
            <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as Category)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${activeCategory === cat.id
                                ? `bg-${cat.color === 'ely-mint' ? '[#28E898]' : cat.color === 'ely-blue' ? '[#003d82]' : cat.color + '-600'} text-white shadow-lg`
                                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                            }`}
                    >
                        <cat.icon className="w-5 h-5" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Document List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-ely-blue" />
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                            {filteredDocs.length} Document(s) trouvé(s)
                        </span>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-ely-blue hover:text-ely-mint transition-colors">
                        <Plus className="w-4 h-4" />
                        Ajouter un document
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-20 flex justify-center">
                        <div className="h-8 w-8 border-2 border-ely-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredDocs.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="divide-y divide-gray-50"
                    >
                        {filteredDocs.map((doc) => {
                            const status = statusConfig[doc.status];
                            return (
                                <motion.div
                                    key={doc.id}
                                    variants={item}
                                    className="p-6 hover:bg-gray-50/80 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100 text-gray-400 rounded-xl group-hover:bg-ely-blue group-hover:text-white transition-all duration-300">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{doc.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-400 font-medium">{doc.date}</span>
                                                <span className="text-xs text-gray-300">•</span>
                                                <span className="text-xs text-gray-400 font-medium">{doc.size}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                            <status.icon className="w-3.5 h-3.5" />
                                            {status.label}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-ely-blue transition-colors" title="Aperçu">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-ely-mint transition-colors" title="Télécharger">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="p-20 text-center">
                        <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium text-lg italic">Aucun document dans cette catégorie.</p>
                    </div>
                )}
            </div>

            {/* Security Notice */}
            <div className="bg-ely-blue/5 p-6 rounded-3xl border border-ely-blue/10 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-ely-blue" />
                </div>
                <div>
                    <h4 className="font-bold text-ely-blue">Espace Sécurisé</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Tous vos documents sont chiffrés et stockés sur des serveurs sécurisés conformes aux normes bancaires européennes.
                    </p>
                </div>
            </div>
        </div>
    );
}
