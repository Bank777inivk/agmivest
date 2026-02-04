"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

interface TestimonialsSectionProps {
    isMinimal?: boolean;
}

export default function TestimonialsSection({ isMinimal = false }: TestimonialsSectionProps) {
    const t = useTranslations('Testimonials');

    const testimonials = [
        {
            name: t('Items.t1.name'),
            role: t('Items.t1.role'),
            content: t('Items.t1.content'),
            rating: 5,
        },
        {
            name: t('Items.t2.name'),
            role: t('Items.t2.role'),
            content: t('Items.t2.content'),
            rating: 5,
        },
        {
            name: t('Items.t3.name'),
            role: t('Items.t3.role'),
            content: t('Items.t3.content'),
            rating: 5,
        },
    ];

    return (
        <section id="testimonials" className={`${isMinimal ? 'py-0' : 'py-16 md:py-20 lg:py-24'} bg-white relative overflow-hidden`}>
            {/* Background Decor */}
            {!isMinimal && <div className="absolute -left-20 top-20 w-80 h-80 bg-ely-blue/5 rounded-full blur-3xl"></div>}

            <div className={`${isMinimal ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                <div className={`${isMinimal ? 'text-left mb-8' : 'text-center mb-12 md:mb-16'}`}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`${isMinimal ? 'text-2xl md:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-bold text-ely-blue mb-4`}
                    >
                        {t('title')}
                    </motion.h2>
                    <div className={`flex items-center ${isMinimal ? 'justify-start' : 'justify-center'} gap-2 mb-4`}>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <span className="font-bold text-gray-700 text-sm">{t('rating')}</span>
                    </div>
                </div>

                <div className={`grid grid-cols-1 ${isMinimal ? 'gap-6' : 'md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
                    {testimonials.slice(0, isMinimal ? 2 : 3).map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className={`group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                        >
                            {/* Premium Decorative Gradient */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ely-mint via-ely-blue to-ely-mint opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <Quote className="absolute top-6 right-6 w-10 h-10 text-ely-mint opacity-[0.08] group-hover:opacity-20 transition-opacity" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm md:text-base italic mb-8 leading-relaxed relative z-10">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ely-blue to-blue-800 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:rotate-6 transition-transform">
                                        {testimonial.name[0]}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-ely-mint rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-ely-blue text-base md:text-lg">{testimonial.name}</h4>
                                    <p className="text-[10px] md:text-xs text-ely-mint font-bold uppercase tracking-widest">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
