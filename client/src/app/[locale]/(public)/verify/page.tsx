import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import VerifyClient from "./VerifyClient";
import { Suspense } from "react";
import { RefreshCw } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Verify' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <VerifyClient />
        </Suspense>
    );
}
