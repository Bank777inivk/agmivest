"use client";

import { motion } from "framer-motion";
import { Building } from "lucide-react";
import { useTranslations } from "next-intl";

// Placeholder data since we don't have actual partner logos yet
// Ideally, these would be Image components with actual logos

interface PartnersSectionProps {
    isMinimal?: boolean;
}

export default function PartnersSection({ isMinimal = false }: PartnersSectionProps) {
    const t = useTranslations('Partners');
    const partners = t.raw('list') as string[];

    return (
        <section id="partners" className={`${isMinimal ? 'py-0 border-0 bg-transparent' : 'py-12 md:py-16 bg-gray-50 border-y border-gray-200'}`}>
            <div className={`${isMinimal ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                <div className={`${isMinimal ? 'text-left mb-8' : 'text-center mb-10'}`}>
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={`${isMinimal ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-bold text-gray-400 uppercase tracking-widest`}
                    >
                        {t('title')}
                    </motion.h3>
                </div>

                <div className="relative overflow-hidden w-full">
                    {/* Fade Edges for Premium Look */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                    <motion.div
                        className="flex gap-4 md:gap-8 items-center py-4"
                        animate={{
                            x: [0, "-50%"],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ width: "max-content" }}
                    >
                        {/* Double the list for infinite loop */}
                        {[...partners, ...partners, ...partners].map((partner, index) => (
                            <div
                                key={`${partner}-${index}`}
                                className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:border-ely-mint/30 transition-all cursor-default group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-ely-mint group-hover:text-white transition-colors">
                                    <Building className="w-5 h-5 transition-transform group-hover:scale-110" />
                                </div>
                                <span className="font-bold text-base md:text-lg text-gray-500 group-hover:text-ely-blue transition-colors whitespace-nowrap">
                                    {partner}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className={`mt-10 ${isMinimal ? 'text-left' : 'text-center'}`}>
                    <p className="text-gray-400 text-sm md:text-base italic mb-8">
                        {t('subtitle')}
                    </p>

                    {isMinimal && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/50 border border-gray-100 p-6 rounded-2xl shadow-sm"
                        >
                            <h4 className="text-ely-blue font-bold mb-3 italic">{t('Network.title')}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {t('Network.description')}
                            </p>
                            <div className="mt-4 flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-ely-mint font-bold text-xl">20+</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">{t('stats.banks')}</span>
                                </div>
                                <div className="w-px bg-gray-100 h-8 self-center"></div>
                                <div className="flex flex-col">
                                    <span className="text-ely-mint font-bold text-xl">100%</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">{t('stats.support')}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
