"use client";

import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TeamSection() {
    const t = useTranslations('Team');

    const team = [
        {
            name: "Marc Dupont",
            role: t('Members.marc.role'),
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            bio: t('Members.marc.bio'),
        },
        {
            name: "Sophie Martin",
            role: t('Members.sophie.role'),
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            bio: t('Members.sophie.bio'),
        },
        {
            name: "Thomas Leroy",
            role: t('Members.thomas.role'),
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            bio: t('Members.thomas.bio'),
        },
        {
            name: "Laura Bernard",
            role: t('Members.laura.role'),
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            bio: t('Members.laura.bio'),
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg lg:h-80 h-64">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ely-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="flex gap-4">
                                        <button className="bg-white p-2 rounded-full text-ely-blue hover:text-ely-mint transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                        <button className="bg-white p-2 rounded-full text-ely-blue hover:text-ely-mint transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-ely-blue">{member.name}</h3>
                            <p className="text-ely-mint font-semibold mb-2">{member.role}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
