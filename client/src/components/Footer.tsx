"use client";

import { Link } from "@/i18n/routing";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations('Footer');

    const footerLinks = [
        { label: t('Links.services'), href: "/services" },
        { label: t('Links.simulator'), href: "/" },
        { label: t('Links.documents'), href: "/documents" },
        { label: t('Links.about'), href: "/about" },
        { label: t('Links.contact'), href: "/contact" },
        { label: t('Links.clientArea'), href: "/login" },
    ];

    return (
        <footer className="bg-ely-blue text-white pt-10 md:pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
                    {/* Column 1: Branding */}
                    <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-6">
                        <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                            <Image
                                src="/logo.png"
                                alt="AGM INVEST"
                                width={120}
                                height={48}
                                className="h-12 md:h-16 w-auto"
                            />
                        </div>
                        <p className="text-gray-300 text-xs md:text-base max-w-xs leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-ely-mint font-bold text-base md:text-xl">{t('linksTitle')}</h3>
                        <ul className="space-y-1.5 md:space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-ely-mint transition-colors text-sm md:text-base"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="space-y-3 md:space-y-4 relative">
                        <h3 className="text-ely-mint font-bold text-base md:text-xl">{t('contactTitle')}</h3>
                        <ul className="space-y-3 md:space-y-4">
                            <li className="flex items-center gap-3 text-gray-300 group">
                                <Phone className="w-4 h-4 md:w-5 md:h-5 text-ely-mint" />
                                <a href="tel:0240561911" className="hover:text-ely-mint transition-colors text-xs md:text-base">02 40 56 19 11</a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 group">
                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-ely-mint" />
                                <a href="mailto:contact@agminvest.fr" className="hover:text-ely-mint transition-colors text-xs md:text-base">contact@agminvest.fr</a>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-ely-mint shrink-0 mt-1" />
                                <span className="text-xs md:text-base leading-relaxed">
                                    123 Rue de la République<br />
                                    44000 Nantes, France
                                </span>
                            </li>
                        </ul>

                        {/* Decorative Arc (Simulated from screenshot) */}
                        <div className="hidden lg:block absolute -top-8 -right-8 w-32 h-32 border-r-4 border-t-4 border-red-500/20 rounded-tr-[100px]"></div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} {t('copyright')}
                    </p>
                    <div className="flex gap-4 md:gap-8">
                        <Link href="/mentions-legales" className="hover:text-white transition-colors">{t('legal.mentions')}</Link>
                        <Link href="/politique-confidentialite" className="hover:text-white transition-colors">{t('legal.privacy')}</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">{t('legal.cookies')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
