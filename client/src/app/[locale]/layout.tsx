import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ProgressBar from "@/components/ProgressBar";
import { Suspense } from "react";
import ClientProvider from "@/components/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AGM INVEST | Crédit & Assurances",
    template: "%s | AGM INVEST"
  },
  description: "Partenaire de confiance pour le financement immobilier, crédits à la consommation et assurances en Europe. Solutions flexibles et rapides.",
  keywords: ["crédit immobilier", "assurance emprunteur", "financement", "prêt personnel", "AGM INVEST", "crédit rapide"],
  authors: [{ name: "AGM INVEST" }],
  creator: "AGM INVEST",
  publisher: "AGM INVEST",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.agm-negoce.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
      'de-DE': '/de',
      'es-ES': '/es',
      'it-IT': '/it',
      'pt-PT': '/pt',
      'tr-TR': '/tr',
      'ro-RO': '/ro',
      'nl-NL': '/nl',
      'pl-PL': '/pl',
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-official.webp',
  },
  openGraph: {
    title: 'AGM INVEST | Crédit & Assurances',
    description: 'Financez vos projets immobiliers et personnels avec AGM INVEST.',
    url: 'https://www.agm-negoce.com',
    siteName: 'AGM INVEST',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof Node !== 'undefined' && Node.prototype.removeChild) {
                  const originalRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (child.parentNode !== this) {
                      if (console) {
                        console.warn('Anti-crash: child is not a child of this node.', child, this);
                      }
                      return child;
                    }
                    return originalRemoveChild.apply(this, arguments);
                  };
                }
              `,
            }}
          />
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <ClientProvider>
            {children}
          </ClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
