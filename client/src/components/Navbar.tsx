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
                    {/* Google Review */}
                    <div className="flex items-center border border-gray-200 rounded-md px-3 py-1.5 gap-2">
                        <span className="text-sm font-medium text-gray-600">{t('reviews')}</span>
                        <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 mr-1">Google</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 border border-ely-blue rounded-md px-3 xl:px-4 py-2">
                        <Phone className="w-4 h-4 text-ely-blue" />
                        <span className="text-base xl:text-lg font-bold text-ely-blue">02 40 56 19 11</span>
                    </div>

                    {/* CTA */}
                    <button className="bg-ely-blue text-white px-5 xl:px-6 py-2.5 rounded-md font-bold text-sm hover:bg-ely-blue/90 transition-colors whitespace-nowrap">
                        {t('appointment')}
                    </button>
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
                            <div className="flex justify-center pb-2">
                                <LanguageSwitcher />
                            </div>
                            <Link
                                href="/credit-request"
                                className="block w-full bg-ely-mint text-white px-6 py-3 rounded-lg font-bold text-center text-sm"
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
                            <a href="tel:0240561911" className="flex items-center justify-center gap-2 py-2">
                                <Phone className="w-5 h-5 text-ely-mint" />
                                <span className="font-bold">02 40 56 19 11</span>
                            </a>
                        </div>
                    </nav>
                </div >
            )
            }
        </header >
    );
}
