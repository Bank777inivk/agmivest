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
import Script from "next/script";

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
  openGraph: {
    title: 'AGM INVEST | Crédit & Assurances',
    description: 'Financez vos projets immobiliers et personnels avec AGM INVEST.',
    url: 'https://www.agm-negoce.com',
    siteName: 'AGM INVEST',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'AGM INVEST - Votre partenaire crédit et assurances',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGM INVEST | Crédit & Assurances',
    description: 'Financez vos projets immobiliers et personnels avec AGM INVEST.',
    images: ['/og-image.webp'],
    creator: '@agminvest',
  },
  icons: {
    icon: '/favicon.webp',
    shortcut: '/favicon.webp',
    apple: '/favicon.webp',
  },
  verification: {
    google: 'j2PL1QjUcu4Jx6MXT20gkVgBjA0TTzhEET625UDQ-_I',
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
    <html lang={locale} suppressHydrationWarning>
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AGM INVEST",
              "url": "https://www.agm-negoce.com",
              "logo": "https://www.agm-negoce.com/logo-official.webp",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+33-1-00-00-00-00",
                "contactType": "customer service",
                "areaServed": "FR",
                "availableLanguage": ["French", "English"]
              },
              "sameAs": [
                "https://www.facebook.com/agminvest",
                "https://www.linkedin.com/company/agminvest",
                "https://twitter.com/agminvest"
              ]
            })
          }}
        />
        <link rel="preconnect" href="https://agm-invest.firebaseapp.com" />
        <link rel="dns-prefetch" href="https://agm-invest.firebaseapp.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          {children}
          {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
                strategy="lazyOnload"
              />
              <Script id="google-ads-init" strategy="lazyOnload">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}', {
                    'send_page_view': true
                  });
                `}
              </Script>
            </>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
