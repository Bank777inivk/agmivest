import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ReviewsClient from "./ReviewsClient";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.Reviews' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function ReviewsPage() {
    return <ReviewsClient />;
}
