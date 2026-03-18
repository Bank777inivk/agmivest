import AboutSection from "@/components/AboutSection";
import HistorySection from "@/components/HistorySection";
import TeamSection from "@/components/TeamSection";
import PartnersSection from "@/components/PartnersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.About' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <AboutSection />
            <HistorySection />
            <TeamSection />
            <PartnersSection />
            <TestimonialsSection />
        </main>
    );
}
