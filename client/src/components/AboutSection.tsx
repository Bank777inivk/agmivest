"use client";

import { motion } from "framer-motion";
import { Award, Users, TrendingUp, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
    const t = useTranslations('About');

    const stats = [
        { number: t('Stats.experience.value'), label: t('Stats.experience.label'), icon: Award },
        { number: t('Stats.clients.value'), label: t('Stats.clients.label'), icon: Users },
        { number: t('Stats.acceptance.value'), label: t('Stats.acceptance.label'), icon: TrendingUp },
        { number: t('Stats.secure.value'), label: t('Stats.secure.label'), icon: Shield },
    ];

    return (
        <section id="about" className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-ely-blue to-blue-900 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-ely-mint/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-ely-mint/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all"
                        >
                            <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-ely-mint mx-auto mb-4" />
                            <div className={`font-black text-ely-mint mb-2 break-words ${
                                stat.number.length > 8 
                                    ? 'text-xl md:text-2xl' 
                                    : stat.number.length > 6 
                                        ? 'text-2xl md:text-3xl' 
                                        : 'text-3xl md:text-4xl'
                            }`}>
                                {stat.number}
                            </div>
                            <div className="text-sm md:text-base text-gray-300">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold">{t('Mission.title')}</h3>
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                            {t.rich('Mission.p1', {
                                highlight: (chunks) => <span className="text-ely-mint font-semibold">{chunks}</span>
                            })}
                        </p>
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                            {t('Mission.p2')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                            <h4 className="font-bold text-xl mb-3 text-ely-mint">{t('Values.title')}</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-ely-mint mt-1">✓</span>
                                    <span>{t('Values.v1')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-ely-mint mt-1">✓</span>
                                    <span>{t('Values.v2')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-ely-mint mt-1">✓</span>
                                    <span>{t('Values.v3')}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-ely-mint mt-1">✓</span>
                                    <span>{t('Values.v4')}</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
