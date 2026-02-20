"use client";

import { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslations } from 'next-intl';

interface ReviewFormData {
    name: string;
    region: string;
    rating: number; // 1-5
    comment: string;
}

export default function ReviewForm() {
    const t = useTranslations('ReviewForm');

    // Form state
    const [formData, setFormData] = useState<ReviewFormData>({
        name: '',
        region: '',
        rating: 5,
        comment: ''
    });

    // Validation state
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const getRatingLabel = (rating: number) => {
        return t(`Ratings.${rating}`);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = t('Errors.name');
        if (!formData.region.trim()) newErrors.region = t('Errors.region');
        if (!formData.comment.trim()) {
            newErrors.comment = t('Errors.commentRequired');
        } else if (formData.comment.trim().length < 10) {
            newErrors.comment = t('Errors.commentTooShort');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[name];
                return newErrs;
            });
        }
    };

    const handleRatingChange = (newRating: number) => {
        setFormData(prev => ({ ...prev, rating: newRating }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'reviews'), {
                ...formData,
                date: new Date().toISOString().split('T')[0],
                verified: false,
                status: 'pending',
                createdAt: Timestamp.now()
            });
            setSubmitStatus('success');
            setFormData({ name: '', region: '', rating: 5, comment: '' });
            setTimeout(() => setSubmitStatus('idle'), 8000);
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-w-2xl mx-auto">
            {/* Form Header - Official Look */}
            <div className="bg-slate-50 border-b border-slate-100 p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{t('brandName')}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('certifiedReviews')}</p>
                    </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{t('verifiedEstablishment')}</span>
                </div>
            </div>

            <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                    {submitStatus === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-lg shadow-emerald-500/10">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-3">{t('Success.title')}</h4>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                                {t('Success.message')}
                            </p>
                            <button
                                onClick={() => setSubmitStatus('idle')}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                {t('Success.button')}
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-8">
                            {/* Rating Selector */}
                            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 text-center">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">{t('ratingLabel')}</label>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            className="group relative focus:outline-none transition-all hover:scale-110 active:scale-90"
                                        >
                                            <Star
                                                className={`w-10 h-10 transition-colors ${star <= formData.rating ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-slate-200 hover:text-slate-300"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm font-black text-slate-700 uppercase tracking-widest min-h-[1.25rem]">
                                    {getRatingLabel(formData.rating)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Labels.name')}</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50/30 font-medium transition-all outline-none focus:bg-white ${errors.name ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-ely-blue focus:shadow-lg focus:shadow-ely-blue/5'}`}
                                        placeholder={t('Placeholders.name')}
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight ml-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Labels.region')}</label>
                                    <input
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50/30 font-medium transition-all outline-none focus:bg-white ${errors.region ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-ely-blue focus:shadow-lg focus:shadow-ely-blue/5'}`}
                                        placeholder={t('Placeholders.region')}
                                    />
                                    {errors.region && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight ml-1">{errors.region}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('Labels.comment')}</label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50/30 font-medium transition-all outline-none focus:bg-white resize-none ${errors.comment ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-ely-blue focus:shadow-lg focus:shadow-ely-blue/5'}`}
                                    placeholder={t('Placeholders.comment')}
                                />
                                {errors.comment && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight ml-1">{errors.comment}</p>}
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-ely-blue to-ely-mint rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t('submit')}
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                {t('disclaimer')}
                            </p>

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest justify-center bg-red-50 p-4 rounded-2xl"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {t('Errors.submission')}
                                </motion.div>
                            )}
                        </form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
