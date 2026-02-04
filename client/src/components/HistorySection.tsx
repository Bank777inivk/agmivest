"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HistorySection() {
    const t = useTranslations('History');

    const milestones = [
        {
            year: "2006",
            title: t('Milestones.m2006.title'),
            description: t('Milestones.m2006.description')
        },
        {
            year: "2012",
            title: t('Milestones.m2012.title'),
            description: t('Milestones.m2012.description')
        },
        {
            year: "2018",
            title: t('Milestones.m2018.title'),
            description: t('Milestones.m2018.description')
        },
        {
            year: "2024",
            title: t('Milestones.m2024.title'),
            description: t('Milestones.m2024.description')
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-ely-blue mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto text-lg"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Central Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-ely-mint/20 h-full hidden md:block"></div>

                    <div className="space-y-12 md:space-y-24">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.year}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 md:text-right pt-2 md:pt-0">
                                    <div className={`${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-ely-mint/50 transition-colors`}>
                                        <span className="text-5xl font-black text-ely-mint/20 absolute -mt-10 ml-2 md:ml-0 md:-mt-12 select-none">{milestone.year}</span>
                                        <h3 className="text-xl font-bold text-ely-blue mb-2 relative z-10">{milestone.title}</h3>
                                        <p className="text-gray-600 relative z-10">{milestone.description}</p>
                                    </div>
                                </div>

                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 bg-ely-mint rounded-full flex items-center justify-center shadow-lg shadow-ely-mint/30 z-10 relative">
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex-1 hidden md:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
