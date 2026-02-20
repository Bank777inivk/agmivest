"use client";

import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ContactSectionProps {
    isMinimal?: boolean;
}

export default function ContactSection({ isMinimal = false }: ContactSectionProps) {
    const t = useTranslations('Contact');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    return (
        <section id="contact" className={`${isMinimal ? 'py-0' : 'py-16 md:py-20 lg:py-24'} bg-white`}>
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
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-10 ${isMinimal ? 'shadow-none border-0 p-0' : 'shadow-xl border border-gray-100'}`}
                    >
                        {isMinimal && <h3 className="text-2xl font-bold text-ely-blue mb-6">{t('minimalTitle')}</h3>}
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-ely-blue mb-2">
                                    {t('form.name')}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ely-mint focus:border-transparent outline-none transition-all"
                                        placeholder={t('form.namePlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-ely-blue mb-2">
                                    {t('form.email')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ely-mint focus:border-transparent outline-none transition-all"
                                        placeholder={t('form.emailPlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-ely-blue mb-2">
                                    {t('form.phone')}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ely-mint focus:border-transparent outline-none transition-all"
                                        placeholder={t('form.phonePlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-semibold text-ely-blue mb-2">
                                    {t('form.message')}
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ely-mint focus:border-transparent outline-none transition-all resize-none"
                                        placeholder={t('form.messagePlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-ely-blue text-white py-4 rounded-xl font-bold text-base md:text-lg hover:bg-ely-blue/90 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span>{t('form.submit')}</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>

                    {/* Info Cards */}
                    {!isMinimal && (
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-br from-ely-blue to-blue-900 rounded-2xl p-8 md:p-10 text-white">
                                <h3 className="text-2xl font-bold mb-6">{t('Why.title')}</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-ely-mint text-xl">✓</span>
                                        <span>{t('Why.reasons.r1')}</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-ely-mint text-xl">✓</span>
                                        <span>{t('Why.reasons.r2')}</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-ely-mint text-xl">✓</span>
                                        <span>{t('Why.reasons.r3')}</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-ely-mint text-xl">✓</span>
                                        <span>{t('Why.reasons.r4')}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-ely-mint/10 rounded-2xl p-8 md:p-10 border-2 border-ely-mint">
                                <h3 className="text-xl font-bold text-ely-blue mb-4">{t('QuickResponse.title')}</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {t.rich('QuickResponse.text', {
                                        bold: (chunks) => <span className="font-bold text-ely-blue">{chunks}</span>
                                    })}
                                    {" "}
                                    <a href="tel:+33756844145" className="font-bold text-ely-mint hover:underline">
                                        {t('QuickResponse.phone')}
                                    </a>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
