"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShieldCheck, RefreshCw, HandCoins, Building2, HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServicesSectionProps {
    isMinimal?: boolean;
}

export default function ServicesSection({ isMinimal = false }: ServicesSectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const t = useTranslations('Services');

    const services = [
        {
            icon: Home,
            title: t('Items.realEstate.title'),
            description: t('Items.realEstate.description'),
        },
        {
            icon: ShieldCheck,
            title: t('Items.insurance.title'),
            description: t('Items.insurance.description'),
        },
        {
            icon: RefreshCw,
            title: t('Items.creditConsolidation.title'),
            description: t('Items.creditConsolidation.description'),
        },
        {
            icon: Building2,
            title: t('Items.professionalLoan.title'),
            description: t('Items.professionalLoan.description'),
        },
        {
            icon: HandCoins,
            title: t('Items.renegotiation.title'),
            description: t('Items.renegotiation.description'),
        },
        {
            icon: HeartHandshake,
            title: t('Items.support.title'),
            description: t('Items.support.description'),
        },
    ];

    return (
        <section id="services" className={`relative ${isMinimal ? 'py-0 bg-transparent' : 'py-16 md:py-20 lg:py-24 bg-gray-50'}`}>
            <div className={`${isMinimal ? 'w-full px-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                {/* Header */}
                {!isMinimal && (
                    <div className="text-center mb-12 md:mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-ely-blue mb-4"
                        >
                            {t('title')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>
                )}

                {/* Services Grid */}
                <div className={`grid ${isMinimal ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
                    {(isMinimal ? services.slice(0, 4) : services).map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={isMinimal ? { opacity: 0, x: -20 } : { opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => isMinimal && setHoveredIndex(index)}
                            onMouseLeave={() => isMinimal && setHoveredIndex(null)}
                            onClick={() => isMinimal && setHoveredIndex(hoveredIndex === index ? null : index)}
                            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden cursor-pointer
                                ${isMinimal ? 'p-0' : 'p-8 hover:-translate-y-1'}`}
                        >
                            <div className={`${isMinimal ? 'p-4 flex items-center gap-4' : ''}`}>
                                <div className={`${isMinimal ? 'w-10 h-10 min-w-[40px]' : 'w-14 h-14 mb-6'} bg-ely-mint/10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-ely-mint transition-colors duration-300`}>
                                    <service.icon className={`${isMinimal ? 'w-5 h-5' : 'w-7 h-7'} text-ely-mint group-hover:text-white transition-colors duration-300`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`${isMinimal ? 'text-base font-bold' : 'text-xl font-bold mb-3'} text-ely-blue`}>{service.title}</h3>
                                    {!isMinimal && <p className="text-gray-600 leading-relaxed">{service.description}</p>}
                                </div>
                                {isMinimal && (
                                    <motion.span
                                        animate={{ rotate: hoveredIndex === index ? 90 : 0 }}
                                        className="text-ely-mint text-xl font-light"
                                    >
                                        +
                                    </motion.span>
                                )}
                            </div>

                            {/* Expanded Description for Minimal Mode */}
                            {isMinimal && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: hoveredIndex === index ? 'auto' : 0,
                                        opacity: hoveredIndex === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="h-px bg-gray-100 mb-4 w-full"></div>
                                        <p
                                            className="text-gray-600 text-sm leading-relaxed"
                                            translate="no"
                                            suppressHydrationWarning
                                        >
                                            {service.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
