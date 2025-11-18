import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SessionWrapper from "../Components/SessionWrapper"; // we'll create this next

export const metadata = {
  title: "ONS Logistics",
  description: "Reliable Shipping, Logistics, and Custom Clearance Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
