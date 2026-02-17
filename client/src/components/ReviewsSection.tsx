"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Filter, TrendingUp, Users, Award } from "lucide-react";
import { reviews, getReviewStats, getRecentReviews, filterByRating } from "@/data/reviewsData";

export default function ReviewsSection() {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);

    const stats = getReviewStats();
    const displayedReviews = selectedRating
        ? filterByRating(selectedRating)
        : showAll
            ? reviews
            : getRecentReviews(12);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                        Avis de nos <span className="text-ely-blue">Clients</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Découvrez ce que nos clients pensent de nos services
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ely-blue to-ely-mint flex items-center justify-center">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.averageRating}/5</p>
                                <p className="text-sm text-slate-600">Note moyenne</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ely-mint to-green-500 flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.totalReviews}+</p>
                                <p className="text-sm text-slate-600">Avis clients</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100)}%</p>
                                <p className="text-sm text-slate-600">Avis 5 étoiles</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        onClick={() => setSelectedRating(null)}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${selectedRating === null
                                ? "bg-gradient-to-r from-ely-blue to-ely-mint text-white shadow-lg"
                                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                            }`}
                    >
                        Tous les avis
                    </button>
                    {[5, 4].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setSelectedRating(rating)}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${selectedRating === rating
                                    ? "bg-gradient-to-r from-ely-blue to-ely-mint text-white shadow-lg"
                                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                                }`}
                        >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {rating} étoiles
                        </button>
                    ))}
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">{review.name}</h3>
                                    <p className="text-sm text-slate-500">{review.region}</p>
                                </div>
                                {review.verified && (
                                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                        <Star className="w-3 h-3 fill-green-700" />
                                        Vérifié
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="mb-3">
                                {renderStars(review.rating)}
                            </div>

                            {/* Comment */}
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                "{review.comment}"
                            </p>

                            {/* Date */}
                            <p className="text-xs text-slate-400">
                                {formatDate(review.date)}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Show More Button */}
                {!selectedRating && !showAll && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-8 py-4 bg-gradient-to-r from-ely-blue to-ely-mint text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            Voir tous les avis ({stats.totalReviews})
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
