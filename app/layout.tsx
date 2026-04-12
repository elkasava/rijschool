import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = "https://rij2go.nl";
const siteName = "Rijschool Rij2Go";
const description =
  "Rijschool Rij2Go biedt kwalitatieve rijlessen in Amsterdam, Zaandam en Almere. Persoonlijke aandacht, moderne lesauto's en flexibele planning. Schrijf je vandaag nog in!";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: siteName,
    url: siteUrl,
    telephone: "+31640695738",
    email: "info@rij2go.nl",
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amsterdam",
      addressRegion: "Noord-Holland",
      addressCountry: "NL",
    },
    areaServed: ["Amsterdam", "Zaandam", "Almere"],
    openingHours: "Mo-Sa 08:00-20:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "9.2",
      bestRating: "10",
      worstRating: "1",
      ratingCount: "200",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Rijpakketten",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Pakket B – Meest gekozen",
          price: "2035",
          priceCurrency: "EUR",
          description: "25 rijlessen inclusief CBR-praktijkexamen",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#pakketten`,
        },
        {
          "@type": "Offer",
          name: "Start Snel",
          price: "1499",
          priceCurrency: "EUR",
          description: "Intensief pakket, rijbewijs in korte tijd",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#pakketten`,
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Rijbewijs B halen – Rijschool Rij2Go",
    description:
      "Leer autorijden bij Rijschool Rij2Go. Persoonlijke begeleiding, modern lesvoertuig en 96% slagingspercentage. Beschikbaar in Amsterdam, Zaandam en Almere.",
    provider: {
      "@type": "DrivingSchool",
      name: siteName,
      url: siteUrl,
    },
    educationalLevel: "Beginner tot gevorderd",
    teaches: "Rijvaardigheid categorie B (personenauto)",
    courseMode: "onsite",
    availableLanguage: ["nl", "ar", "fr"],
    offers: {
      "@type": "Offer",
      price: "680",
      priceCurrency: "EUR",
      name: "Start Snel – 10 rijlessen",
      url: `${siteUrl}/#pakketten`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: "Amsterdam / Zaandam / Almere",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Amsterdam",
          addressCountry: "NL",
        },
      },
    },
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Haal je rijbewijs met zelfvertrouwen`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "rijschool Amsterdam",
    "rijlessen Amsterdam",
    "rijbewijs halen",
    "rijschool Zaandam",
    "rijschool Almere",
    "autorijden leren",
    "CBR examen",
    "rijschool Rij2Go",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName,
    title: `${siteName} | Haal je rijbewijs met zelfvertrouwen`,
    description,
    images: [
      {
        url: "/polo.webp",
        width: 1200,
        height: 630,
        alt: `${siteName} – Rijlessen Amsterdam, Zaandam & Almere`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Haal je rijbewijs met zelfvertrouwen`,
    description,
    images: ["/polo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Ga naar hoofdinhoud
        </a>
        <LanguageProvider>
          <LazyMotion features={domAnimation}>{children}</LazyMotion>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
