import ContactHero from "../../Components/ContactHero.jsx";
import ContactForm from "../../Components/ContactForm.jsx";

export const metadata = {
  title: "Contact Us | ONS Logistics India",
  description:
    "Get in touch with ONS Logistics India — call, email, or visit our office in Ludhiana, Punjab. Request a quote or book an appointment today.",
  keywords: ["logistics contact", "ONS Logistics Ludhiana", "freight inquiry Punjab"],
  openGraph: {
    title: "Contact Us | ONS Logistics India",
    description:
      "Reach out to ONS Logistics for shipping quotes, appointments, or general enquiries. Pan-India coverage from Ludhiana.",
    url: "https://www.onslog.com/contact",
    siteName: "ONS Logistics India",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen">
      <ContactHero />
      <ContactForm />
    </main>
  );
}