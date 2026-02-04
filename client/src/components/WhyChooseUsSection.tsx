"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyChooseUsSection() {
    const t = useTranslations('WhyChooseUs');

    const benefits = [
        {
            title: t('Items.time.title'),
            description: t('Items.time.description')
        },
        {
            title: t('Items.conditions.title'),
            description: t('Items.conditions.description')
        },
        {
            title: t('Items.expert.title'),
            description: t('Items.expert.description')
        },
        {
            title: t('Items.support.title'),
            description: t('Items.support.description')
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-ely-blue mb-6">
                            {t.rich('title', {
                                highlight: (chunks) => <span className="text-ely-mint">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {t('subtitle')}
                        </p>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-ely-mint" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-ely-blue text-lg">{benefit.title}</h3>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-ely-mint to-ely-blue rounded-3xl transform rotate-3 opacity-20 blur-lg"></div>
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 relative border border-gray-100 shadow-xl">
                            <h3 className="text-2xl font-bold text-ely-blue mb-6 text-center">{t('Simulation.title')}</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm text-gray-500 font-medium pb-2 border-b border-gray-200">
                                    <span>{t('Simulation.marketRate')}</span>
                                    <span className="text-gray-400 decoration-red-500 decoration-2 line-through">3.85 %</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold text-ely-blue pb-2 border-b border-gray-200">
                                    <span>{t('Simulation.ourRate')}</span>
                                    <span className="text-ely-mint text-2xl">2.95 %</span>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                                    <span className="block text-sm text-green-700 font-semibold mb-1">{t('Simulation.savings')}</span>
                                    <span className="block text-3xl font-black text-green-600">15 400 €*</span>
                                    <span className="block text-[10px] text-green-700/60 mt-2">{t('Simulation.disclaimer')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
