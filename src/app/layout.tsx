import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nutvest.in"),
  title: "NutVest - Premium Nuts & Dry Fruits from Kashmir | Bandipora",
  description:
    "Buy premium quality nuts and dry fruits from NutVest, Bandipora, Kashmir. Shop authentic Kashmiri almonds, cashews, saffron, pistachios, walnuts, dates, raisins, figs, pine nuts and mixed dry fruits. Fresh, natural, and delivered to your doorstep across India.",
  keywords: [
    "NutVest", "premium nuts", "dry fruits online", "Kashmiri almonds",
    "Kashmir saffron", "cashews online", "pistachios", "walnuts",
    "Bandipora Kashmir", "buy dry fruits", "organic nuts India",
    "healthy snacks", "Kashmir dry fruits", "mixed dry fruits",
    "pine nuts", "dates online", "raisins", "figs", "apricots",
    "natural nuts", "fresh dry fruits", "dried fruits delivery",
    "dry fruits India", "nuts online shopping", "Kashmiri products",
    "saffron online", "almonds online", "walnuts online",
    "best dry fruits brand", "organic dry fruits", "nut shop online",
    "Bandipora dry fruits", "Kashmiri nuts delivery", "dried fruit store",
  ],
  authors: [{ name: "Mohammad Sayeed", url: "https://nutvest.in" }],
  creator: "NutVest",
  publisher: "NutVest by Mohammad Sayeed",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/logo.png", apple: "/logo.png", shortcut: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nutvest.in",
    siteName: "NutVest",
    title: "NutVest - Premium Nuts & Dry Fruits from Kashmir | Free Delivery",
    description: "Buy premium quality Kashmiri almonds, cashews, saffron, pistachios and more. Fresh, natural, and delivered across India from Bandipora, Kashmir. Free delivery on orders above Rs 999.",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "NutVest - Premium Nuts & Dry Fruits from Kashmir" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutVest - Premium Nuts & Dry Fruits from Kashmir",
    description: "Buy premium quality Kashmiri almonds, cashews, saffron, pistachios and more from Bandipora, Kashmir.",
    images: ["/logo.png"],
  },
  alternates: { canonical: "https://nutvest.in" },
  category: "E-Commerce",
  verification: { google: "yMEq1qaPiL10R06YIHSOEgNu5uvyFil8QcxXxrZ-brM" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://nutvest.in/#business",
    name: "NutVest",
    description: "Premium quality nuts and dry fruits from the valleys of Kashmir. Shop authentic Kashmiri almonds, cashews, saffron, pistachios, walnuts, dates, raisins, figs, pine nuts and mixed dry fruits online.",
    image: "https://nutvest.in/logo.png",
    url: "https://nutvest.in",
    telephone: "+918899697765",
    email: "nutvest1@gmail.com",
    priceRange: "₹₹",
    openingHours: "Mo-Sa 09:00-21:00",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash,UPI",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bandipora",
      addressLocality: "Bandipora",
      addressRegion: "Jammu and Kashmir",
      postalCode: "193502",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.42,
      longitude: 74.65,
    },
    founder: {
      "@type": "Person",
      name: "Mohammad Sayeed",
    },
    sameAs: ["https://wa.me/918899697765"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Premium Nuts & Dry Fruits",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kashmiri Almonds" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Premium Cashews" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kashmiri Saffron" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pistachios" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kashmiri Walnuts" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Premium Dates" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Raisins" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Dried Figs" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pine Nuts" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Apricots" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Mixed Dry Fruits" } },
      ],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NutVest",
    url: "https://nutvest.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nutvest.in/#/products?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1a0e0a" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="google-site-verification" content="yMEq1qaPiL10R06YIHSOEgNu5uvyFil8QcxXxrZ-brM" />
        <meta name="geo.region" content="IN-JK" />
        <meta name="geo.placename" content="Bandipora" />
        <meta name="geo.position" content="34.42;74.65" />
        <meta name="ICBM" content="34.42, 74.65" />
        <link rel="canonical" href="https://nutvest.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased nut-gradient min-h-screen text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
