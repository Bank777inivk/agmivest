"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { auth } from "@/lib/firebase";

const languages = [
    { code: 'fr', name: 'Français', country: 'fr' },
    { code: 'en', name: 'English', country: 'gb' },
    { code: 'es', name: 'Español', country: 'es' },
    { code: 'it', name: 'Italiano', country: 'it' },
    { code: 'pt', name: 'Português', country: 'pt' },
    { code: 'nl', name: 'Nederlands', country: 'nl' },
    { code: 'de', name: 'Deutsch', country: 'de' },
    { code: 'pl', name: 'Polski', country: 'pl' },
    { code: 'ro', name: 'Română', country: 'ro' },
    { code: 'sv', name: 'Svenska', country: 'se' }
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = params.locale as string;

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = async (langCode: string) => {
        setIsOpen(false);

        // Update Firestore if user is logged in
        const user = auth.currentUser;
        if (user) {
            try {
                const { doc, updateDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");
                await updateDoc(doc(db, "users", user.uid), {
                    language: langCode
                });
            } catch (error) {
                console.error("Error updating language in Firestore:", error);
            }
        }

        router.push(pathname, { locale: langCode });
    };

    const renderFlag = (countryCode: string) => (
        <img
            src={`https://flagcdn.com/w40/${countryCode}.png`}
            srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
            width="20"
            alt=""
            className="rounded-sm shadow-sm object-cover aspect-[3/2]"
        />
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Select language"
            >
                <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-ely-blue" />
                    <span className="hidden md:inline text-xs font-bold text-gray-700 uppercase tracking-tight">
                        {currentLanguage.code}
                    </span>
                </div>
                {renderFlag(currentLanguage.country)}
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${lang.code === currentLocale ? 'bg-ely-mint/10 text-ely-blue font-semibold' : 'text-gray-700'
                                    }`}
                            >
                                {renderFlag(lang.country)}
                                <span className="flex-1 text-sm">{lang.name}</span>
                                {lang.code === currentLocale && (
                                    <span className="w-1.5 h-1.5 bg-ely-mint rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
