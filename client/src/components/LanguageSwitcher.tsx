"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
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

    const handleLanguageChange = (langCode: string) => {
        setIsOpen(false);
        router.push(pathname, { locale: langCode });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Select language"
            >
                <Globe className="w-5 h-5 text-ely-blue" />
                <span className="hidden md:inline text-sm font-semibold text-gray-700">
                    {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="flex-1">{lang.name}</span>
                                {lang.code === currentLocale && (
                                    <span className="w-2 h-2 bg-ely-mint rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
