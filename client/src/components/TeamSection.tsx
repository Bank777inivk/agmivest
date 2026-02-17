"use client";

import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TeamSection() {
    const t = useTranslations('Team');

    const team = [
        {
            name: "Meyer Alain",
            role: t('Members.meyer.role'),
            image: "/team/meyer.png",
            bio: t('Members.meyer.bio'),
            email: "directeurmeyer@agm-negoce.com"
        },
        {
            name: "Cyrille KLING",
            role: t('Members.cyrille.role'),
            image: "/team/cyrille.jpeg",
            bio: t('Members.cyrille.bio'),
            email: "klingcyrille@agm-negoce.com"
        },
        {
            name: "ROUSSEL EMILIE",
            role: t('Members.emilie.role'),
            image: "/team/emilie.jpeg", // Note the extension is .jpeg
            bio: t('Members.emilie.bio'),
            email: "emilieroussel@agm-negoce.com"
        },
        {
            name: "M. CHAINTEREAU CHRISTOPHE JEAN-PIERRE",
            role: t('Members.christophe.role'),
            image: "/team/christophe.jpeg", // Note the extension is .jpeg
            bio: t('Members.christophe.bio'),
            email: "conseillerchristophe@agm-negoce.com"
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
                                        <a href={`mailto:${member.email}`} className="bg-white p-2 rounded-full text-ely-blue hover:text-ely-mint transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </a>
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
