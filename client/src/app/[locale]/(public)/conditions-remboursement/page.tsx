import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ConditionsRemboursementClient from "./ConditionsRemboursementClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Refund' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function ConditionsRemboursementPage() {
    return <ConditionsRemboursementClient />;
}
