import ContactSection from "@/components/ContactSection";
import LocationSection from "@/components/LocationSection";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="space-y-8">
                <ContactSection />
                <LocationSection />
            </div>
        </main>
    );
}
