import AboutSection from "@/components/AboutSection";
import HistorySection from "@/components/HistorySection";
import TeamSection from "@/components/TeamSection";
import PartnersSection from "@/components/PartnersSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <AboutSection />
            <HistorySection />
            <TeamSection />
            <PartnersSection />
            <TestimonialsSection />
        </main>
    );
}
