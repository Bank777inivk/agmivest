"use client";

import { motion } from "framer-motion";
import { ListTodo, Search, Handshake, PenTool } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProcessSection() {
    const t = useTranslations('Process');

    const steps = [
        {
            icon: ListTodo,
            title: t('Steps.s1.title'),
            description: t('Steps.s1.description')
        },
        {
            icon: Search,
            title: t('Steps.s2.title'),
            description: t('Steps.s2.description')
        },
        {
            icon: Handshake,
            title: t('Steps.s3.title'),
            description: t('Steps.s3.description')
        },
        {
            icon: PenTool,
            title: t('Steps.s4.title'),
            description: t('Steps.s4.description')
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-ely-blue text-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-ely-mint rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-blue-100 max-w-2xl mx-auto text-lg"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-all text-center group"
                        >
                            <div className="w-16 h-16 mx-auto bg-ely-mint rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-ely-mint/20">
                                <step.icon className="w-8 h-8 text-ely-blue" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-blue-100 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
