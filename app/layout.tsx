import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SessionWrapper from "../Components/SessionWrapper"; // we'll create this next
import type { ReactNode } from "react";

export const metadata = {
  title: "ONS Logistics",
  description: "Reliable Shipping, Logistics, and Custom Clearance Services",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
       <head>
        <meta
  name="google-site-verification"
  content="OOAFF6RwAGGwDYe6-LM-yWnL9KXyz3vathh9KdR-UzA"
/>

      </head>
      <body className="bg-[--color-background] text-gray-900">
        <SessionWrapper>
          <Navbar />
          <div className="pt-24">{children}</div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
