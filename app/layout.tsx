import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SessionWrapper from "../Components/SessionWrapper";
import type { ReactNode } from "react";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  alternates: { canonical: "/" },
  title: "ONS Logistics India – Global Shipping & Freight Services",
  description:
    "Reliable global shipping, freight forwarding, customs clearance, and supply chain solutions by ONS Logistics.",
  openGraph: {
    title: "ONS Logistics – Global Shipping & Freight Forwarding",
    description:
      "Trusted logistics partner for freight forwarding, customs clearance, warehousing, and international shipping.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "ONS Logistics",
    images: [
      {
        url: "/ons-logistics-ludhiana.jpg",
        width: 1200,
        height: 630,
        alt: "ONS Logistics - Global Shipping & Supply Chain Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ONS Logistics – Trusted Global Shipping Partner",
    description:
      "Freight forwarding, customs clearance, warehousing, and transport solutions.",
    images: ["/ons-logistics-ludhiana.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[--color-background] text-gray-900 antialiased">
        <SessionWrapper>
          <Navbar />

          {/* Consistent spacing for fixed navbar */}
          <main className="pt-24 min-h-screen">
            {children}
          </main>

          <Footer />
        </SessionWrapper>

        {/* SEO + Analytics */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "ONS Logistics",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              description:
                "ONS Logistics provides global shipping, freight forwarding, customs clearance, and supply chain solutions.",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "#24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7, Mundian Kalan",
                addressLocality: "Ludhiana",
                addressRegion: "Punjab",
                postalCode: "140015",
                addressCountry: "IN",
              },
            }),
          }}
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </body>
    </html>
  );
}
