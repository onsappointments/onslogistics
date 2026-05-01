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
  children: ReactNode ;
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
        <Script
           id="org-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",

               "@type": ["Organization", "LocalBusiness", "ProfessionalService"],

               "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,

               name: "ONS Logistics India Pvt Ltd",
               legalName: "ONS Logistics India Private Limited",

               url: process.env.NEXT_PUBLIC_SITE_URL,

               logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
               image: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,

               description:
                 "ONS Logistics India Pvt Ltd is a Ludhiana-based leading customs house agent (CHA), freight forwarder, and logistics company providing customs clearance, freight forwarding, transportation, and end-to-end supply chain solutions across Ludhiana, Punjab, and India.",

               foundingDate: "2010",

               address: {
                 "@type": "PostalAddress",
                 streetAddress: "#24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7, Mundian Kalan, Chandigarh Road, Ludhiana - 141015, Punjab.",
                 addressLocality: "Ludhiana",
                 addressRegion: "Punjab",
                 postalCode: "141015",
                 addressCountry: "IN"
               },

               geo: {
                 "@type": "GeoCoordinates",
                 latitude: "30.9000",
                 longitude: "75.8573"
               },

               areaServed: [
                 { "@type": "City", "name": "Ludhiana" },
                 { "@type": "State", "name": "Punjab" },
                 { "@type": "Country", "name": "India" },
                 { "@type": "Place", "name": "Global" }
               ],

               contactPoint: [
                 {
                   "@type": "ContactPoint",
                   telephone: "+91-99888-87971",
                   contactType: "customer support",
                   areaServed: ["IN"],
                   availableLanguage: ["English", "Hindi", "Punjabi"]
                 }
               ],

               hasOfferCatalog: {
                 "@type": "OfferCatalog",
                 name: "Logistics & CHA Services in Ludhiana",
                 itemListElement: [
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Customs Clearance (Import & Export) in Ludhiana",
                       description:
                         "Licensed CHA services in Ludhiana for import-export clearance, documentation, and compliance across Indian ports."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Freight Forwarding (Air & Sea) from Ludhiana",
                       description:
                         "International air and sea freight forwarding services from Ludhiana with global carrier network."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Road Transportation (FTL & LTL)",
                       description:
                         "Reliable road transport services from Ludhiana across India including FTL and LTL shipments."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Warehousing & Distribution in Punjab",
                       description:
                         "Secure warehousing, inventory management, and distribution services in Ludhiana and Punjab."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "3PL (Third Party Logistics)",
                       description:
                         "End-to-end third-party logistics solutions including storage, fulfillment, and transportation."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Import Export Consulting & DGFT Licensing",
                       description:
                         "Expert consulting for DGFT licensing, compliance, and international trade documentation in Ludhiana."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Project Cargo Handling",
                       description:
                         "Specialized logistics for heavy and project cargo with end-to-end coordination."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Door-to-Door Logistics",
                       description:
                         "Complete pickup to delivery logistics solutions from Ludhiana to domestic and international destinations."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                      "@type": "Service",
                       name: "Container Handling (FCL & LCL)",
                       description:
                         "Efficient containerized cargo handling services for FCL and LCL shipments."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Cross Border Logistics",
                       description:
                         "Seamless cross-border logistics and customs coordination for international shipments."
                     }
                   },
                   {
                     "@type": "Offer",
                      itemOffered: {
                       "@type": "Service",
                        name: "Supply Chain Management",
                       description:
                         "Optimized supply chain solutions including planning, execution, and tracking."
                      }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "Cargo Insurance Services",
                       description:
                         "Comprehensive cargo insurance solutions to protect shipments against risks."
                     }
                   },
                   {
                      "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "E-commerce Logistics Support",
                       description:
                         "Logistics solutions tailored for e-commerce businesses including fulfillment and delivery."
                     }
                   },
                   {
                     "@type": "Offer",
                     itemOffered: {
                       "@type": "Service",
                       name: "EXIM Documentation Services",
                       description:
                         "Complete import-export documentation and compliance handling from Ludhiana."
                     }
                   }
                ]
               },

               knowsAbout: [
                 "Customs Clearance in Ludhiana",
                 "Freight Forwarding Ludhiana",
                 "CHA Services Ludhiana Punjab",
                 "Logistics Company in Ludhiana",
                 "Import Export Consultant Ludhiana",
                 "3PL Logistics Punjab",
                 "DGFT Licensing Ludhiana",
                 "International Freight Services India",
                 "Supply Chain Management India"
               ],

               sameAs: [
                 "https://www.linkedin.com/in/anil-verma-62691333",
                 "https://www.facebook.com/bestcustombroker" ,
                 "https://www.instagram.com/onslogistics486" ,
                 "https://x.com/OnsPvt" ,
                 "https://www.google.com/maps/place/ONS+Logistics+(I)+Pvt.+Ltd.+-+Custom+House+Agent,+Top+Custom+Broker+Agents+in+Ludhiana/data=!4m2!3m1!1s0x0:0x9277ef49a7be9bc4?sa=X&ved=1t:2428&ictx=111",
                 "https://www.justdial.com/Ludhiana/Ons-Logistics-India-Pvt-Ltd-Near-Radha-Soami-Satsang-Bhavan-Fortis-Hospital-Mundian-Kalan/0161PX161-X161-180329141000-C7H9_BZDET",
                 "https://www.indiamart.com/onslogistics-india/?srsltid=AfmBOopVgnlO2NPhQDcDPrdxhqIHd_yGFDo2mZJ_dP5mhwH7XT1gv7NM",
                 "https://www.tradeindia.com/ons-logistics-india-pvt-ltd-1572140/"
               ]
             }),
           }}
         />
      </body>
    </html>
  );
}
