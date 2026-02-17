"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface LocationSectionProps {
    isMinimal?: boolean;
}

export default function LocationSection({ isMinimal = false }: LocationSectionProps) {
    const t = useTranslations('Location');

    return (
        <section id="location" className={`${isMinimal ? 'py-0' : 'py-16 md:py-20 lg:py-24'} bg-gray-50`}>
            <div className={`${isMinimal ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
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

                <div className={`grid ${isMinimal ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-8 md:gap-12`}>
                    {/* Map Integration */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`bg-white rounded-2xl overflow-hidden ${isMinimal ? 'h-[300px]' : 'h-[400px] md:h-[500px] shadow-xl'}`}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            title="Agence AGM Invest Mulhouse"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=fr&amp;q=40%20Rue%20Jean%20Monnet%2C%2068200%20Mulhouse+(AGM%20Invest)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                            className="w-full h-full filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        >
                        </iframe>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Address */}
                        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${isMinimal ? 'p-4 md:p-6' : 'p-6 md:p-8'}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-ely-mint/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-ely-mint" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-ely-blue text-lg mb-2">{t('address')}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        MELPARK, 40 Rue Jean Monnet<br />
                                        68200 Mulhouse<br />
                                        France
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${isMinimal ? 'p-4 md:p-6' : 'p-6 md:p-8'}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-ely-mint/10 rounded-xl flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-ely-mint" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-ely-blue text-lg mb-2">{t('phone')}</h3>
                                    <a href="tel:+33756844145" className="text-gray-600 hover:text-ely-mint transition-colors text-lg font-semibold">
                                        AGM INVEST +33 7 56 84 41 45
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${isMinimal ? 'p-4 md:p-6' : 'p-6 md:p-8'}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-ely-mint/10 rounded-xl flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-ely-mint" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-ely-blue text-lg mb-2">{t('email')}</h3>
                                    <a href="mailto:contact@agm-negoce.com" className="text-gray-600 hover:text-ely-mint transition-colors">
                                        contact@agm-negoce.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${isMinimal ? 'p-4 md:p-6' : 'p-6 md:p-8'}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-ely-mint/10 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-ely-mint" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-ely-blue text-lg mb-2">{t('hours.title')}</h3>
                                    <div className="text-gray-600 space-y-1 text-sm md:text-base">
                                        <p>{t('hours.week')}</p>
                                        <p>{t('hours.saturday')}</p>
                                        <p className="text-red-500 font-semibold">{t('hours.sunday')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
