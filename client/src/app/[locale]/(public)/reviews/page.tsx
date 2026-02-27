"use client";

import { useTranslations, useFormatter } from "next-intl";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { Link } from '@/i18n/routing';
import ReviewForm from "@/components/ReviewForm";
import { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/useReviews';

export default function ReviewsPage() {
    const t = useTranslations('Reviews');
    const format = useFormatter();
    const { reviews, loading } = useReviews(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile for pagination size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const pageSize = isMobile ? 20 : 50;

    // Reset to page 1 if reviews change (e.g. filter or new data)
    useEffect(() => {
        setCurrentPage(1);
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, [reviews.length]);

    const totalPages = Math.ceil(reviews.length / pageSize);
    const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const renderStars = (rating: number) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format.dateTime(date, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-ely-blue hover:text-ely-mint font-semibold mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        {t('backToHome')}
                    </Link>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            {t.rich('title', {
                                highlight: (chunks) => <span className="text-ely-blue">{chunks}</span>
                            })}
                        </h1>
                        <p className="text-lg text-slate-600">
                            {t('description')}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="max-w-3xl mx-auto mb-20">
                    <ReviewForm />
                </div>

                {/* Reviews List */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Star className="w-6 h-6 fill-ely-blue text-ely-blue" />
                            {t('allReviews')} ({reviews.length})
                        </h2>
                        {totalPages > 1 && (
                            <div className="text-sm font-medium text-slate-500">
                                {t('page')} {currentPage} {t('of')} {totalPages}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-64 bg-white rounded-2xl shadow-sm animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {paginatedReviews.map((review, index) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: (index % 3) * 0.05 }}
                                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 mb-1">{review.name}</h3>
                                                <p className="text-sm text-slate-500">
                                                    {typeof review.id === 'string'
                                                        ? review.region
                                                        : t(`Items.r${review.id}.region`)}
                                                </p>
                                            </div>
                                            {(review as { verified?: boolean }).verified && (
                                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                                    <Star className="w-3 h-3 fill-green-700" />
                                                    {t('verified')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            {renderStars(review.rating)}
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 min-h-[60px]">
                                            &quot;{typeof review.id === 'string'
                                                ? review.comment
                                                : t(`Items.r${review.id}.comment`)}&quot;
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatDate(review.date)}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setCurrentPage(p => Math.max(1, p - 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === 1}
                                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-ely-blue transition-colors text-ely-blue"
                                    >
                                        {t('previous')}
                                    </button>

                                    <div className="hidden sm:flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Show only a few page numbers around current
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => {
                                                            setCurrentPage(page);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={`w-12 h-12 rounded-xl border transition-all font-bold ${currentPage === page
                                                            ? "bg-ely-blue text-white border-ely-blue"
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-ely-blue"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                (page === 2 && currentPage > 3) ||
                                                (page === totalPages - 1 && currentPage < totalPages - 2)
                                            ) {
                                                return <span key={page} className="w-8 flex items-center justify-center text-slate-400">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCurrentPage(p => Math.min(totalPages, p + 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === totalPages}
                                        className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-ely-blue transition-colors text-ely-blue"
                                    >
                                        {t('next')}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </main>
    );
}
