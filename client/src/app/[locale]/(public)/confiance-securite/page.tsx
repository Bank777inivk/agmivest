import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ConfianceSecuriteClient from "./ConfianceSecuriteClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Security' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function ConfianceSecuritePage() {
    return <ConfianceSecuriteClient />;
}
