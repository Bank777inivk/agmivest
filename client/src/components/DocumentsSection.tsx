"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, Upload, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DocumentsSection() {
    const t = useTranslations('Documents');

    const documents = [
        {
            icon: FileText,
            title: t('Items.identity.title'),
            description: t('Items.identity.description'),
        },
        {
            icon: FileText,
            title: t('Items.income.title'),
            description: t('Items.income.description'),
        },
        {
            icon: FileText,
            title: t('Items.bank.title'),
            description: t('Items.bank.description'),
        },
        {
            icon: FileText,
            title: t('Items.home.title'),
            description: t('Items.home.description'),
        },
        {
            icon: Upload,
            title: t('Items.sales.title'),
            description: t('Items.sales.description'),
        },
        {
            icon: Calendar,
            title: t('Items.amortization.title'),
            description: t('Items.amortization.description'),
        },
    ];

    return (
        <section id="documents" className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
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

                {/* Documents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-ely-mint transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-ely-mint/10 rounded-xl flex items-center justify-center group-hover:bg-ely-mint group-hover:scale-110 transition-all">
                                    <doc.icon className="w-6 h-6 text-ely-mint group-hover:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-ely-blue text-lg mb-2">{doc.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{doc.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-ely-mint/10 text-ely-blue px-6 py-3 rounded-full font-semibold text-sm md:text-base">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{t('cta')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
