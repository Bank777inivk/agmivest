import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PolitiqueConfidentialiteClient from "./PolitiqueConfidentialiteClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Privacy' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function PolitiqueConfidentialitePage() {
    return <PolitiqueConfidentialiteClient />;
}
