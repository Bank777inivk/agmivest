import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginClient from "./LoginClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Login' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function LoginPage() {
    return <LoginClient />;
}
