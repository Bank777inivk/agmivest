import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MentionsLegalesClient from "./MentionsLegalesClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Legal' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function MentionsLegalesPage() {
    return <MentionsLegalesClient />;
}
