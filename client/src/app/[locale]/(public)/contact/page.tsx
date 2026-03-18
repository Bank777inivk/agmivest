import ContactSection from "@/components/ContactSection";
import LocationSection from "@/components/LocationSection";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Contact' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="space-y-8">
                <ContactSection />
                <LocationSection />
            </div>
        </main>
    );
}
