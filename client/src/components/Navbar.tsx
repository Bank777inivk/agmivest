"use client";

import { Link } from "@/i18n/routing";
import { Phone, Star, Menu, X } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const t = useTranslations('Navigation');

    const mainLinks = [
        { label: t('home'), href: "/" },
        { label: t('services'), href: "/services" },
        { label: t('documents'), href: "/documents" },
        { label: t('about'), href: "/about" },
        { label: t('contact'), href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
            {/* Top Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo-official.png"
                        alt="AGM INVEST"
                        width={180}
                        height={64}
                        className="h-12 md:h-16 w-auto object-contain"
                        style={{ height: "auto" }}
                        priority
                    />
                </Link>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                    <LanguageSwitcher />
                    {/* Google Review - High Fidelity */}
                    <Link
                        href="/reviews"
                        className="flex items-center gap-3 bg-white border border-slate-100 rounded-full px-4 py-1.5 shadow-sm hover:shadow-md hover:border-ely-blue/20 transition-all group"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="text-[13px] font-black text-slate-900 leading-none">4.9</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">Google Reviews</span>
                            </div>
                        </div>
                        <div className="h-4 w-px bg-slate-100 hidden xl:block" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hidden xl:block">Excellent</span>
                    </Link>

                    {/* Phone - Now Clickable */}
                    <a
                        href="tel:+33756844145"
                        className="flex items-center gap-2 border border-ely-blue rounded-md px-3 xl:px-4 py-2 hover:bg-ely-blue/5 transition-all group"
                    >
                        <Phone className="w-4 h-4 text-ely-blue group-hover:scale-110 transition-transform" />
                        <span className="text-base xl:text-lg font-bold text-ely-blue">AGM INVEST +33 7 56 84 41 45</span>
                    </a>

                    {/* CTA */}
                    <Link href="/register" className="bg-ely-blue text-white px-5 xl:px-6 py-2.5 rounded-md font-bold text-sm hover:bg-ely-blue/90 transition-colors whitespace-nowrap">
                        {t('appointment')}
                    </Link>
                </div>

                {/* Mobile Language Switcher */}
                <div className="lg:hidden mr-1">
                    <LanguageSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-ely-blue"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:block w-full bg-ely-blue">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-2">
                        <ul className="flex items-center gap-6 xl:gap-10">
                            {mainLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-white text-sm font-medium whitespace-nowrap hover:text-ely-mint transition-colors relative group"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ely-mint transition-all group-hover:w-full"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/credit-request"
                                className="bg-ely-mint text-white px-6 py-2 rounded-full font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-black/20 uppercase tracking-wider"
                            >
                                {t('creditRequest')}
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white text-white px-6 py-2 rounded-full font-extrabold text-sm hover:bg-white hover:text-ely-blue transition-all uppercase tracking-wider"
                            >
                                {t('becomeClient')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-ely-blue text-white">
                    <nav className="px-4 py-4 space-y-3">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="block py-2 text-base font-medium hover:text-ely-mint transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            {/* Google Review - Mobile */}
                            <Link
                                href="/reviews"
                                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all group"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-black text-white leading-none">4.9/5</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-tight mt-0.5">Avis Google</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-ely-mint uppercase tracking-widest">Excellent</span>
                            </Link>

                            <Link
                                href="/credit-request"
                                className="block w-full bg-ely-mint text-white px-6 py-3 rounded-lg font-bold text-center text-sm shadow-lg shadow-black/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('creditRequest')}
                            </Link>
                            <Link
                                href="/login"
                                className="block w-full border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-center text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('becomeClient')}
                            </Link>
                            <a href="tel:+33756844145" className="flex items-center justify-center gap-2 py-2 text-white/90 hover:text-white transition-colors">
                                <Phone className="w-5 h-5 text-ely-mint" />
                                <span className="font-bold">AGM INVEST +33 7 56 84 41 45</span>
                            </a>
                        </div>
                    </nav>
                </div >
            )
            }
        </header >
    );
}
