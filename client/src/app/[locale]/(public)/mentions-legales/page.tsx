import { useTranslations } from "next-intl";

export default function MentionsLegalesPage() {
    const t = useTranslations('Legal.Mentions');

    return (
        <main className="min-h-screen pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600">{t('content')}</p>
                </div>
            </div>
        </main>
    );
}
