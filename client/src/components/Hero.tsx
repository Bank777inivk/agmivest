"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedAdBanner from "./AnimatedAdBanner";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative w-full ely-gradient min-h-[500px] md:min-h-[600px] lg:h-[calc(100vh-132px)] flex items-start lg:items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 lg:pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">

                    {/* Left Side: White Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl w-full max-w-full lg:max-w-[34rem] mx-auto lg:mx-0"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-ely-blue leading-tight mb-4 md:mb-5">
                            {t('titleLine1')} <br />
                            {t('titleLine2')} <br />
                            {t('titleLine3')}<span className="text-ely-mint">.</span>
                        </h1>

                        <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-gray-700">
                            <p>
                                {t('description1')}
                                <span className="bg-ely-mint text-white px-2 py-0.5 ml-1 font-semibold rounded-sm">
                                    {t('descriptionHighlight')}
                                </span>
                            </p>

                            <p>
                                {t('description2')}
                            </p>

                            <div className="pt-2 md:pt-3">
                                <p className="bg-ely-mint text-white px-3 py-1 inline-block font-bold rounded-sm mb-4 md:mb-5 text-xs sm:text-sm">
                                    {t('tagline')}
                                </p>

                                <button className="block w-full sm:w-fit bg-ely-blue text-white px-6 sm:px-7 py-3 rounded-md font-bold text-sm sm:text-base hover:scale-105 transition-transform shadow-lg">
                                    {t('cta')}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Animated Ad Banner */}
                    <div className="flex flex-col justify-center items-center text-white relative min-h-[400px] lg:min-h-[500px]">
                        <AnimatedAdBanner />
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top-right"></div>
        </section>
    );
}
