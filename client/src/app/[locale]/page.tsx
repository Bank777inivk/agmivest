import Hero from "@/components/Hero";
import Simulator from "@/components/Simulator";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import ContactSection from "@/components/ContactSection";
import LocationSection from "@/components/LocationSection";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const t = useTranslations('Home');

  return (
    <>
      <Hero />

      {/* Services & Simulator (Two Columns) */}
      <div className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-20 items-start">
            <div>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-ely-blue mb-4">
                  {t('Services.title')}
                </h2>
                <p className="text-gray-600 text-lg">
                  {t('Services.subtitle')}
                </p>
              </div>
              <ServicesSection isMinimal />
              <div className="mt-10">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 bg-ely-mint text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-ely-mint/90 transition-all shadow-lg hover:shadow-ely-mint/20 hover:-translate-y-0.5 group"
                >
                  <span>{t('Services.cta')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="w-full">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-ely-blue mb-4 text-center lg:text-left">
                  {t('Simulator.title')}
                </h2>
                <p className="text-gray-600 text-lg text-center lg:text-left">
                  {t('Simulator.subtitle')}
                </p>
              </div>
              <div className="bg-white p-1 md:p-2 rounded-3xl shadow-2xl overflow-hidden">
                <Simulator isMinimal />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Social Proof (Two Columns) */}
      <div className="bg-gray-50 py-16 md:py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <TestimonialsSection isMinimal />
            <PartnersSection isMinimal />
          </div>
        </div>
      </div>

      {/* Contact & Location (Two Columns) */}
      <div id="contact" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ely-blue mb-4">
              {t('Contact.title')}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              {t('Contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ContactSection isMinimal />
            <LocationSection isMinimal />
          </div>
        </div>
      </div>

    </>
  );
}
