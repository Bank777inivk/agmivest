import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CreditRequestClient from "./CreditRequestClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.CreditRequest' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function CreditRequestPage() {
    return <CreditRequestClient />;
}
