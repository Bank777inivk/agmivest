"use client";

import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ServicesPage() {
    const t = useTranslations('ServicesPage');

    return (
        <main className="min-h-screen bg-white">
            <ServicesSection />
            <WhyChooseUsSection />
            <ProcessSection />

            {/* CTA Section */}
            <section className="py-20 bg-ely-blue text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('CTA.title')}</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        {t('CTA.text')}
                    </p>
                    <Link
                        href="/credit-request"
                        className="inline-flex items-center gap-3 bg-ely-mint text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-ely-mint/90 transition-all shadow-lg hover:shadow-ely-mint/20 hover:-translate-y-1"
                    >
                        {t('CTA.button')}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
