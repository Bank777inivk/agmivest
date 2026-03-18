import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MentionsPublicitairesClient from "./MentionsPublicitairesClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Promo' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function MentionsPublicitairesPage() {
    return <MentionsPublicitairesClient />;
}
