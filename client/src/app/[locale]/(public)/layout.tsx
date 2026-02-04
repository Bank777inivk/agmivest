import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="pt-[80px] md:pt-[128px] lg:pt-[132px]">
                {children}
            </main>
            <Footer />
        </>
    );
}
