// app/layout.tsx
import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LiveChat from "../Components/LiveChat";
import SessionWrapper from "../Components/SessionWrapper";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  alternates: { canonical: "/" },
  title: "ONS Logistics India – Global Shipping & Freight Services",
  description:
    "Reliable global shipping, freight forwarding, customs clearance, and supply chain solutions by ONS Logistics.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-[--color-background] text-gray-900 antialiased">

        {/* 🔹 Hidden Google Translate mount point */}
        <div
          id="google_translate_element"
          style={{ position: "absolute", left: "-9999px", top: 0 }}
        />

        {/* 🔹 Google Translate Init (CLEAN) */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,es,hi,zh-CN,ru,ar',
                  autoDisplay: false
                }, 'google_translate_element');
              }

              // Observe language change via HTML class
              const observer = new MutationObserver(() => {
                const navbar = document.getElementById('site-navbar');
                if (!navbar) return;

                const isTranslated =
                  document.documentElement.classList.contains('translated-ltr') ||
                  document.documentElement.classList.contains('translated-rtl');

                navbar.style.top = isTranslated ? '40px' : '0px';
              });

              observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
              });
            `,
          }}
        />

        {/* 🔹 Google Translate Script */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <SessionWrapper>
          <Navbar />
          <main className="pt-[72px] min-h-screen ">{children}</main>
          <Footer />
        </SessionWrapper>

        <LiveChat />

        {/* 🔹 Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
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
