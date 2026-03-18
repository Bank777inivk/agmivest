import DocumentsSection from "@/components/DocumentsSection";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Documents' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function DocumentsPage() {
    return (
        <main className="min-h-screen bg-white">
            <DocumentsSection />
        </main>
    );
}
